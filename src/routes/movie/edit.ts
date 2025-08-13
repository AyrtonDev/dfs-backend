import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { movies } from '../../db/schemas/movies'
import { eq } from 'drizzle-orm'
import { db } from '../../db/connection'
import { updateMovieSchema } from './schemas/edit'

export const updateMovieRoute: FastifyPluginCallbackZod = app => {
  app.put(
    '/movies/:id',
    { preHandler: [authMiddleware], schema: updateMovieSchema },
    async (request, reply) => {
      try {
        const updateData = request.body

        const { id } = request.params as { id: string }

        if (updateData.releaseDate) {
          updateData.releaseDate = new Date(
            updateData.releaseDate,
          ).toISOString()
        }

        const result = await db
          .update(movies)
          .set(updateData)
          .where(eq(movies.id, id))

        if (result.rowCount === 0) {
          return reply.status(404).send({ error: 'Filme não encontrado' })
        }

        return reply
          .status(200)
          .send({ message: 'Filme atualizado com sucesso' })
      } catch (err) {
        console.error(err)
        return reply.status(500).send({ error: 'Erro interno no servidor' })
      }
    },
  )
}
