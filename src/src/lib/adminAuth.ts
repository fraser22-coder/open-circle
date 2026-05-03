/**
 * Server-side admin authentication helpers.
 *
 * How it works:
 *  1. Admin POSTs password to /api/admin/login
 *  2. Server checks against process.env.ADMIN_SECRET
 *  3. If valid, sets an HttpOnly Secure cookie: ocm_admin=<ADMIN_SECRET>
 *  4. Every admin API route calls requireAdmin(request) — throws 401 if not authed
 *  5. Middleware redirects /admin/* to /admin/login if cookie is missing
 *
 * The cookie is HttpOnly (JS can't read it), Secure (HTTPS only), SameSite=Strict.
 * No JWT library needed — the cookie value IS the secret, compared server-side.
 */

import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'ocm_admin'
const MAX_AGE = 60 * 60 * 8 // 8 hours

/** Returns the admin secret from env. Throws in dev if not set. */
export function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET
  if (!secret) {
    // Fail loudly during development so it's obvious
    if (process.env.NODE_ENV === 'development') {
      throw new Error('ADMIN_SECRET environment variable is not set.')
    }
    // In production, return something that will never match
    return '__unset__'
  }
  return secret
}

/** Returns true if the request has a valid admin session cookie. */
export function isAdminAuthed(req: NextRequest | Request): boolean {
  const secret = process.env.ADMIN_SECRET
  if (!secret) return false

  // NextRequest has a cookies API; plain Request uses headers
  if (req instanceof NextRequest) {
    return req.cookies.get(COOKIE_NAME)?.value === secret
  }
  const cookieHeader = (req as Request).headers.get('cookie') ?? ''
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  return match?.[1] === secret
}

/** Use in API routes — returns a 401 response if not authed, null if OK. */
export function requireAdmin(req: NextRequest | Request): NextResponse | null {
  if (!isAdminAuthed(req)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  return null
}

/** Build the Set-Cookie header value for login. */
export function buildSessionCookie(secret: string): string {
  return [
    `${COOKIE_NAME}=${secret}`,
    `Max-Age=${MAX_AGE}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    process.env.NODE_ENV === 'production' ? 'Secure' : '',
  ].filter(Boolean).join('; ')
}

/** Build the Set-Cookie header value for logout (expires immediately). */
export function buildLogoutCookie(): string {
  return `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`
}
