// src/components/LPScore.tsx
import type { LPReview } from '@/types'

type Props = {
  score: number | null
  review?: LPReview
}

const dimensions: { key: keyof Pick<LPReview, 'fit' | 'comfort' | 'quality' | 'versatility' | 'value'>; label: string }[] = [
  { key: 'fit', label: 'Fit' },
  { key: 'comfort', label: 'Comfort' },
  { key: 'quality', label: 'Quality' },
  { key: 'versatility', label: 'Versatility' },
  { key: 'value', label: 'Value' },
]

export default function LPScore({ score, review }: Props) {
  if (score === null) {
    return <p className="text-warm text-sm">Not yet reviewed</p>
  }

  return (
    <div>
      <div className="flex items-baseline gap-1 mb-4">
        <span className="font-serif text-4xl text-espresso">{score}</span>
        <span className="text-warm text-sm">/ 10</span>
      </div>

      {review && (
        <div className="space-y-2">
          {dimensions.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="text-xs tracking-wide text-warm w-20 flex-shrink-0">{label}</span>
              <div className="flex-1 h-1 bg-warm/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-tan rounded-full"
                  style={{ width: `${review[key] * 10}%` }}
                />
              </div>
              <span className="text-xs text-espresso w-4 text-right">{review[key]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
