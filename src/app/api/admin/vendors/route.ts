import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const unauthed = requireAdmin(req)
  if (unauthed) return unauthed

  // Fetch pending applications that have a Claude-generated profile ready
  const { data, error } = await supabaseAdmin
    .from('vendor_applications')
    .select(`
      id, business_name, contact_name, email, category,
      description, location, price_range, space,
      logo_url, food_photo_urls, created_at,
      generated_name, generated_description,
      generated_tagline, generated_price_range
    `)
    .eq('status', 'pending')
    .not('generated_name', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch pending applications error:', error)
    return NextResponse.json({ error: 'Failed to fetch pending applications.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
