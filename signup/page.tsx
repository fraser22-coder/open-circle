'use client'
import { useState } from 'react'
import Link from 'next/link'
import NavBar from '@/components/NavBar'

const CATEGORIES = [
  { icon: '🍕', label: 'Food', value: 'food' },
  { icon: '🍹', label: 'Drinks', value: 'drinks' },
  { icon: '🎯', label: 'Experience', value: 'experience' },
  { icon: '🎭', label: 'Entertainment', value: 'entertainment' },
]

const SUITABLE_FOR_OPTIONS = [
  '🏢 Corporate Events', '🎉 Private Parties', '💍 Weddings & Engagements',
  '🎊 Markets & Festivals', '🏡 Private Functions', '🎂 Birthday Parties',
]

const inputCls = "w-full rounded-xl px-4 py-3 text-sm text-white border outline-none transition-colors focus:border-[#f9d378]"
const inputStyle = { background: '#303e66', borderColor: '#3c4f80' }
const labelCls = "block text-[11px] font-semibold uppercase tracking-widest mb-2"
const labelStyle = { color: '#baa182' }

export default function VendorSignupPage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    price_range: '',
    space_required: '',
    location: '',
    instagram: '',
    website: '',
    why_join: '',
    suitable_for: [] as string[],
  })

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }))

  const toggleSuitable = (tag: string) => {
    setForm(f => ({
      ...f,
      suitable_for: f.suitable_for.includes(tag)
        ? f.suitable_for.filter(t => t !== tag)
        : [...f.suitable_for, tag],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.business_name || !form.email || !form.category) {
      setError('Please fill in all required fields.')
      return
    }
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('/api/vendor-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return (
    <>
      <NavBar />
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="text-6xl mb-6">⭕</div>
        <h1 className="text-[32px] font-black text-gold mb-3">Application Received!</h1>
        <p className="text-[15px] font-light max-w-md leading-relaxed mb-8" style={{ color: '#c5b098' }}>
          Thanks for applying to join The Circle. We review every application personally
          and will be in touch within 3–5 business days.
        </p>
        <Link href="/circle"
          className="px-8 py-3.5 rounded-full font-bold text-[14px] transition-opacity hover:opacity-90"
          style={{ background: '#f9d378', color: '#1b1f3b' }}>
          Browse Our Circle
        </Link>
      </div>
    </>
  )

  return (
    <>
      <NavBar />

      {/* Hero */}
      <div className="text-center py-14 px-10 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <h1 className="text-[38px] font-black text-gold">Apply to Join The Circle</h1>
        <p className="mt-3 text-[15px] font-light max-w-lg mx-auto leading-relaxed" style={{ color: '#c5b098' }}>
          We're selective — and that's the point. Tell us about your business and we'll
          be in touch if you're a good fit.
        </p>
        <div className="w-14 h-[3px] rounded-full mx-auto mt-5" style={{ background: '#f9d378' }} />
      </div>

      {/* Form */}
      <div className="max-w-[700px] mx-auto px-6 py-12">
        <form onSubmit={handleSubmit} className="space-y-7">

          {error && (
            <div className="rounded-xl px-4 py-3 text-[13px]"
              style={{ background: 'rgba(224,112,112,0.15)', color: '#e07070', border: '1px solid #e07070' }}>
              {error}
            </div>
          )}

          {/* Business info */}
          <div className="rounded-2xl p-7 border space-y-5" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <h2 className="text-[16px] font-bold text-gold">About Your Business</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls} style={labelStyle}>Business Name *</label>
                <input type="text" value={form.business_name} onChange={e => set('business_name', e.target.value)}
                  placeholder="e.g. Burnout Pizza" className={inputCls} style={inputStyle} required />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Your Name *</label>
                <input type="text" value={form.contact_name} onChange={e => set('contact_name', e.target.value)}
                  placeholder="First and last name" className={inputCls} style={inputStyle} required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls} style={labelStyle}>Email Address *</label>
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                  placeholder="you@example.com" className={inputCls} style={inputStyle} required />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  placeholder="+64 21 000 0000" className={inputCls} style={inputStyle} />
              </div>
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Based in</label>
              <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                placeholder="e.g. Auckland" className={inputCls} style={inputStyle} />
            </div>
          </div>

          {/* Category */}
          <div className="rounded-2xl p-7 border space-y-4" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <h2 className="text-[16px] font-bold text-gold">Vendor Type *</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {CATEGORIES.map(c => (
                <button type="button" key={c.value} onClick={() => set('category', c.value)}
                  className="p-4 rounded-xl border text-center transition-all"
                  style={{
                    borderColor: form.category === c.value ? '#f9d378' : '#3c4f80',
                    background: form.category === c.value ? 'rgba(249,211,120,0.1)' : 'transparent',
                  }}>
                  <div className="text-2xl mb-1">{c.icon}</div>
                  <div className="text-[12px] font-semibold" style={{ color: form.category === c.value ? '#f9d378' : '#c5b098' }}>
                    {c.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl p-7 border space-y-5" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <h2 className="text-[16px] font-bold text-gold">Tell Us More</h2>

            <div>
              <label className={labelCls} style={labelStyle}>Describe your business *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="What do you offer? What makes you special? What's your story?"
                rows={4} className={inputCls} style={inputStyle} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls} style={labelStyle}>Price Range</label>
                <input type="text" value={form.price_range} onChange={e => set('price_range', e.target.value)}
                  placeholder="e.g. $12 – $18 per item" className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Space Required</label>
                <input type="text" value={form.space_required} onChange={e => set('space_required', e.target.value)}
                  placeholder="e.g. 3m × 3m" className={inputCls} style={inputStyle} />
              </div>
            </div>

            <div>
              <label className={labelCls} style={labelStyle}>Why do you want to join The Circle?</label>
              <textarea value={form.why_join} onChange={e => set('why_join', e.target.value)}
                placeholder="Tell us what you're looking for in a venue partnership..."
                rows={3} className={inputCls} style={inputStyle} />
            </div>
          </div>

          {/* Suitable for */}
          <div className="rounded-2xl p-7 border space-y-4" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <h2 className="text-[16px] font-bold text-gold">Suitable For</h2>
            <p className="text-[13px] font-light" style={{ color: '#c5b098' }}>Select all event types you can cater for</p>
            <div className="flex gap-2.5 flex-wrap">
              {SUITABLE_FOR_OPTIONS.map(tag => (
                <button type="button" key={tag} onClick={() => toggleSuitable(tag)}
                  className="px-4 py-2 rounded-full text-[12px] font-semibold border transition-all"
                  style={{
                    borderColor: form.suitable_for.includes(tag) ? '#f9d378' : '#3c4f80',
                    background: form.suitable_for.includes(tag) ? 'rgba(249,211,120,0.1)' : 'transparent',
                    color: form.suitable_for.includes(tag) ? '#f9d378' : '#c5b098',
                  }}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="rounded-2xl p-7 border space-y-5" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <h2 className="text-[16px] font-bold text-gold">Online Presence</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls} style={labelStyle}>Instagram</label>
                <input type="text" value={form.instagram} onChange={e => set('instagram', e.target.value)}
                  placeholder="@yourbusiness" className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className={labelCls} style={labelStyle}>Website</label>
                <input type="text" value={form.website} onChange={e => set('website', e.target.value)}
                  placeholder="www.yourbusiness.co.nz" className={inputCls} style={inputStyle} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting}
            className="w-full py-4 rounded-full text-[16px] font-bold transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: '#f9d378', color: '#1b1f3b' }}>
            {submitting ? 'Submitting…' : 'Submit Application →'}
          </button>

          <p className="text-center text-[12px]" style={{ color: '#baa182' }}>
            Already a vendor?{' '}
            <Link href="/vendor/login" className="text-gold hover:underline">Sign in here</Link>
          </p>
        </form>
      </div>

      <footer className="mt-10 py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; Vendor Applications
      </footer>
    </>
  )
}
