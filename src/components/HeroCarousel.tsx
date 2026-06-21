'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { HeroImage } from '@/types'
import { getPhotoUrl } from '@/lib/supabase/storage'

export default function HeroCarousel({ images }: { images: HeroImage[] }) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrent(i => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div className="w-full aspect-[16/7] bg-warm/10 flex items-center justify-center">
        <p className="text-warm/50 text-xs tracking-widest uppercase">No hero images yet</p>
      </div>
    )
  }

  const active = images[current]
  const photoUrl = getPhotoUrl(active.storage_path)

  return (
    <div className="w-full aspect-[16/7] relative overflow-hidden">
      <Image
        key={active.id}
        src={photoUrl}
        alt="Style inspiration"
        fill
        className="object-cover transition-opacity duration-1000"
        priority
      />
      <div className="absolute inset-0 bg-espresso/20" />

      {images.length > 1 && (
        <>
          {/* Dot navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-opacity ${i === current ? 'bg-cream opacity-100' : 'bg-cream opacity-40'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          {/* Left arrow */}
          <button
            onClick={() => setCurrent(i => (i - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-espresso/30 hover:bg-espresso/50 text-cream w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            &#8592;
          </button>
          {/* Right arrow */}
          <button
            onClick={() => setCurrent(i => (i + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-espresso/30 hover:bg-espresso/50 text-cream w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            &#8594;
          </button>
        </>
      )}
    </div>
  )
}
