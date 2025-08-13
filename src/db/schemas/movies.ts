import {
  pgTable,
  text,
  varchar,
  uuid,
  date,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core'

export const movies = pgTable('movies', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  originalTitle: varchar('original_title', { length: 255 }),
  imageUrl: varchar('image_url', { length: 255 }),
  description: text('description'),
  releaseDate: date('release_date'),
  budge: varchar('budget'),
  duration: integer('duration'),
  genre: varchar('genre', { length: 100 }).notNull(),
  director: varchar('director', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})
