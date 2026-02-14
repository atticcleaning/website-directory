import { cache } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { Phone, ExternalLink } from "lucide-react"
import StarRating from "@/components/star-rating"
import ServiceTagChip from "@/components/service-tag-chip"
import GoogleMap from "@/components/google-map"
import prisma from "@/lib/prisma"
import { buildMetadata, buildLocalBusinessJsonLd } from "@/lib/seo"

const getListing = cache(async function getListing(citySlug: string, companySlug: string) {
  return prisma.listing.findFirst({
    where: {
      slug: companySlug,
      city: { slug: citySlug },
    },
    include: {
      city: true,
      reviews: { orderBy: { publishedAt: "desc" } },
      serviceTags: true,
    },
  })
})

// At scale (1000+ listings), consider batching or using ISR instead of full SSG.
export async function generateStaticParams() {
  const listings = await prisma.listing.findMany({
    select: {
      slug: true,
      city: { select: { slug: true } },
    },
  })
  return listings.map((listing) => ({
    citySlug: listing.city.slug,
    companySlug: listing.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string; companySlug: string }>
}): Promise<Metadata> {
  const { citySlug, companySlug } = await params
  const listing = await getListing(citySlug, companySlug)

  if (!listing) {
    return { title: "Listing Not Found | AtticCleaning.com", robots: { index: false } }
  }

  const services = listing.serviceTags
    .map((t) => t.serviceType.replace(/_/g, " ").toLowerCase())
    .slice(0, 3)
    .join(", ")

  return buildMetadata({
    title: `${listing.name} - Attic Cleaning in ${listing.city.name}, ${listing.city.state}`,
    description: `${listing.name} in ${listing.city.name}, ${listing.city.state}. Rated ${listing.starRating} stars from ${listing.reviewCount} reviews. Services: ${services}.`,
    path: `/${citySlug}/${companySlug}`,
  })
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

function parseWorkingHours(hours: string | null): { day: string; time: string }[] | string | null {
  if (!hours) return null
  try {
    const parsed = JSON.parse(hours)
    if (Array.isArray(parsed)) {
      return parsed as { day: string; time: string }[]
    }
    if (typeof parsed === "object" && parsed !== null) {
      return Object.entries(parsed).map(([day, time]) => ({ day, time: String(time) }))
    }
    return hours
  } catch {
    return hours
  }
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ citySlug: string; companySlug: string }>
}) {
  const { citySlug, companySlug } = await params
  const listing = await getListing(citySlug, companySlug)

  if (!listing) {
    notFound()
  }

  const hasContact = listing.phone || listing.website
  const workingHours = parseWorkingHours(listing.workingHours)
  const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY ?? ""

  const jsonLd = buildLocalBusinessJsonLd({
    name: listing.name,
    address: listing.address,
    city: listing.city,
    phone: listing.phone,
    website: listing.website,
    starRating: listing.starRating,
    reviewCount: listing.reviewCount,
    latitude: listing.latitude,
    longitude: listing.longitude,
  })

  return (
    <div className="mx-auto max-w-[800px] py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Company Name */}
      <h1 className="font-sans text-2xl font-bold text-foreground md:text-[2rem]">
        {listing.name}
      </h1>

      {/* Star Rating */}
      <div className="mt-2">
        <StarRating
          rating={listing.starRating}
          reviewCount={listing.reviewCount}
          variant="full"
        />
      </div>

      {/* Service Tags */}
      {listing.serviceTags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {listing.serviceTags.map((tag) => (
            <ServiceTagChip
              key={tag.id}
              serviceType={tag.serviceType}
              variant="card"
            />
          ))}
        </div>
      )}

      {/* Contact Section */}
      {hasContact && (
        <div className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
            Contact
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            {listing.phone && (
              <a
                href={`tel:${listing.phone.replace(/[^\d+]/g, "")}`}
                aria-label={`Call ${listing.name}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-sm font-medium text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {listing.phone}
              </a>
            )}
            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener"
                aria-label={`Visit ${listing.name} website`}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-sm font-medium text-primary"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      )}

      {/* Address */}
      <div className="mt-8">
        <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
          Location
        </h2>
        <p className="mt-3 font-sans text-sm text-foreground">
          {listing.address}
        </p>

        {/* Google Maps Embed */}
        <div className="mt-4">
          <GoogleMap
            latitude={listing.latitude}
            longitude={listing.longitude}
            address={listing.address}
            companyName={listing.name}
            apiKey={mapsApiKey}
          />
        </div>
      </div>

      {/* Business Hours */}
      {workingHours && (
        <div className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
            Business Hours
          </h2>
          {typeof workingHours === "string" ? (
            <p className="mt-3 font-sans text-sm text-foreground whitespace-pre-line">
              {workingHours}
            </p>
          ) : (
            <dl className="mt-3 space-y-1">
              {workingHours.map(({ day, time }) => (
                <div key={day} className="flex gap-2 font-sans text-sm">
                  <dt className="w-28 font-medium text-foreground">{day}</dt>
                  <dd className="text-muted-foreground">{time}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* Reviews */}
      {listing.reviews.length > 0 && (
        <div className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
            Reviews
          </h2>
          <div className="mt-4 space-y-4">
            {listing.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-border bg-card p-3 md:p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-sans text-sm font-medium text-foreground">
                    {review.authorName}
                  </span>
                  <time
                    dateTime={review.publishedAt.toISOString()}
                    className="font-sans text-xs text-muted-foreground"
                  >
                    {formatDate(review.publishedAt)}
                  </time>
                </div>
                <div className="mt-1">
                  <StarRating
                    rating={review.rating}
                    reviewCount={0}
                    variant="compact"
                  />
                </div>
                {review.text && (
                  <p className="mt-2 font-serif text-sm text-foreground md:text-[15px] leading-relaxed">
                    {review.text}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* City Back-Link */}
      <div className="mt-8 border-t border-border pt-6">
        <Link
          href={`/${listing.city.slug}`}
          className="inline-flex min-h-[44px] items-center font-sans text-sm font-medium text-foreground hover:underline"
        >
          More attic cleaning companies in {listing.city.name},{" "}
          {listing.city.state}
        </Link>
      </div>
    </div>
  )
}
