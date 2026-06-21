// src/app/api/scrape/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { scrapeProduct } from '@/lib/scraper'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json() as { url?: unknown }
  const url = typeof body.url === 'string' ? body.url.trim() : null
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 })

  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  const result = await scrapeProduct(url)
  return NextResponse.json(result)
}
