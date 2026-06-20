// src/components/ItemCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import type { ItemWithRelations } from '@/types'

export default function ItemCard({ item }: { item: ItemWithRelations }) {
  const primaryPhoto = item.photos.find(p => p.is_primary) ?? item.photos[0]
  const photoUrl = primaryPhoto
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/item-photos/${primaryPhoto.storage_path}`
    : null

  return (
    <Link href={`/items/${item.id}`} className="group block">
      <div className="aspect-[3/4] bg-warm/10 relative overflow-hidden mb-3">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-warm/40 text-xs tracking-widest uppercase">No photo</span>
          </div>
        )}
        {item.lp_score !== null && (
          <div className="absolute top-3 right-3 bg-espresso text-cream text-xs px-2 py-1 tracking-wide">
            {item.lp_score}
          </div>
        )}
      </div>
      <div>
        <p className="text-espresso text-sm font-medium leading-snug">{item.name}</p>
        {item.brand && (
          <p className="text-warm text-xs tracking-wide mt-0.5">{item.brand.name}</p>
        )}
      </div>
    </Link>
  )
}
