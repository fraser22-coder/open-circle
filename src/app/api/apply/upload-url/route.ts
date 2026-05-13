import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const BUCKET = 'vendor-applications'

export async function POST(req: NextRequest) {
  let body: { email: string; submissionId: string; type: 'logo' | 'food'; index?: number; ext: string; contentType: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { email, submissionId, type, index, ext, contentType } = body
  if (!email || !submissionId || !type || !ext) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const safeEmail = email.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
  const folder    = `${safeEmail}-${submissionId}`
  const filename  = type === 'logo' ? `logo.${ext}` : `food-${(index ?? 0) + 1}.${ext}`
  const path      = `${folder}/${filename}`

  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUploadUrl(path)

  if (error || !data) {
    console.error('Failed to create signed upload URL:', error)
    return NextResponse.json({ error: 'Failed to prepare upload. Please try again.' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(path)

  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl, token: data.token })
}
