declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PROJECT_ID: string
      BLOB_STORE_REGION: string
      BLOB_STORE_ACCESS_KEY_ID: string
      BLOB_KEY_FILENAME: string
      BLOB_PROJECT_ID: string
      BLOB_STORE_SECRET_ACCESS_KEY: string
      BUCKET_NAME: string
      BLOB_STORE: 'S3' | 'GCS' = 'S3'
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}
