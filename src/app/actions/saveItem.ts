'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { uploadPhotoFromUrl } from '@/lib/supabase/storage'

export type SaveItemInput = {
  name: string
  brandName: string
  subcategoryId: string
  description: string
  material: string
  price: string
  purchaseDate: string
  purchaseLocation: string
  sourceUrl: string
  imageUrl: string
  inCollection: boolean
  inWishlist: boolean
  isRecommendation: boolean
}

export async function saveItem(input: SaveItemInput): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Upsert brand by name
  let brandId: string | null = null
  const trimmedBrand = input.brandName.trim()
  if (trimmedBrand) {
    const { data: existing } = await supabase
      .from('brands')
      .select('id')
      .eq('name', trimmedBrand)
      .maybeSingle()

    if (existing) {
      brandId = existing.id as string
    } else {
      const { data: created, error: brandError } = await supabase
        .from('brands')
        .insert({ name: trimmedBrand })
        .select('id')
        .single()
      if (brandError) throw new Error(`Failed to create brand: ${brandError.message}`)
      brandId = created.id as string
    }
  }

  // Create item
  const price = input.price ? parseFloat(input.price) : null
  const { data: item, error: itemError } = await supabase
    .from('items')
    .insert({
      name: input.name.trim(),
      brand_id: brandId,
      subcategory_id: input.subcategoryId || null,
      description: input.description.trim() || null,
      material: input.material.trim() || null,
      purchase_price: price !== null && !isNaN(price) ? price : null,
      purchase_date: input.purchaseDate || null,
      purchase_location: input.purchaseLocation.trim() || null,
      source_url: input.sourceUrl || null,
      status: 'owned',
      in_collection: input.inCollection,
      in_wishlist: input.inWishlist,
      is_recommendation: input.isRecommendation,
    })
    .select('id')
    .single()

  if (itemError || !item) throw new Error(`Failed to create item: ${itemError?.message}`)

  const itemId = item.id as string

  // Download image and upload to Storage
  if (input.imageUrl) {
    const storagePath = await uploadPhotoFromUrl(input.imageUrl, itemId)
    if (storagePath) {
      await supabase.from('item_photos').insert({
        item_id: itemId,
        storage_path: storagePath,
        is_primary: true,
      })
    }
  }

  redirect(`/items/${itemId}`)
}
