import type { Metadata } from "next"

const SITE_NAME = "AtticCleaning.com"
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://atticcleaning.com"

export function buildMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const url = `${BASE_URL}${path}`

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
    },
    twitter: {
      card: "summary",
      title,
      description,
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
    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.latitude,
      longitude: listing.longitude,
    },
  }
}
