import { db } from '../db/connection'
import { movies } from '../db/schemas/movies'

export async function insertTestMovie() {
  const today = new Date()

  await db.insert(movies).values({
    title: 'Filme de Teste',
    description: 'Um filme criado para testar o cronjob de e-mail.',
    releaseDate: today.toISOString().split('T')[0],
    genre: 'Teste',
  })

  console.log('Filme de teste inserido com sucesso!')
}
