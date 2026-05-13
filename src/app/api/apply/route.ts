import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendApplicationConfirmation } from '@/lib/email'

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

  // NOTE: AI profile generation is intentionally NOT done here to keep this
  // route fast and within Vercel's serverless timeout. Fraser can generate the
  // profile on demand from the admin review panel before approving.

  return NextResponse.json({ success: true })
}
