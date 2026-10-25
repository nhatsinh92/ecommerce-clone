'use client'

import { useState } from 'react'
import { useCartWrite } from '@/app/cart/write'

export default function AddToCart({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { pending, failed, write } = useCartWrite()

  async function add() {
    const ok = await write({ kind: 'add', productId, quantity })
    setAdded(ok)
  }

  return (
    <>
      <div className="qty-row">
        <span>Số lượng</span>
        <div className="stepper">
          <button
            type="button"
            aria-label="Giảm"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          >
            −
          </button>
          <b>{quantity}</b>
          <button type="button" aria-label="Tăng" onClick={() => setQuantity((current) => current + 1)}>
            +
          </button>
        </div>
      </div>
      <div className="btn-row">
        <button className="btn btn-ghost" type="button" disabled={pending} onClick={add}>
          Thêm vào giỏ
        </button>
        <button className="btn btn-primary" type="button">
          Mua ngay
        </button>
      </div>
      {added ? <p role="status">Đã thêm vào giỏ</p> : null}
      {failed ? (
        <p className="error" role="alert">
          Không thêm được vào giỏ.
        </p>
      ) : null}
    </>
  )
}
