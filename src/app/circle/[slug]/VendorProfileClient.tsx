'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { Vendor } from '@/lib/types'

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍕 Food', drinks: '🍹 Drinks',
  experience: '🎯 Experience', entertainment: '🎭 Entertainment',
}

export default function VendorProfileClient({ vendor }: { vendor: Vendor }) {
  const [slide, setSlide] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lightboxSlide, setLightboxSlide] = useState(0)
  const [inBrief, setInBrief] = useState(false)

  // Check if vendor is in brief
  useEffect(() => {
    try {
      const brief = JSON.parse(localStorage.getItem('circle_brief') || '[]')
      setInBrief(brief.some((v: { slug: string }) => v.slug === vendor.slug))
    } catch {}
  }, [vendor])

  // Auto-advance slideshow
  useEffect(() => {
    if (!vendor?.photos?.length || lightbox) return
    const t = setInterval(() => setSlide(s => (s + 1) % vendor.photos.length), 4500)
    return () => clearInterval(t)
  }, [vendor, lightbox])

  // Keyboard nav for lightbox
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (!lightbox) return
    if (e.key === 'Escape') setLightbox(false)
    if (e.key === 'ArrowRight') setLightboxSlide(s => (s + 1) % (vendor?.photos?.length || 1))
    if (e.key === 'ArrowLeft') setLightboxSlide(s => (s - 1 + (vendor?.photos?.length || 1)) % (vendor?.photos?.length || 1))
  }, [lightbox, vendor])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // Prevent scroll when lightbox open
  useEffect(() => {
    if (lightbox) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  const openLightbox = (i: number) => { setLightboxSlide(i); setLightbox(true) }

  const toggleBrief = () => {
    try {
      const brief = JSON.parse(localStorage.getItem('circle_brief') || '[]')
      let updated
      if (inBrief) {
        updated = brief.filter((v: { slug: string }) => v.slug !== vendor.slug)
      } else {
        updated = [...brief, { slug: vendor.slug, name: vendor.name, category: vendor.category }]
      }
      localStorage.setItem('circle_brief', JSON.stringify(updated))
      setInBrief(!inBrief)
      window.dispatchEvent(new Event('brief-updated'))
    } catch {}
  }

  const photos = vendor.photos ?? []

  return (
    <>
      <NavBar />

      {/* Lightbox */}
      {lightbox && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.93)' }}
          onClick={() => setLightbox(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <Image
              src={photos[lightboxSlide]}
              alt={`${vendor.name} photo ${lightboxSlide + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
            />
            {/* Close */}
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl z-10 hover:bg-white/20 transition-colors"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              aria-label="Close lightbox"
            >✕</button>

            {/* Prev / Next */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxSlide(s => (s - 1 + photos.length) % photos.length)}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-gold text-2xl z-10 hover:bg-white/10 transition-colors"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                  aria-label="Previous photo"
                >‹</button>
                <button
                  onClick={() => setLightboxSlide(s => (s + 1) % photos.length)}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-gold text-2xl z-10 hover:bg-white/10 transition-colors"
                  style={{ background: 'rgba(0,0,0,0.55)' }}
                  aria-label="Next photo"
                >›</button>

                {/* Counter */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[12px] text-white/70 z-10"
                  style={{ background: 'rgba(0,0,0,0.5)' }}>
                  {lightboxSlide + 1} / {photos.length}
                </div>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxSlide(i)}
                      className="h-2 rounded-full transition-all"
                      style={{ width: i === lightboxSlide ? 22 : 8, background: i === lightboxSlide ? '#f9d378' : 'rgba(255,255,255,0.35)' }}
                      aria-label={`Go to photo ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
            <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[11px] text-white/30 hidden sm:block">
              ESC to close · ← → to navigate
            </p>
          </div>
        </div>
      )}

      {/* Back breadcrumb */}
      <div className="px-4 sm:px-10 py-4 border-b" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
        <Link href="/circle" className="text-gold text-[13px] font-semibold hover:opacity-75 flex items-center gap-1.5">
          ← Back to Our Circle
        </Link>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-10 py-6 sm:py-10">

        {/* Hero slideshow */}
        <div
          className="relative w-full rounded-2xl overflow-hidden mb-4 cursor-pointer"
          style={{ aspectRatio: '16/9', background: '#303e66' }}
          onClick={() => photos.length > 0 && openLightbox(slide)}
          title="Click to view fullscreen"
        >
          {photos.length > 0 ? (
            <>
              {photos.map((url, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-500 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
                  <Image src={url} alt={`${vendor.name} photo ${i + 1}`} fill className="object-cover" sizes="(max-width: 1000px) 100vw, 1000px" />
                </div>
              ))}

              {/* Arrows */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); setSlide(s => (s - 1 + photos.length) % photos.length) }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gold text-lg z-10 transition-all hover:bg-[#303e66]"
                    style={{ background: 'rgba(27,31,59,0.8)', border: '1px solid #3c4f80' }}
                    aria-label="Previous"
                  >‹</button>
                  <button
                    onClick={e => { e.stopPropagation(); setSlide(s => (s + 1) % photos.length) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-gold text-lg z-10 transition-all hover:bg-[#303e66]"
                    style={{ background: 'rgba(27,31,59,0.8)', border: '1px solid #3c4f80' }}
                    aria-label="Next"
                  >›</button>
                  {/* Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); setSlide(i) }}
                        className="h-2 rounded-full transition-all"
                        style={{ width: i === slide ? 22 : 8, background: i === slide ? '#f9d378' : 'rgba(255,255,255,0.3)' }}
                        aria-label={`Photo ${i + 1}`}
                      />
                    ))}
                  </div>
                  {/* Enlarge hint */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold z-10"
                    style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.7)' }}>
                    ⛶ Tap to enlarge
                  </div>
                </>
              )}
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
        </div>

        {/* Thumbnail strip — only if 2+ photos */}
        {photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {photos.map((url, i) => (
              <button
                key={i}
                onClick={() => openLightbox(i)}
                className="flex-shrink-0 relative rounded-lg overflow-hidden transition-all"
                style={{
                  width: 72,
                  height: 54,
                  border: `2px solid ${i === slide ? '#f9d378' : 'transparent'}`,
                  opacity: i === slide ? 1 : 0.6,
                }}
                aria-label={`View photo ${i + 1}`}
              >
                <Image src={url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="72px" />
              </button>
            ))}
          </div>
        )}

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Main */}
          <div>
            <div className="flex items-start gap-4 mb-6">
              {/* Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 border"
                style={{ background: '#2a1000', borderColor: '#3c4f80' }}>
                {vendor.logo_url
                  ? <Image src={vendor.logo_url} alt="logo" width={80} height={80} className="object-contain rounded-xl" />
                  : (vendor.category === 'food' ? '🍕' : '⭕')}
              </div>
              <div>
                <h1 className="text-[24px] sm:text-[32px] font-black text-white leading-tight">{vendor.name}</h1>
                <div className="flex gap-2 mt-2 flex-wrap">
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
                <div key={d.label} className="rounded-xl p-3.5 sm:p-4 border"
                  style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                  <div className="text-[10px] font-semibold uppercase tracking-[1.5px] mb-1" style={{ color: '#baa182' }}>{d.label}</div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-gold leading-tight">{d.value}</div>
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
            <div className="rounded-2xl p-5 sm:p-7 border lg:sticky lg:top-[90px]"
              style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <h3 className="text-[16px] font-bold text-white mb-2">Interested in this vendor?</h3>
              <p className="text-[13px] font-light leading-relaxed mb-5" style={{ color: '#c5b098' }}>
                Submit your event details and {vendor.name} will come back with availability and a quote if required.
              </p>
              <Link
                href={`/book?vendor=${vendor.slug}`}
                className="block w-full text-center py-3.5 rounded-full text-[15px] font-bold mb-3 transition-opacity hover:opacity-90"
                style={{ background: '#f9d378', color: '#1b1f3b' }}
              >
                Request This Vendor
              </Link>
              <button
                onClick={toggleBrief}
                className="block w-full text-center py-3 rounded-full text-[13px] font-semibold transition-all border"
                style={{
                  border: `1.5px solid ${inBrief ? '#52b788' : '#f9d378'}`,
                  color: inBrief ? '#52b788' : '#f9d378',
                  background: inBrief ? 'rgba(82,183,136,0.08)' : 'transparent',
                }}
              >
                {inBrief ? '✓ In Your Brief' : '+ Add to Event Brief'}
              </button>

              {inBrief && (
                <p className="text-[11px] mt-2.5 text-center" style={{ color: '#52b788' }}>
                  Saved to your brief · <Link href="/book" className="underline hover:opacity-75">Open booking form →</Link>
                </p>
              )}

              <hr className="my-5 border-t" style={{ borderColor: '#3c4f80' }} />

              <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Availability</p>
              <div className="text-[12px] mb-2 flex items-center gap-2" style={{ color: '#baa182' }}>
                <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#52b788' }} />
                <span>Currently accepting bookings</span>
              </div>
              <div className="text-[12px] flex items-center gap-2" style={{ color: '#baa182' }}>
                <span>📅</span><span>Weekends &amp; weekdays available</span>
              </div>

              <hr className="my-5 border-t" style={{ borderColor: '#3c4f80' }} />

              <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Part of the Circle since</p>
              <div className="text-[12px] flex items-center gap-2 mb-2">
                <span>⭕</span>
                <span className="font-semibold text-gold">
                  {(vendor as any).member_since ? new Date((vendor as any).member_since).getFullYear() : '2024'} · {vendor.is_beta ? 'Beta Member' : 'Circle Member'}
                </span>
              </div>
              <div className="text-[11px] flex items-center gap-2" style={{ color: '#baa182' }}>
                <span>🔒</span><span>Vetted &amp; approved by Open Circle Markets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-16 sm:mt-20 py-7 px-6 sm:px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; The Circle
      </footer>
    </>
  )
}
