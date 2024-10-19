import S3FileUploader from './s3.uploader'

export interface FileUploader {
  upload(projectId: string, path: string): Promise<void>
}

export class FileUploaderFactory {
  public static createUploader(): FileUploader {
    return new S3FileUploader()
  }
}
