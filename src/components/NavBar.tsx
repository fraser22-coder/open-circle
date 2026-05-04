'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/circle', label: 'Our Circle', match: '/circle' },
  { href: '/how-it-works', label: 'How It Works', match: '/how-it-works' },
  { href: '/book', label: 'Book a Vendor', match: '/book' },
]

const OCMLogo = () => (
  <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
    <circle cx="23" cy="23" r="21" stroke="#f9d378" strokeWidth="3" fill="#1b1f3b"/>
    <text x="23" y="20" textAnchor="middle" fill="#f9d378" fontSize="8" fontWeight="700" fontFamily="Poppins,sans-serif">OPEN</text>
    <text x="23" y="31" textAnchor="middle" fill="#f9d378" fontSize="8" fontWeight="700" fontFamily="Poppins,sans-serif">CIRCLE</text>
    <circle cx="23" cy="6" r="3" fill="#f9d378"/>
  </svg>
)

export default function NavBar() {
  const path = usePathname()

  const isActive = (match: string) =>
    path.startsWith(match) ? 'text-gold' : 'text-tan-2 hover:text-gold'

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-10 h-[72px] border-b"
      style={{ background: '#1b1f3b', borderColor: '#303e66' }}
    >
      {/* Logo → Homepage */}
      <Link href="/" className="flex items-center gap-3">
        <OCMLogo />
        <div>
          <div className="text-[18px] font-bold text-gold leading-tight">Open Circle</div>
          <div className="text-[11px] font-light tracking-[3px] uppercase text-tan-2">Markets</div>
        </div>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        {NAV_LINKS.map(({ href, label, match }) => (
          <Link
            key={href}
            href={href}
            className={`text-[13px] font-medium transition-colors ${isActive(match)}`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/join"
        className="px-5 py-2 rounded-full text-[13px] font-bold transition-opacity hover:opacity-85"
        style={{ background: '#f9d378', color: '#1b1f3b' }}
      >
        Join the Circle
      </Link>
    </nav>
  )
}
