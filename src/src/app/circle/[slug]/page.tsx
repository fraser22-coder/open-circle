import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { Vendor } from '@/lib/types'
import VendorProfileClient from './VendorProfileClient'

interface Props {
  params: { slug: string }
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thecircle.opencirclemarkets.com'

async function getVendor(slug: string): Promise<Vendor | null> {
  const { data } = await supabaseAdmin
    .from('vendors')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vendor = await getVendor(params.slug)
  if (!vendor) return { title: 'Vendor Not Found' }

  const title = `${vendor.name} — Open Circle Markets`
  const description = vendor.description
    ? vendor.description.slice(0, 155)
    : `${vendor.name} is a curated vendor on Open Circle Markets, available for private and corporate events in Auckland.`
  const image = vendor.photos?.[0] ?? undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/circle/${vendor.slug}`,
      images: image ? [{ url: image, width: 1200, height: 630, alt: vendor.name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [],
    },
  }
}

function buildJsonLd(vendor: Vendor) {
  const categoryMap: Record<string, string> = {
    food: 'FoodEstablishment',
    drinks: 'BarOrPub',
    entertainment: 'EntertainmentBusiness',
    experience: 'LocalBusiness',
  }
  const type = categoryMap[vendor.category] ?? 'LocalBusiness'

  return {
    '@context': 'https://schema.org',
    '@type': type,
    name: vendor.name,
    description: vendor.description ?? undefined,
    url: `${BASE_URL}/circle/${vendor.slug}`,
    image: vendor.photos?.[0] ?? undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Auckland',
      addressCountry: 'NZ',
    },
    areaServed: {
      '@type': 'City',
      name: 'Auckland',
    },
    ...(vendor.instagram ? { sameAs: [`https://instagram.com/${vendor.instagram.replace(/^@/, '')}`] } : {}),
    ...(vendor.website ? { url: vendor.website } : {}),
  }
}

export default async function VendorProfilePage({ params }: Props) {
  const vendor = await getVendor(params.slug)
  if (!vendor) notFound()

  const jsonLd = buildJsonLd(vendor)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VendorProfileClient vendor={vendor} />
    </>
  )
}
