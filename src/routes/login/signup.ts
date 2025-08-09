import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

export const signUpRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/signup',
    {
      schema: {
        body: z
          .object({
            name: z.string().min(3),
            email: z.email(),
            password: z.string().min(6),
            passwordConfirmation: z.string().min(6),
          })
          .refine(data => data.password === data.passwordConfirmation, {
            message: 'Passwords must match',
            path: ['passwordConfirmation'],
          }),
      },
    },
    (request, reply) => {
      const body = request.body

      return reply.status(201).send('test')
    },
  )
}
