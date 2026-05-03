import { Metadata } from 'next'
import NavBar from '@/components/NavBar'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Open Circle Markets',
  description: 'Terms and conditions for using The Circle — the Open Circle Markets vendor marketplace.',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-10">
    <h2 className="text-[18px] font-bold text-white mb-3">{title}</h2>
    <div className="text-[14px] leading-relaxed space-y-3" style={{ color: '#c5b098' }}>
      {children}
    </div>
  </section>
)

export default function TermsPage() {
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
          <h1 className="text-[36px] font-black text-gold mb-2">Terms of Service</h1>
          <p className="text-[14px]" style={{ color: '#baa182' }}>
            Last updated: 1 May 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[760px] mx-auto px-6 sm:px-10 py-12">

        <Section title="1. About These Terms">
          <p>
            These Terms of Service ("Terms") govern your use of <strong className="text-white">The Circle</strong>,
            the vendor marketplace operated by <strong className="text-white">Open Circle Markets</strong>
            ("we", "us", "our"), accessible at thecircle.opencirclemarkets.com (or the domain you are currently visiting).
          </p>
          <p>
            By submitting an enquiry, applying to become a vendor, or otherwise using The Circle, you agree to
            these Terms. If you do not agree, please do not use the service.
          </p>
          <p>
            These Terms are governed by New Zealand law. Any disputes will be subject to the jurisdiction of
            the New Zealand courts.
          </p>
        </Section>

        <Section title="2. The Service">
          <p>
            The Circle is a marketplace that connects event organisers with curated food, drinks, experience,
            and entertainment vendors in Auckland and surrounding areas. We facilitate introductions between
            organisers and vendors but are not a party to any agreement, contract, or transaction between them.
          </p>
          <p>
            <strong className="text-white">We are an introduction service only.</strong> Any contract for services
            is between the event organiser and the vendor directly. We are not responsible for the quality,
            safety, legality, or delivery of any vendor services.
          </p>
        </Section>

        <Section title="3. Event Enquiries">
          <p>
            When you submit an event enquiry through The Circle:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>You confirm that the information you provide is accurate and complete.</li>
            <li>You consent to your enquiry details being shared with relevant vendors in our network.</li>
            <li>You understand that submitting an enquiry does not guarantee vendor availability or booking.</li>
            <li>You agree to deal with vendors directly and professionally.</li>
          </ul>
          <p>
            We reserve the right to decline to forward enquiries that appear fraudulent, abusive, or in violation
            of these Terms.
          </p>
        </Section>

        <Section title="4. Vendor Applications and Accounts">
          <p>
            Vendors applying to join The Circle must provide accurate business information. We reserve the right
            to approve or decline any application at our sole discretion.
          </p>
          <p>
            Approved vendors who receive login credentials agree to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Keep their credentials confidential and not share account access.</li>
            <li>Respond to enquiries honestly about their availability.</li>
            <li>Maintain the quality standards that led to their approval.</li>
            <li>Notify us of any material changes to their business (e.g., closure, change of category).</li>
          </ul>
          <p>
            We may suspend or remove a vendor from the directory at any time if we determine they are not
            meeting the standards of The Circle or have violated these Terms.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You must not use The Circle to:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Submit false, misleading, or spam enquiries or applications.</li>
            <li>Attempt to scrape, harvest, or bulk-collect vendor contact information.</li>
            <li>Use automated tools (bots, scrapers) to interact with the service.</li>
            <li>Attempt to circumvent security measures, rate limits, or authentication.</li>
            <li>Engage in any activity that is unlawful or that damages our reputation or service.</li>
          </ul>
          <p>
            We reserve the right to block any IP address or user that violates these rules.
          </p>
        </Section>

        <Section title="6. Intellectual Property">
          <p>
            All content on The Circle — including design, copy, branding, and code — is owned by or licensed
            to Open Circle Markets. You may not reproduce, distribute, or create derivative works without our
            written consent.
          </p>
          <p>
            Vendors who submit profile content (descriptions, photos, logos) grant us a non-exclusive licence
            to display that content on The Circle for the purpose of marketing their services. This licence ends
            when the vendor is removed from the directory.
          </p>
        </Section>

        <Section title="7. Disclaimer of Warranties">
          <p>
            The Circle is provided "as is" and "as available" without warranties of any kind, express or implied.
            We do not warrant that:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>The service will be uninterrupted, error-free, or secure.</li>
            <li>Vendor profiles are always up-to-date or accurate.</li>
            <li>Any vendor will respond to or accept your enquiry.</li>
          </ul>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by New Zealand law, Open Circle Markets will not be liable for any
            indirect, incidental, special, or consequential damages arising from your use of The Circle or any
            vendor services arranged through it. This includes but is not limited to loss of revenue, loss of
            data, or damage to property arising from events booked through the platform.
          </p>
          <p>
            Our total liability to you for any direct damages will not exceed NZD $100.
          </p>
        </Section>

        <Section title="9. Changes to the Service">
          <p>
            We may modify, suspend, or discontinue The Circle at any time without notice. We may also update
            these Terms — when we do, we will update the "Last updated" date above. Continued use after changes
            are posted constitutes your acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="10. Contact">
          <p>
            Questions about these Terms? Contact us at:
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
          <Link href="/privacy" className="text-gold hover:underline">Privacy Policy →</Link>
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
