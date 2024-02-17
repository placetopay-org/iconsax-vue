import camelcase from 'camelcase'
import { existsSync } from 'node:fs'
import { mkdir, writeFile, appendFile, readdir, readFile } from 'node:fs/promises'
import { compile } from '@vue/compiler-dom'
import { rimraf } from 'rimraf'

let iconGroups = null
const append = (file, data) => appendFile(file, data, 'utf8')

export const write = (file, data) => writeFile(file, data, 'utf8')
export const read = file => readFile(file, 'utf8')

export const cleanAndMkdir = async dir => {
  if (existsSync(dir)) await rimraf(dir)
  mkdir(dir)
}

export const getIconGroupsNames = async () => {
  if (!iconGroups) iconGroups = await readdir('./src/')
  return iconGroups
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

const prepareSvg = svg => {
  svg = svg.replace(/fill="#[0-9a-fA-F]{6}"/g, '')
  svg = svg.replace(/stroke="#[0-9a-fA-F]{6}"/g, '')
  svg = svg.replace(/width="24" height="24"/g, '')
  return svg
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

export const buildIcons = async (sourceFolder = 'src', distFolder = 'dist') => {
  await cleanAndMkdir(distFolder)

  const groups = await getIconGroupsNames()
  await groups.forEach(async group => {
    const groupPath = `./${distFolder}/${group}`
    mkdir(groupPath)
    await write(`${groupPath}/index.js`, '')
    await write(`${groupPath}/index.d.js`, '')

    const fileNames = await readdir(`./${sourceFolder}/${group}`)

    fileNames.forEach(async (fileName) => {
      const componentName = `${camelcase(fileName.replace(/\.svg$/, ''), { pascalCase: true })}Icon`
      const filePath = `${groupPath}/${componentName}`

      const svgContent = await read(`./${sourceFolder}/${group}/${fileName}`)
      const source = prepareSvg(svgContent)

      await write(`${filePath}.d.ts`, buildTypes(componentName))
      await write(`${filePath}.js`, compileVue(source))

      const indexExport = `export { default as ${componentName} } from './${componentName}`
      await append(`${groupPath}/index.js`, `${indexExport}.js'\n`)
      await append(`${groupPath}/index.d.ts`, `${indexExport}'\n`)
    })
  })
}
