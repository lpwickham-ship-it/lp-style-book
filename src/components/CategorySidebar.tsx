// src/components/CategorySidebar.tsx
import Link from 'next/link'
import type { Category, Subcategory, Brand } from '@/types'

type CategoryWithSubs = Category & { subcategories: Subcategory[] }

type Props = {
  categories: CategoryWithSubs[]
  brands: Brand[]
  selectedCategory?: string
  selectedSubcategory?: string
  selectedBrand?: string
}

export default function CategorySidebar({
  categories,
  brands,
  selectedCategory,
  selectedSubcategory,
  selectedBrand,
}: Props) {
  return (
    <aside className="w-48 flex-shrink-0">
      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-warm mb-3">Categories</p>
        <ul className="space-y-1">
          <li>
            <Link
              href="/collection"
              className={`text-sm transition-colors block py-0.5 ${!selectedCategory ? 'text-espresso font-medium' : 'text-warm hover:text-espresso'}`}
            >
              All items
            </Link>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link
                href={`/collection?category=${cat.slug}`}
                className={`text-sm transition-colors block py-0.5 ${selectedCategory === cat.slug && !selectedSubcategory ? 'text-espresso font-medium' : 'text-warm hover:text-espresso'}`}
              >
                {cat.name}
              </Link>
              {cat.subcategories.length > 0 && (
                <ul className="ml-3 mt-1 space-y-1">
                  {cat.subcategories.map(sub => (
                    <li key={sub.id}>
                      <Link
                        href={`/collection?subcategory=${sub.slug}`}
                        className={`text-xs transition-colors block py-0.5 ${selectedSubcategory === sub.slug ? 'text-espresso font-medium' : 'text-warm hover:text-espresso'}`}
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-warm mb-3">Brands</p>
        <ul className="space-y-1">
          {brands.map(brand => (
            <li key={brand.id}>
              <Link
                href={`/collection?brand=${encodeURIComponent(brand.name)}`}
                className={`text-sm transition-colors block py-0.5 ${selectedBrand === brand.name ? 'text-espresso font-medium' : 'text-warm hover:text-espresso'}`}
              >
                {brand.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
