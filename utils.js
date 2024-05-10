import camelcase from 'camelcase'
import { existsSync } from 'node:fs'
import { mkdir, writeFile, appendFile, readdir, readFile } from 'node:fs/promises'
import { compile } from '@vue/compiler-dom'
import { rimraf } from 'rimraf'

let iconGroups = null
let iconVariants = null
const append = (file, data) => appendFile(file, data, 'utf8')

export const write = (file, data) => writeFile(file, data, 'utf8')
export const read = file => readFile(file, 'utf8')

export const cleanAndMkdir = async dir => {
  if (existsSync(dir)) await rimraf(dir)
  mkdir(dir)
}

export const getIconGroups = async () => {
  if (!iconGroups) iconGroups = await readdir('./src/')
  return iconGroups
}

export const getIconVariants = async group => {
  if (!iconVariants) iconVariants = await readdir(`./src/${group}`)
  return iconVariants
}

export const getArgs = (args) => {
  const file = args.findIndex(arg => arg === '--file') + 1
  const out = args.findIndex(arg => arg === '--out') + 1

  if (!file) return { error: 'Please provide a source folder. (e.g. --file ./src)' }
  if (!out) return { error: 'Please provide a destination folder. (e.g. --out ./optimized)' }

  return {
    sourceFolder: args[file],
    distFolder: args[out]
  }
}

const prepareSvg = (svg) => {
  // remove background on bulk crypto icons
  svg = svg.replace('<path d="M24 0H0V24H24V0Z" fill="white"/>', '')
  svg = svg.replace('<path opacity="0.58" d="M24 0H0V24H24V0Z" fill="white"/>', '')
  svg = svg.replace('<path fill="#fff" d="M24 0H0v24h24z" opacity=".58"/>', '')

  return svg.replace(/(fill|stroke)="(#[0-9a-fA-F]+)"/g, '$1="currentColor"')
}

const compileVue = source => {
  const { code } = compile(source, { mode: 'module' })
  return code.replace('export function', 'export default function')
}

const buildTypes = componentName => [
  'import type { FunctionalComponent, HTMLAttributes, VNodeProps } from \'vue\';',
  `declare const ${componentName}: FunctionalComponent<HTMLAttributes & VNodeProps>;`,
  `export default ${componentName};`
].join('\n')

export const buildIcons = async (sourceFolder = './src', distFolder = './dist') => {
  await cleanAndMkdir(distFolder)

  const groups = await getIconGroups()
  await groups.forEach(async group => {
    const groupPath = `${distFolder}/${group}`
    await mkdir(groupPath)

    const variants = await getIconVariants(group)
    await variants.forEach(async variant => {
      const variantPath = `${groupPath}/${variant}`
      await mkdir(variantPath)

      await write(`${variantPath}/index.js`, '')
      await write(`${variantPath}/index.d.js`, '')

      const fileNames = await readdir(`${sourceFolder}/${group}/${variant}`)

      fileNames.forEach(async (fileName) => {
        const componentName = `${camelcase(fileName.replace(/\.svg$/, '').replace(/-\(.*\)/, '').replace(/\(.*\)/, ''), { pascalCase: true })}Icon`
        const filePath = `${variantPath}/${componentName}`

        const svgContent = await read(`${sourceFolder}/${group}/${variant}/${fileName}`)
        const source = prepareSvg(svgContent)

        await write(`${filePath}.d.ts`, buildTypes(componentName))
        await write(`${filePath}.js`, compileVue(source))

        const indexExport = `export { default as ${componentName} } from './${componentName}`
        await append(`${variantPath}/index.js`, `${indexExport}.js'\n`)
        await append(`${variantPath}/index.d.ts`, `${indexExport}'\n`)
      })
    })
  })
}
