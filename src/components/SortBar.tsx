'use client'

import { useRouter, useSearchParams } from 'next/navigation'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'score', label: 'LP Score' },
  { value: 'worn', label: 'Most Worn' },
  { value: 'price-desc', label: 'Price ↓' },
  { value: 'price-asc', label: 'Price ↑' },
] as const

type SortValue = typeof SORT_OPTIONS[number]['value']

export default function SortBar({ current }: { current?: string }) {
  const router = useRouter()
  const params = useSearchParams()

  const active = (current ?? 'newest') as SortValue

  function setSort(value: SortValue) {
    const next = new URLSearchParams(params.toString())
    if (value === 'newest') {
      next.delete('sort')
    } else {
      next.set('sort', value)
    }
    router.push(`?${next.toString()}`)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-warm text-xs tracking-widest uppercase">Sort by</span>
      <select
        value={active}
        onChange={e => setSort(e.target.value as SortValue)}
        className="text-xs text-espresso bg-cream border border-espresso/20 px-3 py-1.5 tracking-wide focus:outline-none focus:border-espresso/60 cursor-pointer"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
