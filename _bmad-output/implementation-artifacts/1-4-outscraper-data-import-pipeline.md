# Story 1.4: Outscraper Data Import Pipeline

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **admin**,
I want to programmatically import business listing data from the Outscraper API,
So that the directory is populated with real contractor data including ratings, reviews, and contact information.

## Acceptance Criteria

1. **Script Location:** Import script exists at `src/scripts/import-listings.ts` and supports two modes:
   - **API mode:** `npx tsx src/scripts/import-listings.ts --query "attic cleaning, Phoenix, AZ" [--query "attic cleaning, Tucson, AZ"]`
   - **File mode:** `npx tsx src/scripts/import-listings.ts --file <path-to-json>` (for pre-exported data or testing)
2. **Outscraper API Integration:** In API mode, the script calls the Outscraper Google Maps Search API (`GET https://api.app.outscraper.com/maps/search-v3`) using `OUTSCRAPER_API_KEY` from `.env`, receives JSON responses, and parses business data
3. **Field Mapping:** The script maps Outscraper JSON fields to the Prisma schema, handling known field name variations (e.g., `site` vs `website`, `full_address` vs `address`, `google_id` vs `place_id`)
4. **Validation:** Records missing required fields (`name`, `address`, `phone`, `rating`) are rejected with a logged warning including the business name if available (FR27)
5. **Deduplication:** Records are deduplicated by Google Place ID — existing listings are updated (upsert), new listings are inserted (FR25)
6. **City Resolution:** City records are created or matched by `(name, state)` with an in-memory cache. City slugs are generated (e.g., `"phoenix-az"`). First listing's lat/lng sets city coordinates
7. **Listing Slugs:** URL-safe slugs are generated for companies (e.g., `"abc-attic-cleaning"`) and are unique within a city (`@@unique([cityId, slug])`). Collisions appended with `-2`, `-3`, etc.
8. **Schema Migration:** Add `description` (String?), `subtypes` (String?), and `workingHours` (String?) fields to the Listing model — required for Story 1.5 service tag classification and Story 3.1 business hours display
9. **Extra Fields Captured:** `description`, `subtypes` (stored as comma-separated string), and `working_hours` (stored as JSON string) are mapped from Outscraper data to the new Listing fields
10. **Reviews Import:** When `--with-reviews` flag is passed in API mode, the script also calls the Outscraper Reviews API for each imported listing's `place_id`, importing Review records with author name, rating, text, and date
11. **Summary Report:** The script outputs a summary report to stdout: listings added, listings updated, records rejected, reviews imported, cities created, total processed (FR28). Progress logged every 100 records for large imports
12. **Data Integrity:** 0 records are corrupted or lost during import (NFR-R3)
13. **Idempotent:** Running the import a second time with the same queries/file produces 0 new listings (all upserted), and review duplicates are skipped
14. **Geographic Expansion:** The admin can import data for new geographic areas by running the script with new query arguments (FR32)

## Tasks / Subtasks

- [x] Task 1: Add Listing schema fields and run migration (AC: #8)
  - [x] 1.1 Add `description String?`, `subtypes String?`, `workingHours String?` fields to the Listing model in `prisma/schema.prisma`
  - [x] 1.2 Run `npx prisma migrate dev --name add-listing-description-subtypes-hours` to create and apply migration
  - [x] 1.3 Verify `npx prisma generate` produces updated types

- [x] Task 2: Create import script with Outscraper API integration (AC: #1, #2, #3, #4, #5, #6, #7, #9, #11)
  - [x] 2.1 Create `src/scripts/import-listings.ts` following established script pattern (dotenv, PrismaPg adapter, async main, DATABASE_URL guard, OUTSCRAPER_API_KEY guard, TLS bypass)
  - [x] 2.2 Implement CLI argument parsing: `--query` (repeatable), `--file`, `--with-reviews`, `--limit` (default 500)
  - [x] 2.3 Implement Outscraper API client — `GET /maps/search-v3` with query params: `query`, `limit`, `async=false`, `dropDuplicates=true`. Auth via `X-API-KEY` header. Parse JSON response `data` array
  - [x] 2.4 Implement file mode — read local JSON file, parse as array of business objects (same field structure as API response)
  - [x] 2.5 Implement field resolver that normalizes Outscraper field name variations to canonical names
  - [x] 2.6 Implement required field validation — reject records missing `name`, `address`, `phone`, or `rating`
  - [x] 2.7 Implement City resolution with in-memory `Map<string, City>` cache — find or create City by `(name, state)`, generate slug, set lat/lng from first listing
  - [x] 2.8 Implement Listing upsert by `googlePlaceId` — insert new, update existing. Generate company slug with collision handling. Map `description`, `subtypes`, `workingHours` from Outscraper data
  - [x] 2.9 Implement progress logging (every 100 records) and final summary report
  - [x] 2.10 Implement slugify with edge case handling for apostrophes, periods, "St." abbreviations, and hyphenated city names

- [x] Task 3: Add reviews import support (AC: #10, #13)
  - [x] 3.1 Implement `--with-reviews` flag — after business import, call Outscraper Reviews API for each listing's `place_id`
  - [x] 3.2 Map review fields: `author_title`/`autor_title` → `authorName`, `review_rating` → `rating`, `review_text` → `text`, `review_datetime_utc` → `publishedAt`
  - [x] 3.3 Link reviews to listings by matching `google_id`/`place_id` → `Listing.googlePlaceId`
  - [x] 3.4 Skip reviews for listings not found in the database (log warning)
  - [x] 3.5 Deduplicate reviews by composite key `(listingId, authorName, publishedAt)` — batch-check existing reviews before insert
  - [x] 3.6 Add reviews count to summary report

- [x] Task 4: Run import and verify (AC: #4, #5, #11, #12, #13, #14)
  - [x] 4.1 Test with `--file` mode using a sample JSON fixture
  - [x] 4.2 Test with `--query` mode against Outscraper API (small query, limit=10)
  - [x] 4.3 Verify City records are created with correct slugs
  - [x] 4.4 Verify Listing records have correct data, slugs, city relations, and new fields (description, subtypes, workingHours)
  - [x] 4.5 Re-run the same import to verify idempotency (0 new listings, existing updated)
  - [x] 4.6 Verify summary report output is accurate
  - [x] 4.7 Test with a second query (new metro) to verify geographic expansion

- [x] Task 5: Validate build integrity (AC: all)
  - [x] 5.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 5.2 Run `npm run lint` — zero violations
  - [x] 5.3 Run `npm run build` — compiles successfully

## Dev Notes

### Outscraper API Integration (CRITICAL)

The script calls the Outscraper API directly — no manual CSV export step.

**Places API Endpoint:**
```
GET https://api.app.outscraper.com/maps/search-v3
Headers: X-API-KEY: <OUTSCRAPER_API_KEY>
Params: query, limit (default 500), async=false, dropDuplicates=true, language=en
```

**Response format (JSON):**
```json
{
  "id": "request-id",
  "status": "Success",
  "data": [
    {
      "name": "ABC Attic Cleaning",
      "place_id": "ChIJ...",
      "google_id": "0x...",
      "full_address": "123 Main St, Phoenix, AZ 85001",
      "phone": "+16025551234",
      "site": "https://abcattic.com",
      "rating": 4.7,
      "reviews": 187,
      "latitude": 33.4484,
      "longitude": -112.074,
      "city": "Phoenix",
      "state": "Arizona",
      "description": "Full-service attic cleaning and insulation",
      "subtypes": "Insulation contractor, Pest control service",
      "working_hours": {"Monday": "8AM-5PM", ...}
    }
  ]
}
```

**Use `async=false`** for direct synchronous responses. For attic cleaning queries in specific metros, results are typically < 100 businesses, so responses are fast. If a query times out, log error and continue to next query.

**Environment variable:** `OUTSCRAPER_API_KEY` must be in `.env`. Add to `.env.example` if not already there.

**Reviews API Endpoint (when `--with-reviews` is used):**
```
GET https://api.app.outscraper.com/maps/reviews-v3
Headers: X-API-KEY: <OUTSCRAPER_API_KEY>
Params: query=<place_id>, limit=100, async=false
```

Reviews API takes a `place_id` as the query parameter and returns individual reviews for that business.

### JSON Response Field Mapping

All data comes as JSON — no CSV parsing needed. However, field names can vary between API versions.

**Business fields:**

| Outscraper Field | Variation | Maps To |
|---|---|---|
| `name` | — | `Listing.name` |
| `place_id` | `google_id` | `Listing.googlePlaceId` |
| `full_address` | `address` | `Listing.address` |
| `phone` | `phone_number` | `Listing.phone` |
| `site` | `website` | `Listing.website` |
| `rating` | `stars` | `Listing.starRating` |
| `reviews` | `reviews_count`, `total_reviews` | `Listing.reviewCount` |
| `latitude` | `lat` | `Listing.latitude` |
| `longitude` | `lng`, `lon` | `Listing.longitude` |
| `city` | — | City resolution |
| `state` | `region` | City resolution (convert full name → 2-letter code) |
| `description` | `about` | `Listing.description` |
| `subtypes` | `categories` | `Listing.subtypes` (join array to comma-separated string) |
| `working_hours` | `working_hours_old_format` | `Listing.workingHours` (JSON.stringify if object) |

**CRITICAL: `state` field** — Outscraper returns the full state name (e.g., `"Arizona"`) not the abbreviation (e.g., `"AZ"`). The script must convert full state names to 2-letter codes for City slugs and consistency with the ZipCode table. Use a state name → code lookup map.

**Review fields (from Reviews API):**

| Outscraper Field | Variation | Maps To |
|---|---|---|
| `google_id` | `place_id` | Link to `Listing.googlePlaceId` |
| `author_title` | `autor_title` (typo in some versions) | `Review.authorName` |
| `review_rating` | `rating` | `Review.rating` |
| `review_text` | `text`, `snippet` | `Review.text` |
| `review_datetime_utc` | `review_timestamp` | `Review.publishedAt` |

### Field Resolution Strategy

```typescript
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
  for (const alias of FIELD_ALIASES[canonical]) {
    if (row[alias] !== undefined && row[alias] !== null && row[alias] !== "") return row[alias]
  }
  return undefined
}
```

### State Name to Code Conversion (CRITICAL)

Outscraper returns full state names. Must convert:

```typescript
const STATE_NAME_TO_CODE: Record<string, string> = {
  "alabama": "AL", "alaska": "AK", "arizona": "AZ", "arkansas": "AR",
  "california": "CA", "colorado": "CO", "connecticut": "CT", "delaware": "DE",
  "florida": "FL", "georgia": "GA", "hawaii": "HI", "idaho": "ID",
  // ... all 50 states + DC
  "district of columbia": "DC",
}

function toStateCode(stateInput: string): string | undefined {
  const upper = stateInput.trim().toUpperCase()
  if (upper.length === 2) return upper  // Already a code
  return STATE_NAME_TO_CODE[stateInput.trim().toLowerCase()]
}
```

### Slug Generation with Edge Cases

```typescript
function slugify(text: string): string {
  return text
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")  // Remove diacritics
    .toLowerCase()
    .replace(/[''.]/g, "")           // Remove apostrophes, periods (O'Fallon → ofallon, St. → st)
    .replace(/[^a-z0-9]+/g, "-")     // Non-alphanumeric → hyphens
    .replace(/^-|-$/g, "")           // Trim leading/trailing hyphens
}

// City: "St. Louis" + "MO" → "st-louis-mo"
// City: "O'Fallon" + "IL" → "ofallon-il"
function citySlug(city: string, stateCode: string): string {
  return `${slugify(city)}-${stateCode.toLowerCase()}`
}

// Company: "ABC Attic Cleaning LLC" → "abc-attic-cleaning-llc"
// Collisions within city: "abc-attic-cleaning-llc-2", "-3", etc.
```

### City Resolution with In-Memory Cache

```typescript
const cityCache = new Map<string, { id: string }>()

async function resolveCity(prisma: PrismaClient, name: string, stateCode: string, lat: number, lng: number) {
  const slug = citySlug(name, stateCode)
  const cached = cityCache.get(slug)
  if (cached) return cached

  const city = await prisma.city.upsert({
    where: { slug },
    create: { name, state: stateCode, slug, latitude: lat, longitude: lng },
    update: {},  // Don't update existing cities
  })
  cityCache.set(slug, city)
  return city
}
```

This avoids 15K+ database queries for ~25 cities. After first resolution, all subsequent lookups are in-memory.

### Listing Upsert Strategy

```typescript
await prisma.listing.upsert({
  where: { googlePlaceId: placeId },
  create: {
    googlePlaceId: placeId, name, slug, starRating, reviewCount,
    phone, website, address, latitude, longitude, cityId,
    description, subtypes, workingHours,
  },
  update: {
    name, starRating, reviewCount, phone, website, address,
    latitude, longitude, description, subtypes, workingHours,
  },
})
```

**`slug` and `cityId` are NOT updated** on existing listings to preserve existing URLs. Only mutable data fields are updated.

### Review Deduplication Strategy

Batch-check existing reviews to avoid N+1 queries:

```typescript
// After importing businesses, collect all listing IDs
const listingIds = [...importedListings.values()].map(l => l.id)

// Fetch existing reviews for these listings in one query
const existingReviews = await prisma.review.findMany({
  where: { listingId: { in: listingIds } },
  select: { listingId: true, authorName: true, publishedAt: true },
})

// Build a Set of composite keys for O(1) dedup lookup
const existingKeys = new Set(
  existingReviews.map(r => `${r.listingId}|${r.authorName}|${r.publishedAt.toISOString()}`)
)

// Then for each review from API:
const key = `${listingId}|${authorName}|${publishedAt.toISOString()}`
if (!existingKeys.has(key)) {
  await prisma.review.create({ data: { listingId, authorName, rating, text, publishedAt } })
}
```

### HTTP Client for Outscraper API

Use Node.js built-in `fetch` (available in Node 18+, which is used by Next.js 16):

```typescript
async function outscrapeSearch(query: string, limit: number): Promise<Record<string, unknown>[]> {
  const params = new URLSearchParams({
    query,
    limit: String(limit),
    async: "false",
    dropDuplicates: "true",
    language: "en",
  })
  const res = await fetch(`https://api.app.outscraper.com/maps/search-v3?${params}`, {
    headers: { "X-API-KEY": process.env.OUTSCRAPER_API_KEY! },
  })
  if (!res.ok) throw new Error(`Outscraper API error: ${res.status} ${res.statusText}`)
  const json = await res.json()
  return json.data ?? []
}
```

**No external HTTP library needed** — Node.js built-in `fetch` handles this.

### Schema Migration (Task 1)

Add three optional fields to the Listing model:

```prisma
model Listing {
  // ... existing fields ...
  description   String?      // Outscraper business description — used by Story 1.5 for service tag classification
  subtypes      String?      // Outscraper categories (comma-separated) — critical for Story 1.5 accuracy
  workingHours  String?      // Outscraper working hours (JSON string) — displayed in Story 3.1
  // ... rest unchanged ...
}
```

**Why these fields are needed:**
- `description` + `subtypes`: Story 1.5 says "applies keyword matching against business name and description fields." Without these, classification accuracy drops significantly. `subtypes` contains gold data like "Insulation contractor, Pest control service" that maps directly to our ServiceType enum.
- `workingHours`: Story 3.1 (Listing Detail Page) requires displaying "business hours" (FR8). No current field stores this data.

### Prisma 7 Script Considerations (from Story 1.3)

- **Import path:** `from "../app/generated/prisma/client"` — the `/client` suffix is required
- **Driver adapter required:** Must use `PrismaPg` from `@prisma/adapter-pg`
- **`async function main()` wrapper** — do NOT use top-level `await` (tsx/CJS compatibility)
- **`import "dotenv/config"`** at the top for environment variable loading
- **`prisma.$disconnect()`** in `finally` block
- **`process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"`** for DO Managed PostgreSQL TLS
- **tsx already installed** as a dev dependency (v4.21.0) from Story 1.3

### Script Implementation Skeleton

```typescript
import "dotenv/config"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { readFileSync } from "fs"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.")
  process.exit(1)
}

function parseArgs(argv: string[]) {
  const queries: string[] = []
  let filePath: string | null = null
  let withReviews = false
  let limit = 500

  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--query" && argv[i + 1]) { queries.push(argv[++i]) }
    else if (argv[i] === "--file" && argv[i + 1]) { filePath = argv[++i] }
    else if (argv[i] === "--with-reviews") { withReviews = true }
    else if (argv[i] === "--limit" && argv[i + 1]) { limit = parseInt(argv[++i], 10) }
  }

  if (queries.length === 0 && !filePath) {
    console.error("Usage:")
    console.error("  API mode:  npx tsx src/scripts/import-listings.ts --query \"attic cleaning, Phoenix, AZ\"")
    console.error("  File mode: npx tsx src/scripts/import-listings.ts --file data/outscraper-export.json")
    process.exit(1)
  }

  return { queries, filePath, withReviews, limit }
}

async function main() {
  const args = parseArgs(process.argv)
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  try {
    let businesses: Record<string, unknown>[]

    if (args.filePath) {
      // File mode: read local JSON
      businesses = JSON.parse(readFileSync(args.filePath, "utf-8"))
      if (!Array.isArray(businesses)) {
        // Handle { data: [...] } wrapper from Outscraper exports
        businesses = (businesses as any).data ?? []
      }
    } else {
      // API mode: call Outscraper for each query
      businesses = []
      for (const query of args.queries) {
        console.log(`Querying Outscraper: "${query}"...`)
        const results = await outscrapeSearch(query, args.limit)
        console.log(`  → ${results.length} businesses found`)
        businesses.push(...results)
      }
    }

    // ... process businesses: validate, resolve cities, upsert listings ...
    // ... optionally import reviews if --with-reviews ...
    // ... output summary report ...
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => { console.error("Import failed:", e); process.exit(1) })
```

### What This Story Does NOT Do

- Does NOT classify service tags — that's Story 1.5 (separate script). But DOES capture `description` and `subtypes` fields that Story 1.5 will use for classification.
- Does NOT modify any React components or pages
- Does NOT create the search API or any frontend components
- Does NOT set up the Outscraper account or API key — admin must have this configured

### Anti-Patterns to Avoid

- **Do NOT update `slug` or `cityId` on existing listings** — this would break existing URLs
- **Do NOT import from `src/lib/prisma.ts`** — standalone scripts need their own PrismaClient instance
- **Do NOT install an HTTP client library** — Node.js built-in `fetch` works for Outscraper API calls
- **Do NOT assume `state` field is a 2-letter code** — Outscraper returns full state names; always convert
- **Do NOT query the database for city resolution on every listing** — use the in-memory cache
- **Do NOT use `findFirst` per review for dedup** — batch-check with `findMany` + Set for O(1) lookups
- **Do NOT treat empty strings as valid field values** — treat `""` as missing/undefined
- **Do NOT hard-code API URLs or keys** — use env vars and constants

### Project Structure Notes

- `src/scripts/import-listings.ts` matches the exact path specified in architecture.md
- `src/scripts/` directory exists from Story 1.3
- No new npm dependencies needed — `fetch` is built-in, tsx/dotenv/@prisma/adapter-pg all exist
- Schema migration adds 3 optional fields — non-breaking change

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5] — Service tag classification needs description + subtypes fields
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — Listing detail page needs business hours
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — Outscraper import pipeline design
- [Source: _bmad-output/planning-artifacts/architecture.md#Integration Points] — Outscraper → parse → validate → Prisma upsert
- [Source: _bmad-output/implementation-artifacts/1-3-geocoding-lookup-table-seed.md] — Established script patterns
- [Source: prisma/schema.prisma] — Listing, City, Review models with constraints
- [Source: Outscraper API documentation] — Places API v3 query params, response format, authentication

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Migration `20260213153112_add_listing_description_subtypes_hours` applied successfully — adds 3 nullable columns to Listing table
- Test fixture with 6 businesses: 4 valid (imported), 2 invalid (1 missing name, 1 missing phone) — validation working correctly
- State name conversion verified: `"Arizona"` → `"AZ"` and direct `"AZ"` both work
- Subtypes array format `["Pest control service", "Insulation contractor"]` correctly joined to comma-separated string
- Working hours JSON objects stored as stringified JSON
- Idempotency verified: re-run produced 0 added, 4 updated, 0 cities created
- Two Phoenix listings share same city record — no duplicate cities
- Slug generation: `"Valley Critter Control & Attic Clean"` → `"valley-critter-control-attic-clean"` (ampersand handled)
- Task 4.2 (API mode): `--query "attic cleaning, Phoenix, AZ" --limit 10` → 10 found, 9 imported, 1 rejected (missing address), 3 cities created (Phoenix, Scottsdale, Chandler)
- Task 4.7 (geographic expansion): `--query "attic cleaning, Los Angeles, CA" --limit 10` → 6 found, 5 imported, 1 rejected (missing address), 2 cities created (Los Angeles, Glendale)
- Final database state after live tests: 18 listings, 8 cities, 0 reviews

### Completion Notes List

- All 5 tasks (21 subtasks) completed — all verified including live API tests
- Schema migration: Added `description`, `subtypes`, `workingHours` optional fields to Listing model for Story 1.5 and 3.1 compatibility
- Import script: 570+ lines covering Outscraper API client, JSON file mode, field resolution with 14 alias groups, state name→code conversion (50 states + DC), slugify with edge cases, city caching, listing upsert, review dedup via batch Set, progress logging, summary report
- File mode tested with 6-record fixture: 4 imported, 2 rejected, idempotency verified
- API mode tested live: Phoenix query (10 found, 9 imported), LA query (6 found, 5 imported) — geographic expansion verified
- Final database: 18 listings across 8 cities, validation correctly rejecting records missing required address field
- `npx tsc --noEmit` — zero errors
- `npm run lint` — zero violations
- `npm run build` — compiles successfully

### Change Log

- 2026-02-13: Story 1.4 implemented — Outscraper data import pipeline with programmatic API integration, JSON file mode, schema migration
- 2026-02-13: Code review fixes — removed erroneous DROP INDEX from migration (preserved Story 1.2 trigram indexes), added 60s fetch timeouts, batched review inserts with createMany, added API key guard to outscrapeReviews, fixed double resolveReviewField call, added --limit validation, added 500ms rate-limiting between review API calls

### File List

- `prisma/schema.prisma` — Modified: Added `description`, `subtypes`, `workingHours` optional fields to Listing model
- `prisma/migrations/20260213153112_add_listing_description_subtypes_hours/migration.sql` — Created: Migration to add 3 columns
- `src/scripts/import-listings.ts` — Created: Outscraper import script (API + file modes, field resolution, validation, city caching, upserts, reviews, summary)
- `src/app/generated/prisma/` — Regenerated: Updated Prisma client types
- `data/test-outscraper-listings.json` — Created: Test fixture with 6 sample businesses (4 valid, 2 invalid)
