'use client'
import { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'

type Step = 1 | 2 | 3 | 'done'
const stepNum = (s: Step): number => s === 'done' ? 99 : (s as number)

const OCCASIONS = [
  { icon: '🏢', label: 'Corporate Event', value: 'Corporate Event' },
  { icon: '🎂', label: 'Birthday Party', value: 'Birthday Party' },
  { icon: '💍', label: 'Wedding / Engagement', value: 'Wedding / Engagement' },
  { icon: '🏪', label: 'Market / Festival', value: 'Market / Festival' },
  { icon: '🏡', label: 'Private Function', value: 'Private Function' },
  { icon: '✨', label: 'Other', value: 'Other' },
]
const VENDOR_TYPES = [
  { icon: '🍕', label: 'Food', value: 'food' },
  { icon: '🍹', label: 'Drinks', value: 'drinks' },
  { icon: '🎯', label: 'Experience', value: 'experience' },
  { icon: '🎭', label: 'Entertainment', value: 'entertainment' },
]
const REQUIREMENTS = [
  'Dietary options (vegan, GF etc.)', 'Halal / Kosher', 'Alcohol licence required',
  'Power supply available', 'Water access available', 'Fully self-contained vendor',
]
const REFERRAL_SOURCES = [
  'Instagram', 'Facebook', 'TikTok', 'Google Search', 'Word of mouth',
  'Vendor / vendor referral', 'Other',
]

const inputCls = "w-full rounded-xl px-4 py-3 text-sm font-normal text-white border outline-none transition-colors"
const inputStyle = { background: '#303e66', borderColor: '#3c4f80', color: 'white' }
const errStyle = { color: '#e07070' }

interface BriefVendor { slug: string; name: string; category: string }

export default function BookPage() {
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [brief, setBrief] = useState<BriefVendor[]>([])
  const [consent, setConsent] = useState(false)

  // Form state
  const [occasion, setOccasion] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [guests, setGuests] = useState('')
  const [location, setLocation] = useState('')
  const [venueType, setVenueType] = useState('')
  const [eventNotes, setEventNotes] = useState('')
  const [vendorTypes, setVendorTypes] = useState<string[]>([])
  const [eventType, setEventType] = useState('')
  const [budget, setBudget] = useState(1500)
  const [requirements, setRequirements] = useState<string[]>([])
  const [vendorNotes, setVendorNotes] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [referral, setReferral] = useState('')
  const [honeypot, setHoneypot] = useState('') // bot trap — must stay empty

  // Load brief from localStorage + handle ?vendor= URL param
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('circle_brief') || '[]') as BriefVendor[]
      const initial = Array.isArray(saved) ? saved : []

      // If ?vendor=slug was passed and it's not already in the brief, add it
      const sp = new URLSearchParams(window.location.search)
      const vendorSlug = sp.get('vendor')
      if (vendorSlug && !initial.some(v => v.slug === vendorSlug)) {
        // Fetch vendor info so we can display the name
        fetch(`/api/vendors/${vendorSlug}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data) {
              const withVendor = [...initial, { slug: data.slug, name: data.name, category: data.category }]
              setBrief(withVendor)
              localStorage.setItem('circle_brief', JSON.stringify(withVendor))
              window.dispatchEvent(new Event('brief-updated'))
              const cats = Array.from(new Set(withVendor.map((v: BriefVendor) => v.category))) as string[]
              setVendorTypes(cats)
            }
          })
          .catch(() => {})
      }

      setBrief(initial)
      const cats = Array.from(new Set(initial.map((v: BriefVendor) => v.category))) as string[]
      if (cats.length) setVendorTypes(cats)
    } catch {}
  }, [])

  const removeFromBrief = (slug: string) => {
    const updated = brief.filter(v => v.slug !== slug)
    setBrief(updated)
    localStorage.setItem('circle_brief', JSON.stringify(updated))
    window.dispatchEvent(new Event('brief-updated'))
  }

  const toggleVendorType = (v: string) =>
    setVendorTypes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  const toggleReq = (r: string) =>
    setRequirements(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  // ── Validation ──────────────────────────────────────
  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!occasion) e.occasion = 'Please select an occasion.'
    if (!eventDate) e.eventDate = 'Please enter your event date.'
    if (!guests || parseInt(guests) < 1) e.guests = 'Please enter expected guest count.'
    if (!location.trim()) e.location = 'Please enter your event location.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (vendorTypes.length === 0) e.vendorTypes = 'Please select at least one vendor type.'
    if (!eventType) e.eventType = 'Please select an event type.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e: Record<string, string> = {}
    if (!firstName.trim()) e.firstName = 'First name is required.'
    if (!lastName.trim()) e.lastName = 'Last name is required.'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email address.'
    if (!consent) e.consent = 'Please agree to be contacted before submitting.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goStep2 = () => { if (validateStep1()) { setErrors({}); setStep(2) } }
  const goStep3 = () => { if (validateStep2()) { setErrors({}); setStep(3) } }

  const submit = async () => {
    if (!validateStep3()) return
    setSubmitting(true)
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion, event_date: eventDate, guest_count: parseInt(guests),
          event_location: location, venue_type: venueType, event_notes: eventNotes,
          vendor_types: vendorTypes, event_type: eventType,
          budget: ['catering', 'both'].includes(eventType) ? budget : null,
          requirements, vendor_notes: vendorNotes,
          first_name: firstName, last_name: lastName, email, phone, organisation,
          referral_source: referral,
          // Carry the shortlisted vendor brief into the enquiry
          brief_vendors: brief.map(v => ({ slug: v.slug, name: v.name, category: v.category })),
          // Honeypot — bots fill this, humans don't
          website: honeypot,
        }),
      })
      // Clear brief on successful submission
      localStorage.removeItem('circle_brief')
      window.dispatchEvent(new Event('brief-updated'))
      setStep('done')
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const StepCircle = ({ n }: { n: number }) => {
    const done = (step === 'done') || (typeof step === 'number' && n < step)
    const active = step === n
    return (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all flex-shrink-0"
          style={{
            background: done ? '#52b788' : active ? '#f9d378' : '#303e66',
            color: done || active ? '#1b1f3b' : '#baa182',
            border: `2px solid ${done ? '#52b788' : active ? '#f9d378' : '#3c4f80'}`,
          }}>
          {done ? '✓' : n}
        </div>
        <span className="text-[12px] font-semibold hidden sm:block transition-colors"
          style={{ color: done ? '#52b788' : active ? '#f9d378' : '#baa182' }}>
          {n === 1 ? 'Event Details' : n === 2 ? 'Vendor Preferences' : 'Your Details'}
        </span>
      </div>
    )
  }

  return (
    <>
      <NavBar />

      {/* Hero */}
      <div className="text-center py-10 sm:py-16 px-5 sm:px-10 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <h1 className="text-[34px] sm:text-[42px] font-black text-gold">Book a Vendor</h1>
        <p className="mt-3 text-[14px] sm:text-[15px] font-light max-w-lg mx-auto leading-relaxed" style={{ color: '#c5b098' }}>
          Tell us about your event and we&apos;ll match you with the perfect vendors from the Circle.
          Free to use, no obligation.
        </p>
        <div className="w-14 h-[3px] rounded-full mx-auto mt-5" style={{ background: '#f9d378' }} />
      </div>

      <div className="max-w-[720px] mx-auto px-4 sm:px-8 py-8 sm:py-10 pb-20">

        {/* Stepper */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-3 mb-10">
            <StepCircle n={1} />
            <div className="flex-1 h-[2px] max-w-[60px] transition-all"
              style={{ background: stepNum(step) > 1 ? '#52b788' : '#3c4f80' }} />
            <StepCircle n={2} />
            <div className="flex-1 h-[2px] max-w-[60px] transition-all"
              style={{ background: stepNum(step) > 2 ? '#52b788' : '#3c4f80' }} />
            <StepCircle n={3} />
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-white mb-1.5">Tell us about your event</h2>
            <p className="text-[14px] font-light mb-8" style={{ color: '#c5b098' }}>
              We need a few basics to match you with the right vendors.
            </p>

            {/* Vendor Brief */}
            {brief.length > 0 && (
              <div className="rounded-xl p-4 border mb-6" style={{ background: '#303e66', borderColor: '#f9d378' }}>
                <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>
                  ⭐ Your Vendor Brief ({brief.length} vendor{brief.length !== 1 ? 's' : ''})
                </p>
                <div className="flex flex-wrap gap-2">
                  {brief.map(v => (
                    <div key={v.slug} className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold"
                      style={{ background: 'rgba(249,211,120,0.12)', border: '1px solid #f9d378', color: '#f9d378' }}>
                      {v.name}
                      <button onClick={() => removeFromBrief(v.slug)} className="ml-1 opacity-60 hover:opacity-100 text-[14px] leading-none">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>
              What&apos;s the occasion? <span className="text-gold">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-1">
              {OCCASIONS.map(o => (
                <button key={o.value} onClick={() => { setOccasion(o.value); setErrors(p => ({ ...p, occasion: '' })) }}
                  className="rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all border"
                  style={{
                    background: occasion === o.value ? 'rgba(249,211,120,0.08)' : '#303e66',
                    borderColor: occasion === o.value ? '#f9d378' : errors.occasion ? '#e07070' : '#3c4f80',
                  }}>
                  <div className="text-2xl sm:text-3xl mb-1.5">{o.icon}</div>
                  <div className="text-[11px] sm:text-[12px] font-semibold" style={{ color: occasion === o.value ? '#f9d378' : '#c5b098' }}>
                    {o.label}
                  </div>
                </button>
              ))}
            </div>
            {errors.occasion && <p className="text-[12px] mt-1 mb-4" style={errStyle}>{errors.occasion}</p>}
            {!errors.occasion && <div className="mb-5" />}

            {/* Date + Guests — stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-1">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  Event Date <span className="text-gold">*</span>
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={e => { setEventDate(e.target.value); setErrors(p => ({ ...p, eventDate: '' })) }}
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.eventDate ? '#e07070' : '#3c4f80', colorScheme: 'dark', width: '100%', boxSizing: 'border-box' }}
                />
                {errors.eventDate && <p className="text-[12px] mt-1" style={errStyle}>{errors.eventDate}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  Expected Guests <span className="text-gold">*</span>
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 150"
                  value={guests}
                  onChange={e => { setGuests(e.target.value); setErrors(p => ({ ...p, guests: '' })) }}
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.guests ? '#e07070' : '#3c4f80' }}
                />
                {errors.guests && <p className="text-[12px] mt-1" style={errStyle}>{errors.guests}</p>}
              </div>
            </div>
            <div className="mb-5" />

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Location / Suburb <span className="text-gold">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Ponsonby, Auckland"
                value={location}
                onChange={e => { setLocation(e.target.value); setErrors(p => ({ ...p, location: '' })) }}
                className={inputCls}
                style={{ ...inputStyle, borderColor: errors.location ? '#e07070' : '#3c4f80' }}
              />
              {errors.location && <p className="text-[12px] mt-1" style={errStyle}>{errors.location}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>Venue Type</label>
              <select value={venueType} onChange={e => setVenueType(e.target.value)} className={inputCls} style={inputStyle}>
                <option value="">Select venue type…</option>
                {['Outdoor (park, garden, open space)', 'Indoor (hall, warehouse, venue)', 'Mixed indoor / outdoor', 'Private residence', 'Not yet confirmed'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Tell us more about your event
              </label>
              <textarea
                placeholder="Theme, timing, setup notes, access requirements…"
                value={eventNotes}
                onChange={e => setEventNotes(e.target.value)}
                rows={4}
                className={inputCls}
                style={inputStyle}
              />
            </div>

            <div className="flex justify-end pt-7 border-t" style={{ borderColor: '#3c4f80' }}>
              <button onClick={goStep2}
                className="px-9 py-3.5 rounded-full text-[14px] font-bold transition-all hover:opacity-90"
                style={{ background: '#f9d378', color: '#1b1f3b' }}>
                Next: Vendor Preferences →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-white mb-1.5">What are you looking for?</h2>
            <p className="text-[14px] font-light mb-8" style={{ color: '#c5b098' }}>
              Select the type of vendor you need. You can choose multiple.
            </p>

            <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>
              Vendor Type <span className="text-gold">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-1">
              {VENDOR_TYPES.map(v => (
                <button key={v.value} onClick={() => { toggleVendorType(v.value); setErrors(p => ({ ...p, vendorTypes: '' })) }}
                  className="rounded-xl p-3 sm:p-4 text-center border transition-all"
                  style={{
                    background: vendorTypes.includes(v.value) ? 'rgba(249,211,120,0.08)' : '#303e66',
                    borderColor: vendorTypes.includes(v.value) ? '#f9d378' : errors.vendorTypes ? '#e07070' : '#3c4f80',
                  }}>
                  <div className="text-2xl sm:text-3xl mb-1.5">{v.icon}</div>
                  <div className="text-[11px] sm:text-[12px] font-semibold" style={{ color: vendorTypes.includes(v.value) ? '#f9d378' : '#c5b098' }}>
                    {v.label}
                  </div>
                </button>
              ))}
            </div>
            {errors.vendorTypes && <p className="text-[12px] mt-1 mb-2" style={errStyle}>{errors.vendorTypes}</p>}
            <div className="mb-5" />

            <div className="mb-1">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Selling or Catering event? <span className="text-gold">*</span>
              </label>
              <select
                value={eventType}
                onChange={e => { setEventType(e.target.value); setErrors(p => ({ ...p, eventType: '' })) }}
                className={inputCls}
                style={{ ...inputStyle, borderColor: errors.eventType ? '#e07070' : '#3c4f80' }}
              >
                <option value="">Select…</option>
                <option value="selling">Selling event — vendors sell directly to guests</option>
                <option value="catering">Catering — vendor provides food for a fixed fee</option>
                <option value="both">Both / not sure yet</option>
              </select>
              {errors.eventType && <p className="text-[12px] mt-1" style={errStyle}>{errors.eventType}</p>}
            </div>
            <div className="mb-5" />

            {/* Budget — only for catering/both */}
            {['catering', 'both'].includes(eventType) && (
              <div className="mb-5 rounded-xl p-5 border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-3" style={{ color: '#baa182' }}>
                  Catering Budget (approx.) <span className="text-gold">*</span>
                </label>
                <div className="text-center text-[22px] font-bold text-gold mb-3">
                  {budget >= 10000 ? '$10,000+' : `$${budget.toLocaleString()}`}
                </div>
                <input type="range" min={500} max={10000} step={250} value={budget}
                  onChange={e => setBudget(parseInt(e.target.value))}
                  className="w-full" style={{ accentColor: '#f9d378' }} />
                <div className="flex justify-between text-[12px] mt-2" style={{ color: '#baa182' }}>
                  <span>$500</span><span>$10,000+</span>
                </div>
              </div>
            )}

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-3" style={{ color: '#baa182' }}>
                Any specific requirements?
              </label>
              <div className="flex flex-wrap gap-3">
                {REQUIREMENTS.map(r => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={requirements.includes(r)} onChange={() => toggleReq(r)}
                      style={{ accentColor: '#f9d378', width: 16, height: 16 }} />
                    <span className="text-[13px]" style={{ color: '#c5b098' }}>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Anything else the vendor should know?
              </label>
              <textarea placeholder="Cuisine preference, service style, setup window…" value={vendorNotes} onChange={e => setVendorNotes(e.target.value)}
                rows={3} className={inputCls} style={inputStyle} />
            </div>

            <div className="flex justify-between items-center pt-7 border-t" style={{ borderColor: '#3c4f80' }}>
              <button onClick={() => { setErrors({}); setStep(1) }}
                className="px-7 py-3 rounded-full text-[14px] font-semibold border transition-all hover:text-white"
                style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}>
                ← Back
              </button>
              <span className="text-[12px]" style={{ color: '#baa182' }}>Step 2 of 3</span>
              <button onClick={goStep3}
                className="px-9 py-3.5 rounded-full text-[14px] font-bold transition-all hover:opacity-90"
                style={{ background: '#f9d378', color: '#1b1f3b' }}>
                Next: Your Details →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-white mb-1.5">Almost there — your details</h2>
            <p className="text-[14px] font-light mb-8" style={{ color: '#c5b098' }}>
              We&apos;ll send vendor responses directly to you. Your info is never shared without your consent.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  First Name <span className="text-gold">*</span>
                </label>
                <input type="text" placeholder="Fraser" value={firstName}
                  onChange={e => { setFirstName(e.target.value); setErrors(p => ({ ...p, firstName: '' })) }}
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.firstName ? '#e07070' : '#3c4f80' }} />
                {errors.firstName && <p className="text-[12px] mt-1" style={errStyle}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  Last Name <span className="text-gold">*</span>
                </label>
                <input type="text" value={lastName}
                  onChange={e => { setLastName(e.target.value); setErrors(p => ({ ...p, lastName: '' })) }}
                  className={inputCls}
                  style={{ ...inputStyle, borderColor: errors.lastName ? '#e07070' : '#3c4f80' }} />
                {errors.lastName && <p className="text-[12px] mt-1" style={errStyle}>{errors.lastName}</p>}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Email Address <span className="text-gold">*</span>
              </label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                className={inputCls}
                style={{ ...inputStyle, borderColor: errors.email ? '#e07070' : '#3c4f80' }} />
              {errors.email && <p className="text-[12px] mt-1" style={errStyle}>{errors.email}</p>}
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>Phone Number</label>
              <input type="tel" placeholder="+64 21 000 0000" value={phone} onChange={e => setPhone(e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Organisation / Company (if applicable)
              </label>
              <input type="text" placeholder="e.g. Acme Corp" value={organisation} onChange={e => setOrganisation(e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                How did you hear about us?
              </label>
              <select value={referral} onChange={e => setReferral(e.target.value)} className={inputCls} style={inputStyle}>
                <option value="">Select…</option>
                {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="rounded-xl p-4 border mb-1"
              style={{ background: '#303e66', borderColor: errors.consent ? '#e07070' : '#3c4f80' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={consent} onChange={e => { setConsent(e.target.checked); setErrors(p => ({ ...p, consent: '' })) }}
                  style={{ accentColor: '#f9d378', width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
                <span className="text-[13px] font-light leading-relaxed" style={{ color: '#c5b098' }}>
                  I agree to be contacted by Open Circle Markets and matched vendors regarding my event enquiry.
                </span>
              </label>
            </div>
            {errors.consent && <p className="text-[12px] mt-1 mb-2" style={errStyle}>{errors.consent}</p>}

            {/* Honeypot — hidden from real users, bots fill it and get silently blocked */}
            <div style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center pt-7 border-t mt-5" style={{ borderColor: '#3c4f80' }}>
              <button onClick={() => { setErrors({}); setStep(2) }}
                className="px-7 py-3 rounded-full text-[14px] font-semibold border transition-all hover:text-white"
                style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}>
                ← Back
              </button>
              <span className="text-[12px]" style={{ color: '#baa182' }}>Step 3 of 3</span>
              <button onClick={submit} disabled={submitting}
                className="px-9 py-3.5 rounded-full text-[14px] font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: '#f9d378', color: '#1b1f3b' }}>
                {submitting ? 'Submitting…' : 'Submit Enquiry ✓'}
              </button>
            </div>
          </div>
        )}

        {/* ── CONFIRMATION ── */}
        {step === 'done' && (
          <div className="text-center py-10">
            <div className="text-7xl mb-6">🎉</div>
            <h2 className="text-[32px] font-black text-gold mb-3">You&apos;re in the Circle!</h2>
            <p className="text-[15px] font-light leading-relaxed max-w-md mx-auto mb-8" style={{ color: '#c5b098' }}>
              Your event enquiry has been submitted. Our vendors will review your brief and get back
              to you with availability and quotes within{' '}
              <strong className="text-gold">48 hours</strong>.
            </p>
            <div className="rounded-2xl p-6 border max-w-md mx-auto mb-8 text-left"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <p className="text-[11px] font-bold uppercase tracking-[2px] mb-4" style={{ color: '#baa182' }}>
                Your Enquiry Summary
              </p>
              {[
                ['Occasion', occasion],
                ['Date', eventDate],
                ['Location', location],
                ['Guests', `${guests} guests`],
                ['Vendor Types', vendorTypes.join(', ')],
                ['Contact', `${firstName} ${lastName} · ${email}`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-2.5 border-b text-[13px]" style={{ borderColor: '#3c4f80' }}>
                  <span style={{ color: '#baa182' }}>{label}</span>
                  <span className="font-semibold text-white text-right ml-4">{val || '—'}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <a href="/circle"
                className="px-8 py-3.5 rounded-full text-[14px] font-bold transition-all hover:opacity-90"
                style={{ background: '#f9d378', color: '#1b1f3b' }}>
                Browse More Vendors
              </a>
              <button onClick={() => { setStep(1); setOccasion(''); setEventDate(''); setGuests(''); setLocation(''); }}
                className="px-7 py-3 rounded-full text-[13px] font-semibold border transition-all"
                style={{ border: '1.5px solid #f9d378', color: '#f9d378' }}>
                Submit Another Enquiry
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; The Circle
      </footer>
    </>
  )
}
