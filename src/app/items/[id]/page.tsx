// src/app/items/[id]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LPScore from '@/components/LPScore'
import { getItemLPScore } from '@/types'
import type { LPReview, WearRecord } from '@/types'
import { getPhotoUrl } from '@/lib/supabase/storage'

export default async function ItemPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: item } = await supabase
    .from('items')
    .select(`
      *,
      brand:brands(*),
      subcategory:subcategories(*, category:categories(*)),
      photos:item_photos(*),
      reviews:lp_reviews(*),
      wear_records:wear_records(*),
      pairings:item_pairings!item_id(
        *,
        paired_item:items!paired_item_id(
          *, brand:brands(*), photos:item_photos(*)
        )
      )
    `)
    .eq('id', params.id)
    .single()

  if (!item) notFound()

  const reviews = (item.reviews as LPReview[]) ?? []
  const wearRecords = (item.wear_records as WearRecord[]) ?? []
  const lpScore = getItemLPScore(reviews)
  const latestReview = [...reviews].sort(
    (a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()
  )[0]

  const primaryPhoto = item.photos.find((p: { is_primary: boolean }) => p.is_primary) ?? item.photos[0]
  const photoUrl = primaryPhoto ? getPhotoUrl(primaryPhoto.storage_path) : null

  const lastWorn =
    wearRecords.length > 0
      ? new Date(
          [...wearRecords].sort(
            (a, b) => new Date(b.worn_on).getTime() - new Date(a.worn_on).getTime()
          )[0].worn_on
        ).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : null

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link
        href="/collection"
        className="text-xs tracking-widest uppercase text-warm hover:text-espresso transition-colors mb-8 inline-block"
      >
        ← Back
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left: primary photo */}
        <div className="aspect-[3/4] bg-warm/10 relative overflow-hidden">
          {photoUrl ? (
            <Image src={photoUrl} alt={item.name} fill className="object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-warm/40 text-xs tracking-widest uppercase">No photo</span>
            </div>
          )}
        </div>

        {/* Right: details */}
        <div>
          <p className="text-xs tracking-widest uppercase text-warm mb-2">
            {item.brand?.name ?? ''}
          </p>
          <h1 className="font-serif text-3xl text-espresso mb-6 leading-tight">{item.name}</h1>

          {item.description && (
            <p className="text-warm text-sm leading-relaxed mb-6">{item.description}</p>
          )}

          {item.material && (
            <p className="text-xs tracking-wide text-warm mb-6">
              <span className="uppercase mr-2">Material</span>
              {item.material}
            </p>
          )}

          <div className="border-t border-espresso/10 pt-6 mb-6">
            <p className="text-xs tracking-widest uppercase text-warm mb-4">LP Score</p>
            <LPScore score={lpScore} review={latestReview} />
          </div>

          <div className="border-t border-espresso/10 pt-6 mb-6">
            <p className="text-xs tracking-widest uppercase text-warm mb-3">Wear History</p>
            <p className="text-sm text-espresso">
              {wearRecords.length === 0
                ? 'Not yet worn'
                : `Worn ${wearRecords.length} time${wearRecords.length === 1 ? '' : 's'}`}
            </p>
            {lastWorn && (
              <p className="text-xs text-warm mt-1">
                Last worn: {lastWorn}
              </p>
            )}
          </div>

          {item.purchase_price && (
            <div className="border-t border-espresso/10 pt-6">
              <p className="text-xs tracking-widest uppercase text-warm mb-1">Purchase Price</p>
              <p className="text-sm text-espresso">
                ${item.purchase_price.toFixed(2)}
                {wearRecords.length > 0 && (
                  <span className="text-warm ml-2">
                    (${(item.purchase_price / wearRecords.length).toFixed(2)} per wear)
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
