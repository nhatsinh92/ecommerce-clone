import Link from 'next/link'
import Header from '@/components/Header'

export default function ProductNotFound() {
  return (
    <>
      <Header q="" />
      <div className="wrap">
        <div className="empty">
          <h1>Không thấy sản phẩm</h1>
          <Link className="btn btn-primary" href="/">
            Về trang chủ
          </Link>
        </div>
      </div>
    </>
  )
}
