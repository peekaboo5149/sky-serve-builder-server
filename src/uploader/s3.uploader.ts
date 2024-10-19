import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import logger from '../logger'
import { FileUploader } from './file.uploader'
import * as fs from 'fs/promises' // Use promises API
import * as path from 'path'
import * as mime from 'mime-types'

const s3Client = new S3Client({
  region: process.env.BLOB_STORE_REGION,
  credentials: {
    accessKeyId: process.env.BLOB_STORE_ACCESS_KEY_ID,
    secretAccessKey: process.env.BLOB_STORE_SECRET_ACCESS_KEY,
  },
})

export default class S3FileUploader implements FileUploader {
  async upload(projectId: string, distFolderPath: string): Promise<void> {
    await logger.info('Starting to upload...')

    try {
      const distFolderContents = await fs.readdir(distFolderPath)

      const uploadPromises = distFolderContents.map(async (file) => {
        const filePath = path.join(distFolderPath, file)

        const stat = await fs.lstat(filePath)
        if (stat.isDirectory()) return // Skip directories

        await logger.info(`Uploading ${file}`)
        const type = mime.lookup(filePath) || 'application/octet-stream'

        const command = new PutObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: `__outputs/${projectId}/${file}`,
          Body: fs.createReadStream(filePath),
          ContentType: type,
        })

        await s3Client.send(command)
        await logger.info(`Uploaded ${file}`)
      })

      await Promise.all(uploadPromises) // Wait for all uploads to finish
      await logger.info('Done')
    } catch (error) {
      await logger.error(`Error uploading files: ${error.message}`)
    }
  }
}
