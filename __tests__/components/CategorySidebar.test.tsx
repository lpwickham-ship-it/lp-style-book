// __tests__/components/CategorySidebar.test.tsx
import { render, screen } from '@testing-library/react'
import CategorySidebar from '@/components/CategorySidebar'
import type { Category, Subcategory, Brand } from '@/types'

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
})

type CategoryWithSubs = Category & { subcategories: Subcategory[] }

const categories: CategoryWithSubs[] = [
  {
    id: 'cat-1', name: 'Clothing', slug: 'clothing',
    subcategories: [
      { id: 's1', category_id: 'cat-1', name: 'Tops', slug: 'tops' },
      { id: 's2', category_id: 'cat-1', name: 'Shirts', slug: 'shirts' },
    ],
  },
  {
    id: 'cat-2', name: 'Shoes', slug: 'shoes',
    subcategories: [
      { id: 's3', category_id: 'cat-2', name: 'Boots', slug: 'boots' },
    ],
  },
]

const brands: Brand[] = [
  { id: 'b1', name: "Drake's", country: 'UK', notes: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'b2', name: 'Buck Mason', country: 'US', notes: null, created_at: '2026-01-01T00:00:00Z' },
]

describe('CategorySidebar', () => {
  it('renders all category names', () => {
    render(<CategorySidebar categories={categories} brands={brands} />)
    expect(screen.getByText('Clothing')).toBeInTheDocument()
    expect(screen.getByText('Shoes')).toBeInTheDocument()
  })

  it('renders subcategory names', () => {
    render(<CategorySidebar categories={categories} brands={brands} />)
    expect(screen.getByText('Tops')).toBeInTheDocument()
    expect(screen.getByText('Shirts')).toBeInTheDocument()
    expect(screen.getByText('Boots')).toBeInTheDocument()
  })

  it('renders brand names', () => {
    render(<CategorySidebar categories={categories} brands={brands} />)
    expect(screen.getByText("Drake's")).toBeInTheDocument()
    expect(screen.getByText('Buck Mason')).toBeInTheDocument()
  })
})
