import fastify from 'fastify'
import { createPoll } from './routes/create-poll'
import { getPollById } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import cookie from '@fastify/cookie'

const port = 3333

const app = fastify()

app.register(cookie, {
  secret: 'polls-app-nlw',
  hook: 'onRequest',
})

app.register(createPoll)
app.register(getPollById)
app.register(voteOnPoll)

app.listen({ port: port }).then(() => {
  const appRoutes = app.printRoutes()
  console.log(`Server listening on port: ${port}`)
  console.log('\nRoutes found:')
  console.log(appRoutes)
})
