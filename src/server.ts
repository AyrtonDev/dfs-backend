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
import multipart from '@fastify/multipart'
import { moviesListRoute } from './routes/movie/list'
import fastifyJwt from '@fastify/jwt'
import { genresListRoute } from './routes/movie/all-genres'
import { userRoute } from './routes/user/user'
import { movieRoute } from './routes/movie/movie'
import { uploadImageRoute } from './routes/images/upload'
import { listImagesRoute } from './routes/images/list'
import { registerMovieRoute } from './routes/movie/register'
import { startCronJob } from './services/cron-email'
import { insertTestMovie } from './services/test'
import { updateMovieRoute } from './routes/movie/edit'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT'],
})

app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.get('/health', () => {
  return 'OK'
})

app.register(signUpRoute)
app.register(loginRoute)
app.register(moviesListRoute)
app.register(registerMovieRoute)
app.register(updateMovieRoute)
app.register(genresListRoute)
app.register(userRoute)
app.register(movieRoute)
app.register(uploadImageRoute)
app.register(listImagesRoute)
// Descomente o metodo abaixo para criar um filme teste para verficiar o envio do email.
// insertTestMovie()

const start = async () => {
  try {
    await app.listen({ port: env.PORT })
    console.log(`🚨 Server running at http://localhost:${env.PORT}`)
    startCronJob()
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
