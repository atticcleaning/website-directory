# Story 6.3: Search Analytics Logging

Status: done

## Story

As a **site owner**,
I want low-result search queries logged to the database,
So that I can prioritize geographic expansion based on real user demand.

## Acceptance Criteria

1. **SearchLog Table Existence:** The SearchLog table exists in the Prisma schema with fields: `id (cuid)`, `query (String)`, `resultCount (Int)`, `radiusMiles (Float)`, `latitude (Float, optional)`, `longitude (Float, optional)`, `createdAt (DateTime)`. Indexes on both `createdAt` and `query`.
2. **Search API Integration:** The search API route (at `GET /api/search`) integrates with SearchLog logging via the `searchListings()` function in `src/lib/search.ts`.
3. **Logging Trigger:** When a search query returns fewer than 3 results, the system inserts a record into the SearchLog table.
4. **Captured Data:** Each log entry captures: query text, result count (actual count returned), radius used (in miles), resolved latitude/longitude (when available), and timestamp.
5. **Asynchronous Logging:** Logging is asynchronous — it does not delay the search response to the client.
6. **No Logging Threshold:** Searches returning 3 or more results are NOT logged (to minimize storage).
7. **Admin Query Access:** The admin can query the SearchLog table via Prisma Studio or CLI to identify expansion priorities.
8. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with no regressions.

## Tasks / Subtasks

- [x] Task 1: Add conditional check to search logging (AC: #3, #6)
  - [x] 1.1 In `src/lib/search.ts`, wrap the existing `prisma.searchLog.create()` call in a conditional: only log when `enrichedResults.length < MIN_RESULTS` (which is the constant `3`, already defined on line 8).
  - [x] 1.2 The fire-and-forget pattern (no await, `.catch()` error handler) MUST be preserved — do NOT change the async behavior.

- [x] Task 2: Add query index to SearchLog schema (AC: #1, #7)
  - [x] 2.1 In `prisma/schema.prisma`, add `@@index([query])` to the SearchLog model (alongside the existing `@@index([createdAt])`).
  - [x] 2.2 Run `npx prisma generate` to regenerate the Prisma client.
  - [x] 2.3 Run `npx prisma db push` to apply the index to the database (or generate a migration if preferred).

- [x] Task 3: Build validation (AC: #8)
  - [x] 3.1 Run `npx tsc --noEmit` — zero type errors.
  - [x] 3.2 Run `npm run lint` — zero violations.
  - [x] 3.3 Run `npm run build` — compiles successfully with no regressions.

## Dev Notes

### Architecture Compliance

**Search Analytics Logging (architecture.md, Cross-Cutting Concerns):**
- Decision: Log search queries returning < 3 results for geographic expansion prioritization
- FR30: System logs search queries that return fewer than 3 results, capturing location data for expansion prioritization
- Logging happens in `src/lib/search.ts` within the `searchListings()` function — NOT in a separate helper file, NOT in middleware

**Fire-and-Forget Pattern (already implemented in Story 2.2):**
- The logging call uses `.catch()` without `await` — non-blocking
- Errors are logged to console but never thrown — cannot break the search API
- This pattern is preserved; only the conditional gate is added

**Database Indexes (architecture.md, Data Model):**
- `@@index([createdAt])` — already exists, enables date-range admin queries
- `@@index([query])` — MUST BE ADDED, enables admin GROUP BY query pattern for expansion prioritization

### What Already Exists (from Story 1.2 + Story 2.2)

**SearchLog Prisma model** (`prisma/schema.prisma:92-102`):
- All required fields already defined: `id`, `query`, `resultCount`, `radiusMiles`, `latitude`, `longitude`, `createdAt`
- `@@index([createdAt])` exists
- Missing: `@@index([query])` — needed for admin queries grouping by search term

**Fire-and-forget logging** (`src/lib/search.ts:338-349`):
- Already implemented with correct data capture
- Currently logs ALL searches unconditionally
- Must be changed to only log when `enrichedResults.length < MIN_RESULTS`

**Search API route** (`src/app/api/search/route.ts`):
- No changes needed — logging lives in `searchListings()`, not the route handler
- Route handler simply calls `searchListings()` and returns JSON

### What This Story Actually Changes

This story has a very small code footprint because most infrastructure already exists:

1. **One conditional gate** — wrapping the existing logging call in an `if` check
2. **One schema index** — adding `@@index([query])` for admin queries

### What This Story Does NOT Do

- Does NOT create a new `src/lib/search-logger.ts` file — logging stays inline in `searchListings()`
- Does NOT modify the search API route handler (`src/app/api/search/route.ts`)
- Does NOT add any client-side analytics or tracking
- Does NOT create an admin dashboard or analytics API
- Does NOT add any new environment variables
- Does NOT create tests (testing framework not yet set up)
- Does NOT change any search behavior, UI, or response format

### Previous Story Learnings (from Stories 6.1 + 6.2)

- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types
- **Build workers capped at 3**: `experimental.cpus: 3` in next.config.ts to stay within DB connection limits
- **Prisma connection pool**: `max: 3` with lazy Proxy initialization in `prisma.ts`. Unconditional global caching.
- **`MIN_RESULTS` constant**: Already defined as `3` in `src/lib/search.ts:8` — use this constant, not a hardcoded `3`
- **Fire-and-forget error pattern**: Use `.catch((err: unknown) => console.error(...))` — no await, no re-throw

### Admin Query Examples (via Prisma Studio or CLI)

After implementation, the admin can identify expansion priorities:

```sql
-- Top searched locations with no/few results
SELECT query, COUNT(*) as occurrences, AVG("radiusMiles") as avg_radius
FROM "SearchLog"
GROUP BY query
ORDER BY occurrences DESC
LIMIT 20;

-- Recent low-result searches by geography
SELECT query, "resultCount", "radiusMiles", latitude, longitude, "createdAt"
FROM "SearchLog"
WHERE "createdAt" > NOW() - INTERVAL '30 days'
ORDER BY "createdAt" DESC;
```

### Project Structure Notes

```
src/
├── app/
│   └── api/
│       └── search/
│           └── route.ts              (no change)
├── lib/
│   ├── search.ts                     ← MODIFIED (add conditional to logging)
│   ├── prisma.ts                     (no change)
│   └── seo.ts                        (no change)
│
prisma/
└── schema.prisma                     ← MODIFIED (add @@index([query]))
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 6, Story 6.3] — FR30, acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md#Cross-Cutting Concerns] — Search analytics logging requirement
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Model] — SearchLog schema definition
- [Source: src/lib/search.ts#338-349] — Existing fire-and-forget logging implementation
- [Source: prisma/schema.prisma#92-102] — Existing SearchLog model
- [Source: _bmad-output/implementation-artifacts/6-1-seo-metadata-schema-markup.md] — Story 6.1 learnings
- [Source: _bmad-output/implementation-artifacts/6-2-xml-sitemap-crawl-control.md] — Story 6.2 learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- No issues encountered — minimal code change, build passed on first attempt

### Completion Notes List

- All 8 ACs implemented and verified
- Wrapped existing `prisma.searchLog.create()` in `if (enrichedResults.length < MIN_RESULTS)` conditional gate
- Fire-and-forget pattern preserved: no `await`, `.catch()` error handler intact
- Added `@@index([query])` to SearchLog schema for admin GROUP BY queries
- Prisma client regenerated successfully
- Build: 35 static pages, no regressions
- Only 2 files changed — minimal footprint since logging infrastructure already existed from Stories 1.2 and 2.2

### File List

- `src/lib/search.ts` — MODIFIED: Added conditional gate to only log searches with < 3 results
- `prisma/schema.prisma` — MODIFIED: Added `@@index([query])` to SearchLog model
