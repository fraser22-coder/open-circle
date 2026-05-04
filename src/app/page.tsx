import Link from 'next/link'
import Image from 'next/image'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { Vendor } from '@/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open Circle Markets — Auckland\'s Curated Event Vendor Network',
  description: 'Browse and book Auckland\'s finest food, drinks, experience, and entertainment vendors for your next private or corporate event. Curated, vetted, and ready to book.',
}

const CATEGORY_LABELS: Record<string, string> = {
  food: '🍕 Food', drinks: '🍹 Drinks',
  experience: '🎯 Experience', entertainment: '🎭 Entertainment',
}

export default async function HomePage() {
  // Fetch a few featured vendors for the preview section
  const { data: featuredVendors } = await supabase
    .from('vendors')
    .select('id, name, slug, category, description, photos, price_range, location, is_available, is_beta')
    .eq('is_active', true)
    .eq('is_available', true)
    .limit(3)

  const vendors = (featuredVendors as Vendor[]) ?? []

  return (
    <>
      <NavBar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-5 sm:px-10 pt-16 sm:pt-24 pb-16 sm:pb-20 border-b"
        style={{ background: 'linear-gradient(145deg, #1b1f3b 0%, #252c50 50%, #1b1f3b 100%)', borderColor: '#303e66' }}
      >
        {/* Decorative background rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.03]"
            style={{ border: '1px solid #f9d378' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.04]"
            style={{ border: '1px solid #f9d378' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full opacity-[0.05]"
            style={{ border: '1px solid #f9d378' }} />
        </div>

        <div className="max-w-[900px] mx-auto text-center relative z-10">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7 text-[11px] font-bold uppercase tracking-[2px]"
            style={{ background: 'rgba(249,211,120,0.1)', border: '1px solid rgba(249,211,120,0.3)', color: '#f9d378' }}>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: '#f9d378' }} />
            Auckland&apos;s curated vendor network
          </div>

          <h1 className="text-[38px] sm:text-[58px] lg:text-[68px] font-black text-white leading-[1.05] mb-6">
            Every great event needs
            <br />
            <span style={{ color: '#f9d378' }}>great vendors.</span>
          </h1>

          <p className="text-[15px] sm:text-[18px] font-light max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: '#c5b098' }}>
            Open Circle Markets is Auckland&apos;s handpicked network of premium food, drink,
            experience, and entertainment vendors — available for private and corporate events.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/circle"
              className="px-8 py-4 rounded-full text-[15px] font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{ background: '#f9d378', color: '#1b1f3b' }}
            >
              Browse The Circle →
            </Link>
            <Link
              href="/book"
              className="px-8 py-4 rounded-full text-[15px] font-semibold border transition-all hover:border-gold hover:text-gold"
              style={{ border: '2px solid #3c4f80', color: '#c5b098' }}
            >
              Submit an Enquiry
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 justify-center mt-12">
            {[
              { icon: '🔍', text: 'Every vendor vetted personally' },
              { icon: '⚡', text: 'Responses within 48 hours' },
              { icon: '🆓', text: 'Free to use, no obligation' },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-2 text-[13px]" style={{ color: '#baa182' }}>
                <span>{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 border-b" style={{ borderColor: '#303e66' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#baa182' }}>
              Simple process
            </p>
            <h2 className="text-[30px] sm:text-[38px] font-black text-white">
              How The Circle works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                icon: '🔍',
                title: 'Browse & Shortlist',
                desc: 'Explore Auckland\'s finest vetted vendors. Filter by category — food, drinks, experience, or entertainment. Add the ones you like to your Event Brief.',
              },
              {
                step: '02',
                icon: '📋',
                title: 'Submit Your Brief',
                desc: 'Tell us about your event — date, guest count, location, and what you\'re looking for. Takes 3 minutes. No phone calls required.',
              },
              {
                step: '03',
                icon: '⚡',
                title: 'Vendors Come to You',
                desc: 'Your shortlisted vendors are notified first. They respond with availability and quotes within 48 hours — you choose who to book.',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="rounded-2xl p-7 border relative"
                style={{ background: '#303e66', borderColor: '#3c4f80' }}
              >
                <div
                  className="text-[11px] font-black uppercase tracking-[2px] mb-4"
                  style={{ color: '#f9d378', opacity: 0.5 }}
                >
                  Step {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-[18px] font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[14px] font-light leading-relaxed" style={{ color: '#c5b098' }}>{item.desc}</p>

                {i < 2 && (
                  <div className="hidden sm:block absolute top-1/2 -right-4 text-[20px] z-10"
                    style={{ color: '#3c4f80', transform: 'translateY(-50%)' }}>
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE CIRCLE — FEATURED VENDORS ────────────────────────────────────── */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 border-b" style={{ borderColor: '#303e66' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#baa182' }}>
                The Circle
              </p>
              <h2 className="text-[30px] sm:text-[38px] font-black text-white leading-tight">
                Auckland&apos;s finest,
                <br />
                <span style={{ color: '#f9d378' }}>curated for your event.</span>
              </h2>
            </div>
            <Link
              href="/circle"
              className="flex-shrink-0 px-6 py-3 rounded-full text-[13px] font-bold border transition-all hover:border-gold hover:text-gold"
              style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}
            >
              View All Vendors →
            </Link>
          </div>

          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {vendors.map(vendor => (
                <Link key={vendor.id} href={`/circle/${vendor.slug}`} className="block group">
                  <div
                    className="rounded-2xl overflow-hidden border transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:border-gold"
                    style={{ background: '#303e66', borderColor: '#3c4f80' }}
                  >
                    <div className="relative h-[200px] w-full overflow-hidden" style={{ background: '#1b1f3b' }}>
                      {vendor.photos?.[0] ? (
                        <Image src={vendor.photos[0]} alt={vendor.name} fill className="object-cover" sizes="400px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl"
                          style={{ background: 'linear-gradient(135deg,#1a0a05,#3d1a08,#c75a00)' }}>
                          {vendor.category === 'food' ? '🍕' : vendor.category === 'drinks' ? '🍹' : '🎯'}
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
                          style={{ background: '#f9d378', color: '#1b1f3b' }}>
                          {CATEGORY_LABELS[vendor.category]}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-[18px] font-bold text-white mb-1">{vendor.name}</h3>
                      <p className="text-[13px] font-light leading-relaxed mb-3 line-clamp-2" style={{ color: '#c5b098' }}>
                        {vendor.description}
                      </p>
                      <div className="text-[13px] font-bold text-gold">{vendor.price_range} <span className="text-[11px] font-light" style={{ color: '#baa182' }}>per item</span></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-2xl border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
              <p className="text-gold font-semibold">Vendors coming soon</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              href="/circle"
              className="inline-flex px-10 py-4 rounded-full text-[15px] font-bold transition-all hover:opacity-90"
              style={{ background: '#f9d378', color: '#1b1f3b' }}
            >
              Explore All of The Circle →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 border-b" style={{ borderColor: '#303e66' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-[28px] sm:text-[36px] font-black text-white">
              Whatever your event needs
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '🍕', label: 'Food', desc: 'Street food, catering, specialty cuisine', href: '/circle?category=food' },
              { icon: '🍹', label: 'Drinks', desc: 'Bars, beverage stations, cocktail carts', href: '/circle?category=drinks' },
              { icon: '🎯', label: 'Experience', desc: 'Interactive activities and installations', href: '/circle?category=experience' },
              { icon: '🎭', label: 'Entertainment', desc: 'Performers, DJs, live acts', href: '/circle?category=entertainment' },
            ].map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className="rounded-2xl p-5 sm:p-6 border text-center transition-all hover:-translate-y-1 group"
                style={{ background: '#303e66', borderColor: '#3c4f80' }}
              >
                <div className="text-4xl sm:text-5xl mb-3">{cat.icon}</div>
                <h3 className="text-[16px] font-bold text-white mb-1.5 group-hover:text-gold transition-colors">{cat.label}</h3>
                <p className="text-[12px] font-light" style={{ color: '#baa182' }}>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR VENDORS ──────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 py-16 sm:py-20 border-b" style={{ borderColor: '#303e66' }}>
        <div className="max-w-[900px] mx-auto">
          <div className="rounded-2xl p-8 sm:p-12 border text-center"
            style={{ background: 'linear-gradient(135deg, #252c50, #1b1f3b)', borderColor: '#3c4f80' }}>
            <div className="text-[40px] mb-4">⭕</div>
            <p className="text-[11px] font-bold uppercase tracking-[3px] mb-3" style={{ color: '#baa182' }}>
              For vendors
            </p>
            <h2 className="text-[28px] sm:text-[36px] font-black text-white mb-4">
              Stop chasing gigs.
              <br />
              <span style={{ color: '#f9d378' }}>Let events come to you.</span>
            </h2>
            <p className="text-[15px] font-light leading-relaxed max-w-lg mx-auto mb-8" style={{ color: '#c5b098' }}>
              Join The Circle and get notified when events that match your profile come in.
              We only take the best — and that selectivity is what makes it valuable for everyone in it.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
              {[
                { icon: '📸', title: 'Your own profile page', desc: 'Photos, pricing, and your story — all in one place' },
                { icon: '📬', title: 'Matched opportunities', desc: 'Email notifications for events that fit your category' },
                { icon: '🏆', title: 'Quality by association', desc: 'Being in The Circle signals credibility to clients' },
              ].map(f => (
                <div key={f.title} className="rounded-xl p-4 border" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h4 className="text-[14px] font-bold text-white mb-1">{f.title}</h4>
                  <p className="text-[12px] font-light" style={{ color: '#baa182' }}>{f.desc}</p>
                </div>
              ))}
            </div>
            <Link
              href="/vendor/signup"
              className="inline-flex px-8 py-3.5 rounded-full text-[14px] font-bold transition-all hover:opacity-90"
              style={{ background: '#f9d378', color: '#1b1f3b' }}
            >
              Apply to Join The Circle
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="px-5 sm:px-10 py-16 sm:py-24 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-[32px] sm:text-[48px] font-black text-white mb-5">
            Ready to plan your
            <br />
            <span style={{ color: '#f9d378' }}>next great event?</span>
          </h2>
          <p className="text-[15px] font-light mb-10" style={{ color: '#c5b098' }}>
            Browse the Circle, shortlist your vendors, and submit one brief.
            It&apos;s free, it&apos;s fast, and there&apos;s no obligation.
          </p>
          <Link
            href="/circle"
            className="inline-flex px-12 py-4 rounded-full text-[16px] font-bold transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Browse The Circle →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 sm:px-10 border-t" style={{ background: '#303e66', borderColor: '#3c4f80' }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <div className="text-[18px] font-black text-gold mb-1">Open Circle Markets</div>
              <p className="text-[13px] font-light max-w-xs" style={{ color: '#baa182' }}>
                Auckland&apos;s curated network of premium event vendors.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Platform</p>
                {[
                  { href: '/circle', label: 'The Circle' },
                  { href: '/book', label: 'Book a Vendor' },
                  { href: '/how-it-works', label: 'How It Works' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="block text-[13px] mb-2 hover:text-gold transition-colors" style={{ color: '#c5b098' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Vendors</p>
                {[
                  { href: '/vendor/signup', label: 'Apply to Join' },
                  { href: '/vendor/login', label: 'Vendor Login' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="block text-[13px] mb-2 hover:text-gold transition-colors" style={{ color: '#c5b098' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[2px] mb-3" style={{ color: '#baa182' }}>Legal</p>
                {[
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                ].map(l => (
                  <Link key={l.href} href={l.href} className="block text-[13px] mb-2 hover:text-gold transition-colors" style={{ color: '#c5b098' }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
            style={{ borderColor: '#3c4f80' }}>
            <p className="text-[12px]" style={{ color: '#baa182' }}>
              © {new Date().getFullYear()} Open Circle Markets. Auckland, New Zealand.
            </p>
            <p className="text-[12px]" style={{ color: '#baa182' }}>
              Built for event organisers and vendors who care about quality.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
