import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { business_name, contact_name, email, phone, category, description, website, instagram } = body

  if (!business_name || !contact_name || !email || !phone || !category || !description) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }

  const { error } = await supabase.from('vendor_applications').insert({
    business_name: business_name.trim(),
    contact_name: contact_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    category,
    description: description.trim(),
    website: website?.trim() || null,
    instagram: instagram?.trim() || null,
    status: 'pending',
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
