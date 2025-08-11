import z from 'zod'

export const signUpSchema = {
  body: z
    .object({
      name: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
      passwordConfirmation: z.string().min(6),
    })
    .refine(data => data.password === data.passwordConfirmation, {
      message: 'Passwords must match',
      path: ['passwordConfirmation'],
    }),
}

export type SignUpParams = z.infer<typeof signUpSchema>
