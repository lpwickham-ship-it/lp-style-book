// supabase/seed-photos.ts
// Seeds one Unsplash photo per collection item, mapped by subcategory.
// Run with: node --env-file=.env.local --import tsx/esm supabase/seed-photos.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// One curated Unsplash photo per subcategory slug
const PHOTO_BY_SUBCATEGORY: Record<string, string> = {
  tops:      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
  shirts:    'https://images.unsplash.com/photo-1598033549897-5f2ed0d08060?auto=format&fit=crop&w=800&q=80',
  bottoms:   'https://images.unsplash.com/photo-1473966968600-d4b0f1a1ecfe?auto=format&fit=crop&w=800&q=80',
  outerwear: 'https://images.unsplash.com/photo-1539533113208-f19d8573321f?auto=format&fit=crop&w=800&q=80',
  knitwear:  'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=800&q=80',
  ties:      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
  watches:   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
  belts:     'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=800&q=80',
  bags:      'https://images.unsplash.com/photo-1548036161-59e0ba0439de?auto=format&fit=crop&w=800&q=80',
  scarves:   'https://images.unsplash.com/photo-1520903740330-d968a5b8870c?auto=format&fit=crop&w=800&q=80',
  eyewear:   'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
  trainers:  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  boots:     'https://images.unsplash.com/photo-1608256246200-537512867984?auto=format&fit=crop&w=800&q=80',
  loafers:   'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80',
  derby:     'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
  oxford:    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
}

const FALLBACK = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80'

async function main() {
  console.log('Fetching items...')
  const { data: items, error } = await supabase
    .from('items')
    .select('id, subcategory:subcategories(slug)')
    .eq('in_collection', true)

  if (error || !items) {
    console.error('Failed to fetch items:', error)
    process.exit(1)
  }

  console.log(`Seeding photos for ${items.length} items...`)

  // Clear existing seeded photos first so this script is idempotent
  await supabase.from('item_photos').delete().like('storage_path', 'https://images.unsplash.com%')

  const photos = items.map(item => {
    const sub = item.subcategory as unknown as { slug: string } | null
    const slug = sub?.slug ?? ''
    const url = PHOTO_BY_SUBCATEGORY[slug] ?? FALLBACK
    return {
      item_id: item.id,
      storage_path: url,
      is_primary: true,
    }
  })

  const { error: insertError } = await supabase.from('item_photos').insert(photos)
  if (insertError) {
    console.error('Failed to insert photos:', insertError)
    process.exit(1)
  }

  console.log(`Done — ${photos.length} photos seeded.`)
}

main()
