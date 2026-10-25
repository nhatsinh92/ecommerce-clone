const http = require('node:http')
const { PrismaClient, Category } = require('@prisma/client')

const HOST = '127.0.0.1'
const PORT = 4000
// Prisma 6 exports the schema enum as Category. Prisma.Category is undefined at runtime.
const CATEGORY_IDS = new Set(Object.values(Category))

/** @typedef {{ category?: string, q?: string }} ProductFilter */
/** @typedef {{ params: Record<string, string>, query: URLSearchParams }} RouteInput */
/** @typedef {[number, unknown]} RouteResult */

/** @returns {{ ok: true, filter: ProductFilter } | { ok: false, error: string }} */
function parseProductQuery(query) {
  const category = query.get('category') || undefined
  if (category && !CATEGORY_IDS.has(category)) return { ok: false, error: 'unknown category' }
  const q = query.get('q')?.trim() || undefined
  return { ok: true, filter: { category, q } }
}

/** @param {ProductFilter} filter */
function toWhere(filter) {
  return {
    ...(filter.category && { categoryId: filter.category }),
    ...(filter.q && { name: { contains: filter.q, mode: 'insensitive' } }),
  }
}

function toProductJson(row) {
  return {
    id: row.id,
    category: row.categoryId,
    name: row.name,
    price: row.price,
    listPrice: row.listPrice,
    sold: row.sold,
    rating: Number(row.rating.toString()),
    blurb: row.blurb,
  }
}

function byNumericIdSuffix(a, b) {
  return Number(a.id.slice(1)) - Number(b.id.slice(1))
}

/** @param {import('@prisma/client').PrismaClient} db */
function routesFor(db) {
  return {
    'GET /health': async () => {
      try {
        await db.$queryRaw`select 1`
        return [200, { ok: true }]
      } catch {
        return [503, { ok: false }]
      }
    },
    'GET /products': async ({ query }) => {
      const parsed = parseProductQuery(query)
      if (!parsed.ok) return [400, { error: parsed.error }]
      const rows = await db.product.findMany({ where: toWhere(parsed.filter) })
      return [200, { products: rows.sort(byNumericIdSuffix).map(toProductJson) }]
    },
    'GET /products/:id': async ({ params }) => {
      const row = await db.product.findUnique({ where: { id: params.id } })
      return row ? [200, { product: toProductJson(row) }] : [404, { error: 'not found' }]
    },
  }
}

/**
 * Literal segments match exactly. A ":name" segment captures one decoded path segment.
 * Different segment counts never match, so /products/p1/extra is a 404.
 * @param {Record<string, (input: RouteInput) => Promise<RouteResult>>} routes
 */
function compileRoutes(routes) {
  const table = Object.entries(routes).map(([key, handler]) => {
    const [method, path] = key.split(' ')
    return { method, segments: path.split('/'), handler }
  })
  return (method, pathname) => {
    const parts = pathname.split('/')
    for (const row of table) {
      if (row.method !== method || row.segments.length !== parts.length) continue
      const params = {}
      const ok = row.segments.every((segment, index) => {
        if (!segment.startsWith(':')) return segment === parts[index]
        if (parts[index] === '') return false
        params[segment.slice(1)] = decodeURIComponent(parts[index])
        return true
      })
      if (ok) return { handler: row.handler, params }
    }
    return null
  }
}

function writeJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json' })
  res.end(JSON.stringify(body))
}

/** @param {import('@prisma/client').PrismaClient} db @returns {http.Server} */
function createServer(db) {
  const match = compileRoutes(routesFor(db))
  return http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1')
      const hit = match(req.method, url.pathname)
      if (!hit) {
        writeJson(res, 404, { error: 'not found' })
        return
      }
      const [status, body] = await hit.handler({ params: hit.params, query: url.searchParams })
      writeJson(res, status, body)
    } catch {
      writeJson(res, 500, { error: 'internal' })
    }
  })
}

module.exports = { createServer }

if (require.main === module) {
  createServer(new PrismaClient()).listen(PORT, HOST)
}
