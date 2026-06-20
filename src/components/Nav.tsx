// src/components/Nav.tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-espresso/10 bg-cream sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-espresso tracking-widest uppercase text-sm"
        >
          LP&apos;s Style Book
        </Link>
        <div className="flex gap-8">
          <Link
            href="/"
            className="text-warm hover:text-espresso text-xs tracking-widest uppercase transition-colors"
          >
            Home
          </Link>
          <Link
            href="/recommendations"
            className="text-warm hover:text-espresso text-xs tracking-widest uppercase transition-colors"
          >
            Recommendations
          </Link>
          <Link
            href="/collection"
            className="text-warm hover:text-espresso text-xs tracking-widest uppercase transition-colors"
          >
            My Collection
          </Link>
        </div>
      </div>
    </nav>
  )
}
