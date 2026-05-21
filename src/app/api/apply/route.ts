import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendApplicationConfirmation, sendApplicationAdminAlert } from '@/lib/email'

// Photos are uploaded directly from the browser to Supabase Storage via signed
// URLs (/api/apply/upload-url). This route only receives text fields + the
// resulting photo URLs as JSON — no files pass through Vercel.

export async function POST(req: NextRequest) {
  let body: {
    business_name: string
    contact_name: string
    email: string
    phone: string
    category: string
    description: string
    location: string
    price_range: string
    space: string
    logo_url: string
    food_photo_urls: string[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const {
    business_name, contact_name, email, phone, category,
    description, location, price_range, space,
    logo_url, food_photo_urls,
  } = body

  if (!business_name || !contact_name || !email || !phone || !category ||
      !description || !location || !price_range || !space) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }
  if (!logo_url) {
    return NextResponse.json({ error: 'Please upload your logo.' }, { status: 400 })
  }
  if (!food_photo_urls?.length) {
    return NextResponse.json({ error: 'Please upload at least one food or product photo.' }, { status: 400 })
  }

  // ── Save application ──────────────────────────────────────────────────────
  const { error: appError } = await supabaseAdmin
    .from('vendor_applications')
    .insert({
      business_name:   business_name.trim(),
      contact_name:    contact_name.trim(),
      email:           email.trim().toLowerCase(),
      phone:           phone.trim(),
      category,
      description:     description.trim(),
      location:        location.trim(),
      price_range:     price_range.trim(),
      space,
      logo_url,
      food_photo_urls,
      status: 'pending',
    })

  if (appError) {
    console.error('Application insert error:', appError)
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
  }

  // ── Send emails ───────────────────────────────────────────────────────────
  await sendApplicationConfirmation({
    email:         email.trim().toLowerCase(),
    business_name: business_name.trim(),
    contact_name:  contact_name.trim(),
  }).catch(err => console.error('Confirmation email failed:', err))

  await sendApplicationAdminAlert({
    email:         email.trim().toLowerCase(),
    business_name: business_name.trim(),
    contact_name:  contact_name.trim(),
    phone:         phone.trim(),
    category,
    location:      location.trim(),
  }).catch(err => console.error('Admin application alert failed:', err))

  // NOTE: AI profile generation happens on demand in the admin review panel.

  return NextResponse.json({ success: true })
}
