import { fastify } from 'fastify'
import cors from '@fastify/cors'  
import { DatabasePostgres } from './database-postgres.js'

const server = fastify()

server.register(cors, {
  origin: "*",
})

const database = new DatabasePostgres()

server.get('/', () => {
  return 'Hello Miguel'
})

server.post('/videos', async (request, reply) => {
  const { title, description, duration } = request.body

  await database.create({
    title,
    description,
    duration,
  })

  console.log(database.list())

  return reply.status(201).send()
})

server.get('/videos', async (request) => {
  const search = request.query.search

  const videos = await database.list(search)

  return videos
})

server.put('/videos/:id', async (request, reply) => {
  const videosId = request.params.id
  const { title, description, duration } = request.body

  await database.update(videosId, {
    title,
    description,
    duration,
  })

  return reply.status(204).send()
})

server.delete('/videos/:id', async (request, reply) => {
  const videoId = request.params.id

  await database.delete(videoId)

  return reply.status(204).send()
})

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333,
})