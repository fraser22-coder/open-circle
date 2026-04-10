import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEnquiryConfirmation, sendAdminAlert, sendVendorOpportunity } from '@/lib/email'
import { Enquiry, Vendor } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // 1. Save enquiry to database
    const { data: enquiry, error } = await supabaseAdmin
      .from('enquiries')
      .insert({ ...body, status: 'new' })
      .select()
      .single()

    if (error) throw error

    // 2. Send confirmation email to customer
    await sendEnquiryConfirmation(enquiry as Enquiry)

    // 3. Alert admin
    await sendAdminAlert(enquiry as Enquiry)

    // 4. Find matching vendors and notify them
    const { data: vendors } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true)
      .in('category', body.vendor_types)

    if (vendors?.length) {
      await Promise.allSettled(
        (vendors as Vendor[]).map(v => sendVendorOpportunity(v, enquiry as Enquiry))
      )

      // 5. Mark enquiry as sent
      await supabaseAdmin
        .from('enquiries')
        .update({ status: 'sent_to_vendors' })
        .eq('id', enquiry.id)
    }

    return NextResponse.json({ success: true, id: enquiry.id })
  } catch (err) {
    console.error('Enquiry error:', err)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}

export async function GET() {
  // Admin only — returns all enquiries
  const { data, error } = await supabaseAdmin
    .from('enquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
