declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BLOB_STORE_REGION: string
      BLOB_STORE_ACCESS_KEY_ID: string
      BLOB_STORE_SECRET_ACCESS_KEY: string
      BUCKET_NAME: string
      NODE_ENV: 'development' | 'production'
    }
  }
}

export {}
