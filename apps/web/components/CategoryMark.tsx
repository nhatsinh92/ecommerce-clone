import type { Category } from '@/lib/catalog'

// Strokes are compile-time constants copied from the prototype, not request data.
export default function CategoryMark({ category }: { category: Category }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      fill="none"
      stroke="#27272a"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: category.stroke }}
    />
  )
}
