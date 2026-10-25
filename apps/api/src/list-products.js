const { PrismaClient } = require('@prisma/client')

function byNumericIdSuffix(a, b) {
  return Number(a.id.slice(1)) - Number(b.id.slice(1))
}

async function main() {
  const db = new PrismaClient()
  try {
    const rows = await db.product.findMany({ select: { id: true, name: true } })
    rows.sort(byNumericIdSuffix)
    process.stdout.write(`${rows.map((row) => row.name).join('\n')}\n`)
  } finally {
    await db.$disconnect()
  }
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
