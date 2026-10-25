import { redirect } from 'next/navigation'
import CatalogPage from '@/components/CatalogPage'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>
}) {
  const raw = (await searchParams).q
  const q = (Array.isArray(raw) ? raw[0] : (raw ?? '')).trim()
  if (!q) redirect('/')
  return <CatalogPage view={{ kind: 'search', q }} />
}
