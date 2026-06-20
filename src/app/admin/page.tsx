// src/app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl text-espresso mb-2">Admin</h1>
      <p className="text-warm text-sm mb-8">Logged in as {user.email ?? 'unknown'}</p>
      <p className="text-warm text-sm">
        Product import and item management arrive in Plan 2.
      </p>
    </div>
  )
}
