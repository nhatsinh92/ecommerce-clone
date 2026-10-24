const http = require('node:http')
const { PrismaClient } = require('@prisma/client')

const HOST = '127.0.0.1'
const PORT = 4000
const db = new PrismaClient()

const routes = {
  'GET /health': async () => {
    try {
      await db.$queryRaw`select 1`
      return [200, { ok: true }]
    } catch {
      return [503, { ok: false }]
    }
  },
}

function writeJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://127.0.0.1').pathname
  const handler = routes[`${req.method} ${pathname}`]
  if (!handler) {
    writeJson(res, 404, { error: 'not found' })
    return
  }
  const [status, body] = await handler()
  writeJson(res, status, body)
})

server.listen(PORT, HOST)
