import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'
import { sendApplicationApproved, sendApplicationDenied } from '@/lib/email'

export async function POST(req: NextRequest) {
  const unauthed = requireAdmin(req)
  if (unauthed) return unauthed

  const { vendor_id, action } = await req.json()

  if (!vendor_id || !['approve', 'deny'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Fetch the vendor + linked application in one go
  const { data: vendor, error: fetchError } = await supabaseAdmin
    .from('vendors')
    .select('id, name, slug, application_id')
    .eq('id', vendor_id)
    .single()

  if (fetchError || !vendor) {
    return NextResponse.json({ error: 'Vendor not found.' }, { status: 404 })
  }

  // Fetch applicant details from vendor_applications
  let applicantEmail = ''
  let contactName = ''
  if (vendor.application_id) {
    const { data: application } = await supabaseAdmin
      .from('vendor_applications')
      .select('email, contact_name')
      .eq('id', vendor.application_id)
      .single()
    applicantEmail = application?.email ?? ''
    contactName    = application?.contact_name ?? ''
  }

  // ── Approve ───────────────────────────────────────────────────────────────
  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('vendors')
      .update({
        is_active:     true,
        review_status: 'approved',
        email:         applicantEmail || null,
      })
      .eq('id', vendor_id)

    if (error) {
      console.error('Approve error:', error)
      return NextResponse.json({ error: 'Failed to approve vendor.' }, { status: 500 })
    }

    if (vendor.application_id) {
      await supabaseAdmin
        .from('vendor_applications')
        .update({ status: 'approved' })
        .eq('id', vendor.application_id)
    }

    if (applicantEmail) {
      await sendApplicationApproved({
        email:         applicantEmail,
        business_name: vendor.name,
        contact_name:  contactName,
        slug:          vendor.slug,
      }).catch(err => console.error('Approval email failed:', err))
    }

    return NextResponse.json({ success: true, message: 'Vendor is now live.' })
  }

  // ── Deny ──────────────────────────────────────────────────────────────────
  const { error } = await supabaseAdmin
    .from('vendors')
    .update({ review_status: 'rejected' })
    .eq('id', vendor_id)

  if (error) {
    console.error('Deny error:', error)
    return NextResponse.json({ error: 'Failed to deny vendor.' }, { status: 500 })
  }

  if (vendor.application_id) {
    await supabaseAdmin
      .from('vendor_applications')
      .update({ status: 'rejected' })
      .eq('id', vendor.application_id)
  }

  if (applicantEmail) {
    await sendApplicationDenied({
      email:         applicantEmail,
      business_name: vendor.name,
      contact_name:  contactName,
    }).catch(err => console.error('Denial email failed:', err))
  }

  return NextResponse.json({ success: true, message: 'Vendor archived.' })
}
