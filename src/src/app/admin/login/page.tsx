'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      if (res.ok) {
        router.replace('/admin')
      } else {
        const data = await res.json()
        setError(data.error ?? 'Incorrect password.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#1b1f3b' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-[26px] font-black text-gold mb-1">Admin Access</h1>
          <p className="text-[13px] font-light" style={{ color: '#baa182' }}>
            Open Circle Markets — Internal Only
          </p>
        </div>
        <form onSubmit={submit} className="rounded-2xl p-8 border space-y-5"
          style={{ background: '#303e66', borderColor: '#3c4f80' }}>
          {error && (
            <div className="rounded-xl px-4 py-3 text-[13px]"
              style={{ background: 'rgba(224,112,112,0.15)', color: '#e07070', border: '1px solid #e07070' }}>
              {error}
            </div>
          )}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: '#baa182' }}>
              Password
            </label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full rounded-xl px-4 py-3 text-sm text-white border outline-none"
              style={{ background: '#1b1f3b', borderColor: '#3c4f80' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold text-[15px] hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
