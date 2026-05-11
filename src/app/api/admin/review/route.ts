import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const unauthed = requireAdmin(req)
  if (unauthed) return unauthed

  const { vendor_id, action } = await req.json()

  if (!vendor_id || !['approve', 'deny'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (action === 'approve') {
    const { error } = await supabaseAdmin
      .from('vendors')
      .update({ is_active: true, review_status: 'approved' })
      .eq('id', vendor_id)

    if (error) {
      console.error('Approve error:', error)
      return NextResponse.json({ error: 'Failed to approve vendor.' }, { status: 500 })
    }

    // Mirror status on the application record
    const { data: vendor } = await supabaseAdmin
      .from('vendors')
      .select('application_id')
      .eq('id', vendor_id)
      .single()

    if (vendor?.application_id) {
      await supabaseAdmin
        .from('vendor_applications')
        .update({ status: 'approved' })
        .eq('id', vendor.application_id)
    }

    return NextResponse.json({ success: true, message: 'Vendor is now live.' })
  }

  // action === 'deny'
  const { data: vendor } = await supabaseAdmin
    .from('vendors')
    .select('application_id')
    .eq('id', vendor_id)
    .single()

  const { error } = await supabaseAdmin
    .from('vendors')
    .update({ review_status: 'rejected' })
    .eq('id', vendor_id)

  if (error) {
    console.error('Deny error:', error)
    return NextResponse.json({ error: 'Failed to deny vendor.' }, { status: 500 })
  }

  if (vendor?.application_id) {
    await supabaseAdmin
      .from('vendor_applications')
      .update({ status: 'rejected' })
      .eq('id', vendor.application_id)
  }

  return NextResponse.json({ success: true, message: 'Vendor archived.' })
}
