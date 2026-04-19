export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, error } = await supabaseAdmin
      .from('vendor_applications')
      .insert({
        business_name: body.business_name,
        contact_name: body.contact_name,
        email: body.email,
        phone: body.phone,
        category: body.category,
        description: body.description,
        price_range: body.price_range,
        space_required: body.space_required,
        location: body.location,
        instagram: body.instagram,
        website: body.website,
        why_join: body.why_join,
        suitable_for: body.suitable_for,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error('Application error:', err)
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('vendor_applications')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
