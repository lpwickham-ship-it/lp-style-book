// src/components/ImportForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { saveItem, type SaveItemInput } from '@/app/actions/saveItem'
import type { ScrapeResult } from '@/lib/scraper'
import type { Category, Subcategory, Brand } from '@/types'

type Props = {
  categories: (Category & { subcategories: Subcategory[] })[]
  brands: Brand[]
}

type FormState = {
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

const EMPTY_FORM: FormState = {
  name: '', brandName: '', subcategoryId: '', description: '',
  material: '', price: '', purchaseDate: '', purchaseLocation: '',
  sourceUrl: '', imageUrl: '', inCollection: true, inWishlist: false, isRecommendation: false,
}

export default function ImportForm({ categories, brands }: Props) {
  const [url, setUrl] = useState('')
  const [scraping, setScraping] = useState(false)
  const [scrapeError, setScrapeError] = useState<string | null>(null)
  const [confidence, setConfidence] = useState<ScrapeResult['confidence'] | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, startSave] = useTransition()
  const [saveError, setSaveError] = useState<string | null>(null)

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault()
    setScraping(true)
    setScrapeError(null)
    setConfidence(null)

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) {
        const { error } = await res.json() as { error?: string }
        throw new Error(error ?? 'Scrape failed')
      }
      const result = await res.json() as ScrapeResult
      setConfidence(result.confidence)
      setForm({
        name: result.name ?? '',
        brandName: result.brand ?? '',
        subcategoryId: '',
        description: result.description ?? '',
        material: result.material ?? '',
        price: result.price !== null ? String(result.price) : '',
        purchaseDate: '',
        purchaseLocation: '',
        sourceUrl: result.sourceUrl,
        imageUrl: result.imageUrl ?? '',
        inCollection: true,
        inWishlist: false,
        isRecommendation: false,
      })
    } catch (err) {
      setScrapeError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setScraping(false)
    }
  }

  function handleSave() {
    setSaveError(null)
    if (!form.name.trim()) { setSaveError('Name is required'); return }
    const input: SaveItemInput = { ...form }
    startSave(async () => {
      try {
        await saveItem(input)
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Save failed')
      }
    })
  }

  const confidenceBadge: Record<NonNullable<typeof confidence>, string> = {
    full: 'bg-tan/20 text-tan',
    partial: 'bg-warm/20 text-warm',
    failed: 'bg-red-100 text-red-700',
  }
  const confidenceLabel: Record<NonNullable<typeof confidence>, string> = {
    full: 'Auto-filled — review and save',
    partial: 'Partial — some fields need filling in',
    failed: 'Could not scrape — fill in manually',
  }

  return (
    <div>
      {/* URL input */}
      <form onSubmit={handleScrape} className="mb-10">
        <label className="block text-xs text-warm tracking-widest uppercase mb-2">
          Product URL
        </label>
        <div className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://drakes.com/products/..."
            required
            className="flex-1 border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60 placeholder:text-warm/40"
          />
          <button
            type="submit"
            disabled={scraping || !url}
            className="bg-espresso text-cream text-xs tracking-widest uppercase px-6 py-2.5 hover:bg-warm transition-colors disabled:opacity-40"
          >
            {scraping ? 'Scraping…' : 'Scrape'}
          </button>
        </div>
        {scrapeError && (
          <p className="text-red-600 text-xs mt-2">{scrapeError}</p>
        )}
      </form>

      {/* Confidence badge */}
      {confidence && (
        <div className={`inline-block text-xs px-3 py-1 tracking-wide mb-8 ${confidenceBadge[confidence]}`}>
          {confidenceLabel[confidence]}
        </div>
      )}

      {/* Draft form — shown once scrape has run (even if failed) */}
      {confidence !== null && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Brand</label>
              <input
                type="text"
                value={form.brandName}
                onChange={e => setField('brandName', e.target.value)}
                list="brands-list"
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60"
              />
              <datalist id="brands-list">
                {brands.map(b => <option key={b.id} value={b.name} />)}
              </datalist>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Subcategory</label>
              <select
                value={form.subcategoryId}
                onChange={e => setField('subcategoryId', e.target.value)}
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60"
              >
                <option value="">— select —</option>
                {categories.map(cat => (
                  <optgroup key={cat.id} label={cat.name}>
                    {cat.subcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setField('price', e.target.value)}
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60"
              />
            </div>

            {/* Purchase Date */}
            <div>
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Purchase Date</label>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={e => setField('purchaseDate', e.target.value)}
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60"
              />
            </div>

            {/* Purchase Location */}
            <div>
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Purchased From</label>
              <input
                type="text"
                value={form.purchaseLocation}
                onChange={e => setField('purchaseLocation', e.target.value)}
                placeholder="e.g. drakes.com, Dover Street Market"
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60 placeholder:text-warm/40"
              />
            </div>

            {/* Material */}
            <div>
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Material</label>
              <input
                type="text"
                value={form.material}
                onChange={e => setField('material', e.target.value)}
                placeholder="e.g. 100% wool"
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60 placeholder:text-warm/40"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60 resize-none"
              />
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-xs text-warm tracking-widest uppercase mb-1">Photo URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={e => setField('imageUrl', e.target.value)}
                className="w-full border border-espresso/20 bg-cream text-espresso text-sm px-4 py-2.5 focus:outline-none focus:border-espresso/60"
              />
              {form.imageUrl && (
                <div className="mt-3 w-32 aspect-[3/4] bg-warm/10 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Presence flags */}
          <div>
            <p className="text-xs text-warm tracking-widest uppercase mb-3">Add to</p>
            <div className="flex gap-6">
              {([
                ['inCollection', 'My Collection'],
                ['inWishlist', 'Wishlist'],
                ['isRecommendation', "LP's Picks"],
              ] as [keyof FormState, string][]).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key] as boolean}
                    onChange={e => setField(key, e.target.checked)}
                    className="accent-espresso"
                  />
                  <span className="text-sm text-espresso">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          {saveError && <p className="text-red-600 text-xs">{saveError}</p>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-espresso text-cream text-xs tracking-widest uppercase px-8 py-3 hover:bg-warm transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Save to Wardrobe'}
          </button>
        </div>
      )}
    </div>
  )
}
