// __tests__/components/ItemCard.test.tsx
import { render, screen } from '@testing-library/react'
import ItemCard from '@/components/ItemCard'
import type { ItemWithRelations } from '@/types'

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
})
jest.mock('next/image', () => {
  return function MockImage({ alt }: { alt: string }) {
    return <img alt={alt} />
  }
})

const mockItem: ItemWithRelations = {
  id: 'item-1',
  name: 'Navy Wool Tie',
  brand_id: 'brand-1',
  subcategory_id: 'sub-1',
  description: null,
  material: 'Wool',
  purchase_price: 120,
  purchase_date: null,
  purchase_location: null,
  source_url: null,
  status: 'owned',
  in_collection: true,
  in_wishlist: false,
  is_recommendation: false,
  created_at: '2026-06-01T00:00:00Z',
  brand: { id: 'brand-1', name: "Drake's", country: 'UK', notes: null, created_at: '2026-01-01T00:00:00Z' },
  subcategory: { id: 'sub-1', category_id: 'cat-1', name: 'Ties', slug: 'ties', category: { id: 'cat-1', name: 'Accessories', slug: 'accessories' } },
  photos: [],
  lp_score: 8.2,
  wear_count: 14,
}

describe('ItemCard', () => {
  it('renders the item name', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText('Navy Wool Tie')).toBeInTheDocument()
  })

  it('renders the brand name', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText("Drake's")).toBeInTheDocument()
  })

  it('renders the LP score', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText('8.2')).toBeInTheDocument()
  })

  it('links to the item detail page', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/items/item-1')
  })

  it('shows a placeholder when there are no photos', () => {
    render(<ItemCard item={mockItem} />)
    expect(screen.getByText('No photo')).toBeInTheDocument()
  })
})
