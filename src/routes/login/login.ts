import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { db } from '../../db/connection'
import { accounts } from '../../db/schemas/accounts'
import { eq } from 'drizzle-orm'
import { env } from '../../env'
import { loginSchema } from './schemas/login'

export const loginRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/login',
    {
      schema: loginSchema,
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body

        const [account] = await db
          .select()
          .from(accounts)
          .where(eq(accounts.email, email))

        if (!account) {
          return reply.status(401).send({ error: 'Invalid credentials' })
        }

        const isValidPassword = await bcrypt.compare(password, account.password)
        if (!isValidPassword) {
          return reply.status(401).send({ error: 'Invalid credentials' })
        }

        const token = jwt.sign({ email: account.email }, env.JWT_SECRET)

        return reply.status(200).send({ token })
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
