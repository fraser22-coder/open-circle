import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works | Open Circle Markets',
  description: 'See how The Circle connects Auckland event organisers with curated food, drinks, and entertainment vendors — in three simple steps.',
}

const Step = ({
  number,
  title,
  description,
  details,
}: {
  number: string
  title: string
  description: string
  details: string[]
}) => (
  <div className="flex gap-6 sm:gap-10">
    <div className="flex-shrink-0">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-black border-2"
        style={{ background: '#1b1f3b', borderColor: '#f9d378', color: '#f9d378' }}
      >
        {number}
      </div>
    </div>
    <div className="flex-1 pb-12 border-b last:border-0" style={{ borderColor: '#3c4f80' }}>
      <h3 className="text-[20px] font-bold text-white mb-2">{title}</h3>
      <p className="text-[15px] mb-4" style={{ color: '#c5b098' }}>{description}</p>
      <ul className="space-y-2">
        {details.map((d, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: '#baa182' }}>
            <span className="text-gold mt-0.5">✓</span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const FAQ = ({ q, a }: { q: string; a: string }) => (
  <div className="py-5 border-b" style={{ borderColor: '#3c4f80' }}>
    <h4 className="text-[15px] font-bold text-white mb-2">{q}</h4>
    <p className="text-[14px]" style={{ color: '#c5b098' }}>{a}</p>
  </div>
)

export default function HowItWorksPage() {
  return (
    <>
      <NavBar />

      {/* Hero */}
      <div className="px-6 sm:px-10 py-16 border-b text-center"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <div className="max-w-[680px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#baa182' }}>
            The Process
          </p>
          <h1 className="text-[38px] sm:text-[52px] font-black text-white mb-4 leading-tight">
            How <span style={{ color: '#f9d378' }}>The Circle</span> works
          </h1>
          <p className="text-[16px] leading-relaxed" style={{ color: '#c5b098' }}>
            We&apos;ve made it simple. Tell us about your event, browse our curated vendors, and we&apos;ll connect you —
            no cold-calling, no spreadsheets, no guesswork.
          </p>
        </div>
      </div>

      {/* For Organisers */}
      <div className="max-w-[800px] mx-auto px-6 sm:px-10 py-16">
        <div className="mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ background: '#2d4a2d', color: '#b7e4c7' }}>
            For Event Organisers
          </span>
          <h2 className="text-[28px] font-black text-white mb-2">Plan your event in three steps</h2>
          <p className="text-[15px]" style={{ color: '#baa182' }}>
            From idea to confirmed vendor, it takes minutes — not weeks.
          </p>
        </div>

        <div className="space-y-0">
          <Step
            number="1"
            title="Browse the directory"
            description="Explore our curated selection of Auckland's best food trucks, bars, entertainers, and experience vendors. Filter by category and read about what makes each one special."
            details={[
              'Filter by food, drinks, entertainment, or experience',
              'See photos, pricing info, and what events each vendor suits',
              'Add your favourites to your Event Brief as you go',
            ]}
          />
          <Step
            number="2"
            title="Submit your enquiry"
            description="Fill in your event details — date, location, guest count, and what kind of vendors you need. Tell us about your vision and any specific requirements."
            details={[
              'Takes about 3 minutes to complete',
              'Your shortlisted vendors are highlighted in your enquiry',
              'Budget is optional — just give us what you know',
              'Your contact details are kept private until vendors respond',
            ]}
          />
          <Step
            number="3"
            title="We connect you"
            description="Your enquiry is sent directly to available vendors in the right categories. Interested vendors respond with their availability and any questions — then you take it from there."
            details={[
              'Vendors typically respond within 24–48 hours',
              'Only vendors who are available and interested will reach out',
              'You deal directly with vendors for pricing and logistics',
              'No middleman fees or booking commissions',
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/circle"
            className="px-8 py-3.5 rounded-full text-[14px] font-bold text-center transition-all hover:opacity-90"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Browse Vendors
          </Link>
          <Link
            href="/book"
            className="px-8 py-3.5 rounded-full text-[14px] font-semibold border text-center transition-all hover:text-white"
            style={{ border: '1.5px solid #3c4f80', color: '#c5b098' }}
          >
            Submit an Enquiry
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t" style={{ borderColor: '#3c4f80' }} />

      {/* For Vendors */}
      <div className="max-w-[800px] mx-auto px-6 sm:px-10 py-16">
        <div className="mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ background: '#1d3a5c', color: '#7ec8e3' }}>
            For Vendors
          </span>
          <h2 className="text-[28px] font-black text-white mb-2">Get discovered by the right clients</h2>
          <p className="text-[15px]" style={{ color: '#baa182' }}>
            No commissions. No bidding wars. Just qualified leads delivered straight to your inbox.
          </p>
        </div>

        <div className="space-y-0">
          <Step
            number="1"
            title="Apply to join"
            description="Submit your application with your business details, category, and a description of what you offer. Our team reviews every application personally."
            details={[
              'Free to apply — no upfront costs',
              'We review applications within a few business days',
              'We look for quality, reliability, and fit with our community',
            ]}
          />
          <Step
            number="2"
            title="Get listed in the directory"
            description="Once approved, you'll get a vendor profile on The Circle with photos, your description, and details of what events you're suited for."
            details={[
              'Your profile is seen by Auckland event organisers',
              'You can be shortlisted by organisers before they even enquire',
              'We send you email notifications for matching enquiries',
            ]}
          />
          <Step
            number="3"
            title="Respond to opportunities"
            description="When a matching enquiry comes in, you'll receive an email with the event details. Log into your vendor portal, mark your availability, and the organiser will contact you directly."
            details={[
              'See all enquiries matching your category in one dashboard',
              'Mark yourself available or pass — no pressure',
              'Deal directly with organisers — no commission taken',
              'Build relationships with repeat clients over time',
            ]}
          />
        </div>

        <div className="mt-10">
          <Link
            href="/join"
            className="inline-block px-8 py-3.5 rounded-full text-[14px] font-bold text-center transition-all hover:opacity-90"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Apply to Join The Circle
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ background: '#303e66' }} className="border-t border-b" style={{ borderColor: '#3c4f80' }}>
        <div className="max-w-[800px] mx-auto px-6 sm:px-10 py-16">
          <h2 className="text-[28px] font-black text-white mb-8">Common questions</h2>

          <FAQ
            q="Is there a cost to use The Circle?"
            a="For event organisers, it's completely free. For vendors, there's no commission on bookings — we operate on a curation model. Pricing details for vendor listings may be introduced in future."
          />
          <FAQ
            q="How quickly will vendors get back to me?"
            a="Most vendors respond within 24–48 hours. If you have a tight timeline, mention it in your event notes and vendors will prioritise accordingly."
          />
          <FAQ
            q="What if I don't hear back from vendors?"
            a="If you haven't heard back within 48–72 hours, email us at hello@opencirclemarkets.com and we'll follow up on your behalf."
          />
          <FAQ
            q="Do you handle contracts or payments?"
            a="No — The Circle is an introduction service. All booking agreements, contracts, and payments are handled directly between you and the vendor. We recommend getting any agreement in writing."
          />
          <FAQ
            q="Can I request a specific vendor?"
            a="Yes. As you browse the directory, you can add vendors to your Event Brief. When you submit your enquiry, those vendors are flagged as your shortlist and contacted first."
          />
          <FAQ
            q="What areas do you cover?"
            a="Our vendors are primarily based in and around Auckland. Some vendors may travel for the right event — mention your location in the enquiry and vendors will confirm availability."
          />
          <FAQ
            q="How do I apply to become a vendor?"
            a="Click 'Join The Circle' and fill in the application form. We'll review your submission and get back to you within a few business days."
          />
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16 px-6 sm:px-10 text-center" style={{ background: '#1b1f3b' }}>
        <div className="max-w-[560px] mx-auto">
          <h2 className="text-[28px] sm:text-[34px] font-black text-white mb-3">
            Ready to find your vendors?
          </h2>
          <p className="text-[15px] mb-8" style={{ color: '#c5b098' }}>
            Browse the directory and start building your Event Brief today.
          </p>
          <Link
            href="/circle"
            className="inline-block px-10 py-4 rounded-full text-[15px] font-bold transition-all hover:opacity-90"
            style={{ background: '#f9d378', color: '#1b1f3b' }}
          >
            Explore The Circle →
          </Link>
        </div>
      </div>

      <footer className="py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; Auckland
        <span className="mx-3">·</span>
        <Link href="/privacy" className="hover:underline">Privacy</Link>
        <span className="mx-2">·</span>
        <Link href="/terms" className="hover:underline">Terms</Link>
      </footer>
    </>
  )
}
