import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const unauthed = requireAdmin(req)
  if (unauthed) return unauthed

  const { data, error } = await supabaseAdmin
    .from('vendors')
    .select('id, name, category, description, tagline, location, price_range, space, logo_url, food_photo_urls, review_status, created_at')
    .eq('review_status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch pending vendors error:', error)
    return NextResponse.json({ error: 'Failed to fetch pending vendors.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
