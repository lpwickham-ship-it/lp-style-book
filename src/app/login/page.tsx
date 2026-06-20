'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <h1 className="font-serif text-3xl text-espresso mb-1 tracking-tight">
          LP&apos;s Style Book
        </h1>
        <p className="text-warm text-xs tracking-widest uppercase mb-10">Admin Access</p>

        {sent ? (
          <p className="text-espresso text-sm leading-relaxed">
            Check your inbox — a login link is on its way to{' '}
            <strong>{email}</strong>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full border border-warm/30 bg-white px-4 py-3 text-espresso text-sm focus:outline-none focus:border-tan placeholder:text-warm/40 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-espresso text-cream py-3 text-xs tracking-widest uppercase hover:bg-espresso/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Sending…' : 'Send Login Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
