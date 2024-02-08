import { FastifyInstance } from 'fastify'

export async function pollResult(app: FastifyInstance) {
  app.get(
    '/polls/:pollid/results',
    {
      websocket: true,
    },
    (connection, request) => {
      connection.socket.on('message', (message: string) => {
        connection.socket.send('You sent: ' + message)
      })
    }
  )
}
