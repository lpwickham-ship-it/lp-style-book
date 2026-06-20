// src/types/index.ts

export type Brand = {
  id: string
  name: string
  country: string | null
  notes: string | null
  created_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
}

export type Subcategory = {
  id: string
  category_id: string
  name: string
  slug: string
  category?: Category
}

export type Item = {
  id: string
  name: string
  brand_id: string | null
  subcategory_id: string | null
  description: string | null
  material: string | null
  purchase_price: number | null
  purchase_date: string | null
  purchase_location: string | null
  source_url: string | null
  status: 'owned' | 'archived'
  in_collection: boolean
  in_wishlist: boolean
  is_recommendation: boolean
  created_at: string
}

export type ItemPhoto = {
  id: string
  item_id: string
  storage_path: string
  is_primary: boolean
  created_at: string
}

export type LPReview = {
  id: string
  item_id: string
  fit: number
  comfort: number
  quality: number
  versatility: number
  value: number
  notes: string | null
  reviewed_at: string
}

export type WearRecord = {
  id: string
  item_id: string
  worn_on: string
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | null
  occasion: 'Casual' | 'Smart Casual' | 'Work' | 'Formal' | 'Sport' | null
  created_at: string
}

export type WishlistItem = {
  id: string
  item_id: string
  status: 'Wishlist' | 'Researching' | 'Considering' | 'Purchased' | 'Archived'
  notes: string | null
  alternatives: string | null
  interest_score: number | null
  created_at: string
}

export type FailedPurchase = {
  id: string
  item_id: string
  reason: 'poor fit' | 'poor quality' | 'poor value' | 'rarely worn' | "doesn't suit style" | 'uncomfortable' | 'impulse purchase' | 'other'
  notes: string | null
  created_at: string
}

export type RecommendationEntry = {
  id: string
  item_id: string | null
  written_take: string
  published_at: string
}

export type ItemPairing = {
  id: string
  item_id: string
  paired_item_id: string
  note: string | null
}

export type HeroImage = {
  id: string
  storage_path: string
  display_order: number
  created_at: string
}

// Enriched types — used by list views and detail pages
export type ItemWithRelations = Item & {
  brand: Brand | null
  subcategory: (Subcategory & { category: Category }) | null
  photos: ItemPhoto[]
  lp_score: number | null
  wear_count: number
}

export type ItemDetail = ItemWithRelations & {
  reviews: LPReview[]
  wear_records: WearRecord[]
  pairings: Array<ItemPairing & { paired_item: ItemWithRelations }>
}

export type BrandWithStats = Brand & {
  items: ItemWithRelations[]
  average_lp_score: number | null
  total_wear_count: number
}

// Averages five review dimensions, rounded to one decimal place.
export function computeLPScore(
  review: Pick<LPReview, 'fit' | 'comfort' | 'quality' | 'versatility' | 'value'>
): number {
  const sum = review.fit + review.comfort + review.quality + review.versatility + review.value
  return Math.round((sum / 5) * 10) / 10
}

// Returns the LP score of the most recent review, or null if none exist.
export function getItemLPScore(reviews: LPReview[]): number | null {
  if (reviews.length === 0) return null
  const latest = [...reviews].sort(
    (a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime()
  )[0]
  return computeLPScore(latest)
}
