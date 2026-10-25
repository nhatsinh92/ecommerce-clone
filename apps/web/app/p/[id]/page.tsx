import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import CategoryMark from '@/components/CategoryMark'
import Header from '@/components/Header'
import { getProduct, percentOff } from '@/lib/catalog'
import { formatCount, formatVnd } from '@/lib/format'
import AddToCart from './AddToCart'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const product = await getProduct((await params).id)
  if (!product) notFound()
  return (
    <>
      <Header q="" />
      <div className="wrap">
        <p className="crumb">
          <Link href="/">Trang chủ</Link>
          {' / '}
          <Link href={`/c/${product.category.id}`}>{product.category.name}</Link>
          {' / '}
          {product.name}
        </p>
        <div className="product-layout">
          <div className="gallery-main" style={{ '--well': product.category.well } as CSSProperties}>
            <CategoryMark category={product.category} />
          </div>
          <div className="buy">
            <h1>{product.name}</h1>
            <p className="meta">
              <span className="star">★</span> {product.rating.toFixed(1)} · Đã bán {formatCount(product.sold)}
            </p>
            <div className="price-plate">
              <span className="price big">{formatVnd(product.price)}</span>
              <span className="was">{formatVnd(product.listPrice)}</span>
              <span className="off-chip">-{percentOff(product)}%</span>
            </div>
            <dl className="specs">
              <dt>Danh mục</dt>
              <dd>{product.category.name}</dd>
              <dt>Đã bán</dt>
              <dd>{formatCount(product.sold)}</dd>
              <dt>Thanh toán</dt>
              <dd>Tiền mặt khi nhận hàng</dd>
            </dl>
            <p className="blurb">{product.blurb}</p>
            <AddToCart productId={product.id} />
          </div>
        </div>
      </div>
    </>
  )
}
