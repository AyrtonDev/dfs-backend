import { z } from 'zod'

export const updateMovieSchema = {
  body: z.object({
    title: z.string().optional(),
    imageUrl: z.string().url().optional(),
    releaseDate: z.string().optional(),
    duration: z.number().optional(),
    genre: z.string().optional(),
    originalTitle: z.string().optional(),
    description: z.string().optional(),
    budge: z.string().optional(),
    director: z.string().optional(),
  }),
}

export type UpdateMovieParam = z.infer<typeof updateMovieSchema.body>
