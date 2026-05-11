'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'food', label: '🍕 Food' },
  { value: 'drinks', label: '🍹 Drinks' },
  { value: 'experience', label: '🎯 Experience' },
  { value: 'entertainment', label: '🎭 Entertainment' },
]

const SPACE_OPTIONS = [
  { value: '2x2', label: 'Small', desc: '2m × 2m' },
  { value: '3x3', label: 'Medium', desc: '3m × 3m' },
  { value: '4x4plus', label: 'Large', desc: '4m × 4m+' },
  { value: 'flexible', label: 'Flexible', desc: 'Varies by event' },
]

interface PhotoState {
  logo: File | null
  foodPhotos: File[]
}

export default function ApplyPage() {
  const [form, setForm] = useState({
    business_name: '',
    contact_name: '',
    email: '',
    phone: '',
    category: '',
    description: '',
    location: '',
    price_range: '',
    space: '',
  })
  const [photos, setPhotos] = useState<PhotoState>({ logo: null, foodPhotos: [] })
  const [logoDragging, setLogoDragging] = useState(false)
  const [foodDragging, setFoodDragging] = useState(false)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const logoInputRef = useRef<HTMLInputElement>(null)
  const foodInputRef = useRef<HTMLInputElement>(null)

  const set = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  // ── Logo drag/drop ──────────────────────────────────────────────────────────
  const handleLogoDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setLogoDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setPhotos(prev => ({ ...prev, logo: file }))
    }
  }, [])

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPhotos(prev => ({ ...prev, logo: file }))
  }

  // ── Food photos drag/drop ───────────────────────────────────────────────────
  const handleFoodDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setFoodDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setPhotos(prev => ({ ...prev, foodPhotos: [...prev.foodPhotos, ...files] }))
  }, [])

  const handleFoodFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    setPhotos(prev => ({ ...prev, foodPhotos: [...prev.foodPhotos, ...files] }))
  }

  const removeFoodPhoto = (index: number) => {
    setPhotos(prev => ({
      ...prev,
      foodPhotos: prev.foodPhotos.filter((_, i) => i !== index),
    }))
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photos.logo) {
      setErrorMsg('Please upload your logo.')
      setStatus('error')
      return
    }
    if (photos.foodPhotos.length === 0) {
      setErrorMsg('Please upload at least one food or product photo.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setErrorMsg('')
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('logo', photos.logo)
      photos.foodPhotos.forEach(f => fd.append('food_photos', f))

      const res = await fetch('/api/apply', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
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
  const selectorBtnStyle = (selected: boolean) => ({
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${selected ? '#f9d378' : '#3c4f80'}`,
    background: selected ? '#f9d378' : '#252d4a',
    color: selected ? '#1b1f3b' : '#c5b098',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
  })

  // ── Success screen ──────────────────────────────────────────────────────────
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

  // ── Form ────────────────────────────────────────────────────────────────────
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

          {/* Location */}
          <div>
            <label style={labelStyle}>Location *</label>
            <input
              required
              style={inputStyle}
              placeholder="e.g. Ponsonby, Auckland"
              value={form.location}
              onChange={e => set('location', e.target.value)}
            />
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
            <input required type="text" value={form.category} onChange={() => {}} style={{ display: 'none' }} />
          </div>

          {/* Price Range */}
          <div>
            <label style={labelStyle}>Price Range *</label>
            <input
              required
              style={inputStyle}
              placeholder="e.g. $10–$20 per item, most things under $15"
              value={form.price_range}
              onChange={e => set('price_range', e.target.value)}
            />
          </div>

          {/* Space Required */}
          <div>
            <label style={labelStyle}>Space Required *</label>
            <p className="text-[12px] mb-3" style={{ color: '#6b7db3' }}>
              How much space do you typically need at an event?
            </p>
            <div className="grid grid-cols-2 gap-3">
              {SPACE_OPTIONS.map(s => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => set('space', s.value)}
                  style={selectorBtnStyle(form.space === s.value)}
                >
                  <div className="font-bold text-[13px]">{s.label}</div>
                  <div className="text-[11px] mt-0.5 opacity-75">{s.desc}</div>
                </button>
              ))}
            </div>
            <input required type="text" value={form.space} onChange={() => {}} style={{ display: 'none' }} />
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

          {/* ── Photos ──────────────────────────────────────────────────────── */}
          <div
            style={{
              border: '1px solid #3c4f80',
              borderRadius: '14px',
              padding: '20px',
              background: '#1e2541',
            }}
          >
            <label style={{ ...labelStyle, marginBottom: '4px' }}>Photos *</label>
            <p className="text-[12px] mb-5" style={{ color: '#6b7db3' }}>
              These will be used on your listing if your application is successful.
            </p>

            {/* Logo */}
            <div className="mb-5">
              <p className="text-[12px] font-semibold mb-2" style={{ color: '#baa182' }}>
                LOGO <span style={{ color: '#f9d378' }}>*</span>
              </p>
              <div
                onDragOver={e => { e.preventDefault(); setLogoDragging(true) }}
                onDragLeave={() => setLogoDragging(false)}
                onDrop={handleLogoDrop}
                onClick={() => logoInputRef.current?.click()}
                style={{
                  border: `2px dashed ${logoDragging ? '#f9d378' : photos.logo ? '#4ade80' : '#3c4f80'}`,
                  borderRadius: '12px',
                  background: logoDragging ? '#2a3356' : '#252d4a',
                  padding: photos.logo ? '12px' : '28px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  justifyContent: photos.logo ? 'flex-start' : 'center',
                }}
              >
                {photos.logo ? (
                  <>
                    <img
                      src={URL.createObjectURL(photos.logo)}
                      alt="Logo preview"
                      style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                    />
                    <div style={{ textAlign: 'left' }}>
                      <p className="text-[13px] font-semibold" style={{ color: '#4ade80' }}>✓ Logo uploaded</p>
                      <p className="text-[11px] mt-0.5" style={{ color: '#6b7db3' }}>{photos.logo.name}</p>
                      <button
                        type="button"
                        onClick={e => { e.stopPropagation(); setPhotos(prev => ({ ...prev, logo: null })) }}
                        className="text-[11px] mt-1"
                        style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">🖼️</div>
                    <p className="text-[13px] font-semibold" style={{ color: '#c5b098' }}>
                      Drop your logo here or <span style={{ color: '#f9d378' }}>click to browse</span>
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: '#6b7db3' }}>PNG, JPG or SVG — ideally square</p>
                  </div>
                )}
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleLogoFile}
              />
            </div>

            {/* Food / product photos */}
            <div>
              <p className="text-[12px] font-semibold mb-2" style={{ color: '#baa182' }}>
                FOOD / PRODUCT PHOTOS <span style={{ color: '#f9d378' }}>*</span>
                <span className="font-normal ml-2" style={{ color: '#6b7db3' }}>(at least 1, up to 6)</span>
              </p>

              {photos.foodPhotos.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {photos.foodPhotos.map((file, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Food photo ${i + 1}`}
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '8px', border: '2px solid #4ade80' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeFoodPhoto(i)}
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          background: '#f87171',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          lineHeight: '20px',
                          textAlign: 'center',
                          padding: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.foodPhotos.length < 6 && (
                <div
                  onDragOver={e => { e.preventDefault(); setFoodDragging(true) }}
                  onDragLeave={() => setFoodDragging(false)}
                  onDrop={handleFoodDrop}
                  onClick={() => foodInputRef.current?.click()}
                  style={{
                    border: `2px dashed ${foodDragging ? '#f9d378' : '#3c4f80'}`,
                    borderRadius: '12px',
                    background: foodDragging ? '#2a3356' : '#252d4a',
                    padding: '24px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                  }}
                >
                  <div className="text-3xl mb-2">📸</div>
                  <p className="text-[13px] font-semibold" style={{ color: '#c5b098' }}>
                    {photos.foodPhotos.length === 0
                      ? <>Drop photos here or <span style={{ color: '#f9d378' }}>click to browse</span></>
                      : <><span style={{ color: '#f9d378' }}>Add more photos</span> ({photos.foodPhotos.length}/6 added)</>
                    }
                  </p>
                  <p className="text-[11px] mt-1" style={{ color: '#6b7db3' }}>PNG or JPG — show off your best work!</p>
                </div>
              )}
              <input
                ref={foodInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFoodFiles}
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
