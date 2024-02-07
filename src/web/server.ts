import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const port = 3333

const app = fastify()
const prisma = new PrismaClient()

app.post('/polls', async (request, reply) => {
  const createPollBody = z.object({
    title: z.string(),
  })
  const { title } = createPollBody.parse(request.body)

  const poll = await prisma.poll.create({
    data: {
      title: title,
    },
  })

  return reply.status(201).send({ pollId: poll.id })
})

app.listen({ port: port }).then(() => {
  console.log(`Server listening on port: ${port}`)
})
