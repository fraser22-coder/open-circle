export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sanitizeString, sanitizeEnum } from '@/lib/sanitize'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate limit: 30 responses per vendor per hour
  const ip = getClientIp(req)
  const { allowed } = checkRateLimit(`vendor-resp:${ip}`, 30, 60 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  let raw: Record<string, unknown>
  try { raw = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const enquiry_id = sanitizeString(raw.enquiry_id, 100)
  const vendor_id = sanitizeString(raw.vendor_id, 100)
  const status = sanitizeEnum(raw.status, ['available', 'unavailable'])
  const message = sanitizeString(raw.message, 1000)

  if (!enquiry_id || !vendor_id || !status) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  // Upsert — allows a vendor to change their response
  const { data, error } = await supabaseAdmin
    .from('vendor_responses')
    .upsert(
      { enquiry_id, vendor_id, status, message, updated_at: new Date().toISOString() },
      { onConflict: 'enquiry_id,vendor_id' }
    )
    .select()
    .single()

  if (error) {
    console.error('Vendor response error:', error)
    return NextResponse.json({ error: 'Failed to save response.' }, { status: 500 })
  }

  // If vendor is available, update enquiry status to responses_received
  if (status === 'available') {
    await supabaseAdmin
      .from('enquiries')
      .update({ status: 'responses_received' })
      .eq('id', enquiry_id)
      .eq('status', 'sent_to_vendors') // only upgrade, don't downgrade
  }

  return NextResponse.json({ success: true, data })
}
