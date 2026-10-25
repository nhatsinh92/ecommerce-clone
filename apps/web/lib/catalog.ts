export const CATEGORIES = [
  { id: 'phone', name: 'Điện thoại', well: '#e3f2fd', stroke: '<rect x="22" y="8" width="20" height="48" rx="3"/><path d="M28 48h8"/>' },
  { id: 'laptop', name: 'Laptop', well: '#ede7f6', stroke: '<rect x="12" y="14" width="40" height="28" rx="2"/><path d="M8 46h48"/>' },
  { id: 'home', name: 'Nhà cửa', well: '#fff3e0', stroke: '<path d="M10 30 32 12l22 18v22H10Z"/><path d="M28 52V36h8v16"/>' },
  { id: 'beauty', name: 'Làm đẹp', well: '#fce4ec', stroke: '<path d="M28 14h8l2 8H26l2-8z"/><rect x="26" y="22" width="12" height="28" rx="4"/>' },
  { id: 'fashion', name: 'Thời trang', well: '#e8f5e9', stroke: '<path d="M22 16 32 24 42 16l8 12-8 4v20H22V32l-8-4 8-12z"/>' },
  { id: 'book', name: 'Sách', well: '#fff8e1', stroke: '<path d="M16 14h32v38H16z"/><path d="M16 14c6 6 12 6 16 0"/>' },
  { id: 'grocery', name: 'Bách hóa', well: '#f1f8e9', stroke: '<path d="M20 24h24l-4 26H24L20 24z"/><path d="M26 24c1-8 4-12 6-12s5 4 6 12"/>' },
  { id: 'baby', name: 'Mẹ và bé', well: '#f3e5f5', stroke: '<circle cx="32" cy="22" r="8"/><path d="M18 50c2-12 8-16 14-16s12 4 14 16"/>' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']
export type Category = (typeof CATEGORIES)[number]

export type Product = {
  id: string
  category: Category
  name: string
  price: number
  listPrice: number
  sold: number
  rating: number
  blurb: string
}

export type ProductFilter = { category?: CategoryId; q?: string }

export function parseCategoryId(raw: string): CategoryId | null {
  const category = CATEGORIES.find((item) => item.id === raw)
  return category ? category.id : null
}

export function percentOff(product: Pick<Product, 'price' | 'listPrice'>): number {
  return Math.round((1 - product.price / product.listPrice) * 100)
}

export async function listProducts(filter: ProductFilter): Promise<Product[]> {
  const params = new URLSearchParams()
  if (filter.category) params.set('category', filter.category)
  if (filter.q) params.set('q', filter.q)
  const query = params.toString()
  const res = await fetch(`${origin()}/products${query ? `?${query}` : ''}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`products ${res.status}`)
  const body: unknown = await res.json()
  if (!isRecord(body) || !Array.isArray(body.products)) throw new Error('products')
  return body.products.map(parseProduct)
}

export async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(`${origin()}/products/${encodeURIComponent(id)}`, { cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`product ${res.status}`)
  const body: unknown = await res.json()
  if (!isRecord(body) || !('product' in body)) throw new Error('product')
  return parseProduct(body.product)
}

function origin(): string {
  const value = process.env.API_ORIGIN
  if (!value) throw new Error('API_ORIGIN')
  return value
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
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(name)
  return value
}

function parseProduct(json: unknown): Product {
  if (!isRecord(json)) throw new Error('product')
  const categoryId = readString(json, 'category')
  const category = CATEGORIES.find((item) => item.id === categoryId)
  if (!category) throw new Error('category')
  return {
    id: readString(json, 'id'),
    category,
    name: readString(json, 'name'),
    price: readNumber(json, 'price'),
    listPrice: readNumber(json, 'listPrice'),
    sold: readNumber(json, 'sold'),
    rating: readNumber(json, 'rating'),
    blurb: readString(json, 'blurb'),
  }
}
