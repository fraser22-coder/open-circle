'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import NavBar from '@/components/NavBar'

export default function VendorLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const login = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/vendor/dashboard')
  }

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white border outline-none transition-colors"
  const inputStyle = { background: '#303e66', borderColor: '#3c4f80' }

  return (
    <>
      <NavBar />
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">⭕</div>
            <h1 className="text-[28px] font-black text-gold mb-2">Vendor Login</h1>
            <p className="text-[14px] font-light" style={{ color: '#c5b098' }}>
              Sign in to access your Circle dashboard
            </p>
          </div>

          <form onSubmit={login} className="rounded-2xl p-8 border space-y-5"
            style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            {error && (
              <div className="rounded-xl px-4 py-3 text-[13px] font-medium"
                style={{ background: 'rgba(224,112,112,0.15)', color: '#e07070', border: '1px solid #e07070' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[1.5px] mb-2" style={{ color: '#baa182' }}>
                Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[1.5px] mb-2" style={{ color: '#baa182' }}>
                Password
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••" className={inputCls} style={inputStyle} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-full font-bold text-[15px] transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ background: '#f9d378', color: '#1b1f3b' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="text-center text-[13px]" style={{ color: '#baa182' }}>
              Not a vendor yet?{' '}
              <Link href="/vendor/signup" className="text-gold hover:underline font-semibold">Apply to join</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
