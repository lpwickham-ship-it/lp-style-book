// src/lib/scraper.ts
import * as cheerio from 'cheerio/slim'

export type ScrapeResult = {
  name: string | null
  brand: string | null
  price: number | null
  description: string | null
  material: string | null
  imageUrl: string | null
  sourceUrl: string
  confidence: 'full' | 'partial' | 'failed'
}

function extractJsonLd(html: string): Record<string, unknown> | null {
  const $ = cheerio.load(html)
  let result: Record<string, unknown> | null = null
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).text()) as unknown
      const product =
        Array.isArray(parsed)
          ? (parsed as Record<string, unknown>[]).find(p => p['@type'] === 'Product')
          : (parsed as Record<string, unknown>)['@type'] === 'Product'
          ? (parsed as Record<string, unknown>)
          : null
      if (product && !result) result = product
    } catch {
      // ignore malformed JSON
    }
  })
  return result
}

function extractMeta($: cheerio.CheerioAPI, property: string): string | null {
  return (
    $(`meta[property="${property}"]`).attr('content') ??
    $(`meta[name="${property}"]`).attr('content') ??
    null
  )
}

function domainToBrand(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    const name = host.split('.')[0]
    return name.charAt(0).toUpperCase() + name.slice(1)
  } catch {
    return null
  }
}

function parsePrice(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null
  const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''))
  return isNaN(n) ? null : n
}

export async function scrapeProduct(url: string): Promise<ScrapeResult> {
  const failed: ScrapeResult = {
    name: null, brand: null, price: null, description: null,
    material: null, imageUrl: null, sourceUrl: url, confidence: 'failed',
  }

  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return failed
    html = await res.text()
  } catch {
    return failed
  }

  const $ = cheerio.load(html)
  const ld = extractJsonLd(html)

  const ldBrand = ld?.brand
  const brandFromLd =
    ldBrand && typeof ldBrand === 'object' && !Array.isArray(ldBrand)
      ? ((ldBrand as Record<string, unknown>).name as string | undefined) ?? null
      : typeof ldBrand === 'string' ? ldBrand : null

  const ldOffers = ld?.offers
  const priceRaw =
    ldOffers && typeof ldOffers === 'object' && !Array.isArray(ldOffers)
      ? (ldOffers as Record<string, unknown>).price
      : null

  const ldImage = ld?.image
  const imageFromLd = Array.isArray(ldImage)
    ? (ldImage as string[])[0] ?? null
    : typeof ldImage === 'string' ? ldImage : null

  const rawName =
    (ld?.name as string | undefined) ??
    extractMeta($, 'og:title') ??
    ($('h1').first().text().trim() || null)

  const name = rawName ?? null

  const brand =
    brandFromLd ??
    extractMeta($, 'og:site_name') ??
    domainToBrand(url)

  const price = parsePrice(
    priceRaw ?? extractMeta($, 'product:price:amount') ?? extractMeta($, 'og:price:amount')
  )

  const description =
    (ld?.description as string | undefined) ??
    extractMeta($, 'og:description') ??
    extractMeta($, 'description') ??
    null

  const imageUrl =
    imageFromLd ??
    extractMeta($, 'og:image') ??
    null

  const confidence: ScrapeResult['confidence'] =
    name && imageUrl ? 'full' : name || imageUrl ? 'partial' : 'failed'

  return { name: name ?? null, brand: brand ?? null, price, description, material: null, imageUrl, sourceUrl: url, confidence }
}
