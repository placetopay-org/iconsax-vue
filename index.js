import { getArgs, read, write, buildIcons, getIconGroupsNames } from './utils.js'

const updatePackageJson = async (distFolder = './dist', path = './package.json') => {
  const pkg = JSON.parse(await read(path))
  pkg.exports = {}
  pkg.exports['.'] = { import: './index.js' }

  const groups = await getIconGroupsNames()

  for (const group of groups) {
    const exportPath = `${distFolder}/${group}/`

    pkg.exports[`./${group}`] = {
      types: `${exportPath}index.d.ts`,
      import: `${exportPath}index.js`
    }

    pkg.exports[`./${group}/*`] = pkg.exports[`./${group}/*.js`] = {
      types: `${exportPath}*.d.ts`,
      import: `${exportPath}*.js`
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
