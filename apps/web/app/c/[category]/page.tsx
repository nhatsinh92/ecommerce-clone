import { notFound } from 'next/navigation'
import CatalogPage from '@/components/CatalogPage'
import { parseCategoryId } from '@/lib/catalog'

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const category = parseCategoryId((await params).category)
  if (!category) notFound()
  return <CatalogPage view={{ kind: 'category', category }} />
}
