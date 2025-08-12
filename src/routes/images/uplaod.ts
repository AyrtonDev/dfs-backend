import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { bucket } from '../../s3/config'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { env } from '../../env'

export const uploadImageRoute: FastifyPluginCallbackZod = app => {
  app.post(
    '/upload-image',
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const data = await request.file({
          limits: {
            fileSize: 5 * 1024 * 1024,
          },
        })

        if (!data) {
          return reply.status(400).send({ error: 'Arquivo não enviado' })
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
        if (!allowedTypes.includes(data.mimetype)) {
          return reply
            .status(400)
            .send({ error: 'Tipo de arquivo não suportado' })
        }

        const fileName = data.filename
        const buffer = await data.toBuffer()

        await bucket.send(
          new PutObjectCommand({
            Bucket: env.R2_PUBLIC,
            Key: fileName,
            Body: buffer,
            ContentType: data.mimetype,
          }),
        )

        const fileUrl = `${env.R2_PUBLIC}/post-movie-images/${fileName}`

        return reply
          .status(201)
          .send({ message: 'Upload realizado com sucesso', url: fileUrl })
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
