import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function generateVendorProfile(application: {
  business_name: string
  category: string
  location: string
  price_range: string
  space: string
  description: string
}): Promise<{ name: string; description: string; tagline: string; price_range: string }> {
  const prompt = `You are helping Open Circle Markets (OCM), an Auckland-based curated vendor network for private and corporate events, generate a polished vendor profile from a new application.

Application data:
- Business name: ${application.business_name}
- Category: ${application.category}
- Location: ${application.location}
- Price range (vendor's words): ${application.price_range}
- Space required: ${application.space}
- About them (vendor's words): ${application.description}

Generate a JSON object with these exact fields:
{
  "name": "The business display name — keep it as submitted unless there's a clear typo",
  "description": "2–3 sentences written in third person. Punchy, warm, and event-focused. Highlight what makes them unique and why they'd be great for a private or corporate event in Auckland.",
  "tagline": "A single short tagline under 8 words. No full stop.",
  "price_range": "A clean, formatted version of their price range (e.g. '$10–$20 per item'). Keep it brief."
}

Return ONLY valid JSON. No markdown, no explanation, just the JSON object.`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`Claude API error: ${res.status}`)
  const data = await res.json()
  const text = data.content?.[0]?.text ?? ''
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

export async function POST(req: NextRequest) {
  let body: { application_id: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { application_id } = body
  if (!application_id) {
    return NextResponse.json({ error: 'application_id is required.' }, { status: 400 })
  }

  // Fetch the application
  const { data: app, error: fetchError } = await supabaseAdmin
    .from('vendor_applications')
    .select('business_name, category, location, price_range, space, description')
    .eq('id', application_id)
    .single()

  if (fetchError || !app) {
    return NextResponse.json({ error: 'Application not found.' }, { status: 404 })
  }

  // Generate profile
  let profile: { name: string; description: string; tagline: string; price_range: string }
  try {
    profile = await generateVendorProfile(app)
  } catch (err) {
    console.error('Profile generation failed:', err)
    return NextResponse.json({ error: 'Profile generation failed. Please try again.' }, { status: 500 })
  }

  // Save back to application record
  const { error: updateError } = await supabaseAdmin
    .from('vendor_applications')
    .update({
      generated_name:        profile.name,
      generated_description: profile.description,
      generated_tagline:     profile.tagline,
      generated_price_range: profile.price_range,
    })
    .eq('id', application_id)

  if (updateError) {
    console.error('Profile update error:', updateError)
    return NextResponse.json({ error: 'Failed to save generated profile.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, profile })
}
