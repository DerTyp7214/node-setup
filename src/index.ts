import chalk from 'chalk'
import { spawn } from 'child_process'
import { config as dotenv } from 'dotenv'
import { readFileSync, writeFileSync } from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import { NodeSetupConfig, PackageJson } from './types'

dotenv()

const appPath = path.resolve(process.cwd()).split('node_modules')[0]

const defaultConfig: NodeSetupConfig = {
  packageManager: process.env.PACKAGE_MANAGER || 'npm',
  envVars: [],
}

const packageJsonPath = path.join(appPath, 'package.json')

const packageJson: PackageJson = JSON.parse(
  readFileSync(packageJsonPath, 'utf8'),
)

const config: NodeSetupConfig = {
  ...defaultConfig,
  ...packageJson['node-setup'],
}

async function install() {
  const child = spawn(config.packageManager, ['install'], {
    stdio: 'inherit',
    shell: true,
  })

  await new Promise((resolve, reject) => {
    child.addListener('error', reject)
    child.addListener('exit', resolve)
  }).catch((error) => {
    console.error(error)
    process.exit(1)
  })

  console.log('Installed dependencies')
}

async function setupEnv() {
  const processEnv: Record<string, string> = {}
  dotenv({ processEnv })

  const envPrompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'envName',
      message: 'Environment file name',
      default: '.env',
    },
  ])

  const allEnvKeys = [
    ...new Set([...Object.keys(processEnv), ...config.envVars]),
  ]

  const dotEnvPath = path.join(appPath, envPrompt.envName)

  const createEnvVarPrompt = async () =>
    await inquirer.prompt([
      {
        type: 'list',
        name: 'envVar',
        message: 'Environment variables',
        choices: [
          ...allEnvKeys.map((envVar) => ({
            name: processEnv[envVar]
              ? `${envVar}: ${processEnv[envVar]}`
              : envVar,
            value: envVar,
          })),
          new inquirer.Separator(),
          {
            name: 'Save and exit',
            value: 'save',
          },
        ],
      },
    ])

  const createEditEnvVarPrompt = async (varName: string) =>
    await inquirer.prompt([
      {
        type: 'input',
        name: 'envVar',
        message: `Value for ${varName}`,
        default: processEnv[varName] ?? '',
      },
    ])

  let envVarPrompt = await createEnvVarPrompt()

  while (envVarPrompt.envVar !== 'save') {
    const envPrompt = await createEditEnvVarPrompt(envVarPrompt.envVar)
    processEnv[envVarPrompt.envVar] = envPrompt.envVar
    envVarPrompt = await createEnvVarPrompt()
  }

  console.log(
    chalk.blackBright('\nSaving environment variables to'),
    chalk.blueBright(dotEnvPath),
  )

  let envFile = ''

  for (const [key, value] of Object.entries(processEnv)) {
    envFile += `${key}=${value}\n`
  }

  writeFileSync(dotEnvPath, envFile)
}

async function main() {
  console.log(chalk.blackBright('Installing dependencies\n'))
  await install()
  console.log(chalk.blackBright('\nSetting up environment variables\n'))
  await setupEnv()
  console.log(chalk.green('\n✓'), chalk.blackBright('Done'))
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main()

export { NodeSetupConfig, PackageJson, defaultConfig, install, setupEnv }
