const vi = new Intl.NumberFormat('vi-VN')

export function formatVnd(amount: number): string {
  return `${vi.format(amount)}₫`
}

export function formatCount(n: number): string {
  return vi.format(n)
}
