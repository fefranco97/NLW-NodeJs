import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'
import { createPoll } from './routes/create-poll'
import { getPollById } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import { pollResult } from './ws/poll-results'

const port = 3333

const app = fastify()

app.register(websocket)

app.register(cookie, {
  secret: 'polls-app-nlw',
  hook: 'onRequest',
})

app.register(createPoll)
app.register(getPollById)
app.register(voteOnPoll)
app.register(pollResult)

app.listen({ port: port }).then(() => {
  const appRoutes = app.printRoutes()
  console.log(`Server listening on port: ${port}`)
  console.log('\nRoutes found:')
  console.log(appRoutes)
})
