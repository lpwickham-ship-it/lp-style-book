// src/app/admin/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl text-espresso mb-1">Admin</h1>
      <p className="text-warm text-sm mb-10">Logged in as {user.email ?? 'unknown'}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/import"
          className="border border-espresso/20 p-6 hover:border-espresso/60 transition-colors group"
        >
          <p className="font-serif text-lg text-espresso mb-1 group-hover:text-tan transition-colors">Import Item</p>
          <p className="text-warm text-xs">Paste a product URL to add an item to your wardrobe.</p>
        </Link>
      </div>
    </div>
  )
}
