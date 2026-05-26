export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'
import { sendVendorOpportunity } from '@/lib/email'
import { Vendor, Enquiry } from '@/lib/types'

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req)
  if (deny) return deny

  let body: { enquiry_id: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { enquiry_id } = body
  if (!enquiry_id) {
    return NextResponse.json({ error: 'enquiry_id is required.' }, { status: 400 })
  }

  // ── Fetch the enquiry ────────────────────────────────────────────────────────
  const { data: enquiry, error: eErr } = await supabaseAdmin
    .from('enquiries')
    .select('*')
    .eq('id', enquiry_id)
    .single()

  if (eErr || !enquiry) {
    return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 })
  }

  // ── Determine which vendors to notify ───────────────────────────────────────
  const briefSlugs: string[] = Array.isArray(enquiry.brief_vendors)
    ? enquiry.brief_vendors.map((v: any) => v?.slug).filter(Boolean)
    : []

  let vendorsToNotify: Vendor[] = []

  if (briefSlugs.length > 0) {
    // Customer shortlisted specific vendors → email only them
    const { data, error } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .in('slug', briefSlugs)

    if (error) {
      console.error('[OCM] resend-enquiry: vendor lookup error:', error)
      return NextResponse.json({ error: 'Database error fetching vendors.' }, { status: 500 })
    }
    vendorsToNotify = (data as Vendor[]) ?? []
  } else {
    // No shortlist → all active + available vendors in matching categories
    const { data, error } = await supabaseAdmin
      .from('vendors')
      .select('*')
      .eq('is_active', true)
      .eq('is_available', true)
      .in('category', enquiry.vendor_types ?? [])

    if (error) {
      console.error('[OCM] resend-enquiry: vendor lookup error:', error)
      return NextResponse.json({ error: 'Database error fetching vendors.' }, { status: 500 })
    }
    vendorsToNotify = (data as Vendor[]) ?? []
  }

  const vendorsWithEmail    = vendorsToNotify.filter(v => v.email)
  const vendorsWithoutEmail = vendorsToNotify.filter(v => !v.email)

  // ── Diagnostic: no vendors matched at all ───────────────────────────────────
  if (vendorsToNotify.length === 0) {
    return NextResponse.json({
      sent: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      message: briefSlugs.length > 0
        ? 'None of the shortlisted vendors were found (check slugs are correct and vendors are active).'
        : `No active + available vendors found matching categories: ${(enquiry.vendor_types ?? []).join(', ')}. Check vendor is_active and is_available flags in Supabase, and that the category values match exactly.`,
    })
  }

  // ── Diagnostic: vendors found but none have email ───────────────────────────
  if (vendorsWithEmail.length === 0) {
    return NextResponse.json({
      sent: 0,
      failed: 0,
      skipped: vendorsWithoutEmail.length,
      total: vendorsToNotify.length,
      message: `${vendorsToNotify.length} vendor(s) matched but none have an email address stored. ` +
        `Check the "email" column exists in the vendors table (run add-application-generated-fields.sql migration if not) ` +
        `and that each vendor row has a value in that column.`,
    })
  }

  // ── Send emails ──────────────────────────────────────────────────────────────
  const results = await Promise.allSettled(
    vendorsWithEmail.map(v => sendVendorOpportunity(v, enquiry as Enquiry))
  )

  const succeeded = results.filter(r => r.status === 'fulfilled').length
  const failed    = results.filter(r => r.status === 'rejected').length

  if (failed > 0) {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`[OCM] resend-enquiry: failed to notify "${vendorsWithEmail[i]?.name}":`, r.reason)
      }
    })
  }

  // ── Update enquiry status ────────────────────────────────────────────────────
  if (succeeded > 0) {
    await supabaseAdmin
      .from('enquiries')
      .update({ status: 'sent_to_vendors' })
      .eq('id', enquiry_id)
  }

  return NextResponse.json({
    sent: succeeded,
    failed,
    skipped: vendorsWithoutEmail.length,
    total: vendorsToNotify.length,
    message: `Sent to ${succeeded} vendor${succeeded !== 1 ? 's' : ''}` +
      (vendorsWithoutEmail.length > 0 ? `, skipped ${vendorsWithoutEmail.length} (no email)` : '') +
      (failed > 0 ? `, ${failed} failed` : '') + '.',
  })
}
