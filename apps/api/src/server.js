const http = require('node:http')
const { PrismaClient, Category } = require('@prisma/client')

const HOST = '127.0.0.1'
const PORT = 4000
// Prisma 6 exports the schema enum as Category. Prisma.Category is undefined at runtime.
const CATEGORY_IDS = new Set(Object.values(Category))

/** @typedef {{ category?: string, q?: string }} ProductFilter */
/** @typedef {{ params: Record<string, string>, query: URLSearchParams, cookies: Record<string, string>, body: unknown }} RouteInput */
/** @typedef {[number, unknown] | [number, unknown, Record<string, string>]} RouteResult */

const MAX_BODY_BYTES = 8 * 1024
const POSTGRES_INT_MAX = 2147483647
const CART_MAX_AGE = 60 * 60 * 24 * 30
const EMPTY_CART = { lines: [], count: 0, total: 0 }

class InvalidQuantity extends Error {}

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

function parseCookies(header) {
  const cookies = {}
  if (!header) return cookies
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq === -1) continue
    const name = part.slice(0, eq).trim()
    if (!name) continue
    const raw = part.slice(eq + 1).trim()
    try {
      cookies[name] = decodeURIComponent(raw)
    } catch {
      cookies[name] = raw
    }
  }
  return cookies
}

// A non-uuid makes Prisma throw, which would turn an unknown cookie into a 500.
function isUuid(value) {
  return typeof value === 'string'
    && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

function cartCookie(cartId) {
  return `cart=${cartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${CART_MAX_AGE}`
}

function parseQuantity(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const { quantity } = body
  if (typeof quantity !== 'number' || !Number.isSafeInteger(quantity) || quantity < 1) return null
  return quantity
}

function toCartJson(rows) {
  let count = 0
  let total = 0
  const lines = rows.map((row) => {
    const lineTotal = row.product.price * row.quantity
    count += row.quantity
    total += lineTotal
    return {
      product: {
        id: row.product.id,
        category: row.product.categoryId,
        name: row.product.name,
        price: row.product.price,
      },
      quantity: row.quantity,
      lineTotal,
    }
  })
  return { lines, count, total }
}

async function loadCart(db, cartId) {
  if (!isUuid(cartId)) return EMPTY_CART
  const rows = await db.cartLine.findMany({
    where: { cartId },
    include: { product: true },
    orderBy: [{ addedAt: 'asc' }, { productId: 'asc' }],
  })
  return toCartJson(rows)
}

async function writeLine(db, cartId, productId, body, mode) {
  const quantity = parseQuantity(body)
  if (quantity == null) return [400, { error: 'invalid quantity' }]
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) return [400, { error: 'unknown product' }]
  let id
  try {
    id = await db.$transaction(async (tx) => {
      const existingCart = isUuid(cartId)
        ? await tx.cart.findUnique({ where: { id: cartId } })
        : null
      const cart = existingCart ?? (await tx.cart.create({ data: {} }))
      const line = await tx.cartLine.findUnique({
        where: { cartId_productId: { cartId: cart.id, productId } },
      })
      const next = mode === 'add' ? (line?.quantity ?? 0) + quantity : quantity
      if (!Number.isSafeInteger(next) || next > POSTGRES_INT_MAX || !Number.isSafeInteger(product.price * next)) {
        throw new InvalidQuantity()
      }
      await tx.cartLine.upsert({
        where: { cartId_productId: { cartId: cart.id, productId } },
        create: { cartId: cart.id, productId, quantity: next },
        update: { quantity: next },
      })
      return cart.id
    })
  } catch (error) {
    if (error instanceof InvalidQuantity) return [400, { error: 'invalid quantity' }]
    throw error
  }
  return [200, { cart: await loadCart(db, id) }, { 'set-cookie': cartCookie(id) }]
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
    'GET /cart': async ({ cookies }) => [200, { cart: await loadCart(db, cookies.cart) }],
    'POST /cart/lines/:productId': ({ params, cookies, body }) =>
      writeLine(db, cookies.cart, params.productId, body, 'add'),
    'PUT /cart/lines/:productId': ({ params, cookies, body }) =>
      writeLine(db, cookies.cart, params.productId, body, 'set'),
    'DELETE /cart/lines/:productId': async ({ params, cookies }) => {
      if (isUuid(cookies.cart)) {
        await db.cartLine.deleteMany({ where: { cartId: cookies.cart, productId: params.productId } })
      }
      return [200, { cart: await loadCart(db, cookies.cart) }]
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

function writeJson(res, status, body, headers = {}) {
  res.writeHead(status, { 'content-type': 'application/json', ...headers })
  res.end(JSON.stringify(body))
}

function readJson(req) {
  if (req.method !== 'POST' && req.method !== 'PUT') return Promise.resolve({ ok: true, value: undefined })
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let settled = false
    function finish(result) {
      if (settled) return
      settled = true
      resolve(result)
    }
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        finish({ ok: false })
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      if (settled) return
      const raw = Buffer.concat(chunks).toString('utf8')
      if (raw.length === 0) {
        finish({ ok: true, value: undefined })
        return
      }
      try {
        finish({ ok: true, value: JSON.parse(raw) })
      } catch {
        finish({ ok: false })
      }
    })
    req.on('error', (error) => {
      if (settled) return
      settled = true
      reject(error)
    })
  })
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
      const body = await readJson(req)
      if (!body.ok) {
        writeJson(res, 400, { error: 'invalid json' })
        return
      }
      const [status, payload, headers] = await hit.handler({
        params: hit.params,
        query: url.searchParams,
        cookies: parseCookies(req.headers.cookie),
        body: body.value,
      })
      writeJson(res, status, payload, headers)
    } catch (error) {
      console.error(error)
      writeJson(res, 500, { error: 'internal' })
    }
  })
}

module.exports = { createServer }

if (require.main === module) {
  createServer(new PrismaClient()).listen(PORT, HOST)
}
