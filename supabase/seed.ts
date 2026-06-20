// supabase/seed.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role key — bypasses RLS for seeding
)

// ──────────────────────────────────────────────────────────────
// Reference data
// ──────────────────────────────────────────────────────────────

const BRANDS = [
  { name: "Drake's", country: 'UK', notes: 'Heritage British accessories and tailoring. Exceptional tie and pocket square selection.' },
  { name: 'Buck Mason', country: 'US', notes: 'American basics done properly. Best slub tees and chinos at their price point.' },
  { name: 'Sunspel', country: 'UK', notes: 'The gold standard for underwear and casual basics. Long-staple cotton only.' },
  { name: 'Loro Piana', country: 'Italy', notes: 'Unmatched cashmere and superfine wool. Investment pieces that last decades.' },
  { name: 'Reiss', country: 'UK', notes: 'Reliable smart-casual staples. Good tailoring for the price.' },
  { name: 'Orlebar Brown', country: 'UK', notes: 'Premium resort and swimwear. Worth the price for the quality and fit.' },
  { name: 'Officine Générale', country: 'France', notes: 'Relaxed Parisian tailoring. Linen and cotton blends that breathe.' },
  { name: 'Albam', country: 'UK', notes: 'Understated British quality. Great knitwear and workwear-inspired pieces.' },
  { name: 'Corridor NYC', country: 'US', notes: 'Neo-trad American. Beautiful fabrics sourced from Japanese mills.' },
  { name: 'Alex Mill', country: 'US', notes: 'NYC basics with a relaxed fit. Excellent denim and oxford shirts.' },
  { name: 'The Real McCoy\'s', country: 'Japan', notes: 'Japanese heritage reproductions. Made to last a lifetime.' },
  { name: 'Naked & Famous', country: 'Canada', notes: 'Best raw denim at their price point. Fades beautifully over time.' },
  { name: 'Polo Ralph Lauren', country: 'US', notes: 'Reliable for basics. Oxford shirts and chinos are almost always good.' },
  { name: 'Hamilton Shirts', country: 'US', notes: 'Heritage American shirtmaker. Solid construction, classic fits.' },
  { name: 'Turnbull & Asser', country: 'UK', notes: 'Jermyn Street institution. Dress shirts and ties at their finest.' },
  { name: 'New & Lingwood', country: 'UK', notes: 'Eton and Cambridge outfitter. Socks and underwear are exceptional.' },
  { name: 'Uniqlo', country: 'Japan', notes: 'The benchmark for affordable basics. Linen shirts and merino wool are standouts.' },
]

const ITEMS = [
  // Drake's
  { brand: "Drake's", name: 'Navy Grenadine Tie', sub: 'Ties', price: 145, mat: 'Silk grenadine', desc: 'The essential navy tie. Open-weave grenadine catches the light without being flashy. Pairs with everything.', wears: 22, fit: 9, comfort: 9, quality: 10, vers: 9, val: 8, failed: false },
  { brand: "Drake's", name: 'Wool Challis Pocket Square', sub: 'Scarves', price: 65, mat: 'Wool challis', desc: 'Burgundy and navy paisley. Soft enough to fold without creasing, drapes beautifully in a chest pocket.', wears: 18, fit: 10, comfort: 10, quality: 10, vers: 7, val: 7, failed: false },
  // Buck Mason
  { brand: 'Buck Mason', name: 'Slub Cotton Tee', sub: 'Tops', price: 58, mat: '100% slub cotton', desc: 'The best casual tee at this price. The texture is subtle and improves with washing.', wears: 41, fit: 8, comfort: 10, quality: 8, vers: 9, val: 9, failed: false },
  { brand: 'Buck Mason', name: 'Stretch Chino', sub: 'Bottoms', price: 118, mat: 'Cotton-stretch blend', desc: 'Comfortable enough for a long day but looks smart. The stretch is barely noticeable to anyone but you.', wears: 28, fit: 7, comfort: 9, quality: 7, vers: 8, val: 8, failed: false },
  // Sunspel
  { brand: 'Sunspel', name: 'Riviera Polo Shirt', sub: 'Tops', price: 165, mat: 'Long-staple cotton', desc: 'The polo shirt by which all others are judged. Minimal branding, perfect weight, flattering fit.', wears: 19, fit: 9, comfort: 10, quality: 10, vers: 8, val: 7, failed: false },
  { brand: 'Sunspel', name: 'Classic Boxer Short', sub: 'Bottoms', price: 55, mat: 'Long-staple cotton', desc: 'Expensive for underwear and worth every cent. Last significantly longer than cheaper alternatives.', wears: 60, fit: 9, comfort: 10, quality: 10, vers: 10, val: 8, failed: false },
  // Loro Piana
  { brand: 'Loro Piana', name: 'Cashmere Crewneck Sweater', sub: 'Knitwear', price: 1200, mat: 'Baby cashmere', desc: 'Softer than anything else I own. An investment that pays off every winter.', wears: 14, fit: 9, comfort: 10, quality: 10, vers: 9, val: 7, failed: false },
  { brand: 'Loro Piana', name: 'Wish Scarf', sub: 'Scarves', price: 450, mat: 'Baby cashmere', desc: 'Impossibly light for how warm it keeps you. One of the best purchases I\'ve made.', wears: 12, fit: 10, comfort: 10, quality: 10, vers: 8, val: 7, failed: false },
  // Reiss
  { brand: 'Reiss', name: 'Slim Wool Trousers', sub: 'Bottoms', price: 195, mat: 'Wool blend', desc: 'Good everyday trousers for smart-casual occasions. Fit is reliable, nothing special but nothing bad.', wears: 24, fit: 7, comfort: 7, quality: 7, vers: 8, val: 7, failed: false },
  { brand: 'Reiss', name: 'Merino Turtleneck', sub: 'Knitwear', price: 145, mat: 'Merino wool', desc: 'Bought in dark navy. Pilled after six washes — disappointing for the price.', wears: 4, fit: 6, comfort: 5, quality: 3, vers: 5, val: 2, failed: true, failReason: 'poor quality' },
  // Orlebar Brown
  { brand: 'Orlebar Brown', name: 'Bulldog Swim Short', sub: 'Bottoms', price: 195, mat: 'Recycled polyester', desc: 'The swim short that looks as good at the bar as in the water. Worth the price.', wears: 9, fit: 9, comfort: 9, quality: 9, vers: 7, val: 7, failed: false },
  // Officine Générale
  { brand: 'Officine Générale', name: 'Linen Overshirt', sub: 'Shirts', price: 295, mat: 'Irish linen', desc: 'Perfect summer layer. Worn open over a tee or buttoned up with chinos.', wears: 16, fit: 9, comfort: 10, quality: 9, vers: 9, val: 8, failed: false },
  // Albam
  { brand: 'Albam', name: 'Shetland Crewneck', sub: 'Knitwear', price: 175, mat: 'Shetland wool', desc: 'Proper scratchy Shetland, as it should be. Rustic texture and warm. A true workhorse.', wears: 20, fit: 8, comfort: 7, quality: 9, vers: 8, val: 9, failed: false },
  { brand: 'Albam', name: 'Chore Coat', sub: 'Outerwear', price: 225, mat: 'Cotton canvas', desc: 'Versatile work jacket. The pockets are genuinely useful and it breaks in beautifully.', wears: 17, fit: 8, comfort: 8, quality: 9, vers: 9, val: 9, failed: false },
  // Corridor NYC
  { brand: 'Corridor NYC', name: 'Seersucker Blazer', sub: 'Outerwear', price: 495, mat: 'Cotton seersucker', desc: 'Summer tailoring that doesn\'t take itself too seriously. The texture does the work.', wears: 7, fit: 8, comfort: 9, quality: 9, vers: 7, val: 7, failed: false },
  // Alex Mill
  { brand: 'Alex Mill', name: 'Standard Oxford Shirt', sub: 'Shirts', price: 115, mat: 'Cotton oxford', desc: 'The benchmark oxford shirt. Relaxed fit, proper weight, no branding. Fades beautifully.', wears: 33, fit: 9, comfort: 9, quality: 9, vers: 10, val: 9, failed: false },
  { brand: 'Alex Mill', name: 'Mill Jean', sub: 'Bottoms', price: 168, mat: '100% cotton selvedge denim', desc: 'Classic five-pocket jean in a straight fit. Honest denim at a fair price.', wears: 27, fit: 8, comfort: 8, quality: 9, vers: 9, val: 9, failed: false },
  // The Real McCoy's
  { brand: 'The Real McCoy\'s', name: 'Joe McCoy Denim Jacket', sub: 'Outerwear', price: 595, mat: 'Japanese selvedge denim', desc: 'Built to last fifty years. The indigo is already fading in all the right places.', wears: 11, fit: 8, comfort: 8, quality: 10, vers: 8, val: 8, failed: false },
  // Naked & Famous
  { brand: 'Naked & Famous', name: 'Weird Guy Raw Denim', sub: 'Bottoms', price: 195, mat: 'Japanese raw selvedge denim', desc: 'Six months of wear and the fades are extraordinary. Worth the patience.', wears: 45, fit: 8, comfort: 7, quality: 10, vers: 8, val: 9, failed: false },
  // Polo Ralph Lauren
  { brand: 'Polo Ralph Lauren', name: 'Custom Fit Oxford Shirt', sub: 'Shirts', price: 98, mat: 'Cotton oxford cloth', desc: 'Reliable and inoffensive. Not exciting but always correct.', wears: 19, fit: 7, comfort: 8, quality: 7, vers: 9, val: 8, failed: false },
  { brand: 'Polo Ralph Lauren', name: 'Merino Wool V-Neck', sub: 'Knitwear', price: 145, mat: 'Merino wool', desc: 'Bought this as a placeholder. The colour was off and it felt cheap. Donated after three wears.', wears: 3, fit: 5, comfort: 5, quality: 4, vers: 5, val: 3, failed: true, failReason: "doesn't suit style" },
  // Hamilton Shirts
  { brand: 'Hamilton Shirts', name: 'Broadcloth Dress Shirt', sub: 'Shirts', price: 225, mat: '2-ply cotton broadcloth', desc: 'American shirtmaking at its best. The collar roll is perfect and it keeps its shape all day.', wears: 13, fit: 9, comfort: 9, quality: 10, vers: 8, val: 8, failed: false },
  // Turnbull & Asser
  { brand: 'Turnbull & Asser', name: 'Jermyn Street Dress Shirt', sub: 'Shirts', price: 295, mat: '2-ply Sea Island cotton', desc: 'The finest cotton I\'ve worn against skin. The shirt equivalent of a Loro Piana sweater.', wears: 8, fit: 9, comfort: 10, quality: 10, vers: 7, val: 7, failed: false },
  { brand: 'Turnbull & Asser', name: 'Repp Stripe Tie', sub: 'Ties', price: 165, mat: 'Silk', desc: 'Navy and gold repp stripe. A Jermyn Street classic. Goes with everything in the wardrobe.', wears: 11, fit: 9, comfort: 9, quality: 10, vers: 8, val: 7, failed: false },
  // New & Lingwood
  { brand: 'New & Lingwood', name: 'Merino Ankle Socks', sub: 'Bottoms', price: 28, mat: 'Merino wool', desc: 'Exceptional socks. Lasted three years without holes or thinning. Worth the premium.', wears: 90, fit: 9, comfort: 10, quality: 10, vers: 10, val: 9, failed: false },
  // Uniqlo
  { brand: 'Uniqlo', name: 'Premium Linen Shirt', sub: 'Shirts', price: 49, mat: 'French linen', desc: 'The best value linen shirt available. The fabric is good and it washes well.', wears: 22, fit: 7, comfort: 9, quality: 7, vers: 8, val: 10, failed: false },
  { brand: 'Uniqlo', name: 'Extra Fine Merino Crewneck', sub: 'Knitwear', price: 49, mat: 'Extra fine merino', desc: 'Impressive for the price. Pilled slightly after a year but remained wearable. Good value.', wears: 30, fit: 7, comfort: 8, quality: 6, vers: 9, val: 9, failed: false },
  // Additional items to reach 38
  { brand: "Drake's", name: 'Madder Silk Tie', sub: 'Ties', price: 165, mat: 'Madder silk', desc: 'Brick red with a subtle paisley. The matte finish of madder silk is unlike anything else.', wears: 9, fit: 9, comfort: 9, quality: 10, vers: 7, val: 7, failed: false },
  { brand: 'Sunspel', name: 'Sea Island Cotton Tee', sub: 'Tops', price: 85, mat: 'Sea Island cotton', desc: 'The ultimate white tee. So fine it feels like a second skin. Worth the indulgence.', wears: 15, fit: 9, comfort: 10, quality: 10, vers: 10, val: 7, failed: false },
  { brand: 'Albam', name: 'Ripstop Work Trouser', sub: 'Bottoms', price: 145, mat: 'Cotton ripstop', desc: 'Weekend workhorse. Comfortable, durable, and looks better with wear.', wears: 21, fit: 8, comfort: 9, quality: 9, vers: 7, val: 9, failed: false },
  { brand: 'Officine Générale', name: 'Cotton Twill Chino', sub: 'Bottoms', price: 265, mat: 'Japanese cotton twill', desc: 'Impeccable French chino. The fabric has a slight sheen and drapes beautifully.', wears: 18, fit: 9, comfort: 8, quality: 9, vers: 9, val: 7, failed: false },
  { brand: 'Corridor NYC', name: 'Japanese Cotton Poplin Shirt', sub: 'Shirts', price: 295, mat: 'Japanese cotton poplin', desc: 'The fabric feels almost handmade. A shirt to treasure.', wears: 10, fit: 8, comfort: 9, quality: 10, vers: 8, val: 7, failed: false },
  { brand: 'Polo Ralph Lauren', name: 'Relaxed Fit Chino', sub: 'Bottoms', price: 98, mat: 'Chino cotton', desc: 'Bought impulsively in the wrong size. Too large in the seat. Classic impulse buy mistake.', wears: 2, fit: 3, comfort: 5, quality: 6, vers: 5, val: 3, failed: true, failReason: 'poor fit' },
  { brand: "Drake's", name: 'Cashmere Scarf', sub: 'Scarves', price: 195, mat: 'Cashmere', desc: 'Camel-coloured cashmere. Light and warm. A winter essential.', wears: 16, fit: 10, comfort: 10, quality: 9, vers: 9, val: 8, failed: false },
  { brand: 'Reiss', name: 'Harrington Jacket', sub: 'Outerwear', price: 245, mat: 'Cotton', desc: 'Clean and versatile transitional jacket. Smart without being stiff.', wears: 12, fit: 8, comfort: 8, quality: 7, vers: 9, val: 7, failed: false },
  { brand: 'Loro Piana', name: 'Windmate Jacket', sub: 'Outerwear', price: 1850, mat: 'Storm System® fabric', desc: 'The most functional garment I own. Windproof, rainproof, and packs to nothing.', wears: 22, fit: 9, comfort: 10, quality: 10, vers: 8, val: 7, failed: false },
  { brand: 'Uniqlo', name: 'Wide-Leg Chino', sub: 'Bottoms', price: 49, mat: 'Cotton', desc: 'Wrong cut for my body type. Looked shapeless and was never worn after the first try-on.', wears: 1, fit: 2, comfort: 6, quality: 6, vers: 4, val: 2, failed: true, failReason: "doesn't suit style" },
  { brand: 'The Real McCoy\'s', name: 'Buco J-100 Leather Jacket', sub: 'Outerwear', price: 1200, mat: 'Horsehide leather', desc: 'A jacket to pass down. The horsehide is stiff now and will break in over years.', wears: 6, fit: 8, comfort: 7, quality: 10, vers: 7, val: 8, failed: false },
] as const

const WISHLIST = [
  { brand: "Drake's", name: 'Grenadine Tie in Forest Green', price: 145, status: 'Considering', interest: 8, notes: 'Would fill a gap in the tie rotation. Seen it worn by several people I respect.' },
  { brand: 'Sunspel', name: 'Q82 Swim Short', price: 110, status: 'Researching', interest: 7, notes: 'Waiting for the navy colourway to come back in stock.' },
  { brand: 'Loro Piana', name: 'Open Walk Loafers', price: 890, status: 'Wishlist', interest: 9, notes: 'The ideal warm-weather loafer. Watching for a sale.' },
  { brand: 'Officine Générale', name: 'Batiste Shirt', price: 255, status: 'Researching', interest: 7, notes: 'Very lightweight summer option. Need to try the fit in person.' },
  { brand: 'Albam', name: 'Indigo Work Shirt', price: 145, status: 'Considering', interest: 8, notes: 'The indigo version of the chore coat would pair well with raw denim.' },
  { brand: 'Alex Mill', name: 'Washed Twill Trouser', price: 148, status: 'Wishlist', interest: 6, notes: 'A more relaxed alternative to chinos for weekends.' },
  { brand: 'Corridor NYC', name: 'Floral Jacquard Tie', price: 185, status: 'Considering', interest: 7, notes: 'Something different. The pattern is bold but the colours are muted enough.' },
  { brand: 'Hamilton Shirts', name: 'End-on-End Shirt', price: 225, status: 'Researching', interest: 8, notes: 'The end-on-end texture adds interest without pattern. On the shortlist.' },
  { brand: 'Loro Piana', name: 'Baby Cashmere Polo', price: 1050, status: 'Wishlist', interest: 8, notes: 'An indulgence. The summer equivalent of the crewneck.' },
  { brand: 'New & Lingwood', name: 'Striped Cotton Pyjamas', price: 195, status: 'Wishlist', interest: 6, notes: 'A considered luxury. Long-staple cotton for sleeping in.' },
  { brand: 'Turnbull & Asser', name: 'Poplin Dress Shirt in Pale Blue', price: 295, status: 'Researching', interest: 9, notes: 'The blue equivalent of the white. Would replace two lesser shirts.' },
  { brand: 'Naked & Famous', name: 'Easy Guy in Heavyweight Denim', price: 215, status: 'Considering', interest: 7, notes: 'A more relaxed cut for weekends. The heavyweight fabric will fade slowly.' },
  { brand: 'Reiss', name: 'Slim Cotton Suit', price: 495, status: 'Archived', interest: 4, notes: 'Decided against — the wool-blend suits I already own are better for formal occasions.' },
  { brand: 'Orlebar Brown', name: 'Setter Shirt', price: 195, status: 'Purchased', interest: 9, notes: 'Ordered. Linen-cotton blend in navy. Should arrive next week.' },
  { brand: 'Buck Mason', name: 'Raw Denim Jacket', price: 198, status: 'Wishlist', interest: 7, notes: 'American alternative to the Real McCoy\'s for casual wear.' },
  { brand: 'Albam', name: 'Merino Turtle Neck', price: 165, status: 'Considering', interest: 8, notes: 'A cleaner alternative to the Shetland for smart-casual occasions.' },
]

async function main() {
  process.stdout.write('Seeding brands...\n')
  const { data: insertedBrands, error: brandErr } = await supabase
    .from('brands')
    .upsert(BRANDS, { onConflict: 'name' })
    .select()
  if (brandErr) throw brandErr
  const brandMap = Object.fromEntries((insertedBrands ?? []).map(b => [b.name, b.id]))

  process.stdout.write('Fetching subcategories...\n')
  const { data: subs } = await supabase.from('subcategories').select('id, slug, name')
  const subMap = Object.fromEntries((subs ?? []).map(s => [s.name, s.id]))

  process.stdout.write('Seeding items...\n')
  for (const item of ITEMS) {
    const { data: inserted, error: itemErr } = await supabase
      .from('items')
      .insert({
        name: item.name,
        brand_id: brandMap[item.brand],
        subcategory_id: subMap[item.sub],
        description: item.desc,
        material: item.mat,
        purchase_price: item.price,
        in_collection: true,
        is_recommendation: false,
        in_wishlist: false,
        status: 'owned',
      })
      .select()
      .single()
    if (itemErr) throw itemErr

    // Add review
    const { error: reviewErr } = await supabase.from('lp_reviews').insert({
      item_id: inserted.id,
      fit: item.fit,
      comfort: item.comfort,
      quality: item.quality,
      versatility: item.vers,
      value: item.val,
      notes: null,
    })
    if (reviewErr) throw reviewErr

    // Add wear records
    const wearCount = item.wears
    const baseDate = new Date('2024-01-01')
    const seasons = ['Spring', 'Summer', 'Autumn', 'Winter'] as const
    const occasions = ['Casual', 'Smart Casual', 'Work', 'Formal', 'Sport'] as const
    for (let i = 0; i < wearCount; i++) {
      const date = new Date(baseDate)
      date.setDate(baseDate.getDate() + Math.floor((i / wearCount) * 540))
      await supabase.from('wear_records').insert({
        item_id: inserted.id,
        worn_on: date.toISOString().split('T')[0],
        season: seasons[i % 4],
        occasion: occasions[i % 5],
      })
    }

    // Add failed purchase record if applicable
    if (item.failed) {
      await supabase.from('failed_purchases').insert({
        item_id: inserted.id,
        reason: (item as { failReason?: string }).failReason ?? 'other',
        notes: null,
      })
    }
  }

  process.stdout.write('Seeding wishlist...\n')
  for (const wi of WISHLIST) {
    const { data: draftItem } = await supabase
      .from('items')
      .insert({
        name: wi.name,
        brand_id: brandMap[wi.brand],
        in_collection: false,
        in_wishlist: true,
        is_recommendation: false,
        status: 'owned',
        purchase_price: wi.price,
      })
      .select()
      .single()
    if (!draftItem) continue

    await supabase.from('wishlist_items').insert({
      item_id: draftItem.id,
      status: wi.status,
      interest_score: wi.interest,
      notes: wi.notes,
    })
  }

  process.stdout.write('Done.\n')
}

main().catch(err => {
  process.stderr.write(String(err) + '\n')
  process.exit(1)
})
