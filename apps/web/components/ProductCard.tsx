import Link from 'next/link'
import type { CSSProperties } from 'react'
import CategoryMark from '@/components/CategoryMark'
import { percentOff, type Product } from '@/lib/catalog'
import { formatCount, formatVnd } from '@/lib/format'

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link className="card" href={`/p/${product.id}`}>
      <span className="art" style={{ '--well': product.category.well } as CSSProperties}>
        <span className="off">-{percentOff(product)}%</span>
        <CategoryMark category={product.category} />
      </span>
      <span className="card-body">
        <span className="card-name">{product.name}</span>
        <span className="price-row">
          <span className="price">{formatVnd(product.price)}</span>
          <span className="was">{formatVnd(product.listPrice)}</span>
        </span>
        <span className="meta">
          <span className="star">★</span> {product.rating.toFixed(1)} · Đã bán {formatCount(product.sold)}
        </span>
      </span>
    </Link>
  )
}
