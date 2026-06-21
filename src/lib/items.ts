// src/lib/items.ts
import { getItemLPScore } from '@/types'
import type { LPReview } from '@/types'

type RawItem = {
  lp_reviews?: LPReview[]
  wear_records?: { id: string }[]
  [key: string]: unknown
}

export function enrichItems<T extends RawItem>(items: T[]): (Omit<T, 'lp_reviews' | 'wear_records'> & { lp_score: number | null; wear_count: number })[] {
  return items.map(item => ({
    ...item,
    lp_score: getItemLPScore((item.lp_reviews ?? []) as LPReview[]),
    wear_count: (item.wear_records ?? []).length,
  }))
}

export function computeAvgScore(items: { lp_score: number | null }[]): string {
  const scored = items.filter((i): i is typeof i & { lp_score: number } => i.lp_score !== null)
  if (scored.length === 0) return '—'
  return (scored.reduce((sum, i) => sum + i.lp_score, 0) / scored.length).toFixed(1)
}
