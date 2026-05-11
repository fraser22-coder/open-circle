import { Resend } from 'resend'
import { Enquiry, Vendor } from './types'
import { getVendorAgreementHtml } from './contractTemplate'

// TODO: switch back to 'Open Circle Markets <noreply@opencirclemarkets.com>' once domain is verified in Resend
const FROM = 'Open Circle Markets <onboarding@resend.dev>'
const ADMIN_EMAIL = 'opencirclemarkets@gmail.com'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://opencirclemarkets.com'
const LOGO_URL = 'https://uavytnztojbjerlopaiz.supabase.co/storage/v1/object/public/vendor-photos/Opencirclelogo-1.png'

// ── Shared helpers ────────────────────────────────────────────────────────────

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!)
}

function emailWrapper(content: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#1b1f3b;color:#fff;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
      <div style="text-align:center;margin-bottom:32px">
        <img src="${LOGO_URL}" alt="Open Circle Markets" style="height:72px;width:auto;display:block;margin:0 auto 12px" />
        <p style="color:#baa182;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0">Open Circle Markets</p>
      </div>
      ${content}
      <hr style="border:none;border-top:1px solid #303e66;margin:32px 0" />
      <p style="color:#6b7db3;font-size:11px;text-align:center;margin:0">
        Open Circle Markets · Auckland, New Zealand<br />
        <a href="mailto:${ADMIN_EMAIL}" style="color:#baa182">${ADMIN_EMAIL}</a>
      </p>
    </div>
  `
}

function goldButton(href: string, label: string) {
  return `<a href="${href}" style="display:inline-block;background:#f9d378;color:#1b1f3b;padding:13px 30px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px;margin-top:20px">${label}</a>`
}

function infoTable(rows: [string, string][]) {
  return `
    <div style="background:#303e66;border-radius:10px;padding:20px;margin:20px 0">
      <table style="width:100%;border-collapse:collapse">
        ${rows.map(([label, value]) => `
          <tr>
            <td style="color:#baa182;padding:6px 0;font-size:13px;vertical-align:top">${label}</td>
            <td style="color:#fff;font-size:13px;text-align:right;padding:6px 0">${value}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `
}

// ── Enquiry emails ────────────────────────────────────────────────────────────

/** Confirmation to customer after they submit an enquiry */
export async function sendEnquiryConfirmation(enquiry: Enquiry) {
  await getResend().emails.send({
    from: FROM,
    to: enquiry.email,
    subject: "You're in the Circle — Enquiry Received",
    html: emailWrapper(`
      <h1 style="color:#f9d378;font-size:26px;margin:0 0 16px">You're in the Circle!</h1>
      <p style="color:#c5b098;line-height:1.7">Hi ${enquiry.first_name},</p>
      <p style="color:#c5b098;line-height:1.7">
        Your event enquiry has been received and passed on to our vendors.
        Expect to hear back with availability and quotes within <strong style="color:#f9d378">48 hours</strong>.
      </p>
      ${infoTable([
        ['Occasion', enquiry.occasion],
        ['Date', enquiry.event_date],
        ['Location', enquiry.event_location],
        ['Guests', String(enquiry.guest_count)],
      ])}
      <p style="color:#c5b098;line-height:1.7;font-size:13px">
        In the meantime, feel free to browse our full vendor circle below.
      </p>
      ${goldButton(`${SITE_URL}/circle`, 'Browse the Circle →')}
    `)
  })
}

/** Alert to Fraser when a new enquiry comes in */
export async function sendAdminAlert(enquiry: Enquiry) {
  await getResend().emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Circle Enquiry — ${enquiry.occasion} | ${enquiry.event_location}`,
    html: emailWrapper(`
      <h2 style="color:#f9d378;margin:0 0 16px">New Enquiry Received</h2>
      <div style="background:#303e66;border-radius:10px;padding:20px">
        <p style="margin:0 0 8px"><strong style="color:#baa182">Name:</strong> ${enquiry.first_name} ${enquiry.last_name}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Email:</strong> ${enquiry.email}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Phone:</strong> ${enquiry.phone || 'Not provided'}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Occasion:</strong> ${enquiry.occasion}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Date:</strong> ${enquiry.event_date}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Location:</strong> ${enquiry.event_location}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Guests:</strong> ${enquiry.guest_count}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Vendor Types:</strong> ${enquiry.vendor_types.join(', ')}</p>
        <p style="margin:0 0 8px"><strong style="color:#baa182">Event Type:</strong> ${enquiry.event_type}</p>
        ${enquiry.budget ? `<p style="margin:0 0 8px"><strong style="color:#baa182">Budget:</strong> $${enquiry.budget.toLocaleString()}</p>` : ''}
        <p style="margin:0 0 8px"><strong style="color:#baa182">Notes:</strong> ${enquiry.vendor_notes || 'None'}</p>
        ${enquiry.brief_vendors?.length
          ? `<p style="margin:8px 0 0;color:#f9d378">⭐ Shortlisted: ${enquiry.brief_vendors.map(v => v.name).join(', ')}</p>`
          : ''}
      </div>
      ${goldButton(`${SITE_URL}/admin`, 'View in Admin Panel →')}
    `)
  })
}

/** Opportunity alert to a vendor about a new matched enquiry */
export async function sendVendorOpportunity(vendor: Vendor, enquiry: Enquiry) {
  const recipientEmail = vendor.email || ADMIN_EMAIL
  const isShortlisted = enquiry.brief_vendors?.some(v => v.slug === vendor.slug)

  await getResend().emails.send({
    from: FROM,
    to: recipientEmail,
    subject: `New Event Opportunity — ${enquiry.occasion} on ${enquiry.event_date}`,
    html: emailWrapper(`
      <h2 style="color:#f9d378;margin:0 0 16px">You've got a new opportunity!</h2>
      <p style="color:#c5b098;line-height:1.7">
        Hi ${vendor.name}, a new event brief has come in that matches your profile.
      </p>
      ${isShortlisted
        ? `<div style="background:#1d4731;border-radius:8px;padding:12px 16px;margin:16px 0">
             <p style="color:#b7e4c7;margin:0;font-size:13px">⭐ <strong>You were specifically shortlisted by this customer.</strong></p>
           </div>`
        : ''}
      ${infoTable([
        ['Occasion', enquiry.occasion],
        ['Date', enquiry.event_date],
        ['Location', enquiry.event_location],
        ['Guests', String(enquiry.guest_count)],
        ['Venue', enquiry.venue_type ?? '—'],
        ...(enquiry.budget ? [['Budget', `$${enquiry.budget.toLocaleString()}`] as [string, string]] : []),
      ])}
      ${enquiry.event_notes
        ? `<p style="color:#c5b098;font-size:13px;background:#252d4a;padding:12px 16px;border-radius:8px;border-left:3px solid #f9d378">
             <strong style="color:#baa182">Notes from organiser:</strong><br />${enquiry.event_notes}
           </p>`
        : ''}
      <p style="color:#c5b098;line-height:1.7;font-size:13px">
        To express your interest or get more details, reply directly to this email or contact Fraser at
        <a href="mailto:${ADMIN_EMAIL}" style="color:#f9d378">${ADMIN_EMAIL}</a>.
      </p>
    `)
  })
}

// ── Vendor application emails ─────────────────────────────────────────────────

/** Confirmation to applicant immediately after they submit */
export async function sendApplicationConfirmation(data: {
  email: string
  business_name: string
  contact_name: string
}) {
  await getResend().emails.send({
    from: FROM,
    to: data.email,
    subject: `Application Received — ${data.business_name}`,
    html: emailWrapper(`
      <h1 style="color:#f9d378;font-size:26px;margin:0 0 16px">Application Received!</h1>
      <p style="color:#c5b098;line-height:1.7">Hi ${data.contact_name},</p>
      <p style="color:#c5b098;line-height:1.7">
        Thanks for applying to join the Circle — we've received your application for
        <strong style="color:#fff">${data.business_name}</strong> and we're excited to take a look.
      </p>
      <p style="color:#c5b098;line-height:1.7">
        We personally review every application and will be in touch within
        <strong style="color:#f9d378">3–5 business days</strong>.
      </p>
      <div style="background:#252d4a;border-radius:10px;padding:16px 20px;margin:20px 0;border-left:3px solid #f9d378">
        <p style="color:#baa182;font-size:13px;margin:0 0 6px;text-transform:uppercase;letter-spacing:1px">What happens next</p>
        <p style="color:#c5b098;font-size:13px;margin:0;line-height:1.7">
          Our team will review your profile, photos, and offering. If your application is successful,
          we'll generate your vendor profile and send it to you for review before it goes live on the Circle.
        </p>
      </div>
      <p style="color:#c5b098;line-height:1.7;font-size:13px">
        Questions? Reach us at <a href="mailto:${ADMIN_EMAIL}" style="color:#f9d378">${ADMIN_EMAIL}</a>
      </p>
      ${goldButton(`${SITE_URL}/circle`, 'Browse the Circle →')}
    `)
  })
}

/** Sent to applicant when Fraser approves their profile — includes pre-filled vendor agreement */
export async function sendApplicationApproved(data: {
  email: string
  business_name: string
  contact_name: string
  slug: string
}) {
  const profileUrl = `${SITE_URL}/circle/${data.slug}`

  const contractHtml = getVendorAgreementHtml({
    vendorName:  data.business_name,
    contactName: data.contact_name,
  })

  await getResend().emails.send({
    from: FROM,
    to: data.email,
    subject: `Welcome to the Circle, ${data.business_name}! 🎉`,
    html: emailWrapper(`
      <h1 style="color:#f9d378;font-size:26px;margin:0 0 16px">Welcome to the Circle!</h1>
      <p style="color:#c5b098;line-height:1.7">Hi ${data.contact_name},</p>
      <p style="color:#c5b098;line-height:1.7">
        Great news — <strong style="color:#fff">${data.business_name}</strong> has been approved
        and your profile is now <strong style="color:#f9d378">live on the Circle</strong>. 🎉
      </p>
      <div style="background:#1d4731;border-radius:10px;padding:16px 20px;margin:20px 0">
        <p style="color:#b7e4c7;font-size:13px;margin:0;line-height:1.7">
          ✓ Your profile is live and visible to event organisers across Auckland.
        </p>
      </div>
      <div style="background:#252d4a;border-radius:10px;padding:16px 20px;margin:20px 0;border-left:3px solid #f9d378">
        <p style="color:#baa182;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">What happens next</p>
        <p style="color:#c5b098;font-size:13px;margin:0;line-height:1.7">
          When an event organiser submits an enquiry that matches your category, you'll receive
          an email notification with the event details. Reply to express your interest and we'll
          take it from there.
        </p>
      </div>
      <div style="background:#2a3356;border-radius:10px;padding:16px 20px;margin:20px 0;border:1px solid #f9d378">
        <p style="color:#f9d378;font-size:13px;font-weight:700;margin:0 0 6px">📄 Vendor Agreement attached</p>
        <p style="color:#c5b098;font-size:13px;margin:0;line-height:1.7">
          Your Vendor Agreement is attached to this email with your details pre-filled.
          Please open it, print or save as PDF, sign it, and reply to this email with the signed copy.
          The remaining yellow fields (your address and our signature) will be completed on our end.
        </p>
      </div>
      <p style="color:#c5b098;line-height:1.7;font-size:13px">
        Any questions? Get in touch at <a href="mailto:${ADMIN_EMAIL}" style="color:#f9d378">${ADMIN_EMAIL}</a>
      </p>
      ${goldButton(profileUrl, 'View Your Profile →')}
    `),
    attachments: [
      {
        filename: `OCM-Vendor-Agreement-${data.business_name.replace(/[^a-z0-9]/gi, '-')}.html`,
        content: Buffer.from(contractHtml, 'utf-8').toString('base64'),
      },
    ],
  })
}

/** Sent to applicant when Fraser denies their application */
export async function sendApplicationDenied(data: {
  email: string
  business_name: string
  contact_name: string
}) {
  await getResend().emails.send({
    from: FROM,
    to: data.email,
    subject: `Your Open Circle Markets Application — ${data.business_name}`,
    html: emailWrapper(`
      <h1 style="color:#f9d378;font-size:26px;margin:0 0 16px">Thanks for Applying</h1>
      <p style="color:#c5b098;line-height:1.7">Hi ${data.contact_name},</p>
      <p style="color:#c5b098;line-height:1.7">
        Thank you for your interest in joining the Circle and for taking the time to apply on behalf of
        <strong style="color:#fff">${data.business_name}</strong>.
      </p>
      <p style="color:#c5b098;line-height:1.7">
        After careful review, we've decided not to move forward with your application at this stage.
        Our network is carefully curated to ensure every event we work on is the right fit for everyone
        involved — this decision doesn't reflect on the quality of your offering.
      </p>
      <div style="background:#252d4a;border-radius:10px;padding:16px 20px;margin:20px 0;border-left:3px solid #3c4f80">
        <p style="color:#c5b098;font-size:13px;margin:0;line-height:1.7">
          You're welcome to reapply in the future as our network grows and new opportunities arise.
          If you'd like more specific feedback, feel free to reply to this email and we'll do our best
          to help.
        </p>
      </div>
      <p style="color:#c5b098;line-height:1.7;font-size:13px">
        We wish you all the best with your business — thank you again for your interest in Open Circle Markets.
      </p>
      <p style="color:#c5b098;line-height:1.7;font-size:13px">— Fraser &amp; the OCM Team</p>
    `)
  })
}
