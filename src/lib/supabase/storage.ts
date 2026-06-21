// src/lib/supabase/storage.ts
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

export function getPhotoUrl(storagePath: string): string {
  if (storagePath.startsWith('http')) return storagePath
  return `${SUPABASE_URL}/storage/v1/object/public/item-photos/${storagePath}`
}
