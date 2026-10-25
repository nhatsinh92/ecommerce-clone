const { describe, test, before, after } = require('node:test')
const assert = require('node:assert/strict')
const { once } = require('node:events')
const { execFileSync } = require('node:child_process')
const { PrismaClient } = require('@prisma/client')
const { createServer } = require('./src/server')

const url = process.env.TEST_DATABASE_URL
const db = new PrismaClient({ datasourceUrl: url })
let server
let base

async function call(method, path, { cookie, body } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      ...(cookie ? { cookie } : {}),
      ...(body !== undefined ? { 'content-type': 'application/json' } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  const setCookies = res.headers.getSetCookie()
  return { status: res.status, body: await res.json(), setCookie: setCookies[0] ?? null }
}

function cookieHeader(setCookie) {
  assert.ok(setCookie)
  return setCookie.split(';')[0]
}

describe('cart', () => {
  before(async () => {
    execFileSync(process.execPath, ['prisma/seed.js'], {
      cwd: __dirname,
      env: { ...process.env, DATABASE_URL: url },
      stdio: 'inherit',
    })
    server = createServer(db)
    await once(server.listen(0, '127.0.0.1'), 'listening')
    base = `http://127.0.0.1:${server.address().port}`
  })

  after(async () => {
    await db.cart.deleteMany()
    await new Promise((resolve) => server.close(resolve))
    await db.$disconnect()
  })

  test('no cookie reads an empty cart and sets no cookie', async () => {
    const { status, body, setCookie } = await call('GET', '/cart')
    assert.equal(status, 200)
    assert.deepEqual(body, { cart: { lines: [], count: 0, total: 0 } })
    assert.equal(setCookie, null)
  })

  test('POST quantity 1 for p1 sets the cart cookie', async () => {
    const { status, setCookie } = await call('POST', '/cart/lines/p1', { body: { quantity: 1 } })
    assert.equal(status, 200)
    assert.match(
      setCookie,
      /^cart=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}; Path=\/; HttpOnly; SameSite=Lax; Max-Age=2592000$/i,
    )
  })

  test('PUT quantity 2 then GET returns quantity 2 and total 17980000', async () => {
    const added = await call('POST', '/cart/lines/p1', { body: { quantity: 1 } })
    const cookie = cookieHeader(added.setCookie)
    const put = await call('PUT', '/cart/lines/p1', { cookie, body: { quantity: 2 } })
    assert.equal(put.status, 200)
    const got = await call('GET', '/cart', { cookie })
    assert.equal(got.status, 200)
    assert.equal(got.body.cart.lines.length, 1)
    assert.equal(got.body.cart.lines[0].quantity, 2)
    assert.equal(got.body.cart.total, 17980000)
  })

  test('POST twice adds the quantities on one line', async () => {
    const first = await call('POST', '/cart/lines/p1', { body: { quantity: 1 } })
    const cookie = cookieHeader(first.setCookie)
    const second = await call('POST', '/cart/lines/p1', { cookie, body: { quantity: 1 } })
    assert.equal(second.status, 200)
    assert.equal(second.body.cart.lines.length, 1)
    assert.equal(second.body.cart.lines[0].quantity, 2)
    assert.equal(second.body.cart.lines[0].product.id, 'p1')
  })

  test('quantity 0, 1.5, and "2" are invalid', async () => {
    for (const quantity of [0, 1.5, '2']) {
      const { status, body, setCookie } = await call('POST', '/cart/lines/p1', { body: { quantity } })
      assert.equal(status, 400, String(quantity))
      assert.deepEqual(body, { error: 'invalid quantity' })
      assert.equal(setCookie, null)
    }
  })

  test('unknown product p999 is 400 and sets no cookie', async () => {
    const { status, body, setCookie } = await call('POST', '/cart/lines/p999', { body: { quantity: 1 } })
    assert.equal(status, 400)
    assert.deepEqual(body, { error: 'unknown product' })
    assert.equal(setCookie, null)
  })

  test('DELETE removes the line and a second DELETE is 200', async () => {
    const added = await call('POST', '/cart/lines/p1', { body: { quantity: 1 } })
    const cookie = cookieHeader(added.setCookie)
    const first = await call('DELETE', '/cart/lines/p1', { cookie })
    assert.equal(first.status, 200)
    assert.equal(first.setCookie, null)
    assert.deepEqual(first.body.cart, { lines: [], count: 0, total: 0 })
    const second = await call('DELETE', '/cart/lines/p1', { cookie })
    assert.equal(second.status, 200)
    assert.deepEqual(second.body.cart, { lines: [], count: 0, total: 0 })
  })

  test('a client with no cookie still reads an empty cart', async () => {
    const added = await call('POST', '/cart/lines/p1', { body: { quantity: 1 } })
    assert.equal(added.status, 200)
    const { status, body, setCookie } = await call('GET', '/cart')
    assert.equal(status, 200)
    assert.deepEqual(body, { cart: { lines: [], count: 0, total: 0 } })
    assert.equal(setCookie, null)
  })

  test('GET /products still returns 16 products', async () => {
    const { status, body } = await call('GET', '/products')
    assert.equal(status, 200)
    assert.equal(body.products.length, 16)
  })
})
