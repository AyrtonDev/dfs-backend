import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { movies } from '../../db/schemas/movies'
import { db } from '../../db/connection'
import { applyMoviesFiltersHelper } from './helpers/filter-helper'
import { sql } from 'drizzle-orm'
import { moviesListSchema } from './schemas/list'
import { authMiddleware } from '../../middlewares/authMiddleware'

export const moviesListRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/movies',
    {
      preHandler: [authMiddleware],
      schema: moviesListSchema,
    },
    async (request, reply) => {
      try {
        const filter = request.body

        const limit = 10
        const offset = (filter.pagination - 1) * limit

        let query = db
          .select({
            id: movies.id,
            title: movies.title,
            imageUrl: movies.imageUrl,
            genre: movies.genre,
            duration: movies.duration,
            releaseDate: movies.releaseDate,
          })
          .from(movies)

        query = applyMoviesFiltersHelper(query, filter)
          .limit(limit)
          .offset(offset)

        const results = await query

        let countQuery = db.select({ count: sql`count(*)` }).from(movies)
        countQuery = applyMoviesFiltersHelper(countQuery, filter)

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
