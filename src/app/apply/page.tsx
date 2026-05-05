'use client'
import { useState } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'food', label: '🍕 Food' },
  { value: 'drinks', label: '🍹 Drinks' },
  { value: 'experience', label: '🎯 Experience' },
  { value: 'entertainment', label: '🎭 Entertainment' },
]

export default function ApplyPage() {
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    website: '',
    instagram: '',
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  const inputStyle = {
    background: '#252d4a',
    border: '1px solid #3c4f80',
    borderRadius: '10px',
    color: '#f0e6d3',
    padding: '12px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    color: '#baa182',
    marginBottom: '6px',
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#1b1f3b' }}>
        <div className="text-center max-w-md">
          <div className="text-6xl mb-5">⭕</div>
          <h1 className="text-3xl font-black text-gold mb-3">You&apos;re in the queue!</h1>
          <p className="text-[15px] leading-relaxed mb-8" style={{ color: '#c5b098' }}>
            Thanks for applying to join the Circle. We personally review every application and will be in touch within 3–5 business days.
          </p>
          <Link
            href="/circle"
            className="inline-block px-7 py-3 rounded-full font-bold text-[14px]"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Browse Our Circle →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#1b1f3b' }}>
      {/* Hero */}
      <div
        className="text-center py-12 px-5 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}
      >
        <h1 className="text-[34px] sm:text-[42px] font-black text-gold">Join the Circle</h1>
        <p className="mt-3 text-[14px] sm:text-[15px] font-light max-w-lg mx-auto leading-relaxed" style={{ color: '#c5b098' }}>
          Apply to become part of Auckland&apos;s curated vendor network. We handpick every vendor — food, drink, experience, and entertainment.
        </p>
        <div className="w-14 h-[3px] rounded-full mx-auto mt-5" style={{ background: '#f9d378' }} />
      </div>

      {/* Form */}
      <div className="max-w-[640px] mx-auto px-5 py-10 sm:py-14">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* Business name */}
          <div>
            <label style={labelStyle}>Business / Vendor Name *</label>
            <input
              required
              style={inputStyle}
              placeholder="e.g. The Cookie Lab"
              value={form.business_name}
              onChange={e => set('business_name', e.target.value)}
            />
          </div>

          {/* Contact name */}
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input
              required
              style={inputStyle}
              placeholder="e.g. Sarah Johnson"
              value={form.contact_name}
              onChange={e => set('contact_name', e.target.value)}
            />
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Email *</label>
              <input
                required
                type="email"
                style={inputStyle}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Phone *</label>
              <input
                required
                type="tel"
                style={inputStyle}
                placeholder="021 000 0000"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map(c => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set('category', c.value)}
                  className="py-3 px-4 rounded-xl text-[13px] font-semibold transition-all border text-left"
                  style={{
                    borderColor: form.category === c.value ? '#f9d378' : '#3c4f80',
                    background: form.category === c.value ? '#f9d378' : '#252d4a',
                    color: form.category === c.value ? '#1b1f3b' : '#c5b098',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
            {/* hidden input so form validation works */}
            <input required type="text" value={form.category} onChange={() => {}} style={{ display: 'none' }} />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Tell us about your offering *</label>
            <textarea
              required
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              placeholder="What do you sell or offer? What makes you a great fit for events?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Website + Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label style={labelStyle}>Website <span style={{ color: '#6b7db3' }}>(optional)</span></label>
              <input
                style={inputStyle}
                placeholder="https://..."
                value={form.website}
                onChange={e => set('website', e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Instagram <span style={{ color: '#6b7db3' }}>(optional)</span></label>
              <input
                style={inputStyle}
                placeholder="@yourhandle"
                value={form.instagram}
                onChange={e => set('instagram', e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {status === 'error' && (
            <div
              className="px-4 py-3 rounded-xl text-[13px]"
              style={{ background: '#3d1a1a', border: '1px solid #8b2222', color: '#f87171' }}
            >
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-4 rounded-full font-bold text-[15px] transition-opacity"
            style={{
              background: '#f9d378',
              color: '#1b1f3b',
              opacity: status === 'submitting' ? 0.6 : 1,
              cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
            }}
          >
            {status === 'submitting' ? 'Submitting…' : 'Apply to Join the Circle →'}
          </button>

          <p className="text-center text-[12px]" style={{ color: '#6b7db3' }}>
            We review every application personally and respond within 3–5 business days.
          </p>
        </form>
      </div>
    </div>
  )
}
