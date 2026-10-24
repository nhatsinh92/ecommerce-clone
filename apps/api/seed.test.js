const { describe, test, after } = require('node:test')
const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const { PrismaClient } = require('@prisma/client')

const url = process.env.TEST_DATABASE_URL

function runSeed() {
  execFileSync(process.execPath, ['prisma/seed.js'], {
    cwd: __dirname,
    env: { ...process.env, DATABASE_URL: url },
    stdio: 'inherit',
  })
}

const db = new PrismaClient({ datasourceUrl: url })

describe('seed', { concurrency: 1 }, () => {
  after(() => db.$disconnect())

  test('seed yields 16 products from an empty table and stays at 16', async () => {
    runSeed()
    await db.product.deleteMany()
    runSeed()
    assert.equal(await db.product.count(), 16)
    runSeed()
    assert.equal(await db.product.count(), 16)
  })

  test('A17 row matches the prototype', async () => {
    const a17 = await db.product.findUniqueOrThrow({ where: { id: 'p1' } })
    assert.equal(a17.name, 'Điện thoại A17 128GB')
    assert.equal(a17.price, 8990000)
    assert.equal(a17.sold, 2140)
    assert.equal(a17.rating.toString(), '4.8')
  })

  test('category phone is exactly the two phones, A17 then C9', async () => {
    const phones = await db.product.findMany({
      where: { categoryId: 'phone' },
      orderBy: { id: 'asc' },
    })
    assert.deepEqual(phones.map((product) => product.name), [
      'Điện thoại A17 128GB',
      'Điện thoại C9 256GB',
    ])
  })

  test('reseed restores a drifted price', async () => {
    await db.product.update({ where: { id: 'p1' }, data: { price: 1 } })
    runSeed()
    assert.equal((await db.product.findUniqueOrThrow({ where: { id: 'p1' } })).price, 8990000)
  })

  test('reseed deletes a product id that is not in the catalog', async () => {
    await db.product.create({
      data: {
        id: 'p99',
        categoryId: 'phone',
        name: 'stray',
        price: 1,
        listPrice: 1,
        sold: 0,
        rating: '1.0',
        blurb: 'stray',
      },
    })
    runSeed()
    assert.equal(await db.product.count(), 16)
    assert.equal(await db.product.findUnique({ where: { id: 'p99' } }), null)
  })

  test('list-products prints 16 names including A17', () => {
    const stdout = execFileSync('npm', ['run', 'list-products'], {
      cwd: __dirname,
      env: { ...process.env, DATABASE_URL: url },
      encoding: 'utf8',
    })
    const lines = stdout.split('\n').filter((line) => line !== '')
    assert.equal(lines.length, 16)
    assert.equal(lines.includes('Điện thoại A17 128GB'), true)
  })
})
