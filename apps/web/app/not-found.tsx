import Link from 'next/link'
import Header from '@/components/Header'

export default function NotFound() {
  return (
    <>
      <Header q="" />
      <div className="wrap">
        <div className="empty">
          <h1>Không thấy trang</h1>
          <Link className="btn btn-primary" href="/">
            Về trang chủ
          </Link>
        </div>
      </div>
    </>
  )
}
