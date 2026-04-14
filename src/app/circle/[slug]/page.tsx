import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { Vendor } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍕 Food', drinks: '🍹 Drinks',
  experience: '🎯 Experience', entertainment: '🎭 Entertainment',
}

export default function VendorProfilePage({ params }: { params: { slug: string } }) {
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [slide, setSlide] = useState(0)
  const [loading, setLoading] = useState(true)

useEffect(() => {
  supabase
    .from('vendors')
    .select('*')
    .eq('slug', params.slug)
    .single()
    .then(({ data, error }) => {
      console.log("SLUG:", params.slug)
      console.log("DATA:", data)
      console.log("ERROR:", error)

      setVendor(data)
      setLoading(false)
    })
}, [params.slug])

  useEffect(() => {
    if (!vendor?.photos?.length) return
    const t = setInterval(() => setSlide(s => (s + 1) % vendor.photos.length), 4500)
    return () => clearInterval(t)
  }, [vendor])

  if (loading) return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gold text-lg font-semibold animate-pulse">Loading vendor profile…</div>
      </div>
    </>
  )

  if (!vendor) return (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-5xl">⭕</div>
        <p className="text-gold text-xl font-bold">Vendor not found</p>
        <Link href="/circle" className="text-tan-2 hover:text-gold text-sm">← Back to Our Circle</Link>
      </div>
    </>
  )

  const photos = vendor.photos ?? []

  return (
    <>
      <NavBar />

      {/* Back */}
      <div className="px-10 py-4 border-b" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
        <Link href="/circle" className="text-gold text-[13px] font-semibold hover:opacity-75 flex items-center gap-1.5">
          ← Back to Our Circle
        </Link>
      </div>

      <div className="max-w-[1000px] mx-auto px-10 py-10">

        {/* Slideshow */}
        <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: '16/9', background: '#303e66' }}>
          {photos.length > 0 ? (
            <>
              {photos.map((url, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
                  <Image src={url} alt={`${vendor.name} photo ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3"
              style={{ background: 'linear-gradient(135deg,#1a0a05,#3d1a08,#8B2500)' }}>
              <span className="text-6xl">{vendor.category === 'food' ? '🍕' : '📸'}</span>
              <span className="text-[12px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Photos coming soon
              </span>
            </div>
          )}

          {/* Arrows */}
          {photos.length > 1 && (
            <>
              <button onClick={() => setSlide(s => (s - 1 + photos.length) % photos.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gold text-lg z-10 transition-all hover:bg-[#303e66]"
                style={{ background: 'rgba(27,31,59,0.8)', border: '1px solid #3c4f80' }}>‹</button>
              <button onClick={() => setSlide(s => (s + 1) % photos.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gold text-lg z-10 transition-all hover:bg-[#303e66]"
                style={{ background: 'rgba(27,31,59,0.8)', border: '1px solid #3c4f80' }}>›</button>
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {photos.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className="h-2 rounded-full transition-all"
                    style={{ width: i === slide ? 22 : 8, background: i === slide ? '#f9d378' : 'rgba(255,255,255,0.3)' }} />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Main */}
          <div>
            <div className="flex items-start gap-5 mb-6">
              {/* Logo */}
              <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl flex-shrink-0 border"
                style={{ background: '#2a1000', borderColor: '#3c4f80' }}>
                {vendor.logo_url
                  ? <Image src={vendor.logo_url} alt="logo" width={80} height={80} className="object-contain rounded-xl" />
                  : (vendor.category === 'food' ? '🍕' : '⭕')}
              </div>
              <div>
                <h1 className="text-[32px] font-black text-white leading-none">{vendor.name}</h1>
                <div className="flex gap-2 mt-2.5 flex-wrap">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                    style={{ background: '#f9d378', color: '#1b1f3b' }}>
                    {CATEGORY_LABELS[vendor.category]}
                  </span>
                  {vendor.is_available && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                      style={{ background: '#1d4731', color: '#b7e4c7' }}>
                      ● Available for Bookings
                    </span>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[15px] font-light leading-relaxed mb-7" style={{ color: '#c5b098' }}>
              {vendor.description}
            </p>

            {/* Details grid */}
            <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3.5" style={{ color: '#baa182' }}>
              Vendor Details
            </p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Vendor Type', value: CATEGORY_LABELS[vendor.category], sub: vendor.category },
                { label: 'Price Range', value: vendor.price_range, sub: 'per item / serve' },
                { label: 'Space Required', value: vendor.space_required, sub: 'Flat surface needed' },
                { label: 'Location', value: vendor.location, sub: 'Travel considered' },
              ].map(d => (
                <div key={d.label} className="rounded-xl p-4 border"
                  style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[1.5px] mb-1" style={{ color: '#baa182' }}>{d.label}</div>
                  <div className="text-[16px] font-bold text-gold">{d.value}</div>
                  <div className="text-[11px] mt-0.5" style={{ color: '#baa182' }}>{d.sub}</div>
                </div>
              ))}
            </div>

            {/* Suitable for */}
            {vendor.suitable_for?.length > 0 && (
              <>
                <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Suitable For</p>
                <div className="flex gap-2 flex-wrap">
                  {vendor.suitable_for.map(tag => (
                    <span key={tag} className="px-3.5 py-1.5 rounded-full text-[11px] border"
                      style={{ background: '#303e66', borderColor: '#3c4f80', color: '#c5b098' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-2xl p-7 border sticky top-[90px]"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <h3 className="text-[16px] font-bold text-white mb-2">Interested in this vendor?</h3>
              <p className="text-[13px] font-light leading-relaxed mb-5" style={{ color: '#c5b098' }}>
                Submit your event details and {vendor.name} will come back with availability and a quote if required.
              </p>
              <Link href={`/book?vendor=${vendor.slug}`}
                className="block w-full text-center py-3.5 rounded-full text-[15px] font-bold mb-2.5 transition-opacity hover:opacity-90"
                style={{ background: '#f9d378', color: '#1b1f3b' }}>
                Request This Vendor
              </Link>
              <Link href="/book"
                className="block w-full text-center py-3 rounded-full text-[13px] font-semibold transition-all border hover:bg-gold hover:text-navy"
                style={{ border: '1.5px solid #f9d378', color: '#f9d378' }}>
                Add to Event Brief
              </Link>

              <hr className="my-5 border-t" style={{ borderColor: '#3c4f80' }} />

              <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Availability</p>
              <div className="text-[12px] mb-2 flex items-center gap-2" style={{ color: '#baa182' }}>
                <span>✅</span>
                <span>
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#52b788' }} />
                  Currently accepting bookings
                </span>
              </div>
              <div className="text-[12px] flex items-center gap-2" style={{ color: '#baa182' }}>
                <span>📅</span><span>Weekends &amp; weekdays available</span>
              </div>

              <hr className="my-5 border-t" style={{ borderColor: '#3c4f80' }} />

              <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Part of the Circle since</p>
              <div className="text-[12px] flex items-center gap-2 mb-2">
                <span>⭕</span>
                <span className="font-semibold text-gold">{vendor.is_beta ? 'Beta Member' : 'Circle Member'}</span>
              </div>
              <div className="text-[11px] flex items-center gap-2" style={{ color: '#baa182' }}>
                <span>🔒</span><span>Vetted &amp; approved by Open Circle Markets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; The Circle
      </footer>
    </>
  )
}
