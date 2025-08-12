import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { movies } from '../../db/schemas/movies'
import { db } from '../../db/connection'
import { authMiddleware } from '../../middlewares/authMiddleware'

export const genresListRoute: FastifyPluginCallbackZod = app => {
  app.get('/genres', { preHandler: [authMiddleware] }, async (_, reply) => {
    try {
      const result = await db
        .selectDistinct({ genre: movies.genre })
        .from(movies)

      const genres = result.map(row => row.genre)

      return reply.send(genres)
    } catch (err) {
      console.log(err)
      return reply.status(500).send({ message: 'Something problem happened.' })
    }
  })
}
