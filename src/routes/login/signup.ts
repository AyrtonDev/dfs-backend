import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import bcrypt from 'bcrypt'
import { db } from '../../db/connection'
import { accounts } from '../../db/schemas/accounts'
import jwt from 'jsonwebtoken'
import { env } from '../../env'
import { signUpSchema } from './schemas/signup'
import { eq } from 'drizzle-orm'

export const signUpRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/signup',
    {
      schema: signUpSchema,
    },
    async (request, reply) => {
      try {
        const { name, email, password } = request.body

        const isEmailExisting = await db
          .select()
          .from(accounts)
          .where(eq(accounts.email, email))

        if (isEmailExisting.length > 0) {
          return reply.status(400).send({ error: 'E-mail já cadastrado' })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const [account] = await db
          .insert(accounts)
          .values({
            name,
            email,
            password: hashedPassword,
          })
          .returning()

        const token = jwt.sign({ email: account.email }, env.JWT_SECRET)

        return reply.status(201).send({ token: token })
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
