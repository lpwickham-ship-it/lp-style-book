// __tests__/types/lp-score.test.ts
import { computeLPScore, getItemLPScore } from '@/types'
import type { LPReview } from '@/types'

const makeReview = (overrides: Partial<LPReview> = {}): LPReview => ({
  id: 'r1',
  item_id: 'i1',
  fit: 8,
  comfort: 7,
  quality: 9,
  versatility: 6,
  value: 7,
  notes: null,
  reviewed_at: '2026-06-20T00:00:00Z',
  ...overrides,
})

describe('computeLPScore', () => {
  it('averages five dimensions to one decimal place', () => {
    // (8 + 7 + 9 + 6 + 7) / 5 = 37 / 5 = 7.4
    expect(computeLPScore(makeReview())).toBe(7.4)
  })

  it('returns 10.0 when all dimensions are 10', () => {
    expect(computeLPScore(makeReview({ fit: 10, comfort: 10, quality: 10, versatility: 10, value: 10 }))).toBe(10)
  })

  it('returns 1.0 when all dimensions are 1', () => {
    expect(computeLPScore(makeReview({ fit: 1, comfort: 1, quality: 1, versatility: 1, value: 1 }))).toBe(1)
  })

  it('rounds to one decimal place', () => {
    // (7 + 7 + 7 + 7 + 8) / 5 = 36 / 5 = 7.2
    expect(computeLPScore(makeReview({ fit: 7, comfort: 7, quality: 7, versatility: 7, value: 8 }))).toBe(7.2)
  })
})

describe('getItemLPScore', () => {
  it('returns null for an empty reviews array', () => {
    expect(getItemLPScore([])).toBeNull()
  })

  it('returns the score of the only review', () => {
    expect(getItemLPScore([makeReview()])).toBe(7.4)
  })

  it('returns the score of the most recent review when multiple exist', () => {
    const older = makeReview({ fit: 5, comfort: 5, quality: 5, versatility: 5, value: 5, reviewed_at: '2025-01-01T00:00:00Z' })
    const newer = makeReview({ fit: 9, comfort: 9, quality: 9, versatility: 9, value: 9, reviewed_at: '2026-06-01T00:00:00Z' })
    expect(getItemLPScore([older, newer])).toBe(9)
  })
})
