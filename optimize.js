import { resolve } from 'node:path'
import { mkdir, readdir } from 'node:fs/promises'
import { optimize } from 'svgo'
import { getArgs, cleanAndMkdir, getIconGroups, read, write, getIconVariants } from './utils.js'

async function main () {
  const args = getArgs(process.argv)
  if (args.error) return console.error(args.error)

  console.log(`Optimize files from ${args.sourceFolder} to ${args.distFolder}...`)

  await cleanAndMkdir(args.distFolder)

  const groups = await getIconGroups()
  await groups.forEach(async group => {
    mkdir(`${args.distFolder}/${group}`)
    const variants = await getIconVariants(group)
    await variants.forEach(async variant => {
      const variantPath = `${args.distFolder}/${group}/${variant}`
      mkdir(variantPath)

      const fileNames = await readdir(`${args.sourceFolder}/${group}/${variant}`)

      fileNames.forEach(async (fileName) => {
        const filePath = `${args.sourceFolder}/${group}/${variant}/${fileName}`

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

        await write(`${variantPath}/${fileName}`, svgOptimized.data)
      })
    })
  })

  return console.log('Finished optimizing files.')
}

main()
