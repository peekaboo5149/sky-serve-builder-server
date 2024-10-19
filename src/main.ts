import { exec } from 'child_process'
import * as path from 'path'
import logger, { Logger } from './logger'
import { FileUploader, FileUploaderFactory } from './uploader/file.uploader'

async function build() {
  // Build the downloaded repo
  await logger.info('Build Started ....')
  const outDirPath = path.join(__dirname, '..', 'output')
  await logger.info('Logger Directory', outDirPath)
  const buildCommand = 'npm run build' // TODO: Configurable
  const cmd = `cd ${outDirPath} && NODE_ENV=production npm install && ${buildCommand}`
  await logger.info('Executing command', cmd)
  const process = exec(cmd)

  process.stdout?.on('data', async function (data) {
    await logger.info(data.toString())
  })
  process.stdout?.on('error', async function (error) {
    await logger.error(error.toString())
  })
  process.stdout?.on('close', async function () {
    logger.info('Build Completed ... ')
    const distFolderPath = path.join(__dirname, 'output', 'dist')
    const fileUploader: FileUploader = FileUploaderFactory.createUploader()
    await fileUploader.upload(distFolderPath)
  })

  // Upload it on firebase/s3
}

build()
