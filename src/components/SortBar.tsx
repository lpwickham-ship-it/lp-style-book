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
    <div className="flex items-center gap-1 flex-wrap">
      <span className="text-warm text-xs tracking-widest uppercase mr-2">Sort</span>
      {SORT_OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => setSort(opt.value)}
          className={`text-xs px-3 py-1.5 tracking-wide transition-colors ${
            active === opt.value
              ? 'bg-espresso text-cream'
              : 'text-warm hover:text-espresso border border-espresso/20 hover:border-espresso/40'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
