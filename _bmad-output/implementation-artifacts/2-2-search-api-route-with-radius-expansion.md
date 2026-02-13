# Story 2.2: Search API Route with Radius Expansion

Status: done

## Story

As a **homeowner**,
I want to search for attic cleaning companies by zip code, city, state, or company name,
So that I find relevant local contractors quickly.

## Acceptance Criteria

1. **Search API Endpoint:** `GET /api/search` accepts query parameters: `q` (search query), `service` (filter by ServiceType), `sort` (rating|reviews|distance)
2. **Zip Code Resolution:** The API resolves zip codes to coordinates using the ZipCode lookup table (exact match on `code` field)
3. **City Name Resolution:** The API resolves city names to coordinates using the City table (case-insensitive match on `name` field, optionally with state)
4. **Full-Text Search:** The API performs Postgres full-text search (tsvector + pg_trgm) on listing `name` and `address` fields
5. **Default Radius:** Returns results within a default radius (e.g., 10 miles) of the resolved location
6. **Radius Expansion (20mi):** When fewer than 3 results are found, automatically expands radius to 20 miles
7. **Radius Expansion (50mi):** When still fewer than 3 results after 20mi, expands to 50 miles
8. **SearchResponse Format:** Response follows the exact interface: `{ results: ListingResult[], meta: { query, totalCount, expanded, radiusMiles, location } }`
9. **Always 200 OK:** The API never returns error responses — catches all errors, returns empty results with metadata, logs errors server-side
10. **Empty Results:** Returns `{ results: [], meta: { totalCount: 0, expanded: true, radiusMiles: 50 } }` when no results found after full expansion
11. **Performance:** Search response time < 500ms including radius expansion (NFR-P4)
12. **Security:** Search inputs sanitized via Prisma parameterized queries — no raw string interpolation in SQL (NFR-S3)
13. **Search Logging:** Each search is logged to the SearchLog table with query, resultCount, radiusMiles, latitude, longitude

## Tasks / Subtasks

- [x] Task 1: Create shared TypeScript types (AC: #8)
  - [x] 1.1 Create `src/types/index.ts` with `SearchResponse` and `ListingResult` interfaces matching architecture spec exactly
  - [x] 1.2 Re-export `ServiceType` enum from Prisma generated types for use across the codebase

- [x] Task 2: Create search query logic in `src/lib/search.ts` (AC: #2, #3, #4, #5, #6, #7, #11, #12)
  - [x] 2.1 Create `resolveLocation(query: string)` function — attempts zip code lookup first (exact match on ZipCode.code), then city lookup (case-insensitive on City.name), returns `{ latitude, longitude, city, state } | null`
  - [x] 2.2 Create `searchListings(params)` function — core search logic using Prisma `$queryRaw` with parameterized SQL for tsvector + pg_trgm search on Listing name and address
  - [x] 2.3 Implement radius expansion loop: try default radius → if < 3 results, try 20mi → if < 3 results, try 50mi
  - [x] 2.4 Implement distance calculation using Haversine formula in SQL (or post-query in TypeScript) for `distanceMiles` field
  - [x] 2.5 Implement service type filtering: when `service` param provided, filter results to listings that have a matching ServiceTag
  - [x] 2.6 Implement sort logic: `rating` (starRating DESC), `reviews` (reviewCount DESC), `distance` (distanceMiles ASC). Default sort is `rating`
  - [x] 2.7 Include `reviewSnippet` — first review text truncated to ~120 chars, or null if no reviews
  - [x] 2.8 Include `serviceTags` — array of ServiceType enum values for each listing
  - [x] 2.9 Include `citySlug` and `companySlug` from Listing and City relations

- [x] Task 3: Create API route handler at `src/app/api/search/route.ts` (AC: #1, #8, #9, #10, #13)
  - [x] 3.1 Create `src/app/api/search/route.ts` with `GET` handler
  - [x] 3.2 Parse query params from `request.nextUrl.searchParams`: `q`, `service`, `sort`
  - [x] 3.3 Call search logic from `src/lib/search.ts` — pass parsed params
  - [x] 3.4 Wrap entire handler in try/catch — on any error, return empty SearchResponse with `console.error` logging
  - [x] 3.5 Log search to SearchLog table (fire-and-forget, do NOT await — don't block response)
  - [x] 3.6 Return `NextResponse.json(searchResponse)` with 200 status always

- [x] Task 4: Validate build and test (AC: #11)
  - [x] 4.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 4.2 Run `npm run lint` — zero violations
  - [x] 4.3 Run `npm run build` — compiles successfully
  - [x] 4.4 Manual test via curl: `curl "http://localhost:3000/api/search?q=phoenix"` — verify response shape matches SearchResponse interface
  - [x] 4.5 Manual test: empty query → empty results with expanded: true
  - [x] 4.6 Manual test: zip code query → resolves coordinates from ZipCode table
  - [x] 4.7 Manual test: service filter → only listings with matching ServiceTag returned

## Dev Notes

### Architecture Compliance

**File Structure (architecture.md):**
- `src/app/api/search/route.ts` — API route handler (Next.js App Router convention)
- `src/lib/search.ts` — Search query logic (all raw SQL lives here, NOT in route.ts)
- `src/types/index.ts` — Shared TypeScript types (SearchResponse, ListingResult)
- NO `src/services/`, NO `src/repositories/`, NO `src/api/` client wrapper — these are forbidden anti-patterns

**API Boundary (architecture.md#Architectural Boundaries):**
- `src/app/api/search/route.ts` is the ONLY API route in the entire application
- It accepts GET requests with query parameters
- It returns `SearchResponse` JSON (always 200 OK)
- It consumes `src/lib/search.ts` for query logic and `src/lib/prisma.ts` for database access

**Naming Conventions:**
- Files: kebab-case (`search.ts`, `route.ts`)
- Interfaces: PascalCase (`SearchResponse`, `ListingResult`)
- Prisma models: PascalCase (`Listing`, `City`, `ZipCode`, `SearchLog`)
- Prisma fields: camelCase (`starRating`, `reviewCount`, `citySlug`)
- Enums: SCREAMING_SNAKE (`RODENT_CLEANUP`, `INSULATION_REMOVAL`)

**Import Order Convention:**
1. React/Next.js imports (e.g., `import { NextRequest, NextResponse } from "next/server"`)
2. Third-party library imports
3. `@/components/` imports
4. `@/lib/` imports (e.g., `import prisma from "@/lib/prisma"`)
5. `@/types/` imports (e.g., `import type { SearchResponse } from "@/types"`)

### SearchResponse Interface (EXACT — from architecture.md)

```typescript
interface SearchResponse {
  results: ListingResult[]
  meta: {
    query: string
    totalCount: number
    expanded: boolean
    radiusMiles: number
    location: {
      city: string
      state: string
      latitude: number
      longitude: number
    } | null
  }
}

interface ListingResult {
  id: string
  name: string
  starRating: number
  reviewCount: number
  phone: string | null
  website: string | null
  address: string
  distanceMiles: number | null
  serviceTags: ServiceType[]
  reviewSnippet: string | null
  citySlug: string
  companySlug: string
}
```

**Rules from architecture.md:**
- API response is always 200 OK with the above structure. No error responses to users.
- Empty results: `{ results: [], meta: { totalCount: 0, expanded: true, radiusMiles: 50 } }`
- No wrapper objects (`{ data: ..., error: ... }` pattern NOT used)
- Null for missing optional values, never undefined in JSON

### Search Logic Spec (src/lib/search.ts)

**Location Resolution Strategy:**
1. Check if `q` matches a 5-digit zip code pattern (`/^\d{5}$/`) → query `ZipCode` table for exact match on `code`
2. If not a zip, try city name resolution → query `City` table case-insensitive on `name` (and optionally state if query includes ", XX" state suffix)
3. If no location resolved → fall back to text-based search on Listing `name` and `address` (company name search), no radius filtering
4. If location resolved → use coordinates for radius-based search with full-text matching

**Full-Text Search SQL Pattern (Prisma $queryRaw):**
```typescript
// Use Prisma.$queryRaw with tagged template literals for parameterized queries
// This provides SQL injection protection automatically
const results = await prisma.$queryRaw`
  SELECT l.id, l.name, l."starRating", l."reviewCount", l.phone, l.website, l.address,
         l.slug as "companySlug", c.slug as "citySlug",
         (
           3959 * acos(
             cos(radians(${lat})) * cos(radians(l.latitude))
             * cos(radians(l.longitude) - radians(${lng}))
             + sin(radians(${lat})) * sin(radians(l.latitude))
           )
         ) AS "distanceMiles"
  FROM "Listing" l
  JOIN "City" c ON l."cityId" = c.id
  WHERE (
    to_tsvector('english', l.name) @@ plainto_tsquery('english', ${query})
    OR to_tsvector('english', l.address) @@ plainto_tsquery('english', ${query})
    OR l.name ILIKE ${`%${query}%`}
    OR l.address ILIKE ${`%${query}%`}
  )
  AND (
    3959 * acos(
      cos(radians(${lat})) * cos(radians(l.latitude))
      * cos(radians(l.longitude) - radians(${lng}))
      + sin(radians(${lat})) * sin(radians(l.latitude))
    )
  ) <= ${radiusMiles}
  ORDER BY l."starRating" DESC
  LIMIT 50
`
```

**CRITICAL: Prisma 7 Raw Query Syntax:**
- Use `prisma.$queryRaw` with tagged template literals (backtick syntax) — NOT `prisma.$queryRawUnsafe()`
- Tagged template literals automatically parameterize variables — SQL injection safe
- Import path for Prisma: `import prisma from "@/lib/prisma"` (default export from singleton)
- Import PrismaClient types: `import { Prisma } from "@/app/generated/prisma/client"` (if needed for type casting raw results)
- Import Prisma enums: `import { ServiceType } from "@/app/generated/prisma/client"`

**Radius Expansion Logic:**
```
DEFAULT_RADIUS = 10  (miles)
EXPANDED_RADIUS_1 = 20
EXPANDED_RADIUS_2 = 50
MIN_RESULTS = 3

1. Search with DEFAULT_RADIUS
2. If results.length < MIN_RESULTS → search with EXPANDED_RADIUS_1, set expanded = true
3. If still results.length < MIN_RESULTS → search with EXPANDED_RADIUS_2, set expanded = true
4. Return results with final radiusMiles and expanded flag
```

**Sort Implementation:**
- `rating` (default): `ORDER BY l."starRating" DESC, l."reviewCount" DESC`
- `reviews`: `ORDER BY l."reviewCount" DESC, l."starRating" DESC`
- `distance`: `ORDER BY "distanceMiles" ASC` (only valid when location resolved)
- If `sort=distance` but no location resolved, fall back to `rating` sort

**Service Filter Implementation:**
- When `service` param is provided (e.g., `service=RODENT_CLEANUP`)
- Add a JOIN or subquery to filter listings that have a matching ServiceTag: `EXISTS (SELECT 1 FROM "ServiceTag" st WHERE st."listingId" = l.id AND st."serviceType" = ${service})`
- Validate the service param against the ServiceType enum — ignore invalid values

**Review Snippet:**
- For each listing result, fetch the first review (by `publishedAt` DESC) from the Review table
- Truncate `text` to ~120 characters with ellipsis if longer
- Return `null` if listing has no reviews
- This can be done as a subquery or a separate query after main search — choose what's simpler

### API Route Handler Spec (src/app/api/search/route.ts)

```typescript
import { NextRequest, NextResponse } from "next/server"
import { searchListings } from "@/lib/search"
import type { SearchResponse } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q") || ""
    const service = searchParams.get("service") || undefined
    const sort = searchParams.get("sort") || "rating"

    const response = await searchListings({ q, service, sort })
    return NextResponse.json(response)
  } catch (error) {
    console.error("Search API error:", error)
    // Never return errors to users — return empty results
    const emptyResponse: SearchResponse = {
      results: [],
      meta: {
        query: "",
        totalCount: 0,
        expanded: true,
        radiusMiles: 50,
        location: null,
      },
    }
    return NextResponse.json(emptyResponse)
  }
}
```

**Route handler rules:**
- Keep the route handler THIN — it only parses params, calls search logic, returns response
- All search logic lives in `src/lib/search.ts` — the route handler does NOT contain SQL queries
- Search logging happens inside `searchListings()` or fire-and-forget from route handler
- No `"use client"` — this is a server-side API route

### Search Logging Spec

**Fire-and-forget pattern** — don't block the response:
```typescript
// Inside search logic or route handler — don't await
prisma.searchLog.create({
  data: {
    query: q,
    resultCount: results.length,
    radiusMiles: finalRadius,
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
  },
}).catch((err) => console.error("Search log failed:", err))
```

### Database Context (Already Exists)

**GIN Indexes (migration: 20260213045833_add_gin_indexes):**
- `listing_name_search_idx` — GIN index on `to_tsvector('english', name)` on Listing
- `listing_address_search_idx` — GIN index on `to_tsvector('english', address)` on Listing
- `listing_name_trgm_idx` — GIN trigram index on `name` on Listing
- `listing_address_trgm_idx` — GIN trigram index on `address` on Listing
- `pg_trgm` extension is enabled

These indexes are already created — do NOT create them again. They support `to_tsvector()` full-text search and `ILIKE`/`%` trigram fuzzy matching.

**Prisma Schema Models Used:**
- `Listing` — id, name, slug, starRating, reviewCount, phone?, website?, address, latitude, longitude, cityId
- `City` — id, name, state, slug, latitude, longitude
- `ZipCode` — id, code (unique), city, state, latitude, longitude
- `Review` — id, listingId, authorName, rating, text?, publishedAt
- `ServiceTag` — id, listingId, serviceType (ServiceType enum)
- `SearchLog` — id, query, resultCount, radiusMiles, latitude?, longitude?, createdAt

**Prisma Client Singleton:**
- Import: `import prisma from "@/lib/prisma"`
- Uses PrismaPg adapter (Prisma 7 pattern)
- Generated client at: `src/app/generated/prisma/client`

### Haversine Distance Formula

The Haversine formula calculates the great-circle distance between two points on a sphere. In SQL for miles:
```sql
3959 * acos(
  cos(radians(lat1)) * cos(radians(lat2))
  * cos(radians(lng2) - radians(lng1))
  + sin(radians(lat1)) * sin(radians(lat2))
)
```
Where 3959 is Earth's radius in miles.

**Important:** The `acos()` function can return NaN if the argument is slightly > 1 or < -1 due to floating-point precision. Wrap with `LEAST(1, GREATEST(-1, ...))` or use a CASE expression to handle edge cases.

### Error Handling Pattern (architecture.md)

- **Search API: Never throws.** Catches all errors, returns empty results with metadata. Logs errors server-side with `console.error`.
- No `try/catch` in individual utility functions — let errors propagate to the route handler's top-level catch
- The route handler's catch block returns the standard empty SearchResponse

### What This Story Does NOT Do

- Does NOT create the SearchBar component (Story 2.3)
- Does NOT create the search results page at `/search` (Story 2.5)
- Does NOT create ListingCard, StarRating, or ServiceTagChip (Story 2.4)
- Does NOT add any `"use client"` components
- Does NOT modify the root layout, header, or footer
- Does NOT create loading states or error boundaries
- Does NOT implement client-side filtering/sorting (that's the search results page responsibility)
- Does NOT add any npm dependencies — all search functionality uses Prisma raw SQL and built-in Node/Next.js APIs

### Anti-Patterns to Avoid

- **Do NOT use `prisma.$queryRawUnsafe()`** — always use tagged template literal `prisma.$queryRaw` for SQL injection safety
- **Do NOT put SQL queries in the route handler** — all search SQL lives in `src/lib/search.ts`
- **Do NOT create `src/services/search-service.ts`** — no service layer, use `src/lib/search.ts` directly
- **Do NOT use an external geocoding API** — use the pre-populated ZipCode and City tables
- **Do NOT install any additional packages** — Prisma raw SQL handles everything
- **Do NOT create `loading.tsx`** — anti-pattern per architecture
- **Do NOT create barrel files (index.ts) in `src/lib/`** — only `src/types/index.ts` is a legitimate types barrel
- **Do NOT use `React.use()` or data fetching hooks** — this is a server-side API route
- **Do NOT return HTTP error status codes** — always return 200 OK with SearchResponse structure
- **Do NOT use string concatenation for SQL** — only Prisma tagged template literals
- **Do NOT add rate limiting in code** — Cloudflare handles rate limiting on `/api/search`

### Previous Story Learnings (from Story 2.1)

- **Build verification is critical:** Always run `tsc --noEmit`, `lint`, and `build` before marking done
- **Code review catches real issues:** Story 2.1 had 3 medium-severity issues (sticky footer, mobile visibility, heading hierarchy) — follow specs precisely to minimize review fixes
- **Import pattern established:** `import Link from "next/link"` for navigation, `import prisma from "@/lib/prisma"` for database
- **Prisma 7 import path:** `"../app/generated/prisma/client"` (or `@/app/generated/prisma/client` with path alias) — with `/client` suffix required
- **Font classes on body:** `${plusJakartaSans.variable} ${sourceSerif4.variable} ${lora.variable}` — do NOT modify these

### Project Structure Notes

Current state after Story 2.1:
```
src/
├── app/
│   ├── globals.css          # Tailwind + custom tokens (modified in 2.1)
│   ├── layout.tsx           # Root layout with Header + Footer (modified in 2.1)
│   ├── page.tsx             # Default Next.js page (unmodified — Story 2.6)
│   └── generated/prisma/    # Prisma generated client
├── components/
│   ├── header.tsx           # Header with logo + search placeholder (created in 2.1)
│   ├── footer.tsx           # Footer with cities, resources, legal (created in 2.1)
│   └── ui/                  # shadcn/ui primitives
├── lib/
│   ├── utils.ts             # cn() helper (shadcn default)
│   └── prisma.ts            # Prisma client singleton
```

**New files this story creates:**
- `src/types/index.ts` (NEW)
- `src/lib/search.ts` (NEW)
- `src/app/api/search/route.ts` (NEW)

**Directories that need to be created:**
- `src/types/` — does NOT exist yet
- `src/app/api/search/` — does NOT exist yet

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2 (line 376)] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/architecture.md#API Response Format (line 453)] — SearchResponse and ListingResult interfaces
- [Source: _bmad-output/planning-artifacts/architecture.md#Single API Route: Search (line 254)] — API design, parameters, error handling
- [Source: _bmad-output/planning-artifacts/architecture.md#Full-Text Search (line 233)] — tsvector + pg_trgm decision, Prisma raw SQL
- [Source: _bmad-output/planning-artifacts/architecture.md#Geocoding (line 228)] — Build-time lookup table, ZipCode table
- [Source: _bmad-output/planning-artifacts/architecture.md#Architectural Boundaries (line 660)] — API boundary, data boundary
- [Source: _bmad-output/planning-artifacts/architecture.md#Error Handling (line 516)] — Never throws, empty results pattern
- [Source: _bmad-output/planning-artifacts/architecture.md#Search Logging (line 261)] — SearchLog insert in route handler
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns (line 393)] — File locations
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines (line 554)] — Anti-patterns
- [Source: prisma/schema.prisma] — All model definitions
- [Source: prisma/migrations/20260213045833_add_gin_indexes/migration.sql] — GIN indexes already created
- [Source: src/lib/prisma.ts] — Prisma singleton pattern
- [Source: _bmad-output/implementation-artifacts/2-1-root-layout-header-footer.md] — Previous story learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — implementation was straightforward with no debugging needed.

### Completion Notes List

- Created `src/types/index.ts` with `SearchResponse` and `ListingResult` interfaces matching architecture spec, re-exports `ServiceType` enum from Prisma generated types
- Created `src/lib/search.ts` with complete search logic:
  - `resolveLocation()` — resolves zip codes (5-digit exact match on ZipCode table), city names with optional state (case-insensitive on City table), returns coordinates or null
  - `searchByRadius()` — Prisma `$queryRaw` with Haversine distance in SQL, radius-only filtering (no text filter), service type filtering via EXISTS subquery, configurable sort
  - `searchByText()` — text-only search fallback when no location resolved, tsvector full-text + ILIKE trigram matching
  - `enrichResults()` — batch-loads service tags and review snippets in parallel via Promise.all (avoids N+1), truncates review text to ~120 chars
  - `searchListings()` — main entry point with radius expansion loop (10mi → 20mi → 50mi), fire-and-forget search logging
- Haversine formula uses `LEAST(1.0, GREATEST(-1.0, ...))` guard against floating-point precision errors in `acos()`
- Created `src/app/api/search/route.ts` — thin GET handler parsing `q`, `service`, `sort` params, delegates to `searchListings()`, try/catch returns empty SearchResponse on any error
- Search logging uses fire-and-forget `.catch()` pattern — never blocks the response
- All SQL uses Prisma tagged template literals (`$queryRaw`) for automatic parameterization — no string interpolation
- ServiceType enum cast in SQL uses `${service}::"ServiceType"` for Postgres enum compatibility
- Zero TypeScript errors, zero lint violations, build compiles successfully
- Build output confirms `/api/search` registered as dynamic server-rendered route
- Code review fixes applied: H1 (removed text filter from radius search — city/zip queries now return all listings in radius), M1 (serviceTags typed as ServiceType[] not string[]), M2 (service param validated against enum — invalid values silently ignored), M3 (query truncated to 200 chars max)

### Change Log

- 2026-02-12: Created types/index.ts, lib/search.ts, app/api/search/route.ts — full search API implementation
- 2026-02-12: Code review — separated radius search from text search, added service param validation, query length limit, proper RawListingRow type, parallel enrichment queries

### File List

- src/types/index.ts (new)
- src/lib/search.ts (new)
- src/app/api/search/route.ts (new)
