import z from 'zod'

export const registerMovieSchema = {
  body: z.object({
    title: z.string().min(3, 'Must have title'),
    originalTitle: z.string().optional().default(''),
    imageUrl: z.url('URL invalid').default(''),
    description: z.string().default(''),
    releaseDate: z.coerce.date().optional(),
    duration: z.coerce.number().optional(),
    genre: z.string().min(4, 'Must have genre'),
    director: z.string().default(''),
  }),
}

export type RegisterMovieParam = z.infer<typeof registerMovieSchema.body>
