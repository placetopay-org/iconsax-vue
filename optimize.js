import { resolve } from 'node:path'
import { mkdir, readdir } from 'node:fs/promises'
import { optimize } from 'svgo'
import { getArgs, cleanAndMkdir, getIconGroupsNames, read, write } from './utils.js'

async function main () {
  const args = getArgs(process.argv)
  if (args.error) return console.error(args.error)

  console.log(`Optimize files from ${args.sourceFolder} to ${args.distFolder}...`)

  await cleanAndMkdir(args.distFolder)

  const groups = await getIconGroupsNames()
  await groups.forEach(async group => {
    const groupPath = `./${args.distFolder}/${group}`
    mkdir(groupPath)

    const fileNames = await readdir(`./${args.sourceFolder}/${group}`)

    fileNames.forEach(async (fileName) => {
      const filePath = `./${args.sourceFolder}/${group}/${fileName}`

      const svgContent = await read(filePath)
      const svgOptimized = optimize(svgContent, {
        path: resolve(filePath),
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false
              }
            }
          },
          'removeDimensions'
        ]
      })

      await write(`${groupPath}/${fileName}`, svgOptimized.data)
    })
  })

  return console.log('Finished optimizing files.')
}

main()
