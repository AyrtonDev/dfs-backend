import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { db } from '../../db/connection'
import { movies } from '../../db/schemas/movies'
import { registerMovieSchema } from './schemas/register'

export const registerMovieRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/movies',
    {
      schema: registerMovieSchema,
    },
    async (request, reply) => {
      try {
        const {
          title,
          originalTitle,
          imageUrl,
          description,
          releaseDate,
          duration,
          genre,
          director,
        } = request.body

        const releaseDateString = releaseDate
          ? releaseDate.toISOString().split('T')[0]
          : undefined

        const [movie] = await db
          .insert(movies)
          .values({
            title,
            originalTitle,
            imageUrl,
            description,
            releaseDate: releaseDateString,
            duration,
            genre,
            director,
          })
          .returning()

        if (!movie) {
          return reply
            .status(500)
            .send({ message: 'Problem registering movie' })
        }

        return reply.status(201).send({ message: 'Movie registered' })
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
