'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'

interface DashboardEnquiry {
  id: string
  created_at: string
  occasion: string
  event_date: string
  event_location: string
  guest_count: number
  venue_type: string
  event_type: string
  budget: number | null
  requirements: string[]
  event_notes: string
  vendor_notes: string
  status: string
  // Note: contact details are intentionally NOT shown until vendor responds
}

interface VendorResponse {
  enquiry_id: string
  status: 'available' | 'unavailable'
  message: string
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  new: { bg: '#1d3a5c', color: '#7ec8e3', label: '🔵 New Opportunity' },
  sent_to_vendors: { bg: '#2d4a2d', color: '#b7e4c7', label: '🟢 Active' },
  responses_received: { bg: '#4a3a10', color: '#f9d378', label: '🟡 Responded' },
  closed: { bg: '#3a1a1a', color: '#e07070', label: '🔴 Closed' },
}

export default function VendorDashboard() {
  const router = useRouter()
  const [enquiries, setEnquiries] = useState<DashboardEnquiry[]>([])
  const [myResponses, setMyResponses] = useState<Record<string, VendorResponse>>({})
  const [vendorName, setVendorName] = useState('')
  const [vendorCategory, setVendorCategory] = useState('')
  const [vendorId, setVendorId] = useState('')
  const [loading, setLoading] = useState(true)
  const [responding, setResponding] = useState<string | null>(null)
  const [responseMsg, setResponseMsg] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.push('/vendor/login'); return }

      // Get vendor profile — only their own
      const { data: vendor } = await supabase
        .from('vendors')
        .select('id, name, category')
        .eq('user_id', user.id)
        .single()

      if (!vendor) { router.push('/vendor/login'); return }

      setVendorName(vendor.name)
      setVendorCategory(vendor.category)
      setVendorId(vendor.id)

      // Fetch only enquiries that match this vendor's category
      // and only the fields vendors are allowed to see (no contact details)
      const { data: enqData } = await supabase
        .from('enquiries')
        .select('id, created_at, occasion, event_date, event_location, guest_count, venue_type, event_type, budget, requirements, event_notes, vendor_notes, status')
        .contains('vendor_types', [vendor.category])
        .order('created_at', { ascending: false })

      setEnquiries((enqData as DashboardEnquiry[]) ?? [])

      // Load this vendor's existing responses
      const { data: respData } = await supabase
        .from('vendor_responses')
        .select('*')
        .eq('vendor_id', vendor.id)

      if (respData) {
        const map: Record<string, VendorResponse> = {}
        for (const r of respData) {
          map[r.enquiry_id] = r
        }
        setMyResponses(map)
      }

      setLoading(false)
    })
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/vendor/login')
  }

  const respond = async (enquiryId: string, status: 'available' | 'unavailable') => {
    setResponding(enquiryId)
    const message = responseMsg[enquiryId] ?? ''

    try {
      const res = await fetch('/api/vendor-responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiry_id: enquiryId, vendor_id: vendorId, status, message }),
      })

      if (res.ok) {
        setMyResponses(prev => ({
          ...prev,
          [enquiryId]: { enquiry_id: enquiryId, status, message },
        }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setResponding(null)
    }
  }

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

      <div className="px-6 sm:px-10 py-8 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <div className="max-w-[1100px] mx-auto flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#baa182' }}>
              Vendor Portal
            </p>
            <h1 className="text-[28px] font-black text-gold">{vendorName}</h1>
            <p className="text-[13px] capitalize mt-0.5" style={{ color: '#baa182' }}>
              {vendorCategory} vendor
            </p>
          </div>
          <button onClick={signOut}
            className="px-5 py-2 rounded-full text-[12px] font-semibold border transition-all hover:text-white"
            style={{ border: '1.5px solid #3c4f80', color: '#baa182' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-6 sm:px-10 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'New Opportunities', value: enquiries.filter(e => !myResponses[e.id]).length },
            { label: 'I\'m Available', value: Object.values(myResponses).filter(r => r.status === 'available').length },
            { label: 'Passed', value: Object.values(myResponses).filter(r => r.status === 'unavailable').length },
            { label: 'Total Received', value: enquiries.length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 border text-center"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <div className="text-[32px] font-black text-gold">{s.value}</div>
              <div className="text-[11px] uppercase tracking-widest mt-1" style={{ color: '#baa182' }}>{s.label}</div>
            </div>
          ))}
        </div>

        <h2 className="text-[18px] font-bold text-white mb-5">Event Opportunities</h2>

        {enquiries.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gold font-semibold text-lg">No opportunities yet</p>
            <p className="text-sm mt-2" style={{ color: '#c5b098' }}>
              New {vendorCategory} event enquiries will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {enquiries.map(e => {
              const s = STATUS_STYLES[e.status] ?? STATUS_STYLES.new
              const myResp = myResponses[e.id]

              return (
                <div key={e.id} className="rounded-2xl p-6 border"
                  style={{
                    background: '#303e66',
                    borderColor: myResp?.status === 'available' ? '#52b788' : myResp?.status === 'unavailable' ? '#3a1a1a' : '#3c4f80',
                  }}>
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="text-[17px] font-bold text-white">{e.occasion}</h3>
                      <p className="text-[13px] mt-0.5" style={{ color: '#baa182' }}>
                        {e.event_date} · {e.event_location} · {e.guest_count} guests
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {myResp && (
                        <span className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                          style={{
                            background: myResp.status === 'available' ? '#1d4731' : '#3a1a1a',
                            color: myResp.status === 'available' ? '#b7e4c7' : '#e07070',
                          }}>
                          {myResp.status === 'available' ? '✓ Marked Available' : '✗ Passed'}
                        </span>
                      )}
                      <span className="px-3 py-1.5 rounded-full text-[11px] font-bold"
                        style={{ background: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px] mb-4">
                    <div><span style={{ color: '#baa182' }}>Venue</span><br /><strong className="text-white">{e.venue_type || '—'}</strong></div>
                    <div><span style={{ color: '#baa182' }}>Type</span><br /><strong className="text-white capitalize">{e.event_type}</strong></div>
                    <div><span style={{ color: '#baa182' }}>Budget</span><br /><strong className="text-gold">{e.budget ? `$${e.budget.toLocaleString()}` : 'N/A'}</strong></div>
                    <div><span style={{ color: '#baa182' }}>Received</span><br /><strong className="text-white">{new Date(e.created_at).toLocaleDateString('en-NZ')}</strong></div>
                  </div>

                  {e.vendor_notes && (
                    <div className="mb-4 p-3 rounded-xl text-[12px]" style={{ background: '#1b1f3b', color: '#c5b098' }}>
                      <strong style={{ color: '#baa182' }}>Notes from organiser: </strong>{e.vendor_notes}
                    </div>
                  )}

                  {/* Response section */}
                  {!myResp && (
                    <div className="border-t pt-4" style={{ borderColor: '#3c4f80' }}>
                      <p className="text-[12px] mb-3 font-semibold" style={{ color: '#baa182' }}>
                        Are you available for this event?
                      </p>
                      <textarea
                        placeholder="Optional message to the event organiser (availability, pricing details, questions…)"
                        value={responseMsg[e.id] ?? ''}
                        onChange={ev => setResponseMsg(prev => ({ ...prev, [e.id]: ev.target.value }))}
                        rows={2}
                        className="w-full rounded-xl px-4 py-3 text-[13px] text-white border outline-none mb-3 resize-none"
                        style={{ background: '#1b1f3b', borderColor: '#3c4f80' }}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => respond(e.id, 'available')}
                          disabled={responding === e.id}
                          className="px-5 py-2.5 rounded-full text-[13px] font-bold transition-all disabled:opacity-60 hover:opacity-90"
                          style={{ background: '#f9d378', color: '#1b1f3b' }}
                        >
                          {responding === e.id ? '…' : '✓ I\'m Available'}
                        </button>
                        <button
                          onClick={() => respond(e.id, 'unavailable')}
                          disabled={responding === e.id}
                          className="px-5 py-2.5 rounded-full text-[13px] font-semibold border transition-all disabled:opacity-60"
                          style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}
                        >
                          Pass
                        </button>
                      </div>
                    </div>
                  )}

                  {myResp?.message && (
                    <div className="mt-3 p-3 rounded-xl text-[12px]" style={{ background: '#1b1f3b', color: '#c5b098' }}>
                      <strong style={{ color: '#baa182' }}>Your message: </strong>{myResp.message}
                    </div>
                  )}
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
