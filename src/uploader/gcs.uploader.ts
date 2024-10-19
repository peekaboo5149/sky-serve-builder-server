import { Storage } from '@google-cloud/storage'
import * as mime from 'mime-types'
import path from 'path'
import logger from '../logger'
import { FileUploader } from './file.uploader'

export default class GCSFileUploader extends FileUploader {
  private readonly storage: Storage
  constructor() {
    super()
    this.storage = new Storage({
      projectId: process.env.BLOB_PROJECT_ID,
      keyFilename: process.env.BLOB_KEY_FILENAME,
    })
  }

  async uploadFile(filePath: string, projectId: string): Promise<void> {
    try {
      const bucketName = process.env.BUCKET_NAME!
      const destination = `__outputs/${projectId}/${path.basename(filePath)}`

      await logger.info(`Uploading ${filePath}`)
      await this.storage.bucket(bucketName).upload(filePath, {
        destination,
        metadata: {
          contentType: mime.lookup(filePath) as string,
        },
      })
      await logger.info(`Uploaded ${filePath}`)
    } catch (error: any) {
      await logger.error(`Failed to upload ${filePath}: ${error.message}`)
    }
  }
}
