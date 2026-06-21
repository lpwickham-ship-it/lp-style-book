import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ItemCard from '@/components/ItemCard'
import { enrichItems, computeAvgScore } from '@/lib/items'
import type { ItemWithRelations, LPReview } from '@/types'

export default async function BrandPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!brand) notFound()

  const { data: rawItems } = await supabase
    .from('items')
    .select('*, brand:brands(*), subcategory:subcategories(*, category:categories(*)), photos:item_photos(*), reviews:lp_reviews(*), wear_records:wear_records(id)')
    .eq('brand_id', params.id)
    .eq('in_collection', true)
    .eq('status', 'owned')
    .order('created_at', { ascending: false })

  const items = enrichItems(
    (rawItems ?? []).map(item => ({
      ...item,
      lp_reviews: (item.reviews as LPReview[]) ?? [],
      wear_records: (item.wear_records as { id: string }[]) ?? [],
    }))
  ) as ItemWithRelations[]

  const avgScoreStr = computeAvgScore(items)
  const avgScore = avgScoreStr === '—' ? null : avgScoreStr
  const totalWears = items.reduce((sum, i) => sum + i.wear_count, 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-10">
        <p className="text-xs tracking-widest uppercase text-warm mb-2">{brand.country ?? 'Brand'}</p>
        <h1 className="font-serif text-4xl text-espresso mb-4">{brand.name}</h1>
        <div className="flex gap-8 text-sm text-warm">
          <span>{items.length} items owned</span>
          {avgScore && <span>Avg LP Score: {avgScore}</span>}
          <span>{totalWears} total wears</span>
        </div>
        {brand.notes && (
          <p className="text-warm text-sm leading-relaxed mt-4 max-w-prose">{brand.notes}</p>
        )}
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {items.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
