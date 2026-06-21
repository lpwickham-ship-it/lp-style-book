import { scrapeProduct } from '@/lib/scraper'

const mockFetch = jest.fn()
global.fetch = mockFetch as typeof fetch

describe('scrapeProduct', () => {
  beforeEach(() => mockFetch.mockReset())

  it('extracts product data from JSON-LD', async () => {
    const html = `<html><head>
      <script type="application/ld+json">
        {"@type":"Product","name":"Navy Tie","brand":{"name":"Drake's"},"description":"A classic tie","offers":{"price":"145"},"image":"https://example.com/img.jpg"}
      </script>
    </head><body><h1>Navy Tie</h1></body></html>`
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => html } as Response)

    const result = await scrapeProduct('https://drakes.com/product/navy-tie')
    expect(result.name).toBe('Navy Tie')
    expect(result.brand).toBe("Drake's")
    expect(result.price).toBe(145)
    expect(result.imageUrl).toBe('https://example.com/img.jpg')
    expect(result.confidence).toBe('full')
  })

  it('falls back to Open Graph tags when no JSON-LD', async () => {
    const html = `<html><head>
      <meta property="og:title" content="Slub Tee" />
      <meta property="og:image" content="https://cdn.example.com/tee.jpg" />
      <meta property="og:site_name" content="Buck Mason" />
      <meta property="og:description" content="A great tee." />
    </head><body></body></html>`
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => html } as Response)

    const result = await scrapeProduct('https://buckmason.com/products/slub-tee')
    expect(result.name).toBe('Slub Tee')
    expect(result.brand).toBe('Buck Mason')
    expect(result.imageUrl).toBe('https://cdn.example.com/tee.jpg')
    expect(result.confidence).toBe('full')
  })

  it('returns confidence "partial" when image is missing', async () => {
    const html = `<html><head>
      <meta property="og:title" content="Some Product" />
    </head><body></body></html>`
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => html } as Response)

    const result = await scrapeProduct('https://example.com/product')
    expect(result.name).toBe('Some Product')
    expect(result.imageUrl).toBeNull()
    expect(result.confidence).toBe('partial')
  })

  it('returns confidence "failed" when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const result = await scrapeProduct('https://example.com/product')
    expect(result.confidence).toBe('failed')
    expect(result.name).toBeNull()
  })

  it('returns confidence "failed" on HTTP error', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 } as Response)

    const result = await scrapeProduct('https://example.com/product')
    expect(result.confidence).toBe('failed')
  })

  it('parses price from offers object', async () => {
    const html = `<html><head>
      <script type="application/ld+json">
        {"@type":"Product","name":"Chino","image":"https://example.com/img.jpg","offers":{"@type":"Offer","price":"118.00","priceCurrency":"USD"}}
      </script>
    </head></html>`
    mockFetch.mockResolvedValueOnce({ ok: true, text: async () => html } as Response)

    const result = await scrapeProduct('https://example.com/chino')
    expect(result.price).toBe(118)
  })
})
