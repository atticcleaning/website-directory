import { cache } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import StarRating from "@/components/star-rating"
import FilterToolbar from "@/components/filter-toolbar"
import prisma from "@/lib/prisma"
import { buildMetadata } from "@/lib/seo"
import type { ListingResult } from "@/types"

const getCity = cache(async function getCity(citySlug: string) {
  return prisma.city.findUnique({
    where: { slug: citySlug },
    include: {
      listings: {
        include: { serviceTags: true },
        orderBy: { starRating: "desc" },
      },
    },
  })
})

const getAllCities = cache(async function getAllCities() {
  return prisma.city.findMany({
    include: { _count: { select: { listings: true } } },
  })
})

export async function generateStaticParams() {
  const cities = await prisma.city.findMany({
    select: { slug: true },
  })
  return cities.map((city) => ({ citySlug: city.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ citySlug: string }>
}): Promise<Metadata> {
  const { citySlug } = await params
  const city = await getCity(citySlug)

  if (!city) {
    return { title: "City Not Found | AtticCleaning.com", robots: { index: false } }
  }

  const companyCount = city.listings.length
  const avgRating = computeAvgRating(city.listings)

  return buildMetadata({
    title: `Top Attic Cleaning Companies in ${city.name}, ${city.state} | AtticCleaning.com`,
    description: `Find ${companyCount} top-rated attic cleaning ${companyCount === 1 ? "company" : "companies"} in ${city.name}, ${city.state}. Average rating: ${avgRating.toFixed(1)} stars.`,
    path: `/${citySlug}`,
  })
}

function computeAvgRating(listings: { starRating: number }[]): number {
  if (listings.length === 0) return 0
  return Number(
    (
      listings.reduce((sum, l) => sum + l.starRating, 0) / listings.length
    ).toFixed(1)
  )
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default async function CityLandingPage({
  params,
}: {
  params: Promise<{ citySlug: string }>
}) {
  const { citySlug } = await params
  const city = await getCity(citySlug)

  if (!city) {
    notFound()
  }

  const companyCount = city.listings.length
  const avgRating = computeAvgRating(city.listings)

  const results: ListingResult[] = city.listings.map((listing) => ({
    id: listing.id,
    name: listing.name,
    starRating: listing.starRating,
    reviewCount: listing.reviewCount,
    phone: listing.phone,
    website: listing.website,
    address: listing.address,
    distanceMiles: null,
    serviceTags: listing.serviceTags.map((t) => t.serviceType),
    reviewSnippet: null,
    citySlug: city.slug,
    companySlug: listing.slug,
  }))

  // Nearby cities by geographic proximity
  const allCities = await getAllCities()
  const nearbyCities = allCities
    .filter((c) => c.id !== city.id && c._count.listings > 0)
    .map((c) => ({
      name: c.name,
      state: c.state,
      slug: c.slug,
      listingCount: c._count.listings,
      distance: haversineDistance(
        city.latitude,
        city.longitude,
        c.latitude,
        c.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5)

  return (
    <div className="py-6 md:py-8">
      {/* City Heading */}
      <h1 className="font-sans text-2xl font-bold text-foreground md:text-[2rem]">
        Attic Cleaning Companies in {city.name}, {city.state}
      </h1>

      {/* Aggregated Stats */}
      {companyCount > 0 && (
        <div className="mt-2 inline-flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
          <span className="font-sans text-sm text-muted-foreground">
            {companyCount} {companyCount === 1 ? "company" : "companies"}
          </span>
          <span className="font-sans text-sm text-muted-foreground">&middot;</span>
          <div className="flex items-center gap-1">
            <StarRating rating={avgRating} reviewCount={0} variant="compact" />
            <span className="font-sans text-sm text-muted-foreground">
              avg
            </span>
          </div>
        </div>
      )}

      {/* Filter Toolbar + Listing Cards */}
      <div className="mt-4">
        <FilterToolbar results={results} />
      </div>

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
            Nearby Cities
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {nearbyCities.map((nearby) => (
              <Link
                key={nearby.slug}
                href={`/${nearby.slug}`}
                className="flex min-h-[44px] items-center rounded-lg border border-border bg-card px-4 py-3 font-sans text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary"
              >
                {nearby.name}, {nearby.state} &mdash;{" "}
                {nearby.listingCount}{" "}
                {nearby.listingCount === 1 ? "company" : "companies"}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
