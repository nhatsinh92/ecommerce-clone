import Link from 'next/link'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES, listProducts, type CategoryId, type ProductFilter } from '@/lib/catalog'

export type CatalogView =
  | { kind: 'home' }
  | { kind: 'category'; category: CategoryId }
  | { kind: 'search'; q: string }

type ViewModel = {
  filter: ProductFilter
  heading: string
  active: CategoryId | 'all'
  q: string
}

export function describeView(view: CatalogView): ViewModel {
  if (view.kind === 'home') {
    return { filter: {}, heading: 'Gợi ý hôm nay', active: 'all', q: '' }
  }
  if (view.kind === 'search') {
    return {
      filter: { q: view.q },
      heading: `Kết quả cho “${view.q}”`,
      active: 'all',
      q: view.q,
    }
  }
  const category = CATEGORIES.find((item) => item.id === view.category)
  if (!category) throw new Error('category')
  return {
    filter: { category: view.category },
    heading: category.name,
    active: view.category,
    q: '',
  }
}

export default async function CatalogPage({ view }: { view: CatalogView }) {
  const vm = describeView(view)
  const products = await listProducts(vm.filter)
  return (
    <>
      <Header q={vm.q} />
      <div className="wrap">
        <div className="home-rail">
          <aside className="rail">
            <h2>Danh mục</h2>
            <Link href="/" aria-current={vm.active === 'all' ? 'page' : undefined}>
              Tất cả
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category.id}
                href={`/c/${category.id}`}
                aria-current={vm.active === category.id ? 'page' : undefined}
              >
                {category.name}
              </Link>
            ))}
          </aside>
          <div>
            <section className="hero hero-rail">
              <div>
                <h2>Freeship mọi đơn</h2>
                <p>Thanh toán tiền mặt khi nhận hàng.</p>
              </div>
              <div className="hero-pills">
                <span>Nội thành</span>
                <span>COD</span>
              </div>
            </section>
            <div className="section-head">
              <h1>{vm.heading}</h1>
              <span className="count">{products.length} sản phẩm</span>
            </div>
            {products.length ? (
              <div className="grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h1>Không có sản phẩm khớp</h1>
                <p>Thử từ khóa khác hoặc chọn Tất cả.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
