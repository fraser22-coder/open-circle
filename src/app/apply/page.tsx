'use client'
import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  { value: 'food',          label: '🍕 Food' },
  { value: 'drinks',        label: '🍹 Drinks' },
  { value: 'experience',    label: '🎯 Experience' },
  { value: 'entertainment', label: '🎭 Entertainment' },
]

const SPACES = [
  { value: '2x2',     label: 'Small',    sub: '2m × 2m' },
  { value: '3x3',     label: 'Medium',   sub: '3m × 3m' },
  { value: '4x4plus', label: 'Large',    sub: '4m × 4m+' },
  { value: 'flexible', label: 'Flexible', sub: 'I can adapt' },
]

interface FormState {
  business_name: string
  contact_name: string
  email: string
  phone: string
  category: string
  description: string
  location: string
  price_range: string
  space: string
}

interface PhotoState {
  logo: File | null
  foodPhotos: File[]
}

function PhotoDropZone({
  label,
  hint,
  accept,
  multiple,
  onFiles,
  previews,
  onRemove,
}: {
  label: string
  hint: string
  accept: string
  multiple: boolean
  onFiles: (files: File[]) => void
  previews: { url: string; name: string }[]
  onRemove: (index: number) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length) onFiles(files)
  }, [onFiles])

  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{ display: 'block', color: '#baa182', fontSize: '13px', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label} <span style={{ color: '#f87171' }}>*</span>
      </label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? '#f9d378' : '#3c4f80'}`,
          borderRadius: '12px',
          padding: '28px 20px',
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? '#252d4a' : '#1e2541',
          transition: 'all 0.15s',
        }}
      >
        <p style={{ color: '#6b7db3', fontSize: '14px', margin: 0 }}>
          Drag & drop here, or <span style={{ color: '#f9d378', textDecoration: 'underline' }}>browse</span>
        </p>
        <p style={{ color: '#4a5a80', fontSize: '12px', margin: '6px 0 0' }}>{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={e => {
            const files = Array.from(e.target.files ?? [])
            if (files.length) onFiles(files)
            e.target.value = ''
          }}
        />
      </div>
      {previews.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px' }}>
          {previews.map((p, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img
                src={p.url}
                alt={p.name}
                style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '8px', border: '2px solid #3c4f80' }}
              />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); onRemove(i) }}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  width: 20, height: 20, borderRadius: '50%',
                  background: '#f87171', border: 'none', color: '#fff',
                  fontSize: '12px', cursor: 'pointer', lineHeight: '20px', padding: 0,
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ApplyPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>({
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
  const [logoPreviews, setLogoPreviews] = useState<{ url: string; name: string }[]>([])
  const [foodPreviews, setFoodPreviews] = useState<{ url: string; name: string }[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleLogoFiles = (files: File[]) => {
    const file = files[0]
    setPhotos(prev => ({ ...prev, logo: file }))
    setLogoPreviews([{ url: URL.createObjectURL(file), name: file.name }])
  }

  const handleFoodFiles = (files: File[]) => {
    setPhotos(prev => {
      const next = [...prev.foodPhotos, ...files].slice(0, 6)
      setFoodPreviews(next.map(f => ({ url: URL.createObjectURL(f), name: f.name })))
      return { ...prev, foodPhotos: next }
    })
  }

  const removeLogo = () => {
    setPhotos(prev => ({ ...prev, logo: null }))
    setLogoPreviews([])
  }

  const removeFood = (index: number) => {
    setPhotos(prev => {
      const next = prev.foodPhotos.filter((_, i) => i !== index)
      setFoodPreviews(next.map(f => ({ url: URL.createObjectURL(f), name: f.name })))
      return { ...prev, foodPhotos: next }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!photos.logo) { setError('Please upload your logo.'); return }
    if (photos.foodPhotos.length === 0) { setError('Please upload at least one food or product photo.'); return }

    setSubmitting(true)
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    fd.append('logo', photos.logo)
    photos.foodPhotos.forEach(f => fd.append('food_photos', f))

    try {
      const res = await fetch('/api/apply', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    }
    setSubmitting(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#252d4a',
    border: '1px solid #3c4f80',
    borderRadius: '10px',
    color: '#f0e6d3',
    padding: '13px 16px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: '#baa182',
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  }

  if (success) {
    return (
      <div style={{ background: '#1b1f3b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>⭕</div>
          <h1 style={{ color: '#f9d378', fontSize: '28px', fontWeight: 900, margin: '0 0 16px' }}>Application Received!</h1>
          <p style={{ color: '#c5b098', lineHeight: 1.7, margin: '0 0 12px' }}>
            Thanks for applying to join the Circle. We personally review every application and will be in touch within <strong style={{ color: '#f9d378' }}>3–5 business days</strong>.
          </p>
          <p style={{ color: '#6b7db3', fontSize: '13px', margin: '0 0 32px' }}>
            A confirmation email is on its way to you now.
          </p>
          <button
            onClick={() => router.push('/circle')}
            style={{ background: '#f9d378', color: '#1b1f3b', border: 'none', borderRadius: '50px', padding: '14px 32px', fontWeight: 700, fontSize: '15px', cursor: 'pointer' }}
          >
            Browse the Circle →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#1b1f3b', minHeight: '100vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ color: '#f9d378', fontSize: '32px', fontWeight: 900, margin: '0 0 12px' }}>Join the Circle</h1>
          <p style={{ color: '#c5b098', lineHeight: 1.7, fontSize: '15px', margin: 0 }}>
            Apply to become a vendor on Open Circle Markets. We curate every vendor to ensure the best possible experience for event organisers across Auckland.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Business details */}
          <div style={{ background: '#1e2541', border: '1px solid #3c4f80', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
            <h2 style={{ color: '#f0e6d3', fontSize: '16px', fontWeight: 800, margin: '0 0 24px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Business Details</h2>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Business Name <span style={{ color: '#f87171' }}>*</span></label>
              <input required value={form.business_name} onChange={set('business_name')} style={inputStyle} placeholder="e.g. The Taco Guys" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <label style={labelStyle}>Contact Name <span style={{ color: '#f87171' }}>*</span></label>
                <input required value={form.contact_name} onChange={set('contact_name')} style={inputStyle} placeholder="Your full name" />
              </div>
              <div>
                <label style={labelStyle}>Phone <span style={{ color: '#f87171' }}>*</span></label>
                <input required value={form.phone} onChange={set('phone')} style={inputStyle} placeholder="+64 21 000 0000" type="tel" />
              </div>
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Email <span style={{ color: '#f87171' }}>*</span></label>
              <input required value={form.email} onChange={set('email')} style={inputStyle} placeholder="you@yourbusiness.com" type="email" />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Location <span style={{ color: '#f87171' }}>*</span></label>
              <input required value={form.location} onChange={set('location')} style={inputStyle} placeholder="e.g. Ponsonby, Auckland" />
            </div>
            <div>
              <label style={labelStyle}>Category <span style={{ color: '#f87171' }}>*</span></label>
              <select required value={form.category} onChange={set('category')} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select a category…</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Offering */}
          <div style={{ background: '#1e2541', border: '1px solid #3c4f80', borderRadius: '16px', padding: '28px', marginBottom: '20px' }}>
            <h2 style={{ color: '#f0e6d3', fontSize: '16px', fontWeight: 800, margin: '0 0 24px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Your Offering</h2>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>About Your Business <span style={{ color: '#f87171' }}>*</span></label>
              <textarea
                required
                value={form.description}
                onChange={set('description')}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Tell us what you do, what makes you special, and why you'd be great at private and corporate events…"
              />
            </div>
            <div style={{ marginBottom: '18px' }}>
              <label style={labelStyle}>Price Range <span style={{ color: '#f87171' }}>*</span></label>
              <input
                required
                value={form.price_range}
                onChange={set('price_range')}
                style={inputStyle}
                placeholder="e.g. $15–$25 per person, or $500 minimum spend"
              />
            </div>
            <div>
              <label style={labelStyle}>Space Required <span style={{ color: '#f87171' }}>*</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                {SPACES.map(s => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, space: s.value }))}
                    style={{
                      padding: '12px 8px',
                      borderRadius: '10px',
                      border: `2px solid ${form.space === s.value ? '#f9d378' : '#3c4f80'}`,
                      background: form.space === s.value ? '#252d4a' : 'transparent',
                      color: form.space === s.value ? '#f9d378' : '#6b7db3',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '13px' }}>{s.label}</div>
                    <div style={{ fontSize: '11px', marginTop: '3px', opacity: 0.8 }}>{s.sub}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photos */}
          <div style={{ background: '#1e2541', border: '1px solid #3c4f80', borderRadius: '16px', padding: '28px', marginBottom: '28px' }}>
            <h2 style={{ color: '#f0e6d3', fontSize: '16px', fontWeight: 800, margin: '0 0 24px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Photos</h2>
            <PhotoDropZone
              label="Your Logo"
              hint="PNG or JPG · Max 5MB"
              accept="image/*"
              multiple={false}
              onFiles={handleLogoFiles}
              previews={logoPreviews}
              onRemove={removeLogo}
            />
            <PhotoDropZone
              label="Food / Product Photos"
              hint="Up to 6 photos · PNG or JPG"
              accept="image/*"
              multiple={true}
              onFiles={handleFoodFiles}
              previews={foodPreviews}
              onRemove={removeFood}
            />
          </div>

          {error && (
            <div style={{ background: '#7f1d1d', border: '1px solid #f87171', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', color: '#fca5a5', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !form.space}
            style={{
              width: '100%',
              background: submitting || !form.space ? '#303e66' : '#f9d378',
              color: submitting || !form.space ? '#6b7db3' : '#1b1f3b',
              border: 'none',
              borderRadius: '50px',
              padding: '16px',
              fontWeight: 800,
              fontSize: '16px',
              cursor: submitting || !form.space ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {submitting ? 'Submitting…' : 'Submit Application →'}
          </button>

          <p style={{ color: '#4a5a80', fontSize: '12px', textAlign: 'center', marginTop: '16px' }}>
            We personally review every application. You'll hear back within 3–5 business days.
          </p>
        </form>
      </div>
    </div>
  )
}
