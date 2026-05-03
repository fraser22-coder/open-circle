import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Open Circle Markets',
  description: 'How Open Circle Markets collects, uses, and protects your personal information.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-[18px] font-bold text-white mb-3">{title}</h2>
    <div className="text-[14px] leading-relaxed space-y-3" style={{ color: '#c5b098' }}>
      {children}
    </div>
  </section>
)

export default function PrivacyPage() {
  return (
    <>
      <NavBar />

      {/* Header */}
      <div className="px-6 sm:px-10 py-12 border-b"
        style={{ background: 'linear-gradient(135deg,#303e66,#1b1f3b)', borderColor: '#3c4f80' }}>
        <div className="max-w-[760px] mx-auto">
          <p className="text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#baa182' }}>
            Legal
          </p>
          <h1 className="text-[36px] font-black text-gold mb-2">Privacy Policy</h1>
          <p className="text-[14px]" style={{ color: '#baa182' }}>
            Last updated: 1 May 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 sm:px-10 py-12">

        <Section title="Who We Are">
          <p>
            Open Circle Markets operates <strong className="text-white">The Circle</strong> — a curated vendor
            marketplace connecting Auckland event organisers with food, drinks, experience, and entertainment vendors.
            Our website is located at <strong className="text-white">thecircle.opencirclemarkets.com</strong> (or the
            domain you are currently visiting).
          </p>
          <p>
            We are based in Auckland, New Zealand, and operate under New Zealand law, including the Privacy Act 2020.
            If you have questions about this policy, contact us at{' '}
            <a href="mailto:hello@opencirclemarkets.com" className="text-gold hover:underline">
              hello@opencirclemarkets.com
            </a>.
          </p>
        </Section>

        <Section title="Information We Collect">
          <p><strong className="text-white">From event enquiries:</strong> When you submit an event enquiry we collect
            your first and last name, email address, phone number (optional), organisation name (optional),
            event details (date, location, guest count, occasion, budget), and your preferred vendors.</p>
          <p><strong className="text-white">From vendor applications:</strong> When you apply to join our vendor
            directory we collect your business name, contact name, email, phone number (optional), business category,
            description, social media handles, and website URL.</p>
          <p><strong className="text-white">From vendor accounts:</strong> Vendors who log into the vendor portal
            provide an email address and password, managed securely through Supabase Auth.</p>
          <p><strong className="text-white">Automatically collected:</strong> We collect standard web server logs
            including IP address, browser type, pages visited, and referring URL. This information is used for
            security, rate limiting, and diagnosing technical issues. We do not use third-party analytics trackers
            or advertising pixels.</p>
        </Section>

        <Section title="How We Use Your Information">
          <p>We use the information you provide to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Process and respond to event enquiries</li>
            <li>Send your enquiry details to relevant, available vendors</li>
            <li>Communicate with you about your enquiry or application</li>
            <li>Operate the vendor portal and manage vendor accounts</li>
            <li>Prevent abuse, spam, and fraudulent submissions</li>
            <li>Improve our service based on usage patterns</li>
          </ul>
          <p>
            We do <strong className="text-white">not</strong> sell your personal information. We do not use your
            data for advertising profiling or share it with third parties for marketing purposes.
          </p>
        </Section>

        <Section title="Sharing Your Information">
          <p>
            When you submit an event enquiry, your contact details and event requirements are shared with vendors
            in the relevant categories. This is the core service: connecting event organisers with vendors.
            By submitting an enquiry you consent to this sharing.
          </p>
          <p>
            Vendor profile details (name, description, photos, category) are displayed publicly on our website
            to help event organisers choose the right vendors.
          </p>
          <p>
            We use the following third-party services to operate The Circle:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li><strong className="text-white">Supabase</strong> — database and authentication (data hosted in AWS)</li>
            <li><strong className="text-white">Resend</strong> — transactional email delivery</li>
            <li><strong className="text-white">Vercel</strong> — website hosting</li>
          </ul>
          <p>
            Each of these providers processes data only as necessary to deliver the service and operates under their
            own privacy policies. We encourage you to review them if you have concerns.
          </p>
        </Section>

        <Section title="Data Retention">
          <p>
            Enquiry data is retained for up to 2 years so we can assist with event follow-up and dispute resolution.
            Vendor application data is retained indefinitely unless you request deletion. You may request deletion
            of your data at any time by emailing us.
          </p>
        </Section>

        <Section title="Your Rights (NZ Privacy Act 2020)">
          <p>Under the New Zealand Privacy Act 2020 you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Ask whether we hold personal information about you</li>
            <li>Request access to that information</li>
            <li>Request correction of inaccurate information</li>
            <li>Ask us to delete your data (subject to legal retention requirements)</li>
          </ul>
          <p>
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@opencirclemarkets.com" className="text-gold hover:underline">
              hello@opencirclemarkets.com
            </a>{' '}
            with your request. We will respond within 20 working days as required by law.
          </p>
        </Section>

        <Section title="Cookies and Local Storage">
          <p>
            We use browser local storage (not third-party cookies) to remember your Event Brief while you browse the
            site. This data never leaves your device and is not sent to our servers until you submit an enquiry.
          </p>
          <p>
            We use a single HttpOnly session cookie for admin authentication. This cookie is strictly necessary for
            the admin portal to function and is not used for tracking.
          </p>
          <p>
            We do not use advertising cookies, analytics cookies, or any third-party tracking scripts.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We take reasonable technical and organisational measures to protect your personal information, including:
            encrypted connections (HTTPS/TLS), HttpOnly session cookies, server-side input validation, rate limiting
            on all public endpoints, and restricted database access via row-level security policies.
          </p>
          <p>
            No method of transmission over the internet is 100% secure. If you believe your data has been
            compromised, please contact us immediately.
          </p>
        </Section>

        <Section title="Children">
          <p>
            The Circle is not directed at children under 13. We do not knowingly collect personal information
            from anyone under 13. If you believe a child has submitted information to us, please contact us
            and we will delete it promptly.
          </p>
        </Section>

        <Section title="Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated"
            date at the top of this page. We encourage you to review this page periodically. Continued use of
            The Circle after any changes constitutes your acceptance of the updated policy.
          </p>
        </Section>

        <Section title="Contact Us">
          <p>
            For any privacy-related questions or requests:
          </p>
          <p>
            <strong className="text-white">Open Circle Markets</strong><br />
            Auckland, New Zealand<br />
            <a href="mailto:hello@opencirclemarkets.com" className="text-gold hover:underline">
              hello@opencirclemarkets.com
            </a>
          </p>
        </Section>

        <div className="border-t pt-8 flex gap-6 text-[13px]" style={{ borderColor: '#3c4f80' }}>
          <Link href="/terms" className="text-gold hover:underline">Terms of Service →</Link>
          <Link href="/" className="hover:underline" style={{ color: '#baa182' }}>Back to Home</Link>
        </div>
      </div>

      <footer className="mt-8 py-7 px-10 text-center text-[12px] border-t"
        style={{ background: '#303e66', borderColor: '#3c4f80', color: '#baa182' }}>
        <strong className="text-gold">Open Circle Markets</strong> &nbsp;·&nbsp; Auckland
      </footer>
    </>
  )
}
