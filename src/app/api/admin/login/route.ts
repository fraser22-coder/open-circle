import { NextRequest, NextResponse } from 'next/server'
import { getAdminSecret, buildSessionCookie } from '@/lib/adminAuth'
import { checkRateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  // Rate-limit login attempts: 10 per IP per 15 minutes
  const ip = getClientIp(req)
  const { allowed, retryAfter } = checkRateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many attempts. Try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    )
  }

  let password: string
  try {
    const body = await req.json()
    password = body.password ?? ''
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const secret = getAdminSecret()
  if (!password || password !== secret) {
    // Artificial delay to slow down brute force (even with rate limiting)
    await new Promise(r => setTimeout(r, 400))
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.headers.set('Set-Cookie', buildSessionCookie(secret))
  return res
}
