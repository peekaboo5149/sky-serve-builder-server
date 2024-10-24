import * as fs from 'fs'
import path from 'path'
import logger from '../logger'

export abstract class FileUploader {
  protected abstract uploadFile(
    filePath: string,
    projectId: string
  ): Promise<void>

  async upload(distFolderPath: string): Promise<void> {
    await logger.info('Starting to upload...')
    const PROJECT_ID = process.env.PROJECT_ID

    const distFolderContents = fs.readdirSync(distFolderPath, {
      recursive: true,
    })
    for (const file of distFolderContents) {
      const filePath = path.join(distFolderPath, file as string)
      if (fs.lstatSync(filePath).isDirectory()) continue
      await this.uploadFile(filePath, PROJECT_ID)
    }
    await logger.info('Done')
  }
}
