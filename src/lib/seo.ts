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

/* ------------------------------------------------------------------ */
/*  Organization schema — used in root layout (site-wide)             */
/* ------------------------------------------------------------------ */

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/images/professional-attic-cleaning-insulation-removal-service.webp`,
    description:
      "Search and compare attic cleaning specialists near you. Browse ratings, reviews, and service tags for insulation removal, rodent cleanup, decontamination, and more.",
    sameAs: [],
  }
}

/* ------------------------------------------------------------------ */
/*  WebSite schema with SearchAction — homepage only                  */
/* ------------------------------------------------------------------ */

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

/* ------------------------------------------------------------------ */
/*  BreadcrumbList schema                                             */
/* ------------------------------------------------------------------ */

interface BreadcrumbItem {
  name: string
  path: string
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: `${BASE_URL}${item.path}`,
      })),
    ],
  }
}

/* ------------------------------------------------------------------ */
/*  LocalBusiness schema — listing detail pages                       */
/* ------------------------------------------------------------------ */

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
  workingHours?: { day: string; time: string }[] | null
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
    ...(listing.workingHours && listing.workingHours.length > 0
      ? {
          openingHoursSpecification: listing.workingHours.map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: h.day,
            opens: parseTimeRange(h.time)?.opens ?? "",
            closes: parseTimeRange(h.time)?.closes ?? "",
          })),
        }
      : {}),
  }
}

function parseTimeRange(
  time: string
): { opens: string; closes: string } | null {
  // Try to parse "9:00 AM - 5:00 PM" or "9:00-17:00" style strings
  const match = time.match(
    /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*[-–]\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
  )
  if (!match) return null
  return { opens: match[1].trim(), closes: match[2].trim() }
}

/* ------------------------------------------------------------------ */
/*  Article schema — article detail pages                             */
/* ------------------------------------------------------------------ */

interface ArticleJsonLdInput {
  title: string
  excerpt: string
  slug: string
  publishedAt: string
  heroImage?: string
}

export function buildArticleJsonLd(article: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/articles/${article.slug}`,
    },
    ...(article.heroImage
      ? { image: `${BASE_URL}${article.heroImage}` }
      : {}),
  }
}

/* ------------------------------------------------------------------ */
/*  CollectionPage schema — articles index                            */
/* ------------------------------------------------------------------ */

export function buildCollectionPageJsonLd(
  articles: { title: string; slug: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Attic Cleaning Articles & Guides",
    description:
      "Expert guides on attic cleaning, insulation removal, rodent cleanup, mold remediation, and more.",
    url: `${BASE_URL}/articles`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${BASE_URL}/articles/${article.slug}`,
        name: article.title,
      })),
    },
  }
}

/* ------------------------------------------------------------------ */
/*  ItemList schema — city pages (list of businesses)                 */
/* ------------------------------------------------------------------ */

interface CityListingItem {
  name: string
  citySlug: string
  companySlug: string
}

export function buildCityItemListJsonLd(
  cityName: string,
  state: string,
  listings: CityListingItem[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Attic Cleaning Companies in ${cityName}, ${state}`,
    itemListElement: listings.map((listing, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/${listing.citySlug}/${listing.companySlug}`,
      name: listing.name,
    })),
  }
}

/* ------------------------------------------------------------------ */
/*  Listicle ItemList schema — listicle articles                      */
/* ------------------------------------------------------------------ */

interface ListicleItem {
  name: string
  citySlug: string
  companySlug: string
  position: number
}

export function buildListicleJsonLd(
  title: string,
  slug: string,
  items: ListicleItem[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: `${BASE_URL}/articles/${slug}`,
    numberOfItems: items.length,
    itemListElement: items.map((item) => ({
      "@type": "ListItem",
      position: item.position,
      item: {
        "@type": "LocalBusiness",
        name: item.name,
        url: `${BASE_URL}/${item.citySlug}/${item.companySlug}`,
      },
    })),
  }
}

/* ------------------------------------------------------------------ */
/*  FAQPage schema — articles with FAQ sections                       */
/* ------------------------------------------------------------------ */

export function buildFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
