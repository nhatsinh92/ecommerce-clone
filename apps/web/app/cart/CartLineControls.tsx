'use client'

import { formatVnd } from '@/lib/format'
import { useCartWrite } from './write'

export default function CartLineControls({
  productId,
  quantity,
  lineTotal,
}: {
  productId: string
  quantity: number
  lineTotal: number
}) {
  const { pending, write } = useCartWrite()
  return (
    <>
      <div className="stepper">
        <button
          type="button"
          aria-label="Giảm"
          disabled={pending || quantity <= 1}
          onClick={() => write({ kind: 'set', productId, quantity: quantity - 1 })}
        >
          −
        </button>
        <b>{quantity}</b>
        <button
          type="button"
          aria-label="Tăng"
          disabled={pending}
          onClick={() => write({ kind: 'set', productId, quantity: quantity + 1 })}
        >
          +
        </button>
      </div>
      <div className="line-end">
        <span className="price">{formatVnd(lineTotal)}</span>
        <button className="linkish" type="button" disabled={pending} onClick={() => write({ kind: 'remove', productId })}>
          Xóa
        </button>
      </div>
    </>
  )
}
