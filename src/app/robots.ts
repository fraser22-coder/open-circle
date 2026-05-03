import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thecircle.opencirclemarkets.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/vendor/dashboard',
          '/vendor/login',
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  }
}
