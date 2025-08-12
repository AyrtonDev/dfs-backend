// src/types/fastify.d.ts
import 'fastify'
import type { InferModel } from 'drizzle-orm'
import { accounts } from '../db/schemas/accounts'

declare module 'fastify' {
  // payload do jwt (opcionalmente você pode ajustar)
  interface FastifyRequest {
    user?: { email?: string; id?: string } | Record<string, unknown>
    // userData será o registro vindo do DB (tipado pelo InferModel)
    userData?: InferModel<typeof accounts>
  }
}
