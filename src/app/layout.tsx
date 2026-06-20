import type { Metadata } from 'next'
import { EB_Garamond, Inter } from 'next/font/google'
import Nav from '@/components/Nav'
import './globals.css'

const garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-garamond',
  weight: ['400', '500', '600'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "LP's Style Book",
  description: 'Personal wardrobe intelligence',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${garamond.variable} ${inter.variable}`}>
      <body className="bg-cream text-espresso font-sans antialiased min-h-screen">
          <Nav />
          <main>{children}</main>
      </body>
    </html>
  )
}
