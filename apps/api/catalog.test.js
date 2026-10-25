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

async function getJson(path) {
  const res = await fetch(`${base}${path}`)
  return { status: res.status, body: await res.json() }
}

describe('catalog', () => {
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
    await new Promise((resolve) => server.close(resolve))
    await db.$disconnect()
  })

  test('empty query returns all 16 in catalog order, A17 first', async () => {
    const { status, body } = await getJson('/products')
    assert.equal(status, 200)
    assert.equal(body.products.length, 16)
    assert.deepEqual(
      body.products.map((product) => product.id),
      Array.from({ length: 16 }, (_, index) => `p${index + 1}`),
    )
    assert.deepEqual(body.products[0], {
      id: 'p1',
      category: 'phone',
      name: 'Điện thoại A17 128GB',
      price: 8990000,
      listPrice: 10990000,
      sold: 2140,
      rating: 4.8,
      blurb: 'Màn 6.1 inch, pin khoảng hai ngày, hai SIM.',
    })
  })

  test('category book returns exactly the two books', async () => {
    const { status, body } = await getJson('/products?category=book')
    assert.equal(status, 200)
    assert.deepEqual(
      body.products.map((product) => product.name),
      ['Sách Làm ra việc', 'Sách Ngủ ngon hơn'],
    )
  })

  test('query serum returns only the serum', async () => {
    const lower = await getJson('/products?q=serum')
    assert.equal(lower.status, 200)
    assert.deepEqual(
      lower.body.products.map((product) => product.name),
      ['Serum vitamin C 30ml'],
    )
    const upper = await getJson('/products?q=SERUM')
    assert.equal(upper.status, 200)
    assert.deepEqual(
      upper.body.products.map((product) => product.name),
      ['Serum vitamin C 30ml'],
    )
  })

  test('unknown product id is 404 not found', async () => {
    const { status, body } = await getJson('/products/p999')
    assert.equal(status, 404)
    assert.deepEqual(body, { error: 'not found' })
  })

  test('known product id returns that product', async () => {
    const { status, body } = await getJson('/products/p7')
    assert.equal(status, 200)
    assert.equal(body.product.name, 'Serum vitamin C 30ml')
    assert.equal(body.product.id, 'p7')
    assert.equal(body.product.category, 'beauty')
    assert.equal(typeof body.product.rating, 'number')
  })

  test('unknown category is 400', async () => {
    const { status, body } = await getJson('/products?category=nope')
    assert.equal(status, 400)
    assert.deepEqual(body, { error: 'unknown category' })
  })
})
