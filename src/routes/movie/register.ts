import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../db/connection'
import { movies } from '../../db/schemas/movies'

export const registerMovieRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/movies',
    {
      schema: {
        body: z.object({
          title: z.string().min(3, 'Must have title'),
          originalTitle: z.string().optional().default(''),
          imageUrl: z.url('URL invalid').default(''),
          description: z.string().default(''),
          releaseDate: z.coerce.date().optional(),
          duration: z.coerce.number().optional(),
          genre: z.string().min(4, 'Must have genre'),
          director: z.string().default(''),
        }),
      },
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
