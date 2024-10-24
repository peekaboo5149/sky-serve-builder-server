import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import * as fs from 'fs'
import * as mime from 'mime-types'
import path from 'path'
import logger from '../logger'
import { FileUploader } from './file.uploader'

export default class S3FileUploader extends FileUploader {
  private readonly s3Client: S3Client
  constructor() {
    super()
    this.s3Client = new S3Client({
      region: process.env.BLOB_STORE_REGION,
      credentials: {
        accessKeyId: process.env.BLOB_STORE_ACCESS_KEY_ID,
        secretAccessKey: process.env.BLOB_STORE_SECRET_ACCESS_KEY,
      },
    })
  }

  protected async uploadFile(
    filePath: string,
    projectId: string
  ): Promise<void> {
    try {
      await logger.info(`uploading ${filePath}`)

      // Get the base directory for the relative path
      const baseDir = path.join('/home/app/output/dist')

      // Extract the relative path by removing the base directory from the filePath
      const relativePath = path.relative(baseDir, filePath)

      const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: `__outputs/${projectId}/${relativePath}`, // Use relativePath here
        Body: fs.createReadStream(filePath),
        ContentType: mime.lookup(filePath) as string,
      })

      await this.s3Client.send(command)
      await logger.info(
        `uploaded ${filePath} with path in s3 __outputs/${projectId}/${relativePath}`
      )
    } catch (error: any) {
      await logger.error(`Failed to upload ${filePath}: ${error.message}`)
    }
  }
}
