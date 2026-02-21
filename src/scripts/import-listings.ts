import "dotenv/config"
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// DO Managed PostgreSQL uses a certificate not in the default trust chain.
// Safe for local admin CLI scripts — not used in production server code.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set. Check your .env file.")
  process.exit(1)
}

// ─── State Name → Code Conversion ─────────────────────────

const STATE_NAME_TO_CODE: Record<string, string> = {
  alabama: "AL", alaska: "AK", arizona: "AZ", arkansas: "AR",
  california: "CA", colorado: "CO", connecticut: "CT", delaware: "DE",
  florida: "FL", georgia: "GA", hawaii: "HI", idaho: "ID",
  illinois: "IL", indiana: "IN", iowa: "IA", kansas: "KS",
  kentucky: "KY", louisiana: "LA", maine: "ME", maryland: "MD",
  massachusetts: "MA", michigan: "MI", minnesota: "MN", mississippi: "MS",
  missouri: "MO", montana: "MT", nebraska: "NE", nevada: "NV",
  "new hampshire": "NH", "new jersey": "NJ", "new mexico": "NM", "new york": "NY",
  "north carolina": "NC", "north dakota": "ND", ohio: "OH", oklahoma: "OK",
  oregon: "OR", pennsylvania: "PA", "rhode island": "RI", "south carolina": "SC",
  "south dakota": "SD", tennessee: "TN", texas: "TX", utah: "UT",
  vermont: "VT", virginia: "VA", washington: "WA", "west virginia": "WV",
  wisconsin: "WI", wyoming: "WY", "district of columbia": "DC",
}

function toStateCode(stateInput: string): string | undefined {
  const trimmed = stateInput.trim()
  if (trimmed.length === 2) return trimmed.toUpperCase()
  return STATE_NAME_TO_CODE[trimmed.toLowerCase()]
}

// ─── Slug Generation ───────────────────────────────────────

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .replace(/['''.]/g, "") // Remove apostrophes, periods
    .replace(/[^a-z0-9]+/g, "-") // Non-alphanumeric → hyphens
    .replace(/^-|-$/g, "") // Trim leading/trailing hyphens
}

function makeCitySlug(city: string, stateCode: string): string {
  return `${slugify(city)}-${stateCode.toLowerCase()}`
}

// ─── Field Resolution ──────────────────────────────────────

const FIELD_ALIASES: Record<string, string[]> = {
  place_id: ["place_id", "google_id"],
  name: ["name"],
  address: ["full_address", "address"],
  phone: ["phone", "phone_number"],
  website: ["site", "website"],
  rating: ["rating", "stars"],
  reviews_count: ["reviews", "reviews_count", "total_reviews"],
  latitude: ["latitude", "lat"],
  longitude: ["longitude", "lng", "lon"],
  city: ["city"],
  state: ["state", "region"],
  description: ["description", "about"],
  subtypes: ["subtypes", "categories"],
  working_hours: ["working_hours", "working_hours_old_format"],
}

function resolveField(row: Record<string, unknown>, canonical: string): unknown {
  const aliases = FIELD_ALIASES[canonical]
  if (!aliases) return undefined
  for (const alias of aliases) {
    const val = row[alias]
    if (val !== undefined && val !== null && val !== "") return val
  }
  return undefined
}

function resolveString(row: Record<string, unknown>, canonical: string): string | undefined {
  const val = resolveField(row, canonical)
  if (val === undefined || val === null) return undefined
  return String(val).trim() || undefined
}

function resolveNumber(row: Record<string, unknown>, canonical: string): number | undefined {
  const val = resolveField(row, canonical)
  if (val === undefined || val === null) return undefined
  const num = Number(val)
  return isNaN(num) ? undefined : num
}

// ─── Business Type Filter ─────────────────────────────────
// Reject businesses whose primary type is roofing, HVAC, plumbing, etc.
// unless they also have attic/insulation signals (name or allowed subtypes).

const EXCLUDED_PRIMARY_SUBTYPES = [
  // Trade contractors
  "roofing contractor", "siding contractor", "skylight contractor",
  "hvac contractor", "air conditioning contractor", "air conditioning repair service",
  "air conditioning system supplier", "heating contractor", "heating equipment supplier",
  "furnace repair service", "plumber", "electrician", "electrical installation service",
  "general contractor", "construction company", "building firm", "remodeling contractor",
  "masonry contractor", "bricklayer", "concrete contractor",
  "dry wall contractor", "flooring contractor", "flooring store",
  "garage door supplier", "painting", "painter",
  // Retail / irrelevant
  "home improvement store", "hardware store", "appliance store", "appliance repair service",
  "building materials store", "building materials supplier",
  "hot water system supplier", "gasfitter",
  // Solar
  "solar energy company", "solar energy system service", "solar energy equipment supplier",
  // Landscaping / lawn
  "landscaper", "lawn care service",
  // Moving / storage
  "mover", "moving and storage service", "self-storage facility", "storage facility",
  "dumpster rental service",
  // Cleaning services (non-attic)
  "carpet cleaning service", "window cleaning service", "pressure washing service",
  "house cleaning service", "cleaners", "dry cleaner", "janitorial service",
  // Inspection
  "home inspector", "building inspector",
  // Completely irrelevant
  "brewery", "bar", "restaurant", "cafe",
  "veterinary care", "animal hospital",
  "real estate agency", "real estate agent",
  "insurance agency",
  "recording studio", "video production service",
  "furniture store", "antique store",
  "handyman/handywoman/handyperson",
  "home health care service", "aged care",
  "shredding service", "consumer advice center",
]

const ALLOWED_SUBTYPES = [
  "insulation contractor", "insulator",
  "air duct cleaning service",
  "pest control service", "animal control service", "bird control service",
  "water damage restoration service", "fire damage restoration service",
  "mold removal service",
]

export function shouldExcludeBusiness(name: string, subtypes: string | null): boolean {
  if (!subtypes) return false

  const subtypesLower = subtypes.toLowerCase()
  const nameLower = name.toLowerCase()

  // Check if business has any excluded primary subtype
  const hasExcludedType = EXCLUDED_PRIMARY_SUBTYPES.some((t) => subtypesLower.includes(t))
  if (!hasExcludedType) return false

  // Allow if name contains attic/insulation/crawlspace keywords
  if (nameLower.includes("attic") || nameLower.includes("insulation") || nameLower.includes("crawl")) return false

  // Allow if has allowed subtypes (insulation, pest control, duct cleaning, restoration)
  const hasAllowedType = ALLOWED_SUBTYPES.some((t) => subtypesLower.includes(t))
  if (hasAllowedType) return false

  // Excluded: has excluded types but no attic/insulation signals
  return true
}

// ─── Photo URL Extraction ─────────────────────────────────

function extractPhotoUrls(biz: Record<string, unknown>): string[] {
  const urls: string[] = []

  // Single cover photo (standard places scraper: "photo" field)
  const singlePhoto = biz.photo || biz.photo_url
  if (typeof singlePhoto === "string" && singlePhoto.startsWith("http")) {
    urls.push(singlePhoto)
  }

  // Photos array (dedicated scraper or enhanced export)
  const photosArray = biz.photos
  if (Array.isArray(photosArray)) {
    for (const item of photosArray) {
      if (typeof item === "string" && item.startsWith("http")) {
        urls.push(item)
      } else if (item && typeof item === "object") {
        const url = (item as Record<string, unknown>).big_photo_link
          ?? (item as Record<string, unknown>).photo_link
          ?? (item as Record<string, unknown>).url
        if (typeof url === "string" && url.startsWith("http")) {
          urls.push(url)
        }
      }
    }
  }

  // Street view as last resort fallback
  const streetView = biz.street_view
  if (urls.length === 0 && typeof streetView === "string" && streetView.startsWith("http")) {
    urls.push(streetView)
  }

  // Deduplicate and cap at 10
  return [...new Set(urls)].slice(0, 10)
}

// ─── CLI Argument Parsing ──────────────────────────────────

interface CliArgs {
  queries: string[]
  filePath: string | null
  withReviews: boolean
  limit: number
}

function parseArgs(argv: string[]): CliArgs {
  const queries: string[] = []
  let filePath: string | null = null
  let withReviews = false
  let limit = 500

  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--query" && argv[i + 1]) {
      queries.push(argv[++i])
    } else if (argv[i] === "--file" && argv[i + 1]) {
      filePath = argv[++i]
    } else if (argv[i] === "--with-reviews") {
      withReviews = true
    } else if (argv[i] === "--limit" && argv[i + 1]) {
      const parsed = parseInt(argv[++i], 10)
      if (isNaN(parsed) || parsed < 1) {
        console.error("Error: --limit must be a positive integer.")
        process.exit(1)
      }
      limit = parsed
    }
  }

  if (queries.length === 0 && !filePath) {
    console.error("Usage:")
    console.error('  API mode:  npx tsx src/scripts/import-listings.ts --query "attic cleaning, Phoenix, AZ"')
    console.error("  File mode: npx tsx src/scripts/import-listings.ts --file data/outscraper-export.json")
    console.error("")
    console.error("Options:")
    console.error("  --query <text>      Search query (repeatable for multiple metros)")
    console.error("  --file <path>       Path to local JSON file")
    console.error("  --with-reviews      Also fetch reviews for imported listings (API mode only)")
    console.error("  --limit <n>         Max results per query (default: 500)")
    process.exit(1)
  }

  return { queries, filePath, withReviews, limit }
}

// ─── Outscraper API Client ─────────────────────────────────

async function outscrapeSearch(query: string, limit: number): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.OUTSCRAPER_API_KEY
  if (!apiKey) {
    throw new Error("OUTSCRAPER_API_KEY environment variable is not set.")
  }

  const params = new URLSearchParams({
    query,
    limit: String(limit),
    async: "false",
    dropDuplicates: "true",
    language: "en",
  })

  const url = `https://api.app.outscraper.com/maps/search-v3?${params}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey },
    signal: controller.signal,
  })
  clearTimeout(timeout)

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    throw new Error(`Outscraper API error: ${res.status} ${res.statusText} — ${body}`)
  }

  const json = (await res.json()) as { data?: unknown }
  const data = json.data
  if (!data) return []

  // API returns nested arrays when dropDuplicates=false, flat array when true
  if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
    return (data as Record<string, unknown>[][]).flat()
  }
  return data as Record<string, unknown>[]
}

async function outscrapeReviews(query: string, limit: number = 100): Promise<Record<string, unknown>[]> {
  const apiKey = process.env.OUTSCRAPER_API_KEY
  if (!apiKey) {
    throw new Error("OUTSCRAPER_API_KEY environment variable is not set.")
  }

  const params = new URLSearchParams({
    query,
    reviewsLimit: String(limit),
    async: "false",
  })

  const url = `https://api.app.outscraper.com/maps/reviews-v3?${params}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)
  const res = await fetch(url, {
    headers: { "X-API-KEY": apiKey },
    signal: controller.signal,
  })
  clearTimeout(timeout)

  if (!res.ok) {
    console.warn(`  ⚠ Reviews API error for "${query}": ${res.status} ${res.statusText}`)
    return []
  }

  const json = (await res.json()) as { data?: Record<string, unknown>[] }
  const data = json.data
  if (!data || !Array.isArray(data) || data.length === 0) return []

  // Reviews v3 response: data[0].reviews_data contains the review array.
  // Only the first place match is used; secondary matches (rare with name+address) are ignored.
  const place = data[0]
  const reviewsData = place.reviews_data
  if (!reviewsData || !Array.isArray(reviewsData)) return []
  return reviewsData as Record<string, unknown>[]
}

// ─── Review Field Resolution ───────────────────────────────

const REVIEW_FIELD_ALIASES: Record<string, string[]> = {
  place_id: ["google_id", "place_id"],
  author_name: ["author_title", "autor_title"],
  rating: ["review_rating", "rating"],
  text: ["review_text", "text", "snippet"],
  published_at: ["review_datetime_utc", "review_timestamp"],
}

function resolveReviewField(row: Record<string, unknown>, canonical: string): unknown {
  const aliases = REVIEW_FIELD_ALIASES[canonical]
  if (!aliases) return undefined
  for (const alias of aliases) {
    const val = row[alias]
    if (val !== undefined && val !== null && val !== "") return val
  }
  return undefined
}

// ─── Main Import Logic ─────────────────────────────────────

export interface ImportSummary {
  totalProcessed: number
  listingsAdded: number
  listingsUpdated: number
  rejected: number
  citiesCreated: number
  reviewsImported: number
  photosImported: number
  listingsWithPhotos: number
}

export function emptyImportSummary(): ImportSummary {
  return {
    totalProcessed: 0,
    listingsAdded: 0,
    listingsUpdated: 0,
    rejected: 0,
    citiesCreated: 0,
    reviewsImported: 0,
    photosImported: 0,
    listingsWithPhotos: 0,
  }
}

export function mergeImportSummaries(target: ImportSummary, source: ImportSummary): void {
  target.totalProcessed += source.totalProcessed
  target.listingsAdded += source.listingsAdded
  target.listingsUpdated += source.listingsUpdated
  target.rejected += source.rejected
  target.citiesCreated += source.citiesCreated
  target.reviewsImported += source.reviewsImported
  target.photosImported += source.photosImported
  target.listingsWithPhotos += source.listingsWithPhotos
}

export function printImportSummary(summary: ImportSummary, label: string = "Import Summary", showReviews: boolean = false): void {
  console.log(`\n═══════════════════════════════════════`)
  console.log(`  ${label}`)
  console.log(`═══════════════════════════════════════`)
  console.log(`  Total processed:    ${summary.totalProcessed}`)
  console.log(`  Listings added:     ${summary.listingsAdded}`)
  console.log(`  Listings updated:   ${summary.listingsUpdated}`)
  console.log(`  Records rejected:   ${summary.rejected}`)
  console.log(`  Cities created:     ${summary.citiesCreated}`)
  if (showReviews) {
    console.log(`  Reviews imported:   ${summary.reviewsImported}`)
  }
  console.log(`  Photos imported:    ${summary.photosImported} photos (${summary.listingsWithPhotos} listings with photos)`)
  console.log(`═══════════════════════════════════════`)
}

export interface ImportOptions {
  queries: string[]
  filePath?: string | null
  withReviews: boolean
  limit: number
}

/**
 * Shared cache for batch imports. Pre-load once, pass to multiple runImport calls
 * to avoid re-querying all cities/listings on each invocation.
 */
export interface ImportCache {
  cityCache: Map<string, { id: string }>
  existingPlaceIds: Set<string>
}

/**
 * Initialize shared import cache by loading all existing cities and listing place IDs.
 */
export async function initImportCache(prisma: PrismaClient): Promise<ImportCache> {
  const cityCache = new Map<string, { id: string }>()
  const existingCities = await prisma.city.findMany({ select: { id: true, slug: true } })
  for (const city of existingCities) {
    cityCache.set(city.slug, { id: city.id })
  }

  const existingPlaceIds = new Set(
    (await prisma.listing.findMany({ select: { googlePlaceId: true } })).map((l) => l.googlePlaceId)
  )

  return { cityCache, existingPlaceIds }
}

/**
 * Core import function. Fetches listings from Outscraper API or a local file,
 * validates, deduplicates, and upserts them into the database. Optionally imports reviews.
 *
 * @param prisma - Connected PrismaClient instance
 * @param options - Import options (queries, filePath, withReviews, limit)
 * @param cache - Optional shared cache for batch operations (avoids re-querying per call)
 * @returns ImportSummary with counts of processed, added, updated, rejected, etc.
 */
export async function runImport(prisma: PrismaClient, options: ImportOptions, cache?: ImportCache): Promise<ImportSummary> {
  const summary = emptyImportSummary()

  // ── Fetch business data ──────────────────────────────

  let businesses: Record<string, unknown>[]

  if (options.filePath) {
    console.log(`Reading JSON file: ${options.filePath}`)
    const raw = readFileSync(options.filePath, "utf-8")
    // Strip BOM if present
    const content = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw
    const parsed = JSON.parse(content)

    if (Array.isArray(parsed)) {
      businesses = parsed
    } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.data)) {
      // Handle { data: [...] } wrapper from Outscraper exports
      businesses = parsed.data
    } else {
      throw new Error("JSON file must be an array or an object with a 'data' array.")
    }
    console.log(`  → ${businesses.length} businesses loaded from file`)
  } else {
    businesses = []
    for (const query of options.queries) {
      console.log(`Querying Outscraper: "${query}"...`)
      try {
        const results = await outscrapeSearch(query, options.limit)
        console.log(`  → ${results.length} businesses found`)
        businesses.push(...results)
      } catch (err) {
        console.error(`  ✗ Failed to fetch "${query}": ${err instanceof Error ? err.message : err}`)
      }
    }

    if (businesses.length === 0) {
      console.warn("No businesses fetched from any query.")
      return summary
    }
  }

  // ── Deduplicate by place_id before processing ────────

  const seenPlaceIds = new Set<string>()
  const uniqueBusinesses: Record<string, unknown>[] = []
  for (const biz of businesses) {
    const placeId = resolveString(biz, "place_id")
    if (!placeId) continue
    if (seenPlaceIds.has(placeId)) continue
    seenPlaceIds.add(placeId)
    uniqueBusinesses.push(biz)
  }

  if (uniqueBusinesses.length < businesses.length) {
    console.log(`Deduplicated: ${businesses.length} → ${uniqueBusinesses.length} unique businesses`)
  }

  // ── City cache for in-memory resolution ──────────────
  // Use shared cache if provided, otherwise load fresh

  const cityCache = cache?.cityCache ?? new Map<string, { id: string }>()
  const existingPlaceIds = cache?.existingPlaceIds ?? new Set<string>()

  if (!cache) {
    const existingCities = await prisma.city.findMany({ select: { id: true, slug: true } })
    for (const city of existingCities) {
      cityCache.set(city.slug, { id: city.id })
    }

    const listings = await prisma.listing.findMany({ select: { googlePlaceId: true } })
    for (const l of listings) {
      existingPlaceIds.add(l.googlePlaceId)
    }
  }

  // ── Process each business ────────────────────────────

  const importedListings = new Map<string, { id: string; googlePlaceId: string; name: string; address: string }>()

  for (let i = 0; i < uniqueBusinesses.length; i++) {
    const biz = uniqueBusinesses[i]
    summary.totalProcessed++

    // Progress logging
    if ((i + 1) % 100 === 0 || i === uniqueBusinesses.length - 1) {
      console.log(`Processing ${i + 1}/${uniqueBusinesses.length}...`)
    }

    // ── Extract and validate required fields ─────────

    const placeId = resolveString(biz, "place_id")
    const name = resolveString(biz, "name")
    const address = resolveString(biz, "address")
    const phone = resolveString(biz, "phone")
    const ratingVal = resolveNumber(biz, "rating")

    if (!placeId || !name || !address || !phone || ratingVal === undefined) {
      const missing = [
        !placeId && "place_id",
        !name && "name",
        !address && "address",
        !phone && "phone",
        ratingVal === undefined && "rating",
      ].filter(Boolean)
      console.warn(`  ⚠ Rejected (missing: ${missing.join(", ")}): ${name || "unknown"} [row ${i + 1}]`)
      summary.rejected++
      continue
    }

    // ── Extract optional fields ──────────────────────

    const website = resolveString(biz, "website") || null
    const reviewCount = resolveNumber(biz, "reviews_count") ?? 0
    const lat = resolveNumber(biz, "latitude")
    const lng = resolveNumber(biz, "longitude")
    const cityName = resolveString(biz, "city")
    const stateRaw = resolveString(biz, "state")
    const description = resolveString(biz, "description") || null

    // Subtypes: can be string or array
    const subtypesRaw = resolveField(biz, "subtypes")
    const subtypes = subtypesRaw
      ? Array.isArray(subtypesRaw)
        ? (subtypesRaw as string[]).join(", ")
        : String(subtypesRaw)
      : null

    // Working hours: can be object or string
    const hoursRaw = resolveField(biz, "working_hours")
    const workingHours = hoursRaw
      ? typeof hoursRaw === "object"
        ? JSON.stringify(hoursRaw)
        : String(hoursRaw)
      : null

    // ── Business type filter ─────────────────────────
    if (shouldExcludeBusiness(name, subtypes)) {
      console.warn(`  ⚠ Rejected (excluded business type): ${name} [row ${i + 1}]`)
      summary.rejected++
      continue
    }

    if (!lat || !lng || !cityName || !stateRaw) {
      console.warn(`  ⚠ Rejected (missing location data): ${name} [row ${i + 1}]`)
      summary.rejected++
      continue
    }

    // ── Resolve state code ───────────────────────────

    const stateCode = toStateCode(stateRaw)
    if (!stateCode) {
      console.warn(`  ⚠ Rejected (unknown state: "${stateRaw}"): ${name} [row ${i + 1}]`)
      summary.rejected++
      continue
    }

    // ── Resolve city (cached) ────────────────────────

    const cSlug = makeCitySlug(cityName, stateCode)
    let cityRecord = cityCache.get(cSlug)

    if (!cityRecord) {
      const city = await prisma.city.upsert({
        where: { slug: cSlug },
        create: { name: cityName, state: stateCode, slug: cSlug, latitude: lat, longitude: lng },
        update: {},
      })
      cityRecord = { id: city.id }
      cityCache.set(cSlug, cityRecord)
      summary.citiesCreated++
    }

    // ── Generate listing slug (unique within city) ───

    const baseSlug = slugify(name)
    let listingSlug = baseSlug
    let suffix = 2

    // Check for slug collisions within the city
    while (true) {
      const existing = await prisma.listing.findUnique({
        where: { cityId_slug: { cityId: cityRecord.id, slug: listingSlug } },
        select: { googlePlaceId: true },
      })
      if (!existing || existing.googlePlaceId === placeId) break
      listingSlug = `${baseSlug}-${suffix}`
      suffix++
    }

    // ── Upsert listing ──────────────────────────────

    const isUpdate = existingPlaceIds.has(placeId)

    const listing = await prisma.listing.upsert({
      where: { googlePlaceId: placeId },
      create: {
        googlePlaceId: placeId,
        name,
        slug: listingSlug,
        starRating: ratingVal,
        reviewCount,
        phone,
        website,
        address,
        description,
        subtypes,
        workingHours,
        latitude: lat,
        longitude: lng,
        cityId: cityRecord.id,
      },
      update: {
        name,
        starRating: ratingVal,
        reviewCount,
        phone,
        website,
        address,
        description,
        subtypes,
        workingHours,
        latitude: lat,
        longitude: lng,
      },
    })

    importedListings.set(placeId, { id: listing.id, googlePlaceId: placeId, name, address })

    if (isUpdate) {
      summary.listingsUpdated++
    } else {
      summary.listingsAdded++
      existingPlaceIds.add(placeId)
    }

    // ── Import photos (idempotent: delete + recreate) ──

    const photoUrls = extractPhotoUrls(biz)
    if (photoUrls.length > 0) {
      await prisma.listingPhoto.deleteMany({ where: { listingId: listing.id } })
      await prisma.listingPhoto.createMany({
        data: photoUrls.map((url, idx) => ({
          listingId: listing.id,
          url,
          isPrimary: idx === 0,
          sortOrder: idx,
        })),
      })
      summary.listingsWithPhotos++
      summary.photosImported += photoUrls.length
    }
  }

  // ── Import reviews if requested ─────────────────────

  if (options.withReviews && !options.filePath) {
    console.log("\nFetching reviews for imported listings...")

    // Pre-load existing reviews for deduplication
    const listingIds = [...importedListings.values()].map((l) => l.id)
    const existingReviews = await prisma.review.findMany({
      where: { listingId: { in: listingIds } },
      select: { listingId: true, authorName: true, publishedAt: true },
    })
    const existingReviewKeys = new Set(
      existingReviews.map((r) => `${r.listingId}|${r.authorName}|${r.publishedAt.toISOString()}`)
    )

    let reviewIdx = 0
    for (const [, listing] of importedListings) {
      reviewIdx++
      if (reviewIdx % 10 === 0) {
        console.log(`  Fetching reviews ${reviewIdx}/${importedListings.size}...`)
      }

      // Rate-limit: 500ms delay between review API calls to avoid 429s
      if (reviewIdx > 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      try {
        const reviewQuery = `${listing.name}, ${listing.address}`
        const reviews = await outscrapeReviews(reviewQuery)

        const batch: {
          listingId: string
          authorName: string
          rating: number
          text: string | null
          publishedAt: Date
        }[] = []

        for (const rev of reviews) {
          const authorName = String(resolveReviewField(rev, "author_name") ?? "Anonymous").trim()
          const reviewRating = Number(resolveReviewField(rev, "rating") ?? 0)
          const textRaw = resolveReviewField(rev, "text")
          const reviewText = textRaw ? String(textRaw).trim() || null : null
          const publishedAtRaw = resolveReviewField(rev, "published_at")

          if (!publishedAtRaw) continue

          const publishedAt = new Date(String(publishedAtRaw))
          if (isNaN(publishedAt.getTime())) continue

          const dedupKey = `${listing.id}|${authorName}|${publishedAt.toISOString()}`
          if (existingReviewKeys.has(dedupKey)) continue

          batch.push({
            listingId: listing.id,
            authorName,
            rating: reviewRating,
            text: reviewText,
            publishedAt,
          })

          existingReviewKeys.add(dedupKey)
        }

        if (batch.length > 0) {
          await prisma.review.createMany({ data: batch })
          summary.reviewsImported += batch.length
        }
      } catch (err) {
        console.warn(`  ⚠ Failed to fetch reviews for "${listing.name}": ${err instanceof Error ? err.message : err}`)
      }
    }
  }

  return summary
}

/**
 * Print database totals and a sample verification for a given import run.
 */
export async function printDatabaseTotals(prisma: PrismaClient): Promise<void> {
  const totalListings = await prisma.listing.count()
  const totalCities = await prisma.city.count()
  const totalReviews = await prisma.review.count()
  const totalPhotos = await prisma.listingPhoto.count()
  console.log(`\nDatabase totals: ${totalListings} listings, ${totalCities} cities, ${totalReviews} reviews, ${totalPhotos} photos`)
}

/**
 * Create a PrismaClient connected to DATABASE_URL.
 */
export function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter })
}

// ─── CLI Entry Point ──────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv)
  const prisma = createPrismaClient()

  try {
    const summary = await runImport(prisma, {
      queries: args.queries,
      filePath: args.filePath,
      withReviews: args.withReviews,
      limit: args.limit,
    })

    printImportSummary(summary, "Import Summary", args.withReviews)
    await printDatabaseTotals(prisma)
  } finally {
    await prisma.$disconnect()
  }
}

// Only run CLI when this file is executed directly (not imported by import-metro.ts)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error("Import failed:", e)
    process.exit(1)
  })
}
