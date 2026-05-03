import { MetadataRoute } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thecircle.opencirclemarkets.com'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/circle`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/book`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/join`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Dynamic vendor pages
  let vendorPages: MetadataRoute.Sitemap = []
  try {
    const { data: vendors } = await supabaseAdmin
      .from('vendors')
      .select('slug, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })

    if (vendors) {
      vendorPages = vendors.map(v => ({
        url: `${base}/circle/${v.slug}`,
        lastModified: new Date(v.updated_at ?? Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
    }
  } catch {
    // silently fail — don't break the sitemap if DB is unavailable
  }

  return [...staticPages, ...vendorPages]
}
