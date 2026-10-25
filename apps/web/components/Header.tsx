import Link from 'next/link'
import { getCart } from '@/app/cart/cart'

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="3" />
      <path d="M5 19c1.5-3 3.8-4.5 7-4.5S17.5 16 19 19" />
    </svg>
  )
}

export default async function Header({ q }: { q: string }) {
  const { count } = await getCart()
  return (
    <header className="top">
      <div className="top-row">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <BagIcon />
          </span>
          Mua
        </Link>
        {/* Remounts the uncontrolled input when this page's q changes. */}
        <form className="search" action="/search" method="get" key={q}>
          <input name="q" type="search" placeholder="Tìm sản phẩm" defaultValue={q} />
          <button type="submit">Tìm kiếm</button>
        </form>
        <div className="actions">
          <button className="nav-btn" type="button">
            <UserIcon /> Đăng nhập
          </button>
          <Link className="nav-btn" href="/cart">
            <BagIcon /> Giỏ hàng
            <span className="badge-count" data-empty={count === 0}>
              {count}
            </span>
          </Link>
        </div>
      </div>
      <div className="loc">
        Giao đến <strong>Phường Bến Nghé, Quận 1</strong>
      </div>
    </header>
  )
}
