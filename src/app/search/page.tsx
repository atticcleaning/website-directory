import { cache } from "react"
import type { Metadata } from "next"
import { searchListings } from "@/lib/search"
import RadiusInfo from "@/components/radius-info"
import FilterToolbar from "@/components/filter-toolbar"
import { buildMetadata, buildBreadcrumbJsonLd } from "@/lib/seo"

const getSearchResults = cache((q: string, lat?: number, lng?: number) =>
  searchListings({ q, lat, lng })
)

function parseGeoParam(value: string | string[] | undefined): number | undefined {
  const str = typeof value === "string" ? value : Array.isArray(value) ? value[0] : undefined
  if (!str) return undefined
  const n = parseFloat(str)
  return isNaN(n) ? undefined : n
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q : Array.isArray(params.q) ? params.q[0] ?? "" : ""
  const lat = parseGeoParam(params.lat)
  const lng = parseGeoParam(params.lng)
  const isGeoSearch = lat !== undefined && lng !== undefined
  const data = await getSearchResults(q, lat, lng)
  const locationStr = isGeoSearch
    ? "Near You"
    : data.meta.location
    ? `${data.meta.location.city}, ${data.meta.location.state}`
    : q
  return buildMetadata({
    title: isGeoSearch
      ? `Attic Cleaning Companies Near You | AtticCleaning.com`
      : locationStr
      ? `Attic Cleaning Companies in ${locationStr} | AtticCleaning.com`
      : "Search Results | AtticCleaning.com",
    description: isGeoSearch
      ? `Find top-rated attic cleaning companies near your location. Compare ratings, reviews, and services.`
      : locationStr
      ? `Find top-rated attic cleaning companies in ${locationStr}. Compare ratings, reviews, and services.`
      : "Search results for attic cleaning companies. Compare ratings, reviews, and services.",
    path: "/search",
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q : Array.isArray(params.q) ? params.q[0] ?? "" : ""
  const lat = parseGeoParam(params.lat)
  const lng = parseGeoParam(params.lng)
  const isGeoSearch = lat !== undefined && lng !== undefined
  const data = await getSearchResults(q, lat, lng)

  const { results, meta } = data
  const locationStr = isGeoSearch
    ? null
    : meta.location
    ? `${meta.location.city}, ${meta.location.state}`
    : null

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Search Results", path: "/search" },
  ])

  return (
    <div className="py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <h1 className="font-sans text-2xl font-bold text-foreground md:text-[2rem]">
        {meta.totalCount} attic cleaning {meta.totalCount === 1 ? "company" : "companies"}{" "}
        {isGeoSearch ? "near you" : locationStr ? `in ${locationStr}` : `for "${meta.query}"`}
      </h1>

      {meta.expanded && (
        <div className="mt-2">
          <RadiusInfo radiusMiles={meta.radiusMiles} location={meta.location} />
        </div>
      )}

      <div className="mt-4">
        <FilterToolbar results={results} />
      </div>

      {results.length < 3 && (
        <section className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground">
            Learn About Attic Cleaning
          </h2>
          <p className="mt-2 font-serif text-sm text-muted-foreground">
            Explore our guides to help you make informed decisions about attic cleaning services.
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              <span className="font-sans text-sm font-medium text-foreground">
                What to Expect from an Attic Cleaning Service
              </span>
            </li>
            <li>
              <span className="font-sans text-sm font-medium text-foreground">
                Signs Your Attic Needs Professional Cleaning
              </span>
            </li>
            <li>
              <span className="font-sans text-sm font-medium text-foreground">
                How to Choose the Right Attic Cleaning Company
              </span>
            </li>
          </ul>
        </section>
      )}
    </div>
  )
}
