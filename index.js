import camelcase from 'camelcase'
import { rimraf } from 'rimraf'
import { promises as fs, existsSync } from 'fs'
import { dirname } from 'path'
import { compile } from '@vue/compiler-dom'

const transform = (svg) => {
  const { code } = compile(svg, { mode: 'module' })
  return code.replace('export function', 'export default function')
}

async function getIcons (style) {
  const files = await fs.readdir('./src/' + style)

  const icons = []

  for (const file of files) {
    const svg = await fs.readFile(`./src/${style}/${file}`, 'utf8')
    const componentName = `${camelcase(file.replace(/\.svg$/, ''), { pascalCase: true })}Icon`

    icons.push({ svg, componentName })
  }

  return icons
}

function exportAll (icons, includeExtension = true) {
  return icons
    .map(({ componentName }) => {
      const extension = includeExtension ? '.js' : ''
      return `export { default as ${componentName} } from './${componentName}${extension}'`
    })
    .join('\n')
}

async function ensureWrite (file, text) {
  await fs.mkdir(dirname(file), { recursive: true })
  await fs.writeFile(file, text, 'utf8')
}

async function ensureWriteJson (file, json) {
  await ensureWrite(file, JSON.stringify(json, null, 2) + '\n')
}

async function buildIcons (style) {
  const outDir = './dist/' + style

  const icons = await getIcons(style)

  await Promise.all(
    icons.flatMap(async ({ componentName, svg }) => {
      const content = transform(svg, componentName)

      /** @type {string[]} */
      const types = []

      types.push('import type { FunctionalComponent, HTMLAttributes, VNodeProps } from \'vue\';')
      types.push(`declare const ${componentName}: FunctionalComponent<HTMLAttributes & VNodeProps>;`)
      types.push(`export default ${componentName};`)

      return [
        ensureWrite(`${outDir}/${componentName}.js`, content),
        ...(types ? [ensureWrite(`${outDir}/${componentName}.d.ts`, types.join('\n') + '\n')] : [])
      ]
    })
  )

  await ensureWrite(`${outDir}/index.js`, exportAll(icons))
  await ensureWrite(`${outDir}/index.d.ts`, exportAll(icons, false))
}

/**
 * @param {string[]} styles
 */
async function buildExports (styles) {
  const pkg = {}
  pkg['.'] = { import: './index.js' }

  for (const style of styles) {
    pkg[`./${style}`] = {
      types: `./dist/${style}/index.d.ts`,
      import: `./dist/${style}/index.js`
    }
    pkg[`./${style}/*`] = {
      types: `./dist/${style}/*.d.ts`,
      import: `./dist/${style}/*.js`
    }
    pkg[`./${style}/*.js`] = {
      types: `./dist/${style}/*.d.ts`,
      import: `./dist/${style}/*.js`
    }
  }

  return pkg
}

async function main () {
  const esmPackageJson = { type: 'module', sideEffects: false }

  console.log('Building package...')

  const files = ['bold', 'broken', 'bulk', 'linear', 'outline', 'twotone']

  await Promise.all(files.map((file) => {
    const fileRoute = './dist/' + file
    if (existsSync(fileRoute)) return rimraf(fileRoute)
    return null
  }))

  await Promise.all([
    buildIcons('bold'),
    buildIcons('broken'),
    buildIcons('bulk'),
    buildIcons('linear'),
    buildIcons('outline'),
    buildIcons('twotone'),
    ensureWriteJson('./dist/bold/package.json', esmPackageJson),
    ensureWriteJson('./dist/broken/package.json', esmPackageJson),
    ensureWriteJson('./dist/bulk/package.json', esmPackageJson),
    ensureWriteJson('./dist/linear/package.json', esmPackageJson),
    ensureWriteJson('./dist/outline/package.json', esmPackageJson),
    ensureWriteJson('./dist/twotone/package.json', esmPackageJson)
  ])

  const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf8'))
  packageJson.exports = await buildExports(['bold', 'broken', 'bulk', 'linear', 'outline', 'twotone'])
  await ensureWriteJson('./package.json', packageJson)

  return console.log('Finished building package.')
}

main()
