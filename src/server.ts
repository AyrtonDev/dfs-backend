import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { signUpRoute } from './routes/login/signup'
import fastifyCors from '@fastify/cors'
import { loginRoute } from './routes/login/login'
import multipart from 'fastify-multipart'
import { moviesListRoute } from './routes/movie/list'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: 'http://localhost:3000',
})

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.register(multipart)

app.get('/health', () => {
  return 'OK'
})

app.register(signUpRoute)
app.register(loginRoute)
app.register(moviesListRoute)

const start = async () => {
  try {
    await app.listen({ port: env.PORT })
    console.log(`🚨 Server running at http://localhost:${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
