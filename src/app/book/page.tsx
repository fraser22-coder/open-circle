'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'

type Step = 1 | 2 | 3 | 'done'
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

export default function BookPage() {
  const [step, setStep] = useState<Step>(1)
  const [submitting, setSubmitting] = useState(false)

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

  const toggleVendorType = (v: string) =>
    setVendorTypes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
  const toggleReq = (r: string) =>
    setRequirements(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])

  const submit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion, event_date: eventDate, guest_count: parseInt(guests),
          event_location: location, venue_type: venueType, event_notes: eventNotes,
          vendor_types: vendorTypes, event_type: eventType,
          budget: ['catering','both'].includes(eventType) ? budget : null,
          requirements, vendor_notes: vendorNotes,
          first_name: firstName, last_name: lastName, email, phone, organisation,
          referral_source: referral,
        }),
      })
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
      <div className="text-center py-16 px-10 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <h1 className="text-[42px] font-black text-gold">Book a Vendor</h1>
        <p className="mt-3 text-[15px] font-light max-w-lg mx-auto leading-relaxed" style={{ color: '#c5b098' }}>
          Tell us about your event and we&apos;ll match you with the perfect vendors from the Circle.
          Free to use, no obligation.
        </p>
        <div className="w-14 h-[3px] rounded-full mx-auto mt-5" style={{ background: '#f9d378' }} />
      </div>

      <div className="max-w-[720px] mx-auto px-8 py-12 pb-20">

        {/* Stepper */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-3 mb-12">
            <StepCircle n={1} />
            <div className="flex-1 h-[2px] max-w-[60px] transition-all"
              style={{ background: (typeof step === 'number' && step > 1) || step === 'done' ? '#52b788' : '#3c4f80' }} />
            <StepCircle n={2} />
            <div className="flex-1 h-[2px] max-w-[60px] transition-all"
              style={{ background: (typeof step === 'number' && step > 2) || step === 'done' ? '#52b788' : '#3c4f80' }} />
            <StepCircle n={3} />
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-[24px] font-bold text-white mb-1.5">Tell us about your event</h2>
            <p className="text-[14px] font-light mb-8" style={{ color: '#c5b098' }}>
              We need a few basics to match you with the right vendors.
            </p>

            <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>
              What&apos;s the occasion? <span className="text-gold">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {OCCASIONS.map(o => (
                <button key={o.value} onClick={() => setOccasion(o.value)}
                  className="rounded-xl p-4 text-center cursor-pointer transition-all border"
                  style={{
                    background: occasion === o.value ? 'rgba(249,211,120,0.08)' : '#303e66',
                    borderColor: occasion === o.value ? '#f9d378' : '#3c4f80',
                  }}>
                  <div className="text-3xl mb-2">{o.icon}</div>
                  <div className="text-[12px] font-semibold" style={{ color: occasion === o.value ? '#f9d378' : '#c5b098' }}>
                    {o.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  Event Date <span className="text-gold">*</span>
                </label>
                <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  Expected Guests <span className="text-gold">*</span>
                </label>
                <input type="number" placeholder="e.g. 150" value={guests} onChange={e => setGuests(e.target.value)}
                  className={inputCls} style={inputStyle} />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Location / Suburb <span className="text-gold">*</span>
              </label>
              <input type="text" placeholder="e.g. Ponsonby, Auckland" value={location} onChange={e => setLocation(e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>Venue Type</label>
              <select value={venueType} onChange={e => setVenueType(e.target.value)} className={inputCls} style={inputStyle}>
                <option value="">Select venue type…</option>
                {['Outdoor (park, garden, open space)','Indoor (hall, warehouse, venue)','Mixed indoor / outdoor','Private residence','Not yet confirmed'].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Tell us more about your event
              </label>
              <textarea placeholder="Theme, timing, setup notes, access requirements…" value={eventNotes} onChange={e => setEventNotes(e.target.value)}
                rows={4} className={inputCls} style={inputStyle} />
            </div>

            <div className="flex justify-end pt-7 border-t" style={{ borderColor: '#3c4f80' }}>
              <button onClick={() => setStep(2)}
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
            <h2 className="text-[24px] font-bold text-white mb-1.5">What are you looking for?</h2>
            <p className="text-[14px] font-light mb-8" style={{ color: '#c5b098' }}>
              Select the type of vendor you need. You can choose multiple.
            </p>

            <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>
              Vendor Type <span className="text-gold">*</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {VENDOR_TYPES.map(v => (
                <button key={v.value} onClick={() => toggleVendorType(v.value)}
                  className="rounded-xl p-4 text-center border transition-all"
                  style={{
                    background: vendorTypes.includes(v.value) ? 'rgba(249,211,120,0.08)' : '#303e66',
                    borderColor: vendorTypes.includes(v.value) ? '#f9d378' : '#3c4f80',
                  }}>
                  <div className="text-3xl mb-2">{v.icon}</div>
                  <div className="text-[12px] font-semibold" style={{ color: vendorTypes.includes(v.value) ? '#f9d378' : '#c5b098' }}>
                    {v.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Selling or Catering event? <span className="text-gold">*</span>
              </label>
              <select value={eventType} onChange={e => setEventType(e.target.value)} className={inputCls} style={inputStyle}>
                <option value="">Select…</option>
                <option value="selling">Selling event — vendors sell directly to guests</option>
                <option value="catering">Catering — vendor provides food for a fixed fee</option>
                <option value="both">Both / not sure yet</option>
              </select>
            </div>

            {/* Budget — only for catering/both */}
            {['catering','both'].includes(eventType) && (
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
              <button onClick={() => setStep(1)}
                className="px-7 py-3 rounded-full text-[14px] font-semibold border transition-all hover:text-white"
                style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}>
                ← Back
              </button>
              <span className="text-[12px]" style={{ color: '#baa182' }}>Step 2 of 3</span>
              <button onClick={() => setStep(3)}
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
            <h2 className="text-[24px] font-bold text-white mb-1.5">Almost there — your details</h2>
            <p className="text-[14px] font-light mb-8" style={{ color: '#c5b098' }}>
              We&apos;ll send vendor responses directly to you. Your info is never shared without your consent.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  First Name <span className="text-gold">*</span>
                </label>
                <input type="text" placeholder="Fraser" value={firstName} onChange={e => setFirstName(e.target.value)}
                  className={inputCls} style={inputStyle} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                  Last Name <span className="text-gold">*</span>
                </label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  className={inputCls} style={inputStyle} />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[12px] font-semibold uppercase tracking-[1px] mb-2" style={{ color: '#baa182' }}>
                Email Address <span className="text-gold">*</span>
              </label>
              <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}
                className={inputCls} style={inputStyle} />
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
              <input type="text" placeholder="e.g. Acme Corp, St Mary's School" value={organisation} onChange={e => setOrganisation(e.target.value)}
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

            <div className="rounded-xl p-4 border mb-2"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" style={{ accentColor: '#f9d378', width: 16, height: 16, marginTop: 2 }} />
                <span className="text-[13px] font-light leading-relaxed" style={{ color: '#c5b098' }}>
                  I agree to be contacted by Open Circle Markets and matched vendors regarding my event enquiry.
                </span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-7 border-t" style={{ borderColor: '#3c4f80' }}>
              <button onClick={() => setStep(2)}
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
            {/* Summary */}
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
                className="px-7 py-3 rounded-full text-[13px] font-semibold border transition-all hover:bg-gold hover:text-navy"
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
