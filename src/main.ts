import { exec } from 'child_process'
import * as path from 'path'
import logger from './logger'
import { FileUploaderFactory } from './uploader'
import { FileUploader } from './uploader/file.uploader'

async function build() {
  // Build the downloaded repo
  await logger.info('Build Started ....')
  const outDirPath = path.join(__dirname, '..', 'output')
  await logger.info('Logger Directory', outDirPath)

  const buildCommand = 'npm run build' // TODO: Configurable
  const cmd = `cd ${outDirPath} && npm install && ${buildCommand}`

  await logger.info('Executing command', cmd)

  exec(cmd, { cwd: outDirPath }, async (error, stdout, stderr) => {
    if (error) {
      await logger.error(`Error: ${error.message}`)
      return
    }

    if (stderr) {
      await logger.error(`Stderr: ${stderr}`)
    }

    await logger.info(`Stdout: ${stdout}`)

    // After the build completes, print the directory structure
    await logger.info('Build Completed ...')

    const distFolderPath = path.join(outDirPath, 'dist')
    const fileUploader: FileUploader = FileUploaderFactory.createUploader()
    await fileUploader.upload(distFolderPath)
    await logger.close()
    process.exit(0)
  })
}

build()
