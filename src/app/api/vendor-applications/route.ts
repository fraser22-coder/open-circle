export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeEnum, sanitizeStringArray } from '@/lib/sanitize'

const VALID_CATEGORIES = ['food', 'drinks', 'experience', 'entertainment']

export async function POST(req: NextRequest) {
  // Public endpoint — no admin auth required
  let raw: Record<string, unknown>
  try { raw = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const business_name = sanitizeString(raw.business_name, 150)
  const contact_name = sanitizeString(raw.contact_name, 100)
  const email = sanitizeEmail(raw.email)
  const category = sanitizeEnum(raw.category, VALID_CATEGORIES as any)

  if (!business_name || !email || !category) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('vendor_applications')
      .insert({
        business_name,
        contact_name,
        email,
        phone: sanitizePhone(raw.phone),
        category,
        description: sanitizeString(raw.description, 2000),
        price_range: sanitizeString(raw.price_range, 100),
        space_required: sanitizeString(raw.space_required, 100),
        location: sanitizeString(raw.location, 150),
        instagram: sanitizeString(raw.instagram, 100),
        website: sanitizeString(raw.website, 200),
        why_join: sanitizeString(raw.why_join, 2000),
        suitable_for: sanitizeStringArray(raw.suitable_for, 20, 100),
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Application error:', err)
    return NextResponse.json({ error: 'Failed to submit application.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req)
  if (deny) return deny

  const { data, error } = await supabaseAdmin
    .from('vendor_applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req)
  if (deny) return deny

  let body: { id: string; status: string }
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { id, status } = body
  if (!id || !['approved', 'declined', 'pending'].includes(status)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('vendor_applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
