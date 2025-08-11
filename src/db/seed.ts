import { reset, seed } from 'drizzle-seed'
import { schema } from './schemas'
import { db, pool } from './connection'
import { images } from '../s3/images'

await reset(db, schema)

await seed(db, schema).refine(f => {
  return {
    movies: {
      count: 20,
      columns: {
        title: f.companyName(),
        originalTitle: f.jobTitle(),
        description: f.loremIpsum(),
        genre: f.firstName(),
        director: f.fullName(),
        releaseDate: f.date(),
        duration: f.int({ minValue: 30, maxValue: 180 }),
        imageUrl: f.default({ defaultValue: images.example }),
      },
    },
    accounts: {
      count: 0,
    },
  }
})

await pool.end()

console.log('Database seeded')
