import z from 'zod'

export const moviesListSchema = {
  body: z.object({
    duration: z
      .object({
        min: z.coerce.number().optional(),
        max: z.coerce.number().optional(),
      })
      .optional(),
    release: z
      .object({
        start: z.date().optional(),
        end: z.date().optional(),
      })
      .optional(),
    genre: z.string().optional(),
    searchTerm: z.string().optional(),
    pagination: z.coerce.number().optional().default(1),
  }),
}

export type MoviesListParams = z.infer<typeof moviesListSchema.body>
