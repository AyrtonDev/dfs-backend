import z from 'zod'

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string().min(6),
  }),
}

export type LoginParams = z.infer<typeof loginSchema>
