import { z } from 'zod'

const envSchema = z.object({
  port: z.coerce.number().default(3333),
  dbHost: z.string(),
  dbPort: z.coerce.number().default(5432),
  dbUser: z.string(),
  dbPass: z.string(),
  dbName: z.string(),
})

export const env = envSchema.parse(process.env)
