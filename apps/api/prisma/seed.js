const { execFileSync } = require('node:child_process')
const path = require('node:path')
const { PrismaClient } = require('@prisma/client')

const CATALOG = [
  { id: 'p1', categoryId: 'phone', name: 'Điện thoại A17 128GB', price: 8990000, listPrice: 10990000, sold: 2140, rating: '4.8', blurb: 'Màn 6.1 inch, pin khoảng hai ngày, hai SIM.' },
  { id: 'p2', categoryId: 'phone', name: 'Điện thoại C9 256GB', price: 6490000, listPrice: 7990000, sold: 860, rating: '4.6', blurb: 'Bộ nhớ lớn, sạc nhanh, mặt lưng nhám.' },
  { id: 'p3', categoryId: 'laptop', name: 'Laptop văn phòng 14 inch', price: 13490000, listPrice: 15990000, sold: 430, rating: '4.7', blurb: 'Nhẹ, bàn phím êm, đủ cho họp và soạn thảo.' },
  { id: 'p4', categoryId: 'laptop', name: 'Laptop học tập 15.6 inch', price: 11290000, listPrice: 12990000, sold: 275, rating: '4.5', blurb: 'Màn lớn, khe RAM trống, pin một buổi học.' },
  { id: 'p5', categoryId: 'home', name: 'Nồi chiên không dầu 5 lít', price: 1290000, listPrice: 1890000, sold: 3200, rating: '4.9', blurb: 'Lòng nồi chống dính, hẹn giờ, dễ rửa.' },
  { id: 'p6', categoryId: 'home', name: 'Bộ ga gối cotton đơn', price: 459000, listPrice: 620000, sold: 980, rating: '4.4', blurb: 'Cotton mát, bo chun, giặt máy được.' },
  { id: 'p7', categoryId: 'beauty', name: 'Serum vitamin C 30ml', price: 289000, listPrice: 420000, sold: 5400, rating: '4.8', blurb: 'Dùng buổi sáng, thấm nhanh, không nhờn.' },
  { id: 'p8', categoryId: 'beauty', name: 'Kem chống nắng 50ml', price: 199000, listPrice: 265000, sold: 4100, rating: '4.7', blurb: 'SPF 50, không để lại vệt trắng.' },
  { id: 'p9', categoryId: 'fashion', name: 'Áo thun cotton basic', price: 159000, listPrice: 249000, sold: 2300, rating: '4.6', blurb: 'Form suông, cổ tròn, vài màu trơn.' },
  { id: 'p10', categoryId: 'fashion', name: 'Giày sneaker trắng', price: 499000, listPrice: 790000, sold: 760, rating: '4.5', blurb: 'Đế cao su, đi bộ cả ngày.' },
  { id: 'p11', categoryId: 'book', name: 'Sách Làm ra việc', price: 89000, listPrice: 120000, sold: 6100, rating: '4.9', blurb: 'Cách chia buổi làm và buổi nghỉ.' },
  { id: 'p12', categoryId: 'book', name: 'Sách Ngủ ngon hơn', price: 76000, listPrice: 98000, sold: 1500, rating: '4.6', blurb: 'Thói quen tối ngắn, dễ thử trong một tuần.' },
  { id: 'p13', categoryId: 'grocery', name: 'Cà phê hạt 1kg', price: 189000, listPrice: 240000, sold: 2700, rating: '4.8', blurb: 'Rang vừa, pha phin hoặc máy đều được.' },
  { id: 'p14', categoryId: 'grocery', name: 'Nước rửa chén 3.8kg', price: 99000, listPrice: 135000, sold: 8900, rating: '4.7', blurb: 'Can lớn, mùi chanh, hết bọt nhanh.' },
  { id: 'p15', categoryId: 'baby', name: 'Tã quần size M 60 miếng', price: 239000, listPrice: 310000, sold: 4500, rating: '4.8', blurb: 'Mỏng, thấm tốt, đai co giãn.' },
  { id: 'p16', categoryId: 'baby', name: 'Bình sữa 240ml', price: 129000, listPrice: 175000, sold: 1200, rating: '4.6', blurb: 'Cổ rộng, núm chậm, rửa bằng chổi.' },
]

const apiRoot = path.join(__dirname, '..')

function pushSchema() {
  execFileSync(path.join(apiRoot, 'node_modules', '.bin', 'prisma'), ['db', 'push', '--skip-generate'], {
    cwd: apiRoot,
    stdio: ['ignore', 'inherit', 'inherit'],
  })
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function retryUntil(fn, { timeoutMs, intervalMs }) {
  const started = Date.now()
  for (;;) {
    try {
      fn()
      return
    } catch (err) {
      if (Date.now() - started >= timeoutMs) throw err
      await sleep(intervalMs)
    }
  }
}

async function seed() {
  await retryUntil(pushSchema, { timeoutMs: 60_000, intervalMs: 1_000 })
  const db = new PrismaClient()
  try {
    await db.$transaction(async (tx) => {
      for (const row of CATALOG) {
        await tx.product.upsert({
          where: { id: row.id },
          create: row,
          update: row,
        })
      }
      await tx.product.deleteMany({
        where: { id: { notIn: CATALOG.map((row) => row.id) } },
      })
    })
  } finally {
    await db.$disconnect()
  }
}

if (require.main === module) {
  seed().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
