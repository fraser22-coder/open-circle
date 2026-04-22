'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const OCMLogo = () => (
 import Image from 'next/image'

const OCMLogo = () => (
  <Image src="/Opencirclelogo-1.png" alt="Open Circle Markets" width={46} height={46} />
)

export default function NavBar() {
  const path = usePathname()
  const active = (href: string) =>
    path.startsWith(href) ? 'text-gold' : 'text-tan-2 hover:text-gold'

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-10 h-[72px] border-b"
      style={{ background: '#1b1f3b', borderColor: '#303e66' }}
    >
      {/* Logo */}
      <Link href="/circle" className="flex items-center gap-3">
        <OCMLogo />
        <div>
          <div className="text-[18px] font-bold text-gold leading-tight">Open Circle</div>
          <div className="text-[11px] font-light tracking-[3px] uppercase text-tan-2">Markets</div>
        </div>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        <Link href="/circle" className={`text-[13px] font-medium transition-colors ${active('/circle')}`}>
          Our Circle
        </Link>
        <Link href="/book" className={`text-[13px] font-medium transition-colors ${active('/book')}`}>
          Book a Vendor
        </Link>
        <Link href="/vendor/dashboard" className={`text-[13px] font-medium transition-colors ${active('/vendor')}`}>
          My Events
        </Link>
      </div>

      {/* CTA */}
      <Link
        href="/book"
        className="px-5 py-2 rounded-full text-[13px] font-bold transition-opacity hover:opacity-85"
        style={{ background: '#f9d378', color: '#1b1f3b' }}
      >
        Book a Vendor
      </Link>
    </nav>
  )
}
