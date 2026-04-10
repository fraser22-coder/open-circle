import { Resend } from 'resend'
import { Enquiry, Vendor } from './types'

const resend = new Resend(process.env.RESEND_API_KEY!)
const FROM = 'Open Circle Markets <noreply@opencirclemarkets.com>'
const ADMIN_EMAIL = 'opencirclemarkets@gmail.com'

// Email to customer confirming their enquiry was received
export async function sendEnquiryConfirmation(enquiry: Enquiry) {
  await resend.emails.send({
    from: FROM,
    to: enquiry.email,
    subject: "You're in the Circle — Enquiry Received",
    html: `
      <div style="font-family:Arial,sans-serif;background:#1b1f3b;color:#fff;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
        <div style="text-align:center;margin-bottom:32px">
          <div style="display:inline-block;width:60px;height:60px;border-radius:50%;border:3px solid #f9d378;line-height:54px;font-size:24px;margin-bottom:12px">⭕</div>
          <h1 style="color:#f9d378;font-size:28px;margin:0">You're in the Circle!</h1>
        </div>
        <p style="color:#c5b098;line-height:1.7">Hi ${enquiry.first_name},</p>
        <p style="color:#c5b098;line-height:1.7">
          Your event enquiry has been received and passed on to our vendors.
          Expect to hear back with availability and quotes within <strong style="color:#f9d378">48 hours</strong>.
        </p>
        <div style="background:#303e66;border-radius:10px;padding:20px;margin:24px 0">
          <p style="color:#baa182;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin:0 0 12px">Your Enquiry Summary</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="color:#baa182;padding:6px 0;font-size:13px">Occasion</td><td style="color:#fff;font-size:13px;text-align:right">${enquiry.occasion}</td></tr>
            <tr><td style="color:#baa182;padding:6px 0;font-size:13px">Date</td><td style="color:#fff;font-size:13px;text-align:right">${enquiry.event_date}</td></tr>
            <tr><td style="color:#baa182;padding:6px 0;font-size:13px">Location</td><td style="color:#fff;font-size:13px;text-align:right">${enquiry.event_location}</td></tr>
            <tr><td style="color:#baa182;padding:6px 0;font-size:13px">Guests</td><td style="color:#fff;font-size:13px;text-align:right">${enquiry.guest_count}</td></tr>
          </table>
        </div>
        <p style="color:#c5b098;font-size:12px;margin-top:32px">— Open Circle Markets</p>
      </div>
    `
  })
}

// Email to admin about new enquiry
export async function sendAdminAlert(enquiry: Enquiry) {
  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New Circle Enquiry — ${enquiry.occasion} | ${enquiry.event_location}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#1b1f3b;color:#fff;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
        <h2 style="color:#f9d378">New Enquiry Received</h2>
        <div style="background:#303e66;border-radius:10px;padding:20px">
          <p><strong style="color:#baa182">Name:</strong> ${enquiry.first_name} ${enquiry.last_name}</p>
          <p><strong style="color:#baa182">Email:</strong> ${enquiry.email}</p>
          <p><strong style="color:#baa182">Phone:</strong> ${enquiry.phone || 'Not provided'}</p>
          <p><strong style="color:#baa182">Occasion:</strong> ${enquiry.occasion}</p>
          <p><strong style="color:#baa182">Date:</strong> ${enquiry.event_date}</p>
          <p><strong style="color:#baa182">Location:</strong> ${enquiry.event_location}</p>
          <p><strong style="color:#baa182">Guests:</strong> ${enquiry.guest_count}</p>
          <p><strong style="color:#baa182">Vendor Types:</strong> ${enquiry.vendor_types.join(', ')}</p>
          <p><strong style="color:#baa182">Event Type:</strong> ${enquiry.event_type}</p>
          ${enquiry.budget ? `<p><strong style="color:#baa182">Budget:</strong> $${enquiry.budget.toLocaleString()}</p>` : ''}
          <p><strong style="color:#baa182">Notes:</strong> ${enquiry.vendor_notes || 'None'}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin" style="display:inline-block;margin-top:20px;background:#f9d378;color:#1b1f3b;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700">View in Admin Panel</a>
      </div>
    `
  })
}

// Email to vendor about a new matched opportunity
export async function sendVendorOpportunity(vendor: Vendor, enquiry: Enquiry) {
  await resend.emails.send({
    from: FROM,
    to: vendor.user_id || ADMIN_EMAIL, // fall back to admin if no email on record
    subject: `New Event Opportunity — ${enquiry.occasion} on ${enquiry.event_date}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#1b1f3b;color:#fff;padding:40px;border-radius:12px;max-width:600px;margin:0 auto">
        <h2 style="color:#f9d378">You've got a new opportunity!</h2>
        <p style="color:#c5b098">Hi ${vendor.name}, a new event brief has come in that matches your vendor profile.</p>
        <div style="background:#303e66;border-radius:10px;padding:20px;margin:20px 0">
          <p><strong style="color:#baa182">Occasion:</strong> ${enquiry.occasion}</p>
          <p><strong style="color:#baa182">Date:</strong> ${enquiry.event_date}</p>
          <p><strong style="color:#baa182">Location:</strong> ${enquiry.event_location}</p>
          <p><strong style="color:#baa182">Guests:</strong> ${enquiry.guest_count}</p>
          <p><strong style="color:#baa182">Venue:</strong> ${enquiry.venue_type}</p>
          ${enquiry.budget ? `<p><strong style="color:#baa182">Budget:</strong> $${enquiry.budget.toLocaleString()}</p>` : ''}
          <p><strong style="color:#baa182">Notes:</strong> ${enquiry.event_notes || 'None'}</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/vendor/dashboard" style="display:inline-block;background:#f9d378;color:#1b1f3b;padding:12px 28px;border-radius:50px;text-decoration:none;font-weight:700">Respond in My Dashboard</a>
      </div>
    `
  })
}
