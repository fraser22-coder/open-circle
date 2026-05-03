export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const deny = requireAdmin(req)
  if (deny) return deny

  const { data, error } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const deny = requireAdmin(req)
  if (deny) return deny

  const body = await req.json()
  const { data, error } = await supabaseAdmin.from('vendors').insert(body).select().single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  const deny = requireAdmin(req)
  if (deny) return deny

  const body = await req.json()
  const { id, ...updates } = body
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('vendors')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json(data)
}
