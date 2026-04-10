'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { Enquiry } from '@/lib/types'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new:                { bg: '#1d3a5c', color: '#7ec8e3', label: '🔵 New' },
  sent_to_vendors:    { bg: '#2d4a2d', color: '#b7e4c7', label: '🟢 Active' },
  responses_received: { bg: '#4a3a10', color: '#f9d378', label: '🟡 Responded' },
  closed:             { bg: '#3a1a1a', color: '#e07070', label: '🔴 Closed' },
}

export default function VendorDashboard() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [vendorName, setVendorName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/vendor/login'); return }

      // Get vendor profile
      const { data: vendor } = await supabase.from('vendors').select('name').eq('user_id', user.id).single()
      if (vendor) setVendorName(vendor.name)

      // Get enquiries matched to this vendor's category
      const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false })
      setEnquiries((data as Enquiry[]) ?? [])
      setLoading(false)
    })
  }, [router])

  const signOut = async () => { await supabase.auth.signOut(); router.push('/vendor/login') }

  if (loading) return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gold font-semibold animate-pulse">Loading your dashboard…</div>
      </div>
    </>
  )

  return (
    <>
      <NavBar />

      {/* Dashboard header */}
      <div className="px-10 py-8 border-b" style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#baa182' }}>
              Vendor Portal
            </p>
            <h1 className="text-[28px] font-black text-gold">{vendorName || 'My Dashboard'}</h1>
          </div>
          <button onClick={signOut}
            className="px-5 py-2 rounded-full text-[12px] font-semibold border transition-all hover:text-white"
            style={{ border: '1.5px solid #3c4f80', color: '#baa182' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-10 py-10">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Enquiries', value: enquiries.length },
            { label: 'Active', value: enquiries.filter(e => e.status === 'sent_to_vendors').length },
            { label: 'Responded', value: enquiries.filter(e => e.status === 'responses_received').length },
            { label: 'Closed', value: enquiries.filter(e => e.status === 'closed').length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 border text-center"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <div className="text-[32px] font-black text-gold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#baa182' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-[18px] font-bold text-white mb-5">My Events</h2>

        {enquiries.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gold font-semibold text-lg">No enquiries yet</p>
            <p className="text-sm mt-2" style={{ color: '#c5b098' }}>New opportunities will appear here when they match your profile</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map(e => {
              const s = STATUS_STYLES[e.status] ?? STATUS_STYLES.new
              return (
                <div key={e.id} className="rounded-2xl p-6 border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="text-[17px] font-bold text-white">{e.occasion}</h3>
                      <p className="text-[13px] mt-0.5" style={{ color: '#baa182' }}>
                        {e.event_date} · {e.event_location} · {e.guest_count} guests
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                      style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
                    <div><span style={{ color: '#baa182' }}>Venue</span><br/><strong className="text-white">{e.venue_type || '—'}</strong></div>
                    <div><span style={{ color: '#baa182' }}>Type</span><br/><strong className="text-white capitalize">{e.event_type}</strong></div>
                    <div><span style={{ color: '#baa182' }}>Budget</span><br/><strong className="text-gold">{e.budget ? `$${e.budget.toLocaleString()}` : 'N/A'}</strong></div>
                    <div><span style={{ color: '#baa182' }}>Received</span><br/><strong className="text-white">{new Date(e.created_at).toLocaleDateString('en-NZ')}</strong></div>
                  </div>
                  {e.vendor_notes && (
                    <div className="mt-4 p-3 rounded-xl text-[12px]" style={{ background: '#1b1f3b', color: '#c5b098' }}>
                      <strong style={{ color: '#baa182' }}>Notes: </strong>{e.vendor_notes}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    <button className="px-5 py-2 rounded-full text-[12px] font-bold transition-opacity hover:opacity-90"
                      style={{ background: '#f9d378', color: '#1b1f3b' }}>
                      ✓ Mark Available
                    </button>
                    <button className="px-5 py-2 rounded-full text-[12px] font-semibold border transition-all hover:text-white"
                      style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}>
                      Decline
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <footer className="mt-16 py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; Vendor Portal
      </footer>
    </>
  )
}
