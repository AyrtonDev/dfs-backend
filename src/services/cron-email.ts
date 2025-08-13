import nodemailer from 'nodemailer'
import { movies } from '../db/schemas/movies'
import { eq, sql } from 'drizzle-orm'
import { db } from '../db/connection'
import { accounts } from '../db/schemas/accounts'
import { env } from '../env'
import cron from 'node-cron'

const createTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount()
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  })
  console.log(
    'Transporter Ethereal criado. Visite %s para ver os e-mails.',
    testAccount.web,
  )
  return transporter
}

const getUpcomingMovies = async () => {
  console.log('Buscando filmes para hoje...')
  const today = sql`CURRENT_DATE`
  return await db.select().from(movies).where(eq(movies.releaseDate, today))
}

const getUsersToNotify = async () => {
  console.log('Buscando usuários para notificar...')
  return await db.select().from(accounts)
}

const createEmailHtml = (moviesList: (typeof movies.$inferSelect)[]) => {
  let html = '<h2>Lançamentos de hoje!</h2>'
  html += '<ul>'
  moviesList.forEach(movie => {
    html += `<li><h3>${movie.title}</h3><p>${movie.description}</p></li>`
  })
  html += '</ul>'
  return html
}

export const startCronJob = async () => {
  try {
    const transporter = await createTransporter()

    // Agendador que rodará a cada 5 minutos
    cron.schedule('*/5 * * * *', async () => {
      console.log('--- Executando a tarefa agendada: enviar e-mails ---')
      const moviesToday = await getUpcomingMovies()

      if (moviesToday.length === 0) {
        console.log('Nenhum filme hoje. Ignorando envio de e-mails.')
        return
      }

      const usersToNotify = await getUsersToNotify()

      if (usersToNotify.length === 0) {
        console.log('Nenhum usuário para notificar.')
        return
      }

      const emailHtml = createEmailHtml(moviesToday)

      for (const user of usersToNotify) {
        const info = await transporter.sendMail({
          from: env.EMAIL_FROM,
          to: user.email,
          subject: 'Novos filmes serão lançados hoje!',
          html: emailHtml,
        })
        console.log(
          'E-mail enviado para %s: %s',
          user.email,
          nodemailer.getTestMessageUrl(info),
        )
      }
    })

    console.log('Serviço de agendamento de e-mails iniciado!')
  } catch (error) {
    console.error('Falha ao iniciar o serviço de cronjob:', error)
  }
}
