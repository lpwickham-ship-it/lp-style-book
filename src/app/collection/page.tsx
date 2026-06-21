// src/app/collection/page.tsx
import { createClient } from '@/lib/supabase/server'
import CategorySidebar from '@/components/CategorySidebar'
import ItemCard from '@/components/ItemCard'
import { enrichItems } from '@/lib/items'
import type { Category, Subcategory, Brand, ItemWithRelations, LPReview } from '@/types'

type PageProps = {
  searchParams: { category?: string; subcategory?: string; brand?: string }
}

export default async function CollectionPage({ searchParams }: PageProps) {
  const supabase = await createClient()

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('*, subcategories(*)').order('name'),
    supabase.from('brands').select('id, name').order('name'),
  ])

  let itemQuery = supabase
    .from('items')
    .select(`
      *,
      brand:brands(*),
      subcategory:subcategories(*, category:categories(*)),
      photos:item_photos(*),
      reviews:lp_reviews(*),
      wear_records:wear_records(id)
    `)
    .eq('in_collection', true)
    .eq('status', 'owned')
    .order('created_at', { ascending: false })

  if (searchParams.subcategory) {
    const allSubcategories = (categories ?? []).flatMap(
      c => (c as Category & { subcategories: Subcategory[] }).subcategories
    )
    const sub = allSubcategories.find(s => s.slug === searchParams.subcategory)
    if (sub) itemQuery = itemQuery.eq('subcategory_id', sub.id)
  } else if (searchParams.category) {
    const cat = (categories ?? []).find(
      (c: Category & { subcategories: Subcategory[] }) => c.slug === searchParams.category
    ) as (Category & { subcategories: Subcategory[] }) | undefined
    if (cat && cat.subcategories.length > 0) {
      const subIds = cat.subcategories.map(s => s.id)
      itemQuery = itemQuery.in('subcategory_id', subIds)
    }
  }

  if (searchParams.brand) {
    const brand = (brands ?? []).find(b => b.name === searchParams.brand)
    if (brand) itemQuery = itemQuery.eq('brand_id', brand.id)
  }

  const { data: rawItems } = await itemQuery

  const items = enrichItems(
    (rawItems ?? []).map(item => ({
      ...item,
      lp_reviews: (item.reviews as LPReview[]) ?? [],
      wear_records: (item.wear_records as { id: string }[]) ?? [],
    }))
  ) as ItemWithRelations[]

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10 items-start">
      <div className="sticky top-6 self-start overflow-y-auto max-h-[calc(100vh-3rem)] shrink-0">
      <CategorySidebar
        categories={(categories as (Category & { subcategories: Subcategory[] })[]) ?? []}
        brands={(brands as Brand[]) ?? []}
        selectedCategory={searchParams.category}
        selectedSubcategory={searchParams.subcategory}
        selectedBrand={searchParams.brand}
      />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-serif text-3xl text-espresso">My Collection</h1>
          <span className="text-warm text-sm">{items.length} items</span>
        </div>
        {items.length === 0 ? (
          <p className="text-warm text-sm">No items found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
            {items.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
