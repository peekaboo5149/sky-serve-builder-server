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
    const distFolderContent = fs.readdirSync(distFolderPath, {
      withFileTypes: true, // FIXME: nested files are getting ignored
    })

    const uploadPromises = distFolderContent
      .filter((file) => file.isFile())
      .map((file) => {
        const filePath = path.join(distFolderPath, file.name)
        return this.uploadFile(filePath, PROJECT_ID)
      })

    await Promise.all(uploadPromises)
    await logger.info('Done')
  }
}
