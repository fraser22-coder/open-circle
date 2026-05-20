/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Cache transformed images for 30 days (default is 60 seconds).
    // Vendor photos rarely change — this kills most of the transformation
    // and cache-write usage on Vercel's free tier.
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Disable the X-Powered-By header (don't advertise Next.js)
  poweredByHeader: false,
  // Strict mode for React — catches potential issues early
  reactStrictMode: true,
  // Block direct access to source maps in production
  productionBrowserSourceMaps: false,
  // Additional security headers (supplements the middleware)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        // Never cache API responses in the browser
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
        ],
      },
    ]
  },
}
export default nextConfig
