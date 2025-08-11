import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../env'

export const bucket = new S3Client({
  region: 'auto',
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS,
    secretAccessKey: env.R2_SECRET,
  },
})
