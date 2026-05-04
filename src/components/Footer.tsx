import Link from 'next/link'

const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'https://opencirclemarkets.com'

export default function Footer() {
  return (
    <footer
      className="mt-20 border-t"
      style={{ background: '#141728', borderColor: '#303e66' }}
    >
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand column */}
        <div>
          <div className="text-[16px] font-bold text-gold mb-1">Open Circle Markets</div>
          <div className="text-[11px] tracking-[3px] uppercase mb-4" style={{ color: '#8b9cc8' }}>
            The Circle
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#8b9cc8' }}>
            A curated collective of Auckland&apos;s finest vendors for private and corporate events.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <div className="text-[12px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#8b9cc8' }}>
            Navigate
          </div>
          <ul className="space-y-2">
            {[
              { href: '/', label: 'Home' },
              { href: '/circle', label: 'Our Circle' },
              { href: '/how-it-works', label: 'How It Works' },
              { href: '/book', label: 'Book a Vendor' },
              { href: '/join', label: 'Apply to Join' },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sm transition-colors hover:text-gold"
                  style={{ color: '#8b9cc8' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Back to main site + legal */}
        <div>
          <div className="text-[12px] font-semibold tracking-widest uppercase mb-4" style={{ color: '#8b9cc8' }}>
            Open Circle Markets
          </div>
          <p className="text-sm mb-4" style={{ color: '#8b9cc8' }}>
            The Circle is part of the Open Circle Markets family.
          </p>
          <a
            href={mainSiteUrl}
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-80"
            style={{ color: '#f9d378' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M6 3L2 7l4 4M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Visit opencirclemarkets.com
          </a>
          <ul className="mt-6 space-y-2">
            <li>
              <Link href="/privacy" className="text-xs hover:text-gold transition-colors" style={{ color: '#6b7db3' }}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-xs hover:text-gold transition-colors" style={{ color: '#6b7db3' }}>
                Terms of Service
              </Link>
            </li>
            <li>
              <a
                href={`mailto:support@opencirclemarkets.com`}
                className="text-xs hover:text-gold transition-colors"
                style={{ color: '#6b7db3' }}
              >
                support@opencirclemarkets.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-2"
        style={{ borderColor: '#303e66' }}
      >
        <p className="text-xs" style={{ color: '#6b7db3' }}>
          &copy; {new Date().getFullYear()} Open Circle Markets Ltd. All rights reserved.
        </p>
        <p className="text-xs" style={{ color: '#6b7db3' }}>
          Auckland, New Zealand
        </p>
      </div>
    </footer>
  )
}
