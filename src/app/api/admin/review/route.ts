import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendApplicationApproved, sendApplicationDenied } from '@/lib/email'

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function POST(req: NextRequest) {
  const unauthed = requireAdmin(req)
  if (unauthed) return unauthed

  const { application_id, action } = await req.json()

  if (!application_id || !['approve', 'deny'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Fetch the application
  const { data: application, error: fetchError } = await supabaseAdmin
    .from('vendor_applications')
    .select('*')
    .eq('id', application_id)
    .single()

  if (fetchError || !application) {
    return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  }

  // ── Approve: create the vendor record for the first time ─────────────────
  if (action === 'approve') {
    const vendorName = application.generated_name || application.business_name
    const slug = slugify(vendorName)

    const { data: vendor, error: vendorError } = await supabaseAdmin
      .from('vendors')
      .insert({
        name:            vendorName,
        slug,
        category:        application.category,
        description:     application.generated_description || application.description,
        tagline:         application.generated_tagline     || null,
        location:        application.location,
        price_range:     application.generated_price_range || application.price_range,
        space:           application.space,
        logo_url:        application.logo_url,
        food_photo_urls: application.food_photo_urls,
        email:           application.email,
        is_active:       true,
        is_available:    false,
        is_beta:         false,
        review_status:   'approved',
        application_id:  application.id,
      })
      .select('id, slug')
      .single()

    if (vendorError) {
      console.error('Vendor insert error:', vendorError)
      return NextResponse.json({ error: 'Failed to create vendor profile.' }, { status: 500 })
    }

    await supabaseAdmin
      .from('vendor_applications')
      .update({ status: 'approved' })
      .eq('id', application_id)

    await sendApplicationApproved({
      email:         application.email,
      business_name: vendorName,
      contact_name:  application.contact_name,
      slug:          vendor.slug,
    }).catch(err => console.error('Approval email failed:', err))

    return NextResponse.json({ success: true, message: 'Vendor is now live.' })
  }

  // ── Deny: just update the application status ──────────────────────────────
  await supabaseAdmin
    .from('vendor_applications')
    .update({ status: 'rejected' })
    .eq('id', application_id)

  await sendApplicationDenied({
    email:         application.email,
    business_name: application.generated_name || application.business_name,
    contact_name:  application.contact_name,
  }).catch(err => console.error('Denial email failed:', err))

  return NextResponse.json({ success: true, message: 'Application rejected.' })
}
