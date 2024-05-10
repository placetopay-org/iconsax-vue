import { getArgs, read, write, buildIcons, getIconGroups, getIconVariants } from './utils.js'

const updatePackageJson = async (distFolder = './dist', path = './package.json') => {
  const pkg = JSON.parse(await read(path))
  pkg.exports = {}
  pkg.exports['.'] = { import: './index.js' }

  const groups = await getIconGroups()

  for (const group of groups) {
    const variants = await getIconVariants(group)
    for (const variant of variants) {
      let exportPath = `${group}/${variant}`
      console.log('Exporting', exportPath)

      if (group === 'Base') exportPath = variant
      const referencePath = `${distFolder}/${group}/${variant}/`

      pkg.exports[`./${exportPath}`] = {
        types: `${referencePath}index.d.ts`,
        import: `${referencePath}index.js`
      }

      pkg.exports[`./${exportPath}/*`] = pkg.exports[`./${exportPath}/*.js`] = {
        types: `${referencePath}*.d.ts`,
        import: `${referencePath}*.js`
      }
    }
  }

  await write(path, JSON.stringify(pkg, null, 2) + '\n')
}

async function main () {
  const args = getArgs(process.argv)
  if (args.error) return console.error(args.error)

  console.log(`Building icons... (${args.sourceFolder} -> ${args.distFolder})`)
  await buildIcons(args.sourceFolder, args.distFolder)

  console.log('Updating package.json...')
  await updatePackageJson(args.distFolder)

  return console.log('Finished building package.')
}

main()
