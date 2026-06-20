// __tests__/components/Nav.test.tsx
import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

jest.mock('next/link', () => {
  return function MockLink({ href, children }: { href: string; children: React.ReactNode }) {
    return <a href={href}>{children}</a>
  }
})

describe('Nav', () => {
  it('renders the site name', () => {
    render(<Nav />)
    expect(screen.getByText("LP's Style Book")).toBeInTheDocument()
  })

  it('renders all three navigation links', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /recommendations/i })).toHaveAttribute('href', '/recommendations')
    expect(screen.getByRole('link', { name: /my collection/i })).toHaveAttribute('href', '/collection')
  })
})
