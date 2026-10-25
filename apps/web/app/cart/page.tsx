import Link from 'next/link'
import type { CSSProperties } from 'react'
import CategoryMark from '@/components/CategoryMark'
import Header from '@/components/Header'
import { formatVnd } from '@/lib/format'
import CartLineControls from './CartLineControls'
import { getCart } from './cart'

export default async function Page() {
  const cart = await getCart()
  return (
    <>
      <Header q="" />
      <div className="wrap">
        <h1 className="page-title">Giỏ hàng</h1>
        <div className="cart-layout">
          {cart.lines.length === 0 ? (
            <div className="empty">
              <h2>Giỏ hàng trống</h2>
              <p>Chọn một sản phẩm ở trang chủ.</p>
              <Link className="btn btn-primary" href="/">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="lines">
              {cart.lines.map((line) => (
                <article className="line" key={line.product.id}>
                  <div className="thumb" style={{ '--well': line.product.category.well } as CSSProperties}>
                    <CategoryMark category={line.product.category} />
                  </div>
                  <div>
                    <h3>{line.product.name}</h3>
                    <span className="price">{formatVnd(line.product.price)}</span>
                  </div>
                  <CartLineControls
                    productId={line.product.id}
                    quantity={line.quantity}
                    lineTotal={line.lineTotal}
                  />
                </article>
              ))}
            </div>
          )}
          <aside className="summary">
            <h2>Tạm tính</h2>
            <div className="sum-row">
              <span>{cart.count} sản phẩm</span>
              <span>{formatVnd(cart.total)}</span>
            </div>
            <div className="total-row">
              <span>Thành tiền</span>
              <strong>{formatVnd(cart.total)}</strong>
            </div>
            <button className="btn btn-primary" type="button" disabled={cart.lines.length === 0}>
              Mua hàng
            </button>
          </aside>
        </div>
      </div>
    </>
  )
}
