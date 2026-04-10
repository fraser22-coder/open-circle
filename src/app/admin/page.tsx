'use client'
import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { Enquiry, Vendor } from '@/lib/types'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'opencircle2024'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<'enquiries' | 'vendors'>('enquiries')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)

  const login = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) setAuthed(true)
    else alert('Incorrect password')
  }

  useEffect(() => {
    if (!authed) return
    setLoading(true)
    Promise.all([
      fetch('/api/enquiries').then(r => r.json()),
      fetch('/api/vendors').then(r => r.json()),
    ]).then(([eq, vd]) => { setEnquiries(eq); setVendors(vd); setLoading(false) })
  }, [authed])

  const updateEnquiryStatus = async (id: string, status: string) => {
    await fetch('/api/enquiries', { method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }) })
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as Enquiry['status'] } : e))
  }

  const toggleVendorActive = async (vendor: Vendor) => {
    await fetch('/api/vendors', { method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vendor.id, is_active: !vendor.is_active }) })
    setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, is_active: !v.is_active } : v))
  }

  const inputCls = "rounded-xl px-4 py-3 text-sm text-white border outline-none w-full"
  const inputStyle = { background: '#303e66', borderColor: '#3c4f80' }

  if (!authed) return (
    <>
      <NavBar />
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-[24px] font-black text-gold mb-2">Admin Access</h1>
            <p className="text-sm font-light" style={{ color: '#c5b098' }}>Open Circle Markets — Internal Only</p>
          </div>
          <form onSubmit={login} className="rounded-2xl p-8 border space-y-4"
            style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#baa182' }}>
                Admin Password
              </label>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)}
                placeholder="••••••••" className={inputCls} style={inputStyle} />
            </div>
            <button type="submit" className="w-full py-3.5 rounded-full font-bold text-[15px] hover:opacity-90 transition-opacity"
              style={{ background: '#f9d378', color: '#1b1f3b' }}>
              Enter
            </button>
          </form>
        </div>
      </div>
    </>
  )

  return (
    <>
      <NavBar />
      <div className="px-10 py-7 border-b" style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <div className="max-w-[1200px] mx-auto">
          <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#baa182' }}>Admin Panel</p>
          <h1 className="text-[28px] font-black text-gold">Open Circle Markets</h1>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Enquiries', value: enquiries.length },
            { label: 'New', value: enquiries.filter(e => e.status === 'new').length },
            { label: 'Active Vendors', value: vendors.filter(v => v.is_active).length },
            { label: 'Total Vendors', value: vendors.length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 border text-center"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <div className="text-[32px] font-black text-gold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#baa182' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['enquiries','vendors'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all capitalize"
              style={{
                background: tab === t ? '#f9d378' : '#303e66',
                color: tab === t ? '#1b1f3b' : '#c5b098',
                border: `1.5px solid ${tab === t ? '#f9d378' : '#3c4f80'}`,
              }}>
              {t} ({t === 'enquiries' ? enquiries.length : vendors.length})
            </button>
          ))}
        </div>

        {loading && <div className="text-gold animate-pulse py-10 text-center">Loading…</div>}

        {/* ENQUIRIES TAB */}
        {!loading && tab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.length === 0 && (
              <div className="text-center py-12 rounded-2xl border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                <p className="text-gold font-semibold">No enquiries yet</p>
              </div>
            )}
            {enquiries.map(e => (
              <div key={e.id} className="rounded-2xl p-6 border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                <div className="flex justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <h3 className="text-[17px] font-bold text-white">{e.occasion}</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: '#baa182' }}>
                      {e.first_name} {e.last_name} · {e.email} · {e.phone}
                    </p>
                  </div>
                  <select value={e.status} onChange={ev => updateEnquiryStatus(e.id, ev.target.value)}
                    className="rounded-xl px-3 py-2 text-[12px] font-semibold border outline-none"
                    style={{ background: '#1b1f3b', borderColor: '#3c4f80', color: '#f9d378' }}>
                    <option value="new">🔵 New</option>
                    <option value="sent_to_vendors">🟢 Sent to Vendors</option>
                    <option value="responses_received">🟡 Responses In</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                  <div><span style={{ color: '#baa182' }}>Date</span><br/><strong className="text-white">{e.event_date}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Location</span><br/><strong className="text-white">{e.event_location}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Guests</span><br/><strong className="text-white">{e.guest_count}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Budget</span><br/><strong className="text-gold">{e.budget ? `$${e.budget.toLocaleString()}` : 'N/A'}</strong></div>
                </div>
                {e.vendor_notes && (
                  <p className="mt-3 text-[12px] p-3 rounded-xl" style={{ background: '#1b1f3b', color: '#c5b098' }}>
                    <strong style={{ color: '#baa182' }}>Notes: </strong>{e.vendor_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* VENDORS TAB */}
        {!loading && tab === 'vendors' && (
          <div className="space-y-4">
            {vendors.map(v => (
              <div key={v.id} className="rounded-2xl p-6 border flex justify-between items-center flex-wrap gap-4"
                style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                <div>
                  <h3 className="text-[17px] font-bold text-white">{v.name}</h3>
                  <p className="text-[12px] mt-0.5" style={{ color: '#baa182' }}>
                    {v.category} · {v.location} · {v.price_range}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {v.is_beta && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#3c4f80', color: '#f9d378' }}>Beta</span>}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: v.is_available ? '#1d4731' : '#3a1a1a', color: v.is_available ? '#b7e4c7' : '#e07070' }}>
                      {v.is_available ? '● Available' : '○ Unavailable'}
                    </span>
                  </div>
                </div>
                <button onClick={() => toggleVendorActive(v)}
                  className="px-5 py-2.5 rounded-full text-[12px] font-bold border transition-all"
                  style={{
                    background: v.is_active ? 'transparent' : '#f9d378',
                    color: v.is_active ? '#e07070' : '#1b1f3b',
                    borderColor: v.is_active ? '#e07070' : '#f9d378',
                  }}>
                  {v.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-16 py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; Admin Panel — Internal Use Only
      </footer>
    </>
  )
}
