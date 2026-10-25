import { cache } from 'react'
import { headers } from 'next/headers'
import { CATEGORIES, type Category } from '@/lib/catalog'

export type CartLine = {
  product: { id: string; name: string; price: number; category: Category }
  quantity: number
  lineTotal: number
}

export type Cart = {
  lines: CartLine[]
  count: number
  total: number
}

const EMPTY_CART: Cart = { lines: [], count: 0, total: 0 }

export const getCart = cache(async (): Promise<Cart> => {
  const cookie = (await headers()).get('cookie')
  if (!cookie) return EMPTY_CART
  const origin = process.env.API_ORIGIN
  if (!origin) throw new Error('API_ORIGIN')
  const res = await fetch(`${origin}/cart`, {
    cache: 'no-store',
    headers: { cookie },
  })
  if (!res.ok) throw new Error(`cart ${res.status}`)
  return parseCart(await res.json())
})

function parseCart(json: unknown): Cart {
  if (!isRecord(json) || !isRecord(json.cart)) throw new Error('cart')
  const cart = json.cart
  if (!Array.isArray(cart.lines)) throw new Error('lines')
  return {
    lines: cart.lines.map(parseLine),
    count: readNumber(cart, 'count'),
    total: readNumber(cart, 'total'),
  }
}

function parseLine(json: unknown): CartLine {
  if (!isRecord(json) || !isRecord(json.product)) throw new Error('line')
  const categoryId = readString(json.product, 'category')
  const category = CATEGORIES.find((item) => item.id === categoryId)
  if (!category) throw new Error('category')
  return {
    product: {
      id: readString(json.product, 'id'),
      name: readString(json.product, 'name'),
      price: readNumber(json.product, 'price'),
      category,
    },
    quantity: readNumber(json, 'quantity'),
    lineTotal: readNumber(json, 'lineTotal'),
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function readString(row: Record<string, unknown>, name: string): string {
  const value = row[name]
  if (typeof value !== 'string') throw new Error(name)
  return value
}

function readNumber(row: Record<string, unknown>, name: string): number {
  const value = row[name]
  if (typeof value !== 'number' || !Number.isSafeInteger(value)) throw new Error(name)
  return value
}
