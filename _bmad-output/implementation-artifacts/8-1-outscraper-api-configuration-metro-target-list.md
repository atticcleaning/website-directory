# Story 8.1: Outscraper API Configuration & Metro Target List

Status: done

## Story

As a site administrator,
I want a documented list of 25 target US metros with corresponding Outscraper search queries and a verified API connection,
so that I can systematically import business listings across all target markets in subsequent stories.

## Acceptance Criteria

1. A metro configuration file exists at `data/metro-config.json` defining all 25 target metros with: metro name, city/state, Outscraper search query template, and expected listing volume tier.
2. The 25 metros are selected from the top US metros by population and attic-service search volume, covering geographic diversity (Sun Belt, Midwest, Northeast, West Coast).
3. The `OUTSCRAPER_API_KEY` environment variable is verified working against the live Outscraper Maps Search API v3 endpoint.
4. A single test metro (Phoenix, AZ — existing test data market) has been queried via API mode to confirm end-to-end flow: API call → data parsing → Prisma upsert → city creation → listing creation.
5. The test import produces a clean summary report showing: listings added, duplicates skipped, records rejected, cities created.
6. A `scripts/import-metro.ts` helper script exists that reads `data/metro-config.json` and calls `import-listings.ts` for a given metro key, simplifying batch operations in Stories 8.2/8.3.
7. Query templates use the format `"attic cleaning {city}, {state}"` and `"attic insulation {city}, {state}"` (two queries per metro) to maximize coverage of attic-related businesses.
8. The metro config includes a `searchQueries` array per metro, allowing flexible per-metro query customization.
9. All existing tests continue to pass (`npm run lint`, `npm run build`, type-check).

## Tasks / Subtasks

- [x] Task 1: Create metro configuration file (AC: #1, #2, #7, #8)
  - [x] 1.1 Research and select 25 target US metros based on population rank and geographic diversity
  - [x] 1.2 Create `data/metro-config.json` with metro definitions, search queries, and metadata
  - [x] 1.3 Include two search query templates per metro: "attic cleaning" and "attic insulation"
- [x] Task 2: Verify Outscraper API connectivity (AC: #3)
  - [x] 2.1 Confirm `OUTSCRAPER_API_KEY` is set in `.env`
  - [x] 2.2 Run a minimal API test query using existing `import-listings.ts --query` against Outscraper Maps Search API v3
  - [x] 2.3 Verify response format matches expected field aliases in import script
- [x] Task 3: Run test import for Phoenix metro (AC: #4, #5)
  - [x] 3.1 Run `npx tsx src/scripts/import-listings.ts --query "attic cleaning, Phoenix, AZ" --limit 20`
  - [x] 3.2 Verify listings upserted to database (new + updated from existing test data)
  - [x] 3.3 Verify summary report output is clean (no unexpected rejections)
  - [x] 3.4 Run `npx tsx src/scripts/classify-service-tags.ts` to verify classification works on API-imported data
- [x] Task 4: Create metro import helper script (AC: #6)
  - [x] 4.1 Create `src/scripts/import-metro.ts` that reads metro-config.json
  - [x] 4.2 Accept `--metro <key>` argument to import a single metro
  - [x] 4.3 Accept `--all` flag to import all metros sequentially
  - [x] 4.4 For each metro, call import-listings.ts logic for each search query in the metro's `searchQueries` array
  - [x] 4.5 Add `--with-reviews` pass-through flag
  - [x] 4.6 Output per-metro and aggregate summary
- [x] Task 5: Validate existing pipeline integrity (AC: #9)
  - [x] 5.1 Run `npm run lint` — must pass
  - [x] 5.2 Run `npx tsc --noEmit` — must pass
  - [x] 5.3 Run `npm run build` — must succeed (existing test data still works)

## Dev Notes

### Existing Pipeline — DO NOT Rebuild

The import pipeline is **fully built and tested** from Epic 1 (Stories 1.3, 1.4, 1.5). All three scripts exist and work:

| Script | Path | Purpose |
|--------|------|---------|
| `import-listings.ts` | `src/scripts/import-listings.ts` | Outscraper CSV/API import with upsert, dedup, validation |
| `classify-service-tags.ts` | `src/scripts/classify-service-tags.ts` | Keyword-based service tag classification (6 types) |
| `seed-zip-codes.ts` | `src/scripts/seed-zip-codes.ts` | GeoNames zip code seeding (~41K US zip codes) |

**API mode is already implemented** in `import-listings.ts`:
- `--query "search terms"` flag triggers Outscraper Maps Search API v3
- `--with-reviews` flag fetches reviews per listing (separate API call, 500ms rate limit)
- `--limit <n>` controls max results per query (default: 500)
- Multiple `--query` flags supported for multiple searches in one run

### Outscraper API Details

**Search endpoint:** `https://api.app.outscraper.com/maps/search-v3`
**Reviews endpoint:** `https://api.app.outscraper.com/maps/reviews-v3`
**Auth header:** `X-API-KEY: {OUTSCRAPER_API_KEY}`
**Rate limiting:** 500ms between review API calls (already implemented in import script)
**Timeout:** 60 seconds per request

### 25 Target Metros

Select from top US metros by population. Recommended list (covering geographic diversity):

| # | Metro | State | Region |
|---|-------|-------|--------|
| 1 | Phoenix | AZ | Southwest |
| 2 | Los Angeles | CA | West Coast |
| 3 | Houston | TX | Gulf Coast |
| 4 | Dallas | TX | South Central |
| 5 | Atlanta | GA | Southeast |
| 6 | Chicago | IL | Midwest |
| 7 | Denver | CO | Mountain West |
| 8 | Las Vegas | NV | Southwest |
| 9 | San Antonio | TX | South Central |
| 10 | Miami | FL | Southeast |
| 11 | Tampa | FL | Southeast |
| 12 | Orlando | FL | Southeast |
| 13 | Charlotte | NC | Southeast |
| 14 | Nashville | TN | Southeast |
| 15 | Austin | TX | South Central |
| 16 | San Diego | CA | West Coast |
| 17 | Sacramento | CA | West Coast |
| 18 | Riverside | CA | West Coast |
| 19 | San Jose | CA | West Coast |
| 20 | Jacksonville | FL | Southeast |
| 21 | Columbus | OH | Midwest |
| 22 | Indianapolis | IN | Midwest |
| 23 | San Francisco | CA | West Coast |
| 24 | Seattle | WA | Pacific NW |
| 25 | Minneapolis | MN | Midwest |

### Metro Config File Format

Create `data/metro-config.json`:

```json
{
  "metros": [
    {
      "key": "phoenix-az",
      "city": "Phoenix",
      "state": "AZ",
      "region": "Southwest",
      "tier": "high",
      "searchQueries": [
        "attic cleaning, Phoenix, AZ",
        "attic insulation, Phoenix, AZ"
      ]
    }
  ]
}
```

**Fields:**
- `key`: Matches city slug format (`slugify(city) + "-" + state.toLowerCase()`)
- `city`/`state`: For display and slug generation
- `region`: Geographic grouping (documentation only)
- `tier`: Expected volume — `"high"` (1000+ results), `"medium"` (500-1000), `"low"` (100-500)
- `searchQueries`: Array of Outscraper query strings for this metro

### import-metro.ts Script Design

The helper script should:
1. Read `data/metro-config.json`
2. Accept `--metro <key>` to import one metro or `--all` for all
3. For each metro, iterate its `searchQueries` array
4. For each query, programmatically invoke the same logic as `import-listings.ts --query`
5. **Do NOT shell out** to `import-listings.ts` — instead, import and call its core functions directly (refactor if needed to export them)
6. Pass through `--with-reviews` and `--limit` flags
7. Print per-metro summary + aggregate totals

**Important:** If `import-listings.ts` doesn't export its core logic as reusable functions, the dev should refactor it to export key functions (`fetchFromApi`, `processListings`, `importReviews`, etc.) and have both the CLI entry point and `import-metro.ts` use them. Keep the existing CLI interface unchanged.

### Environment Variables Required

```
OUTSCRAPER_API_KEY=your-outscraper-api-key    # Required for API mode
DATABASE_URL=postgresql://...                  # Already configured
```

Both are already in `.env.example`. The dev just needs to confirm the real key is set in `.env`.

### Database State Awareness

Current database contains **4 test listings** in Phoenix/Scottsdale/Tucson, AZ from file-based import (`data/test-outscraper-listings.json`). The API import will:
- **Update** existing listings if same `googlePlaceId` (upsert logic)
- **Add** new listings discovered by API
- **Create** new City records automatically for new cities found

The `seed-zip-codes.ts` has already been run — ~41K US zip codes are in the `ZipCode` table.

### Project Structure Notes

- New file: `data/metro-config.json` — metro definitions
- New file: `src/scripts/import-metro.ts` — metro import orchestrator
- Modified (maybe): `src/scripts/import-listings.ts` — export core functions for reuse
- No changes to app routes, components, or pages
- No changes to Prisma schema

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md#Story 8.1]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Pipeline]
- [Source: _bmad-output/planning-artifacts/prd.md#FR24-FR29]
- [Source: src/scripts/import-listings.ts — existing API mode implementation]
- [Source: src/scripts/classify-service-tags.ts — existing classification]
- [Source: .env.example — environment variable template]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

### Completion Notes List

- Task 1: Created `data/metro-config.json` with 25 metros (7 high-tier, 14 medium-tier, 4 low-tier), 50 total search queries (2 per metro). Geographic coverage: Southwest, West Coast, Gulf Coast, South Central, Southeast, Midwest, Mountain West, Pacific NW.
- Task 2: API key added to `.env`, verified working. Minimal test query (--limit 3) returned 3 results, 0 rejected, field aliases resolved correctly.
- Task 3: Phoenix test import (--limit 20): 20 processed, 8 added, 9 updated, 3 rejected (missing address — valid). 1 new city created. Classification: 92.3% rate (24/26 listings tagged), 38 total tags across all 6 service types. Database: 26 listings, 9 cities.
- Task 4: Created `src/scripts/import-metro.ts` — metro import orchestrator that reads `data/metro-config.json` and calls `runImport()` from refactored `import-listings.ts`. Supports `--metro <key>`, `--all`, `--with-reviews`, `--limit`, `--config`. Prints per-metro and aggregate summaries. Refactored `import-listings.ts` to export: `ImportSummary`, `ImportOptions`, `runImport()`, `emptyImportSummary()`, `mergeImportSummaries()`, `printImportSummary()`, `printDatabaseTotals()`, `createPrismaClient()`. Existing CLI interface unchanged.
- Task 5: All validations pass — `npm run lint` clean, `npx tsc --noEmit` clean, `npm run build` succeeds (35 pages).

### Change Log

- 2026-02-15: All tasks completed. Tasks 1, 4, 5 done first; Tasks 2, 3 unblocked after API key added.

### File List

- `data/metro-config.json` — NEW: 25 metro definitions with search queries
- `src/scripts/import-metro.ts` — NEW: Metro import orchestrator script
- `src/scripts/import-listings.ts` — MODIFIED: Refactored to export core functions (`runImport`, `ImportSummary`, etc.) for reuse by import-metro.ts. CLI entry point unchanged.

## Senior Developer Review

### Review Date
2026-02-15

### Reviewer Model
Claude Opus 4.6

### Review Findings

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| H1 | HIGH | `runImport()` re-queried ALL cities and listings from DB on each call — O(n) scaling when running `--all` across 25 metros | FIXED: Added `ImportCache` interface and `initImportCache()`. Cache loaded once in import-metro.ts and passed to all `runImport()` calls. Cache updated on new inserts. |
| M1 | MEDIUM | `__dirname` in import-metro.ts unreliable under ESM bundling | FIXED: Changed to `resolve(process.cwd(), "data/metro-config.json")` |
| M2 | MEDIUM | `process.exit(1)` in `runImport()` file-mode JSON parse error would crash import-metro mid-batch | FIXED: Replaced with `throw new Error(...)` |
| M3 | MEDIUM | Metro config had 0 Northeast US metros — geographic diversity gap | FIXED: Swapped Riverside/San Jose (CA) for New York/Philadelphia (Northeast) |
| L1 | LOW | Tier distribution (7 high, 14 medium, 4 low) may not match actual attic-service search volume | DEFERRED: Tiers are documentation-only; can adjust after Wave 1 import data |
| L2 | LOW | No `--dry-run` flag on import-metro.ts | DEFERRED: Not in ACs; can add in Story 8.2 if needed |

### Post-Fix Verification
- `npx tsc --noEmit` — clean
- `npm run lint` — clean
- `npm run build` — succeeds (44 pages)

### Verdict
**PASS** — All HIGH and MEDIUM issues resolved. Story meets all 9 acceptance criteria.
