'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────
interface BriefVendor { slug: string; name: string; category: string }

// ── Category display helpers ─────────────────────────────────────────────────
const CAT_EMOJI: Record<string, string> = {
  food: '🍕', drinks: '🍹', experience: '🎯', entertainment: '🎭',
}
const CAT_LABEL: Record<string, string> = {
  food: 'Food', drinks: 'Drinks', experience: 'Experience', entertainment: 'Entertainment',
}

// ── Sub-components ────────────────────────────────────────────────────────────
const OCMLogo = () => (
  <Image src="/Opencirclelogo-1.png" alt="Open Circle Markets" width={46} height={46} style={{ objectFit: 'contain' }} />
)

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    {open ? (
      <>
        <line x1="4" y1="4" x2="18" y2="18" stroke="#f9d378" strokeWidth="2" strokeLinecap="round"/>
        <line x1="18" y1="4" x2="4" y2="18" stroke="#f9d378" strokeWidth="2" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <line x1="3" y1="6" x2="19" y2="6" stroke="#f9d378" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="11" x2="19" y2="11" stroke="#f9d378" strokeWidth="2" strokeLinecap="round"/>
        <line x1="3" y1="16" x2="19" y2="16" stroke="#f9d378" strokeWidth="2" strokeLinecap="round"/>
      </>
    )}
  </svg>
)

// Shopping-bag icon
const BriefIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

// ── Nav links config ──────────────────────────────────────────────────────────
const NAV_LINKS = [
  { href: '/circle', label: 'Our Circle', match: '/circle' },
  { href: '/book', label: 'Book a Vendor', match: '/book' },
  { href: '/vendor/dashboard', label: 'My Events', match: '/vendor' },
]

// ── Brief Cart drawer ─────────────────────────────────────────────────────────
function BriefCart({
  brief,
  onRemove,
  onClose,
}: {
  brief: BriefVendor[]
  onRemove: (slug: string) => void
  onClose: () => void
}) {
  const router = useRouter()

  const handleBook = () => {
    onClose()
    router.push('/book')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[70] flex flex-col shadow-2xl"
        style={{
          width: 'min(380px, 100vw)',
          background: '#1b1f3b',
          borderLeft: '1px solid #303e66',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: '#303e66' }}
        >
          <div>
            <h2 className="text-[16px] font-bold text-white leading-none">Your Event Brief</h2>
            <p className="text-[12px] mt-1" style={{ color: '#baa182' }}>
              {brief.length === 0
                ? 'No vendors added yet'
                : `${brief.length} vendor${brief.length !== 1 ? 's' : ''} shortlisted`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors text-lg"
            aria-label="Close brief"
          >
            ✕
          </button>
        </div>

        {/* Vendor list */}
        <div className="flex-1 overflow-y-auto py-3">
          {brief.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pb-16 gap-4 px-6 text-center">
              <div className="text-5xl opacity-30">🛍️</div>
              <p className="text-[14px] font-medium" style={{ color: '#baa182' }}>
                Browse the Circle and add vendors you like — they&apos;ll appear here.
              </p>
              <Link
                href="/circle"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-[13px] font-bold border transition-colors hover:bg-white/5"
                style={{ borderColor: '#f9d378', color: '#f9d378' }}
              >
                Browse Vendors →
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-2 px-3">
              {brief.map(v => (
                <li
                  key={v.slug}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 border"
                  style={{ background: '#303e66', borderColor: '#3c4f80' }}
                >
                  {/* Category emoji avatar */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: '#1b1f3b' }}
                  >
                    {CAT_EMOJI[v.category] ?? '⭕'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/circle/${v.slug}`}
                      onClick={onClose}
                      className="text-[14px] font-semibold text-white hover:text-gold transition-colors block truncate"
                    >
                      {v.name}
                    </Link>
                    <span className="text-[11px]" style={{ color: '#baa182' }}>
                      {CAT_LABEL[v.category] ?? v.category}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => onRemove(v.slug)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] transition-colors hover:bg-white/10 flex-shrink-0"
                    style={{ color: '#baa182' }}
                    aria-label={`Remove ${v.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer CTA */}
        {brief.length > 0 && (
          <div
            className="px-4 py-4 border-t flex-shrink-0"
            style={{ borderColor: '#303e66', background: '#1b1f3b' }}
          >
            <p className="text-[11px] text-center mb-3" style={{ color: '#baa182' }}>
              Submit your event details and these vendors will be notified.
            </p>
            <button
              onClick={handleBook}
              className="w-full py-3.5 rounded-full text-[14px] font-bold transition-opacity hover:opacity-90"
              style={{ background: '#f9d378', color: '#1b1f3b' }}
            >
              Submit Your Brief →
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-full text-[13px] font-medium mt-2 transition-colors hover:bg-white/5"
              style={{ color: '#c5b098' }}
            >
              Keep Browsing
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── NavBar ────────────────────────────────────────────────────────────────────
export default function NavBar() {
  const path = usePathname()
  const [brief, setBrief] = useState<BriefVendor[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  // track the previous count to know when to pulse the icon
  const prevCount = useRef(0)
  const [pulse, setPulse] = useState(false)

  const briefCount = brief.length

  const loadBrief = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('circle_brief') || '[]')
      const next = Array.isArray(saved) ? saved : []
      if (next.length > prevCount.current) {
        setPulse(true)
        setTimeout(() => setPulse(false), 600)
      }
      prevCount.current = next.length
      setBrief(next)
    } catch { setBrief([]) }
  }

  useEffect(() => {
    loadBrief()
    window.addEventListener('storage', loadBrief)
    window.addEventListener('brief-updated', loadBrief)
    return () => {
      window.removeEventListener('storage', loadBrief)
      window.removeEventListener('brief-updated', loadBrief)
    }
  }, [])

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false) }, [path])

  const removeBriefVendor = (slug: string) => {
    const updated = brief.filter(v => v.slug !== slug)
    setBrief(updated)
    localStorage.setItem('circle_brief', JSON.stringify(updated))
    window.dispatchEvent(new Event('brief-updated'))
  }

  const active = (match: string) =>
    path.startsWith(match) ? 'text-gold' : 'text-tan-2 hover:text-gold'

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-10 h-[64px] sm:h-[72px] border-b"
        style={{ background: '#1b1f3b', borderColor: '#303e66' }}
      >
        {/* Logo */}
        <Link href="/circle" className="flex items-center gap-3">
          <OCMLogo />
          <div>
            <div className="text-[16px] sm:text-[18px] font-bold text-gold leading-tight">Open Circle</div>
            <div className="text-[10px] sm:text-[11px] font-light tracking-[3px] uppercase text-tan-2">Markets</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className={`text-[13px] font-medium transition-colors ${active(l.match)}`}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">

          {/* Brief / cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-[12px] sm:text-[13px] font-semibold border transition-all hover:border-gold hover:text-gold"
            style={{
              borderColor: briefCount > 0 ? '#f9d378' : '#3c4f80',
              color: briefCount > 0 ? '#f9d378' : '#baa182',
              background: briefCount > 0 ? 'rgba(249,211,120,0.07)' : 'transparent',
            }}
            aria-label={`Your brief — ${briefCount} vendor${briefCount !== 1 ? 's' : ''}`}
          >
            <span
              className={`transition-transform ${pulse ? 'scale-125' : 'scale-100'}`}
              style={{ display: 'flex' }}
            >
              <BriefIcon />
            </span>
            <span className="hidden sm:inline">
              {briefCount > 0 ? `Brief (${briefCount})` : 'My Brief'}
            </span>
            {briefCount > 0 && (
              <span
                className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ background: '#f9d378', color: '#1b1f3b' }}
              >
                {briefCount}
              </span>
            )}
          </button>

          {/* Book CTA — primary gold pill */}
          <Link
            href="/book"
            className="hidden sm:flex px-5 py-2 rounded-full text-[13px] font-bold transition-opacity hover:opacity-85"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Book a Vendor
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ background: menuOpen ? 'rgba(249,211,120,0.1)' : 'transparent' }}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle navigation"
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="md:hidden fixed top-[64px] left-0 right-0 z-40 border-b"
          style={{ background: '#1b1f3b', borderColor: '#303e66' }}
        >
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center px-6 py-4 text-[15px] font-semibold border-b transition-colors ${active(l.match)}`}
              style={{ borderColor: '#252b4a' }}
            >
              {l.label}
            </Link>
          ))}
          <div className="px-5 py-4">
            <Link
              href="/book"
              className="block w-full text-center py-3 rounded-full text-[14px] font-bold"
              style={{ background: '#f9d378', color: '#1b1f3b' }}
            >
              Book a Vendor
            </Link>
          </div>
        </div>
      )}

      {/* Brief cart drawer */}
      {cartOpen && (
        <BriefCart
          brief={brief}
          onRemove={removeBriefVendor}
          onClose={() => setCartOpen(false)}
        />
      )}
    </>
  )
}
