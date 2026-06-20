import { createClient } from '@/lib/supabase/server'
import HeroCarousel from '@/components/HeroCarousel'
import DashboardStats from '@/components/DashboardStats'
import ItemCard from '@/components/ItemCard'
import { getItemLPScore } from '@/types'
import type { HeroImage, LPReview } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: heroImages },
    { data: allItems },
    { count: itemCount },
    { data: rawRecommendationItems },
  ] = await Promise.all([
    supabase.from('hero_images').select('*').order('display_order'),
    supabase
      .from('items')
      .select('*, brand:brands(*), subcategory:subcategories(*, category:categories(*)), photos:item_photos(*), reviews:lp_reviews(*), wear_records:wear_records(id)')
      .eq('in_collection', true)
      .eq('status', 'owned'),
    supabase.from('items').select('*', { count: 'exact', head: true }).eq('in_collection', true).eq('status', 'owned'),
    supabase
      .from('items')
      .select('*, brand:brands(*), subcategory:subcategories(*, category:categories(*)), photos:item_photos(*), reviews:lp_reviews(*), wear_records:wear_records(id)')
      .eq('is_recommendation', true)
      .eq('status', 'owned')
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const items = (allItems ?? []).map(item => ({
    ...item,
    lp_score: getItemLPScore((item.reviews as LPReview[]) ?? []),
    wear_count: (item.wear_records as { id: string }[])?.length ?? 0,
  }))

  const recommendationItems = (rawRecommendationItems ?? []).map(item => ({
    ...item,
    lp_score: getItemLPScore((item.reviews as LPReview[]) ?? []),
    wear_count: (item.wear_records as { id: string }[])?.length ?? 0,
  }))

  const scoredItems = items.filter(i => i.lp_score !== null)
  const avgScore =
    scoredItems.length > 0
      ? (scoredItems.reduce((sum, i) => sum + (i.lp_score ?? 0), 0) / scoredItems.length).toFixed(1)
      : '—'

  const totalValue = items.reduce((sum, i) => sum + (i.purchase_price ?? 0), 0)
  const mostWorn = [...items].sort((a, b) => b.wear_count - a.wear_count).slice(0, 3)
  const recentItems = [...items]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6)

  const stats = [
    { label: 'Items', value: itemCount ?? 0 },
    { label: 'Collection Value', value: totalValue > 0 ? `$${totalValue.toLocaleString()}` : '—' },
    { label: 'Avg LP Score', value: avgScore },
    { label: 'Most Worn', value: mostWorn[0]?.name ?? '—' },
  ]

  return (
    <div>
      <HeroCarousel images={(heroImages as HeroImage[]) ?? []} />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-espresso mb-2">LP&apos;s Style Book</h1>
          <p className="text-warm text-sm tracking-wide">Personal wardrobe intelligence</p>
        </div>

        <DashboardStats stats={stats} />

        {recentItems.length > 0 && (
          <div className="mt-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl text-espresso">Recently Added</h2>
              <a href="/collection" className="text-warm text-sm tracking-wide hover:text-tan transition-colors">View all →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-8">
              {recentItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {recommendationItems.length > 0 && (
          <div className="mt-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-serif text-2xl text-espresso">LP&apos;s Picks</h2>
              <a href="/recommendations" className="text-warm text-sm tracking-wide hover:text-tan transition-colors">View all →</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-8">
              {recommendationItems.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
