import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'
import bcrypt from 'bcrypt'
import { db } from '../../db/connection'
import { accounts } from '../../db/schemas/accounts'

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
    async (request, reply) => {
      try {
        const { name, email, password } = request.body

        const hashedPassword = await bcrypt.hash(password, 12)

        const account = await db
          .insert(accounts)
          .values({
            name,
            email,
            password: hashedPassword,
          })
          .returning()

        console.log(account[0])

        return reply.status(201).send('test')
      } catch (err) {
        console.log(err)
      }
    },
  )
}
