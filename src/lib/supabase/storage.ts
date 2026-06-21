// src/lib/supabase/storage.ts
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

export function getPhotoUrl(storagePath: string): string {
  if (storagePath.startsWith('http')) return storagePath
  return `${SUPABASE_URL}/storage/v1/object/public/item-photos/${storagePath}`
}

export async function uploadPhotoFromUrl(
  imageUrl: string,
  itemId: string,
): Promise<string | null> {
  const serviceClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  let buffer: ArrayBuffer
  let contentType: string
  try {
    const res = await fetch(imageUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return null
    contentType = res.headers.get('content-type') ?? 'image/jpeg'
    buffer = await res.arrayBuffer()
  } catch {
    return null
  }

  const ext = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
    ? 'webp'
    : 'jpg'
  const path = `${itemId}/${crypto.randomUUID()}.${ext}`

  const { error } = await serviceClient.storage
    .from('item-photos')
    .upload(path, buffer, { contentType, upsert: false })

  if (error) return null
  return path
}
