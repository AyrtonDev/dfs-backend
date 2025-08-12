// middlewares/authMiddleware.ts
import { eq } from 'drizzle-orm'
import { FastifyReply, FastifyRequest } from 'fastify'
import { db } from '../db/connection'
import { accounts } from '../db/schemas/accounts'

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const payload = await request.jwtVerify<{ email?: string }>()

    const email = payload?.email ?? (request.user as any)?.email

    if (!email) {
      return reply.code(401).send({ error: 'Token inválido: email ausente' })
    }

    const [user] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.email, email))
      .limit(1)

    if (!user) {
      return reply.code(401).send({ error: 'Usuário não encontrado' })
    }

    request.userData = user

    return
  } catch (err) {
    request.log?.error?.(err)
    return reply.code(401).send({ error: 'Token inválido ou ausente' })
  }
}
