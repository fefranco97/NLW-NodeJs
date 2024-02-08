import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { FastifyInstance } from 'fastify'

export async function getPollById(app: FastifyInstance) {
  app.get('/polls/:pollid', async (request, reply) => {
    console.log(request.params)

    const getPollParams = z.object({
      pollid: z.string().uuid(),
    })
    const { pollid } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollid,
      },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return reply.send({ poll })
  })
}