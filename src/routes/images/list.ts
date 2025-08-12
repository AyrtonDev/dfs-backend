import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { authMiddleware } from '../../middlewares/authMiddleware'
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { bucket } from '../../s3/config'
import { env } from '../../env'

export const listImagesRoute: FastifyPluginCallbackZod = app => {
  app.get(
    '/images',
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const result = await bucket.send(
          new ListObjectsV2Command({
            Bucket: `${env.R2_PUBLIC}/post-movie-images`,
          }),
        )

        if (!result.Contents) {
          return reply.send([])
        }

        const images = result.Contents.map(file => ({
          key: file.Key,
          lastModified: file.LastModified,
          size: file.Size,
          url: `${env.R2_PUBLIC}/post-movie-images/${file.Key}`,
        }))

        return reply.send(images)
      } catch (err) {
        console.log(err)
        return reply
          .status(500)
          .send({ message: 'Something problem happened.' })
      }
    },
  )
}
