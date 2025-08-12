import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { movies } from '../../db/schemas/movies'
import { db } from '../../db/connection'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { eq } from 'drizzle-orm'

export const movieRoute: FastifyPluginCallbackZod = app => {
  app.get(
    '/movies/:id',
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string }

        const [movie] = await db.select().from(movies).where(eq(movies.id, id))

        return reply.send(movie)
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
