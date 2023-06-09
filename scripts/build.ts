import fs from 'fs/promises'
import inquirer from 'inquirer'
import { build as tsupBuild, Options } from 'tsup'
import chalk from 'chalk'
import { resolve } from 'path'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

const getPackagesName = async () => {
  const allPackagesName = await fs.readdir(resolve('packages'))
  const packagesName: string[] = []
  for (const pkgName of allPackagesName) {
    const isHiddenFile = /^\./g.test(pkgName)
    const pkgPath = resolve(`packages/${pkgName}/package.json`)
    const pkg = await import(pkgPath)

    if (!isHiddenFile && !pkg.private && !pkg.internal) {
      packagesName.push(pkgName)
    }
  }
  return packagesName
}

const getAnswersFromInquirer = async (packagesName) => {
  const choicePackageQuestion = {
    type: 'checkbox',
    name: 'packages',
    scroll: false,
    message: 'Select build repo(Support Multiple selection)',
    choices: packagesName.map((packageName) => ({
      value: packageName,
      packageName,
    })),
  }
  let { packages } = await inquirer.prompt(choicePackageQuestion)
  if (!packages.length) {
    console.log(
      chalk.yellow(`
        It seems that you did't make a choice.
  
        Please try it again.
      `)
    )
    return
  }
  if (packages.some((p: string) => p === 'all')) {
    packagesName.shift()
    packages = packagesName
  }
  const confirmPackageQuestion = {
    name: 'confirm',
    message: `Confirm build ${packages.join(' and ')} packages?`,
    type: 'list',
    choices: ['Y', 'N'],
  }
  const { confirm } = await inquirer.prompt(confirmPackageQuestion)
  if (confirm === 'N') {
    console.log(chalk.yellow('[release] cancelled.'))
    return
  }
  return packages
}
const packageOtherConfig = {
  core: {
    external: ['@eschecher/internal-core'],
  },
}
const generateBuildConfigs = (packagesName: string[]): Options[] => {
  return packagesName.map(name => {
    return {
      name,
      target: 'node16',
      entry: [`packages/${name}/src/index.ts`],
      outDir: `packages/${name}/dist`,
      format: ['cjs', 'esm'],
      outExtension: (res) => {
        let js = '.js'
        if (res.format === 'cjs') {
          js = '.cjs'
        }
        return {
          js
        }
      },
      dts: true,
      replaceNodeEnv: true,
      splitting: false,
      clean: true,
      shims: false,
      minify: true,
      tsconfig: resolve('tsconfig.json'),
      external: ['@eschecker/internal-core'],
    }
  })
}

const buildEntry = async (packageConfig: Options) => {
  try {
    await tsupBuild(packageConfig)
  } catch (err) {
    console.log('err', err)
    console.log(chalk.red(`${packageConfig.name} build fail!`))
  }
}

const build = async (packagesConfig: Options[]) => {
  for (let config of packagesConfig) {
    await buildEntry(config)
  }
}

const buildBootstrap = async () => {
  const packagesName = await getPackagesName()
  let buildPackagesName = packagesName
  if (!args.all) {
    packagesName.unshift('all')
    const answers = await getAnswersFromInquirer(packagesName)
    if (!answers) {
      return
    }
    buildPackagesName = answers
  }
  const packagesBuildConfig = generateBuildConfigs(buildPackagesName)
  await build(packagesBuildConfig)
}

buildBootstrap().catch((err) => {
  console.log('err', err)
  process.exit(1)
})
