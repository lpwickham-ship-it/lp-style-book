// __tests__/components/LPScore.test.tsx
import { render, screen } from '@testing-library/react'
import LPScore from '@/components/LPScore'
import type { LPReview } from '@/types'

const review: LPReview = {
  id: 'r1', item_id: 'i1',
  fit: 8, comfort: 7, quality: 9, versatility: 6, value: 7,
  notes: 'Great tie', reviewed_at: '2026-06-20T00:00:00Z',
}

describe('LPScore', () => {
  it('renders the score', () => {
    render(<LPScore score={8.2} />)
    expect(screen.getByText('8.2')).toBeInTheDocument()
    expect(screen.getByText('/ 10')).toBeInTheDocument()
  })

  it('renders "Not yet reviewed" when score is null', () => {
    render(<LPScore score={null} />)
    expect(screen.getByText('Not yet reviewed')).toBeInTheDocument()
  })

  it('renders dimension breakdown when review is provided', () => {
    render(<LPScore score={7.4} review={review} />)
    expect(screen.getByText('Fit')).toBeInTheDocument()
    expect(screen.getByText('Comfort')).toBeInTheDocument()
    expect(screen.getByText('Quality')).toBeInTheDocument()
    expect(screen.getByText('Versatility')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })
})
