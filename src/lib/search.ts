import prisma from "@/lib/prisma"
import { Prisma, ServiceType } from "@/app/generated/prisma/client"
import type { SearchResponse, ListingResult } from "@/types"

const DEFAULT_RADIUS = 10
const EXPANDED_RADIUS_1 = 20
const EXPANDED_RADIUS_2 = 50
const MIN_RESULTS = 3
const MAX_RESULTS = 50
const MAX_QUERY_LENGTH = 200
const REVIEW_SNIPPET_LENGTH = 120

const VALID_SERVICE_TYPES = new Set(Object.values(ServiceType))

interface SearchParams {
  q: string
  service?: string
  sort?: string
}

interface ResolvedLocation {
  city: string
  state: string
  latitude: number
  longitude: number
}

/** Raw SQL result shape before enrichment. */
interface RawListingRow {
  id: string
  name: string
  starRating: number
  reviewCount: number
  phone: string | null
  website: string | null
  address: string
  companySlug: string
  citySlug: string
  distanceMiles: number | null
}

/**
 * Resolve a search query to geographic coordinates.
 * 1. Check if query is a 5-digit zip code → lookup ZipCode table
 * 2. Try city name match → lookup City table (case-insensitive)
 * 3. Return null if no location match (fall back to text search)
 */
async function resolveLocation(query: string): Promise<ResolvedLocation | null> {
  const trimmed = query.trim()

  // Check for 5-digit zip code
  if (/^\d{5}$/.test(trimmed)) {
    const zipCode = await prisma.zipCode.findUnique({
      where: { code: trimmed },
    })
    if (zipCode) {
      return {
        city: zipCode.city,
        state: zipCode.state,
        latitude: zipCode.latitude,
        longitude: zipCode.longitude,
      }
    }
  }

  // Try city name resolution (with optional state: "Phoenix, AZ" or "Phoenix")
  const cityStateMatch = trimmed.match(/^(.+?),\s*([A-Za-z]{2})$/)
  if (cityStateMatch) {
    const [, cityName, stateCode] = cityStateMatch
    const city = await prisma.city.findFirst({
      where: {
        name: { equals: cityName.trim(), mode: "insensitive" },
        state: { equals: stateCode.toUpperCase(), mode: "insensitive" },
      },
    })
    if (city) {
      return {
        city: city.name,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude,
      }
    }
  }

  // Try city name only (no state)
  const city = await prisma.city.findFirst({
    where: {
      name: { equals: trimmed, mode: "insensitive" },
    },
  })
  if (city) {
    return {
      city: city.name,
      state: city.state,
      latitude: city.latitude,
      longitude: city.longitude,
    }
  }

  return null
}

/**
 * Validate service parameter against ServiceType enum.
 * Returns the valid service type string or undefined if invalid.
 */
function validateService(service: string | undefined): string | undefined {
  if (!service) return undefined
  return VALID_SERVICE_TYPES.has(service as ServiceType) ? service : undefined
}

/**
 * Build the ORDER BY clause based on sort parameter.
 */
function getSortClause(sort: string, hasLocation: boolean): Prisma.Sql {
  if (sort === "distance" && hasLocation) {
    return Prisma.sql`"distanceMiles" ASC NULLS LAST`
  }
  if (sort === "reviews") {
    return Prisma.sql`l."reviewCount" DESC, l."starRating" DESC`
  }
  // Default: rating
  return Prisma.sql`l."starRating" DESC, l."reviewCount" DESC`
}

/**
 * Search listings within a radius of given coordinates.
 * No text filter — returns ALL listings within radius, optionally filtered by service type.
 */
async function searchByRadius(
  lat: number,
  lng: number,
  radiusMiles: number,
  service: string | undefined,
  sort: string
): Promise<RawListingRow[]> {
  const serviceFilter = service
    ? Prisma.sql`AND EXISTS (SELECT 1 FROM "ServiceTag" st WHERE st."listingId" = l.id AND st."serviceType" = ${service}::"ServiceType")`
    : Prisma.sql``

  const sortClause = getSortClause(sort, true)

  const results = await prisma.$queryRaw<RawListingRow[]>`
    SELECT
      l.id,
      l.name,
      l."starRating",
      l."reviewCount",
      l.phone,
      l.website,
      l.address,
      l.slug AS "companySlug",
      c.slug AS "citySlug",
      (
        3959 * acos(
          LEAST(1.0, GREATEST(-1.0,
            cos(radians(${lat})) * cos(radians(l.latitude))
            * cos(radians(l.longitude) - radians(${lng}))
            + sin(radians(${lat})) * sin(radians(l.latitude))
          ))
        )
      ) AS "distanceMiles"
    FROM "Listing" l
    JOIN "City" c ON l."cityId" = c.id
    WHERE (
      3959 * acos(
        LEAST(1.0, GREATEST(-1.0,
          cos(radians(${lat})) * cos(radians(l.latitude))
          * cos(radians(l.longitude) - radians(${lng}))
          + sin(radians(${lat})) * sin(radians(l.latitude))
        ))
      )
    ) <= ${radiusMiles}
    ${serviceFilter}
    ORDER BY ${sortClause}
    LIMIT ${MAX_RESULTS}
  `

  return results
}

/**
 * Search listings by text only (no location resolved).
 * Uses full-text search + trigram matching on name and address.
 */
async function searchByText(
  query: string,
  service: string | undefined,
  sort: string
): Promise<RawListingRow[]> {
  const serviceFilter = service
    ? Prisma.sql`AND EXISTS (SELECT 1 FROM "ServiceTag" st WHERE st."listingId" = l.id AND st."serviceType" = ${service}::"ServiceType")`
    : Prisma.sql``

  const sortClause = getSortClause(sort, false)

  const results = await prisma.$queryRaw<RawListingRow[]>`
    SELECT
      l.id,
      l.name,
      l."starRating",
      l."reviewCount",
      l.phone,
      l.website,
      l.address,
      l.slug AS "companySlug",
      c.slug AS "citySlug",
      NULL::float AS "distanceMiles"
    FROM "Listing" l
    JOIN "City" c ON l."cityId" = c.id
    WHERE (
      to_tsvector('english', l.name) @@ plainto_tsquery('english', ${query})
      OR to_tsvector('english', l.address) @@ plainto_tsquery('english', ${query})
      OR l.name ILIKE ${"%" + query + "%"}
      OR l.address ILIKE ${"%" + query + "%"}
    )
    ${serviceFilter}
    ORDER BY ${sortClause}
    LIMIT ${MAX_RESULTS}
  `

  return results
}

/**
 * Enrich raw listing rows with service tags and review snippets.
 */
async function enrichResults(rows: RawListingRow[]): Promise<ListingResult[]> {
  if (rows.length === 0) return []

  const listingIds = rows.map((r) => r.id)

  // Fetch service tags and first review for all results in parallel
  const [serviceTags, reviews] = await Promise.all([
    prisma.serviceTag.findMany({
      where: { listingId: { in: listingIds } },
      select: { listingId: true, serviceType: true },
    }),
    prisma.review.findMany({
      where: { listingId: { in: listingIds }, text: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: { listingId: true, text: true },
      distinct: ["listingId"],
    }),
  ])

  // Build lookup maps
  const tagsByListing = new Map<string, ServiceType[]>()
  for (const tag of serviceTags) {
    const existing = tagsByListing.get(tag.listingId) || []
    existing.push(tag.serviceType)
    tagsByListing.set(tag.listingId, existing)
  }

  const reviewByListing = new Map<string, string>()
  for (const review of reviews) {
    if (review.text) {
      const snippet =
        review.text.length > REVIEW_SNIPPET_LENGTH
          ? review.text.slice(0, REVIEW_SNIPPET_LENGTH) + "..."
          : review.text
      reviewByListing.set(review.listingId, snippet)
    }
  }

  // Enrich each row into a full ListingResult
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    starRating: row.starRating,
    reviewCount: row.reviewCount,
    phone: row.phone,
    website: row.website,
    address: row.address,
    companySlug: row.companySlug,
    citySlug: row.citySlug,
    distanceMiles: row.distanceMiles !== null ? Math.round(row.distanceMiles * 10) / 10 : null,
    serviceTags: tagsByListing.get(row.id) || [],
    reviewSnippet: reviewByListing.get(row.id) || null,
  }))
}

/**
 * Main search function — called by the API route handler.
 * Handles location resolution, radius expansion, and result enrichment.
 */
export async function searchListings(params: SearchParams): Promise<SearchResponse> {
  const { q, sort = "rating" } = params
  const trimmedQuery = q.trim().slice(0, MAX_QUERY_LENGTH)
  const validatedService = validateService(params.service)

  // Empty query → return empty results
  if (!trimmedQuery) {
    return {
      results: [],
      meta: {
        query: "",
        totalCount: 0,
        expanded: true,
        radiusMiles: EXPANDED_RADIUS_2,
        location: null,
      },
    }
  }

  // Resolve location from query
  const location = await resolveLocation(trimmedQuery)

  let rows: RawListingRow[]
  let expanded = false
  let finalRadius = DEFAULT_RADIUS

  if (location) {
    // Location resolved — radius-based search (no text filter)
    rows = await searchByRadius(location.latitude, location.longitude, DEFAULT_RADIUS, validatedService, sort)

    if (rows.length < MIN_RESULTS) {
      rows = await searchByRadius(location.latitude, location.longitude, EXPANDED_RADIUS_1, validatedService, sort)
      finalRadius = EXPANDED_RADIUS_1
      expanded = true
    }

    if (rows.length < MIN_RESULTS) {
      rows = await searchByRadius(location.latitude, location.longitude, EXPANDED_RADIUS_2, validatedService, sort)
      finalRadius = EXPANDED_RADIUS_2
      expanded = true
    }
  } else {
    // No location — text-based search on listing name/address
    rows = await searchByText(trimmedQuery, validatedService, sort)
    finalRadius = 0
  }

  // Enrich with service tags and review snippets
  const enrichedResults = await enrichResults(rows)

  // Log low-result searches for expansion prioritization (fire-and-forget)
  if (enrichedResults.length < MIN_RESULTS) {
    prisma.searchLog
      .create({
        data: {
          query: trimmedQuery,
          resultCount: enrichedResults.length,
          radiusMiles: finalRadius,
          latitude: location?.latitude ?? null,
          longitude: location?.longitude ?? null,
        },
      })
      .catch((err: unknown) => console.error("Search log failed:", err))
  }

  return {
    results: enrichedResults,
    meta: {
      query: trimmedQuery,
      totalCount: enrichedResults.length,
      expanded,
      radiusMiles: finalRadius,
      location: location
        ? {
            city: location.city,
            state: location.state,
            latitude: location.latitude,
            longitude: location.longitude,
          }
        : null,
    },
  }
}
