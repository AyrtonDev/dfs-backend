import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { env } from './env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.get('/health', () => {
  return 'OK'
})

const start = async () => {
  try {
    await app.listen({ port: env.port })
    console.log(`🚨 Server running at http://localhost:${env.port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
