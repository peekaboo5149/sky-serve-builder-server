import { FileUploader } from './file.uploader'
import GCSFileUploader from './gcs.uploader'
import S3FileUploader from './s3.uploader'

export class FileUploaderFactory {
  public static createUploader(): FileUploader {
    const store = process.env.BLOB_STORE
    if (store === 'S3') {
      return new S3FileUploader()
    } else if (store === 'GCS') {
      return new GCSFileUploader()
    }
    throw new Error(`Blob store ${store} not supported`)
  }
}
