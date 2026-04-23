import { NextRequest, NextResponse } from 'next/server'

// ── Bad bot / scanner user-agent patterns ──────────────────────────────────
const BAD_UA_PATTERNS = [
  /sqlmap/i, /nikto/i, /nessus/i, /masscan/i, /zgrab/i,
  /python-requests/i, /go-http-client/i, /curl\//i,
  /wget\//i, /libwww-perl/i, /scrapy/i, /dirbuster/i,
  /nuclei/i, /nmap/i, /metasploit/i,
]

// ── Paths that should never be publicly accessible ─────────────────────────
const BLOCKED_PATHS = [
  /^\/\.env/i, /^\/wp-/i, /^\/wp\//i, /^\/phpmyadmin/i,
  /^\/admin\/php/i, /^\/shell/i, /^\/xmlrpc/i,
  /\.php$/i, /\.asp$/i, /\.aspx$/i, /\.jsp$/i,
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ua = req.headers.get('user-agent') ?? ''

  // Block scanner paths immediately
  if (BLOCKED_PATHS.some(p => p.test(pathname))) {
    return new NextResponse(null, { status: 404 })
  }

  // Block known bad user agents
  if (BAD_UA_PATTERNS.some(p => p.test(ua))) {
    return new NextResponse(null, { status: 403 })
  }

  const res = NextResponse.next()

  // ── Security headers ────────────────────────────────────────────────────────
  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff')

  // Referrer policy
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy — disable unused browser features
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=()'
  )

  // HSTS — tell browsers to always use HTTPS (1 year)
  res.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  )

  // Content Security Policy
  // Adjust if you add third-party scripts/fonts
  res.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",   // Next.js requires these
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.supabase.co https://supabase.co",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "font-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  )

  return res
}

export const config = {
  // Run on everything except Next.js internals and static files
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)).*)',
  ],
}
