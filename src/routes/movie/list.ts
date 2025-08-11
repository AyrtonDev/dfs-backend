import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { movies } from '../../db/schemas/movies'
import { db } from '../../db/connection'
import { applyFiltersHelper } from './helpers/filter-helper'
import { sql } from 'drizzle-orm'

export const moviesListRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/movies',
    {
      schema: {
        body: z.object({
          duration: z
            .object({
              min: z.coerce.number().optional(),
              max: z.coerce.number().optional(),
            })
            .optional(),
          release: z
            .object({
              start: z.date().optional(),
              end: z.date().optional(),
            })
            .optional(),
          genre: z.string().optional(),
          searchTerm: z.string().optional(),
          pagination: z.coerce.number().optional().default(1),
        }),
      },
    },
    async (request, reply) => {
      try {
        const filter = request.body

        const limit = 10
        const offset = (filter.pagination - 1) * limit

        let query = db
          .select({
            title: movies.title,
            imageUrl: movies.imageUrl,
            genre: movies.genre,
            duration: movies.duration,
            releaseDate: movies.releaseDate,
          })
          .from(movies)

        query = applyFiltersHelper(query, filter, movies)
          .limit(limit)
          .offset(offset)

        const results = await query

        let countQuery = db.select({ count: sql`count(*)` }).from(movies)
        countQuery = applyFiltersHelper(countQuery, filter, movies)

        const [countResult] = await countQuery
        const total = Number(countResult.count)
        const totalPages = Math.ceil(total / limit)

        return reply.send({
          page: filter.pagination,
          totalPages,
          results,
        })
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
