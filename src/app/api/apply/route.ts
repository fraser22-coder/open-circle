import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendApplicationConfirmation } from '@/lib/email'

// ── Helpers ──────────────────────────────────────────────────────────────────

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

  if (!res.ok) throw new Error('Claude API call failed')
  const data = await res.json()
  const text = data.content?.[0]?.text ?? ''
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const business_name = formData.get('business_name') as string
  const contact_name  = formData.get('contact_name')  as string
  const email         = formData.get('email')         as string
  const phone         = formData.get('phone')         as string
  const category      = formData.get('category')      as string
  const description   = formData.get('description')   as string
  const location      = formData.get('location')      as string
  const price_range   = formData.get('price_range')   as string
  const space         = formData.get('space')         as string
  const logo          = formData.get('logo')          as File | null
  const foodPhotos    = formData.getAll('food_photos') as File[]

  if (!business_name || !contact_name || !email || !phone || !category ||
      !description || !location || !price_range || !space) {
    return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
  }
  if (!logo) {
    return NextResponse.json({ error: 'Please upload your logo.' }, { status: 400 })
  }
  if (foodPhotos.length === 0) {
    return NextResponse.json({ error: 'Please upload at least one food or product photo.' }, { status: 400 })
  }

  // ── Upload photos ─────────────────────────────────────────────────────────
  const safeEmail = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
  const folder    = `${safeEmail}-${Date.now()}`
  const BUCKET    = 'vendor-applications'

  const logoExt    = logo.name.split('.').pop()?.toLowerCase() || 'jpg'
  const logoPath   = `${folder}/logo.${logoExt}`
  const logoBuffer = Buffer.from(await logo.arrayBuffer())

  const { error: logoError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(logoPath, logoBuffer, { contentType: logo.type, upsert: false })

  if (logoError) {
    console.error('Logo upload error:', logoError)
    return NextResponse.json({ error: 'Failed to upload logo. Please try again.' }, { status: 500 })
  }

  const { data: { publicUrl: logoUrl } } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(logoPath)

  const foodPhotoUrls: string[] = []
  for (let i = 0; i < foodPhotos.length; i++) {
    const photo       = foodPhotos[i]
    const photoExt    = photo.name.split('.').pop()?.toLowerCase() || 'jpg'
    const photoPath   = `${folder}/food-${i + 1}.${photoExt}`
    const photoBuffer = Buffer.from(await photo.arrayBuffer())
    const { error: photoError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(photoPath, photoBuffer, { contentType: photo.type, upsert: false })
    if (!photoError) {
      const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(photoPath)
      foodPhotoUrls.push(publicUrl)
    }
  }

  // ── Save application ──────────────────────────────────────────────────────
  const { data: application, error: appError } = await supabaseAdmin
    .from('vendor_applications')
    .insert({
      business_name:   business_name.trim(),
      contact_name:    contact_name.trim(),
      email:           email.trim().toLowerCase(),
      phone:           phone.trim(),
      category,
      description:     description.trim(),
      location:        location.trim(),
      price_range:     price_range.trim(),
      space,
      logo_url:        logoUrl,
      food_photo_urls: foodPhotoUrls,
      status:          'pending',
    })
    .select('id')
    .single()

  if (appError) {
    console.error('Application insert error:', appError)
    return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
  }

  // ── Send confirmation email ───────────────────────────────────────────────
  await sendApplicationConfirmation({
    email:         email.trim().toLowerCase(),
    business_name: business_name.trim(),
    contact_name:  contact_name.trim(),
  }).catch(err => console.error('Confirmation email failed:', err))

  // ── Generate profile with Claude + save to application record ─────────────
  // NOTE: We do NOT insert into the vendors table here.
  // The vendor row is only created when Fraser approves in the admin review.
  try {
    const profile = await generateVendorProfile({
      business_name: business_name.trim(),
      category,
      location:      location.trim(),
      price_range:   price_range.trim(),
      space,
      description:   description.trim(),
    })

    await supabaseAdmin
      .from('vendor_applications')
      .update({
        generated_name:        profile.name,
        generated_description: profile.description,
        generated_tagline:     profile.tagline,
        generated_price_range: profile.price_range,
      })
      .eq('id', application.id)

  } catch (err) {
    // Non-fatal — application is saved and confirmation email sent.
    // Fraser will see it in the admin panel without a generated preview.
    console.error('Claude profile generation failed:', err)
  }

  return NextResponse.json({ success: true })
}
