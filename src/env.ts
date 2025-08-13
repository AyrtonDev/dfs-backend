import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.url().startsWith('postgresql://'),
  JWT_SECRET: z.string(),
  R2_ENDPOINT: z.url().startsWith('https://'),
  R2_NAME: z.string(),
  R2_PREFIX: z.string(),
  R2_ACCESS: z.string(),
  R2_SECRET: z.string(),
  R2_PUBLIC: z.url().startsWith('https://'),
  EMAIL_FROM: z.email(),
})

export const env = envSchema.parse(process.env)
