export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEnquiryConfirmation, sendAdminAlert, sendVendorOpportunity } from '@/lib/email'
import { Enquiry, Vendor } from '@/lib/types'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'
import {
  sanitizeString, sanitizeEmail, sanitizePhone,
  sanitizeNumber, sanitizeEnum, sanitizeEnumArray, sanitizeStringArray,
} from '@/lib/sanitize'

const VALID_OCCASIONS = [
  'Corporate Event', 'Birthday Party', 'Wedding / Engagement',
  'Market / Festival', 'Private Function', 'Other',
]
const VALID_CATEGORIES = ['food', 'drinks', 'experience', 'entertainment']
const VALID_EVENT_TYPES = ['selling', 'catering', 'both']

export async function POST(req: NextRequest) {
  // ── 1. Rate limit: 5 submissions per IP per 10 minutes ──────────────────────
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(`enquiry:${ip}`, 5, 10 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  // ── 2. Parse body ────────────────────────────────────────────────────────────
  let raw: Record<string, unknown>
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // ── 3. Honeypot check (bot trap — must be empty) ─────────────────────────────
  if (raw.website || raw.url || raw.hp) {
    // Silently accept so bots don't know they were blocked
    return NextResponse.json({ success: true })
  }

  // ── 4. Sanitize & validate all inputs ────────────────────────────────────────
  const occasion = sanitizeEnum(raw.occasion, VALID_OCCASIONS as any)
  const event_date = sanitizeString(raw.event_date, 20)
  const guest_count = sanitizeNumber(raw.guest_count, 1, 100000)
  const event_location = sanitizeString(raw.event_location, 200)
  const venue_type = sanitizeString(raw.venue_type, 100)
  const event_notes = sanitizeString(raw.event_notes, 2000)
  const vendor_types = sanitizeEnumArray(raw.vendor_types, VALID_CATEGORIES as any)
  const event_type = sanitizeEnum(raw.event_type, VALID_EVENT_TYPES as any)
  const budget = sanitizeNumber(raw.budget, 0, 100000)
  const requirements = sanitizeStringArray(raw.requirements, 20, 100)
  const vendor_notes = sanitizeString(raw.vendor_notes, 2000)
  const first_name = sanitizeString(raw.first_name, 80)
  const last_name = sanitizeString(raw.last_name, 80)
  const email = sanitizeEmail(raw.email)
  const phone = sanitizePhone(raw.phone)
  const organisation = sanitizeString(raw.organisation, 150)
  const referral_source = sanitizeString(raw.referral_source, 100)
  const brief_vendors = Array.isArray(raw.brief_vendors)
    ? (raw.brief_vendors as any[]).slice(0, 20).map(v => ({
        slug: sanitizeString(v?.slug, 80),
        name: sanitizeString(v?.name, 100),
        category: sanitizeEnum(v?.category, VALID_CATEGORIES as any) ?? '',
      })).filter(v => v.slug && v.name)
    : []

  // Required fields
  const missing: string[] = []
  if (!occasion) missing.push('occasion')
  if (!event_date || !/^\d{4}-\d{2}-\d{2}$/.test(event_date)) missing.push('event_date')
  if (!guest_count) missing.push('guest_count')
  if (!event_location) missing.push('event_location')
  if (!vendor_types.length) missing.push('vendor_types')
  if (!event_type) missing.push('event_type')
  if (!first_name) missing.push('first_name')
  if (!last_name) missing.push('last_name')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) missing.push('email')

  if (missing.length) {
    return NextResponse.json(
      { error: 'Missing required fields.', fields: missing },
      { status: 400 }
    )
  }

  // ── 5. Save to database (clean data only) ────────────────────────────────────
  try {
    const { data: enquiry, error } = await supabaseAdmin
      .from('enquiries')
      .insert({
        occasion, event_date, guest_count, event_location,
        venue_type, event_notes, vendor_types, event_type,
        budget: ['catering', 'both'].includes(event_type!) ? budget : null,
        requirements, vendor_notes,
        first_name, last_name, email, phone, organisation, referral_source,
        brief_vendors,
        status: 'new',
      })
      .select()
      .single()

    if (error) throw error

    // ── 6. Send emails ───────────────────────────────────────────────────────────
    await sendEnquiryConfirmation(enquiry as Enquiry)
    await sendAdminAlert(enquiry as Enquiry)

    // ── 7. Notify matching vendors (shortlisted first) ───────────────────────────
    const briefSlugs = brief_vendors.map(v => v.slug)

    const { data: vendors } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true)
      .in('category', vendor_types)

    if (vendors?.length) {
      const sorted = [...(vendors as Vendor[])].sort((a, b) =>
        (briefSlugs.includes(a.slug) ? 0 : 1) - (briefSlugs.includes(b.slug) ? 0 : 1)
      )
      await Promise.allSettled(sorted.map(v => sendVendorOpportunity(v, enquiry as Enquiry)))
      await supabaseAdmin.from('enquiries').update({ status: 'sent_to_vendors' }).eq('id', enquiry.id)
    }

    return NextResponse.json({ success: true, id: enquiry.id })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Failed to submit enquiry.' }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
