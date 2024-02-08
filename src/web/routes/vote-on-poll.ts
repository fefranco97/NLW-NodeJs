import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { redis } from '../../lib/redis'

const secondsInAMinute = 60
const minutesInAnHour = 60
const hoursInADay = 24
const daysInAMonth = 30

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid(),
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid(),
    })

    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)

    let { sessionId } = request.cookies

    if (sessionId) {
      const userHasPreviusVoted = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId: sessionId,
            pollId: pollId,
          },
        },
      })
      if (userHasPreviusVoted && userHasPreviusVoted.pollOptionId !== pollOptionId) {
        await prisma.vote.delete({
          where: {
            sessionId_pollId: {
              sessionId: sessionId,
              pollId: pollId,
            },
          },
        })
        await redis.zincrby(pollId, -1, userHasPreviusVoted.pollOptionId)
      } else if (userHasPreviusVoted) {
        return reply.status(400).send({ message: 'You have already voted on this poll' })
      }
    }

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: secondsInAMinute * minutesInAnHour * hoursInADay * daysInAMonth,
        signed: true,
        httpOnly: true,
      })
    }

    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId,
      },
    })

    await redis.zincrby(pollId, 1, pollOptionId)

    return reply.status(201).send()
  })
}
