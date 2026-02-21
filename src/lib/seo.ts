import type { Metadata } from "next"

const SITE_NAME = "AtticCleaning.com"
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://atticcleaning.com"

const HERO_IMAGE_URL = `${BASE_URL}/images/professional-attic-cleaning-insulation-removal-service.webp`

export function buildMetadata({
  title,
  description,
  path,
  imageUrl,
}: {
  title: string
  description: string
  path: string
  imageUrl?: string
}): Metadata {
  const url = `${BASE_URL}${path}`
  const ogImage = imageUrl
    ? { url: imageUrl, alt: title }
    : {
        url: HERO_IMAGE_URL,
        width: 1376,
        height: 768,
        alt: "Professional attic cleaning technician removing old insulation and installing fresh fiberglass insulation",
      }
  const twitterImage = imageUrl || HERO_IMAGE_URL

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twitterImage],
    },
  }
}

interface LocalBusinessInput {
  name: string
  address: string
  city: { name: string; state: string }
  phone: string | null
  website: string | null
  starRating: number
  reviewCount: number
  latitude: number
  longitude: number
  imageUrl?: string
}

export function buildLocalBusinessJsonLd(listing: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address,
      addressLocality: listing.city.name,
      addressRegion: listing.city.state,
    },
    ...(listing.phone ? { telephone: listing.phone } : {}),
    ...(listing.website ? { url: listing.website } : {}),
    ...(listing.reviewCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: listing.starRating,
            reviewCount: listing.reviewCount,
          },
        }
      : {}),
    ...(listing.imageUrl ? { image: listing.imageUrl } : {}),
    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    },
  }
}
