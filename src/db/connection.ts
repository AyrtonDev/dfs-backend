import { Pool } from 'pg'
import { env } from '../env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { schema } from './schemas'

const pool = new Pool({
  host: env.dbHost,
  port: env.dbPort,
  user: env.dbUser,
  database: env.dbName,
  password: env.dbPass,
})

export const db = drizzle(pool, { schema, casing: 'snake_case' })
