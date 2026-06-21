// src/app/admin/import/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ImportForm from '@/components/ImportForm'
import type { Category, Subcategory, Brand } from '@/types'

export default async function ImportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('*, subcategories(*)').order('name'),
    supabase.from('brands').select('id, name, country, notes, created_at').order('name'),
  ])

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="font-serif text-3xl text-espresso mb-1">Import Item</h1>
        <p className="text-warm text-sm">Paste a product URL to auto-fill the details, then review and save.</p>
      </div>
      <ImportForm
        categories={(categories as (Category & { subcategories: Subcategory[] })[]) ?? []}
        brands={(brands as Brand[]) ?? []}
      />
    </div>
  )
}
