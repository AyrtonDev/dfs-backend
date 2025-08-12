import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { movies } from '../../db/schemas/movies'
import { db } from '../../db/connection'
import { authMiddleware } from '../../middlewares/authMiddleware'

export const userRoute: FastifyPluginCallbackZod = app => {
  app.get('/user', { preHandler: [authMiddleware] }, async (request, reply) => {
    try {
      const userName = request.userData?.name

      return reply.send(userName)
    } catch (err) {
      console.log(err)
      return reply.status(500).send({ message: 'Something problem happened.' })
    }
  })
}
