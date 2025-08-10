import { pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const accounts = pgTable(
  'accounts',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
  },
  table => ({
    emailIndex: uniqueIndex('accounts_email_idx').on(table.email),
  }),
)
