'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { Enquiry, Vendor } from '@/lib/types'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<'enquiries' | 'vendors' | 'applications'>('enquiries')
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/enquiries').then(r => r.json()),
      fetch('/api/vendors').then(r => r.json()),
      fetch('/api/vendor-applications').then(r => r.json()),
    ]).then(([eq, vd, apps]) => {
      setEnquiries(Array.isArray(eq) ? eq : [])
      setVendors(Array.isArray(vd) ? vd : [])
      setApplications(Array.isArray(apps) ? apps : [])
      setLoading(false)
    })
  }, [])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const updateEnquiryStatus = async (id: string, status: string) => {
    await fetch('/api/enquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: status as Enquiry['status'] } : e))
  }

  const toggleVendorActive = async (vendor: Vendor) => {
    await fetch('/api/vendors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vendor.id, is_active: !vendor.is_active }),
    })
    setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, is_active: !v.is_active } : v))
  }

  const toggleVendorAvailable = async (vendor: Vendor) => {
    await fetch('/api/vendors', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: vendor.id, is_available: !vendor.is_available }),
    })
    setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, is_available: !v.is_available } : v))
  }

  const updateApplicationStatus = async (id: string, status: 'approved' | 'declined') => {
    await fetch('/api/vendor-applications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  return (
    <>
      <NavBar />
      <div className="px-6 sm:px-10 py-7 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <div className="max-w-[1200px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#baa182' }}>
              Admin Panel
            </p>
            <h1 className="text-[28px] font-black text-gold">Open Circle Markets</h1>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2 rounded-full text-[12px] font-semibold border transition-all hover:text-white"
            style={{ border: '1.5px solid #3c4f80', color: '#baa182' }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 sm:px-10 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Enquiries', value: enquiries.length },
            { label: 'New', value: enquiries.filter(e => e.status === 'new').length },
            { label: 'Active Vendors', value: vendors.filter(v => v.is_active).length },
            { label: 'Pending Applications', value: applications.filter(a => a.status === 'pending').length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 border text-center"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <div className="text-[32px] font-black text-gold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#baa182' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['enquiries', 'vendors', 'applications'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-6 py-2.5 rounded-full text-[13px] font-semibold transition-all capitalize"
              style={{
                background: tab === t ? '#f9d378' : '#303e66',
                color: tab === t ? '#1b1f3b' : '#c5b098',
                border: `1.5px solid ${tab === t ? '#f9d378' : '#3c4f80'}`,
              }}>
              {t} ({t === 'enquiries' ? enquiries.length : t === 'vendors' ? vendors.length : applications.length})
            </button>
          ))}
        </div>

        {loading && <div className="text-gold animate-pulse py-10 text-center">Loading…</div>}

        {/* ENQUIRIES */}
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
                    {(e as any).brief_vendors?.length > 0 && (
                      <p className="text-[12px] mt-1" style={{ color: '#f9d378' }}>
                        ⭐ Shortlisted: {(e as any).brief_vendors.map((v: any) => v.name).join(', ')}
                      </p>
                    )}
                  </div>
                  <select
                    value={e.status}
                    onChange={ev => updateEnquiryStatus(e.id, ev.target.value)}
                    className="rounded-xl px-3 py-2 text-[12px] font-semibold border outline-none"
                    style={{ background: '#1b1f3b', borderColor: '#3c4f80', color: '#f9d378' }}
                  >
                    <option value="new">🔵 New</option>
                    <option value="sent_to_vendors">🟢 Sent to Vendors</option>
                    <option value="responses_received">🟡 Responses In</option>
                    <option value="closed">🔴 Closed</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                  <div><span style={{ color: '#baa182' }}>Date</span><br /><strong className="text-white">{e.event_date}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Location</span><br /><strong className="text-white">{e.event_location}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Guests</span><br /><strong className="text-white">{e.guest_count}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Budget</span><br /><strong className="text-gold">{e.budget ? `$${e.budget.toLocaleString()}` : 'N/A'}</strong></div>
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

        {/* VENDORS */}
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
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {v.is_beta && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: '#3c4f80', color: '#f9d378' }}>Beta</span>
                    )}
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: v.is_active ? '#1d4731' : '#3a1a1a', color: v.is_active ? '#b7e4c7' : '#e07070' }}>
                      {v.is_active ? '● Active' : '○ Inactive'}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                      style={{ background: v.is_available ? '#1d3a5c' : '#2a2a2a', color: v.is_available ? '#7ec8e3' : '#888' }}>
                      {v.is_available ? '● Available' : '○ Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => toggleVendorAvailable(v)}
                    className="px-4 py-2 rounded-full text-[12px] font-bold border transition-all"
                    style={{
                      background: v.is_available ? 'rgba(126,200,227,0.1)' : 'transparent',
                      color: v.is_available ? '#7ec8e3' : '#baa182',
                      borderColor: v.is_available ? '#7ec8e3' : '#3c4f80',
                    }}
                  >
                    {v.is_available ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button
                    onClick={() => toggleVendorActive(v)}
                    className="px-4 py-2 rounded-full text-[12px] font-bold border transition-all"
                    style={{
                      background: v.is_active ? 'transparent' : '#f9d378',
                      color: v.is_active ? '#e07070' : '#1b1f3b',
                      borderColor: v.is_active ? '#e07070' : '#f9d378',
                    }}
                  >
                    {v.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* APPLICATIONS */}
        {!loading && tab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 && (
              <div className="text-center py-12 rounded-2xl border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                <p className="text-gold font-semibold">No applications yet</p>
              </div>
            )}
            {applications.map((a: any) => (
              <div key={a.id} className="rounded-2xl p-6 border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                <div className="flex justify-between flex-wrap gap-3 mb-4">
                  <div>
                    <h3 className="text-[17px] font-bold text-white">{a.business_name}</h3>
                    <p className="text-[12px] mt-0.5" style={{ color: '#baa182' }}>
                      {a.contact_name} · {a.email} · {a.phone}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold capitalize self-start"
                    style={{
                      background: a.status === 'approved' ? '#1d4731' : a.status === 'declined' ? '#3a1a1a' : '#1d3a5c',
                      color: a.status === 'approved' ? '#b7e4c7' : a.status === 'declined' ? '#e07070' : '#7ec8e3',
                    }}>
                    {a.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] mb-4">
                  <div><span style={{ color: '#baa182' }}>Category</span><br /><strong className="text-white capitalize">{a.category}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Location</span><br /><strong className="text-white">{a.location || '—'}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Price Range</span><br /><strong className="text-white">{a.price_range || '—'}</strong></div>
                  <div><span style={{ color: '#baa182' }}>Space</span><br /><strong className="text-white">{a.space_required || '—'}</strong></div>
                </div>
                {a.description && (
                  <p className="text-[12px] p-3 rounded-xl mb-2" style={{ background: '#1b1f3b', color: '#c5b098' }}>
                    <strong style={{ color: '#baa182' }}>About: </strong>{a.description}
                  </p>
                )}
                {a.why_join && (
                  <p className="text-[12px] p-3 rounded-xl mb-4" style={{ background: '#1b1f3b', color: '#c5b098' }}>
                    <strong style={{ color: '#baa182' }}>Why join: </strong>{a.why_join}
                  </p>
                )}
                {a.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateApplicationStatus(a.id, 'approved')}
                      className="px-5 py-2 rounded-full text-[12px] font-bold transition-opacity hover:opacity-80"
                      style={{ background: '#1d4731', color: '#b7e4c7' }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(a.id, 'declined')}
                      className="px-5 py-2 rounded-full text-[12px] font-bold border transition-all"
                      style={{ border: '1.5px solid #e07070', color: '#e07070' }}
                    >
                      Decline
                    </button>
                  </div>
                )}
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
