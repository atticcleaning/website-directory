# Story 12.1: Photo Data Model & Import Pipeline Extension

Status: done

## Story

As a site visitor,
I want to see real business photos on listing pages,
so that I can visually verify the legitimacy and quality of attic cleaning companies before contacting them.

## Acceptance Criteria

1. `ListingPhoto` model added to Prisma schema with migration
2. `Listing` model has `photos` relation (one-to-many)
3. Import script maps Outscraper's `photo` field (single cover URL) and `photos` array (if present) to `ListingPhoto` records
4. Maximum 10 photos imported per listing
5. First photo flagged as `isPrimary: true`
6. Import is idempotent — re-running deletes and re-creates photos for each processed listing
7. Import summary report includes: "Photos imported: X listings with photos, Y total photos"
8. `remotePatterns` configured in `next.config.ts` for Google image domains
9. CSP `img-src` updated to allow Google image domains
10. Existing listing data re-imported to populate photos for all listings

## Tasks / Subtasks

- [x] Task 1: Add `ListingPhoto` model to Prisma schema (AC: 1, 2)
  - [x] 1.1 Add `ListingPhoto` model with fields: `id`, `listingId`, `url`, `isPrimary`, `sortOrder`, `createdAt`
  - [x] 1.2 Add `photos ListingPhoto[]` back-reference to `Listing` model
  - [x] 1.3 Run `npx prisma db push` to sync schema (migration drift prevented `migrate dev`; schema pushed directly)
  - [x] 1.4 Verify generated client at `src/app/generated/prisma` includes `listingPhoto` model

- [x] Task 2: Update `next.config.ts` — remote image patterns + CSP (AC: 8, 9)
  - [x] 2.1 Add `images.remotePatterns` array for Google photo CDN domains
  - [x] 2.2 Update CSP `img-src` directive to allow Google image domains
  - [x] 2.3 Verify build succeeds with updated config

- [x] Task 3: Extend import pipeline for photo data (AC: 3, 4, 5, 6, 7)
  - [x] 3.1 Add `extractPhotoUrls()` function (dedicated extractor, not FIELD_ALIASES — per Dev Notes)
  - [x] 3.2 Add `photosImported` and `listingsWithPhotos` to `ImportSummary` interface
  - [x] 3.3 Update `emptyImportSummary()`, `mergeImportSummaries()`, `printImportSummary()`
  - [x] 3.4 Add photo extraction logic after listing upsert — delete existing photos, create new ones
  - [x] 3.5 Enforce max 10 photos per listing, mark first as `isPrimary: true`

- [x] Task 4: Re-import existing data to populate photos (AC: 10)
  - [x] 4.1 Re-run import for all 25 metros via Outscraper API (`npx tsx src/scripts/import-metro.ts --all`)
  - [x] 4.2 Verify photo counts in import summary output — 1,112 photos across 1,112 listings

## Dev Notes

### Prisma Schema — ListingPhoto Model

Add this model to `prisma/schema.prisma` (after the `ServiceTag` model, before `ZipCode`):

```prisma
model ListingPhoto {
  id        String   @id @default(cuid())
  listing   Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  listingId String
  url       String
  isPrimary Boolean  @default(false)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())

  @@index([listingId])
}
```

Add the back-reference to the `Listing` model (after the `serviceTags` line):
```prisma
photos        ListingPhoto[]
```

**Design decisions:**
- `onDelete: Cascade` ensures deleting a listing also deletes its photos. Note: `Review` and `ServiceTag` do NOT have `onDelete: Cascade` (they use the default `Restrict`), so listing deletion requires removing reviews/tags first
- No `width`/`height` fields — Google Maps photo dimensions are embedded in URL parameters (e.g., `=w800-h500-k-no`), not available as standalone metadata from Outscraper. Next.js `<Image>` will use `fill` or explicit sizing at the component level (Story 12.2/12.3)
- `@@index([listingId])` is critical for query performance when loading photos for a listing page

### next.config.ts — Remote Patterns

Add `images` config to the `nextConfig` object:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "**.googleusercontent.com",
    },
    {
      protocol: "https",
      hostname: "streetviewpixels-pa.googleapis.com",
    },
    {
      protocol: "https",
      hostname: "**.ggpht.com",
    },
  ],
},
```

`**` in hostname matches any number of subdomains — covers `lh3`, `lh4`, `lh5`, `lh6` subdomains. Also include `**.ggpht.com` (older Google CDN aliases for the same images).

### next.config.ts — CSP Update

Update the `img-src` directive:
```
OLD: "img-src 'self' data:"
NEW: "img-src 'self' data: https://*.googleusercontent.com https://*.ggpht.com https://streetviewpixels-pa.googleapis.com"
```

### Import Pipeline — Photo Field Structure

**What Outscraper returns for the standard Google Maps places scraper:**

| Field | Type | Description |
|---|---|---|
| `photo` | `string` | Single cover photo URL (most common) |
| `photos_count` | `integer` | Total photos on Google Maps |
| `street_view` | `string` | Street View URL (backup) |

The standard places endpoint (`maps/search-v3`) returns a single `photo` URL string per listing, NOT a photos array. The dedicated Google Maps Photos Scraper (separate product) returns multiple photos with `photo_link` and `big_photo_link` fields.

**Implementation approach:**
1. Add to `FIELD_ALIASES`: `photo: ["photo", "photo_url"]`
2. Also check for `photos` field directly (array of URLs, if present in export data)
3. Extract photo URLs into an array, deduplicate, cap at 10
4. Create `ListingPhoto` records with `sortOrder` = array index, first = `isPrimary: true`

**Photo extraction function** (add to `import-listings.ts`):

```typescript
function extractPhotoUrls(biz: Record<string, unknown>): string[] {
  const urls: string[] = []

  // Single cover photo (standard places scraper)
  const singlePhoto = biz.photo ?? biz.photo_url
  if (typeof singlePhoto === "string" && singlePhoto.startsWith("http")) {
    urls.push(singlePhoto)
  }

  // Photos array (if present from dedicated scraper or enhanced export)
  const photosArray = biz.photos
  if (Array.isArray(photosArray)) {
    for (const item of photosArray) {
      if (typeof item === "string" && item.startsWith("http")) {
        urls.push(item)
      } else if (item && typeof item === "object") {
        // Handle object format: { photo_link, big_photo_link }
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
```

### Import Pipeline — Photo Upsert Pattern

Photos must be imported **idempotently**. After the listing upsert, within the same loop iteration:

```typescript
// After listing upsert (line ~630 area):
const photoUrls = extractPhotoUrls(biz)
if (photoUrls.length > 0) {
  // Delete existing photos for this listing (idempotent re-import)
  await prisma.listingPhoto.deleteMany({ where: { listingId: listing.id } })

  // Create new photo records
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
```

This pattern (delete + create) matches the existing `classify-service-tags.ts` approach for atomic tag replacement.

### ImportSummary Updates

```typescript
// Add to ImportSummary interface:
photosImported: number
listingsWithPhotos: number

// Add to emptyImportSummary():
photosImported: 0,
listingsWithPhotos: 0,

// Add to mergeImportSummaries():
target.photosImported += source.photosImported
target.listingsWithPhotos += source.listingsWithPhotos

// Add to printImportSummary() output:
console.log(`  Photos imported:    ${summary.photosImported} photos (${summary.listingsWithPhotos} listings with photos)`)
```

Always print photo stats (not gated by `showReviews` flag).

### Prisma Migration Command

```bash
npx prisma migrate dev --name add_listing_photos
```

This generates a migration SQL file at `prisma/migrations/<timestamp>_add_listing_photos/migration.sql` and regenerates the Prisma client. The generated SQL will create the `ListingPhoto` table, add the `listingId` foreign key with `CASCADE` delete, and create the `listingId` index.

For production deployment: `npx prisma migrate deploy`

### Project Structure Notes

**Files to create:**
- `prisma/migrations/<timestamp>_add_listing_photos/migration.sql` (auto-generated by Prisma)

**Files to modify:**
| File | Change |
|---|---|
| `prisma/schema.prisma` | Add `ListingPhoto` model + `photos` relation on `Listing` |
| `next.config.ts` | Add `images.remotePatterns` + update CSP `img-src` |
| `src/scripts/import-listings.ts` | Add photo extraction, import logic, summary fields |

**Files NOT to modify (future stories):**
- `src/app/[citySlug]/[companySlug]/page.tsx` — Story 12.2 (gallery)
- `src/components/listing-card.tsx` — Story 12.3 (thumbnails)
- `src/types/index.ts` — Story 12.3 (`ListingResult` type)
- `src/app/[citySlug]/page.tsx` — Story 12.3 (city page query)
- `src/lib/search.ts` — Story 12.3 (search enrichment)
- `src/lib/seo.ts` — Story 12.4 (OG image)

**Naming conventions (enforced by existing schema):**
- Model: `ListingPhoto` (PascalCase)
- Fields: `listingId`, `isPrimary`, `sortOrder` (camelCase)
- Table access: `prisma.listingPhoto` (camelCase, auto-generated)

### Existing Patterns to Follow

**Field resolution pattern** — The import script uses `FIELD_ALIASES` + `resolveField()` / `resolveString()` / `resolveNumber()` for flexible field mapping. Photo fields don't need aliases in `FIELD_ALIASES` since they're handled by the dedicated `extractPhotoUrls()` function that checks multiple field names directly.

**Upsert pattern** — Listings use `prisma.listing.upsert({ where: { googlePlaceId } })`. Photos use delete-all + create-many per listing (not upsert) because photo URLs may change between imports and there's no stable unique identifier per photo.

**Summary reporting** — Follows the existing `printImportSummary()` box format with `═══` borders and aligned labels.

**Import cache** — The `ImportCache` interface doesn't need photo changes. Photos are imported per-listing during the main loop, not pre-cached.

### Google Maps Photo URL Format Reference

URLs follow this pattern:
```
https://lh5.googleusercontent.com/p/AF1QipNiKn0x...=w800-h500-k-no
```

URL parameter tokens (appended after `=`, separated by `-`):
- `w#` — width in pixels
- `h#` — height in pixels
- `s#` — square fit
- `s0` — original resolution
- `k-no` — keep aspect ratio, no crop

The `<Image>` component (Stories 12.2/12.3) will handle sizing via its own `width`/`height` or `fill` props — the URL parameters are for Google's CDN resizing, not stored metadata.

### Key Technical Stack Versions

| Package | Version | Relevance |
|---|---|---|
| next | 16.1.6 | `images.remotePatterns` with `**` wildcard supported |
| @prisma/client | ^7.4.0 | `createMany`, `deleteMany`, `@@index` all supported |
| prisma (CLI) | ^7.4.0 | `migrate dev --name` generates named migrations |

### Anti-Patterns to Avoid

- **DO NOT** add `width`/`height` columns to `ListingPhoto` — dimensions are URL params, not standalone data
- **DO NOT** download or self-host photos — use Next.js Image proxy with remotePatterns
- **DO NOT** use `prisma.listing.update({ data: { photos: { set: [...] } } })` — use explicit `deleteMany` + `createMany` for idempotent re-import
- **DO NOT** add photo aliases to `FIELD_ALIASES` map — use dedicated `extractPhotoUrls()` function since photo field resolution is more complex than simple string/number fields
- **DO NOT** modify any page components or types — those are Stories 12.2-12.4
- **DO NOT** skip the CSP update — external images will be blocked by the existing `img-src 'self' data:` policy

### Build Verification

After all changes:
```bash
rm -rf .next && npx prisma generate && npx next build
```

Build should succeed with no errors. The new `ListingPhoto` model won't affect static page generation since no pages query photos yet (that's Stories 12.2-12.3).

### References

- [Source: prisma/schema.prisma] — Current schema with 6 models, PascalCase/camelCase conventions
- [Source: src/scripts/import-listings.ts] — FIELD_ALIASES pattern, resolveField/String/Number, ImportSummary interface, upsert loop
- [Source: next.config.ts] — CSP directives, security headers, no existing images config
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-12] — Story 12.1 acceptance criteria and cross-story dependencies
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-20.md#Story-12.1] — Detailed change proposals
- [Source: _bmad-output/planning-artifacts/architecture.md] — Flat component structure, page-level data fetching, anti-patterns
- [Source: src/app/[citySlug]/[companySlug]/page.tsx] — Listing detail page Prisma query pattern (include with relations)
- [Source: src/components/listing-card.tsx] — ListingCard props via ListingResult type
- [Source: src/types/index.ts] — ListingResult interface (modified in Story 12.3, not this story)
- [Source: src/lib/seo.ts] — buildMetadata with hardcoded OG image (modified in Story 12.4)
- [Outscraper Google Maps Scraper] — `photo` (single URL), `photos_count`, `street_view` fields
- [Outscraper Google Maps Photos Scraper] — `photo_link`, `big_photo_link` for dedicated multi-photo scraping
- [Google Maps Photo CDN] — Domains: lh3-lh6.googleusercontent.com, *.ggpht.com, streetviewpixels-pa.googleapis.com
- [Next.js 16 Image Config] — `remotePatterns` with `**` wildcard for hostname matching

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Migration drift: `prisma migrate dev` blocked by modified migration + removed indexes on Listing(address), Listing(name). Used `prisma db push` to sync schema, then created migration file manually and marked as applied via `prisma migrate resolve --applied`.
- Test import: Verified with `/tmp/test-photo-import.json` — 3 listings, 2 with photos (1 single `photo` field, 1 `photos` array with 3 URLs), 1 without. All 4 photos imported correctly.
- Idempotency: Re-ran same import — identical results (delete+create pattern works).
- DB verification: Confirmed 4 ListingPhoto records with correct `isPrimary` and `sortOrder` values.

### Completion Notes List

- Task 1: `ListingPhoto` model added to schema with `onDelete: Cascade`, `@@index([listingId])`, and `photos` back-reference on Listing. Used `prisma db push` due to existing migration drift, then created migration file manually (`20260220000000_add_listing_photos`) and marked as applied via `prisma migrate resolve`.
- Task 2: Added `images.remotePatterns` for `**.googleusercontent.com`, `streetviewpixels-pa.googleapis.com`, `**.ggpht.com`. Updated CSP `img-src` directive. Build verified — all 1201+ pages generated successfully.
- Task 3: Added `extractPhotoUrls()` function handling single `photo` field, `photos` array (string or object format), and `street_view` fallback. Updated `ImportSummary` with `photosImported` and `listingsWithPhotos`. Photo import is idempotent (delete+create per listing). Verified end-to-end with test data.
- Task 4: Full 25-metro re-import completed via Outscraper API. Results: 1,884 businesses processed, 1,112 photos imported across 1,112 listings. 418 new listings added, 710 updated. Database now at 1,307 listings, 355 cities.
- No test framework exists in this project. Validation done via: TypeScript compilation, `next build` success, manual import pipeline testing with verified DB records, full production re-import.

### Change Log

- 2026-02-20: All 4 tasks implemented and verified. Schema, config, pipeline changes complete. Full 25-metro re-import executed — 1,112 photos populated.
- 2026-02-20: Code review fixes — created migration file for production deployability, added photo count to `printDatabaseTotals`, fixed `??` → `||` in `extractPhotoUrls`, corrected `onDelete: Cascade` documentation.

### File List

- `prisma/schema.prisma` — Added `ListingPhoto` model, added `photos` relation to `Listing`
- `prisma/migrations/20260220000000_add_listing_photos/migration.sql` — Migration for ListingPhoto table creation
- `next.config.ts` — Added `images.remotePatterns` for Google CDN domains, updated CSP `img-src`
- `src/scripts/import-listings.ts` — Added `extractPhotoUrls()`, updated `ImportSummary` + `printDatabaseTotals`, added photo import logic in main loop
