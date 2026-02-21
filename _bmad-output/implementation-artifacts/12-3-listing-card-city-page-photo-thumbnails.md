# Story 12.3: Listing Card & City Page Photo Thumbnails

Status: done

## Story

As a homeowner,
I want to see a photo thumbnail on listing cards,
so that I get a quick visual impression of each company while scanning search results.

## Acceptance Criteria

1. Listing cards display an 80x80px (mobile) / 96x96px (desktop) thumbnail of the primary business photo alongside the company name and rating
2. Thumbnail uses `rounded-lg` and `object-cover` for consistent framing
3. Card layout maintains its data-dense design — photo is a supporting element, not dominant
4. `shadow-card` and `hover:shadow-card-hover` tokens are maintained on cards
5. Cards without photos render identically to the current text-only layout (no placeholder, no broken image)
6. City landing page query includes the primary photo for each listing
7. Search results API query includes the primary photo for each listing
8. No CLS from photo loading — dimensions explicitly set via CSS
9. All existing performance targets maintained (LCP, page weight)
10. Touch targets remain 44x44px minimum on mobile

## Tasks / Subtasks

- [x] Task 1: Extend `ListingResult` type (AC: 6, 7)
  - [x] 1.1 Add `primaryPhotoUrl: string | null` to `ListingResult` in `src/types/index.ts`

- [x] Task 2: Update search API to include primary photo (AC: 7)
  - [x] 2.1 In `enrichResults()` in `src/lib/search.ts`, add a parallel `prisma.listingPhoto.findMany()` query to fetch the primary photo for each listing
  - [x] 2.2 Build a `photoByListing` lookup map (same pattern as `tagsByListing` and `reviewByListing`)
  - [x] 2.3 Add `primaryPhotoUrl` to the enriched result mapping

- [x] Task 3: Update city landing page query (AC: 6)
  - [x] 3.1 Add `photos: { where: { isPrimary: true }, take: 1 }` to `getCity()` Prisma include in `src/app/[citySlug]/page.tsx`
  - [x] 3.2 Map `listing.photos[0]?.url ?? null` to `primaryPhotoUrl` in the `ListingResult` construction

- [x] Task 4: Update `ListingCard` component with thumbnail (AC: 1, 2, 3, 4, 5, 8, 10)
  - [x] 4.1 Import `Image` from `next/image` in `src/components/listing-card.tsx`
  - [x] 4.2 Conditionally wrap company name + rating + tags in a flex row with the thumbnail when `listing.primaryPhotoUrl` exists
  - [x] 4.3 Thumbnail: `<Image>` with `width={96} height={96}` (not `fill`), `loading="lazy"`, `sizes="96px"`, `rounded-lg object-cover`
  - [x] 4.4 When no photo: render current layout unchanged (no wrapper div changes)

- [x] Task 5: Build verification (AC: all)
  - [x] 5.1 Run `rm -rf .next && npx next build` — all 1722 static pages generated without errors
  - [x] 5.2 Visual verification deferred to `npx next start`

## Dev Notes

### ListingResult Type Change

Update `src/types/index.ts`:

```typescript
export interface ListingResult {
  // ... existing fields ...
  reviewSnippet: string | null
  citySlug: string
  companySlug: string
  primaryPhotoUrl: string | null  // ← ADD THIS
}
```

This field flows through `FilterToolbar` (client component) → `ListingCard` without any changes to `FilterToolbar` itself. `FilterToolbar` passes `ListingResult` objects directly to `ListingCard` via `<ListingCard listing={listing} />`.

### Search API — `enrichResults()` Update

In `src/lib/search.ts`, the `enrichResults()` function (line 229) already batch-fetches service tags and reviews in parallel. Add photos as a third parallel query:

```typescript
async function enrichResults(rows: RawListingRow[]): Promise<ListingResult[]> {
  if (rows.length === 0) return []

  const listingIds = rows.map((r) => r.id)

  const [serviceTags, reviews, photos] = await Promise.all([
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
    prisma.listingPhoto.findMany({
      where: { listingId: { in: listingIds }, isPrimary: true },
      select: { listingId: true, url: true },
    }),
  ])

  // Build lookup maps
  // ... existing tagsByListing and reviewByListing maps ...

  const photoByListing = new Map<string, string>()
  for (const photo of photos) {
    photoByListing.set(photo.listingId, photo.url)
  }

  return rows.map((row) => ({
    // ... existing fields ...
    reviewSnippet: reviewByListing.get(row.id) || null,
    primaryPhotoUrl: photoByListing.get(row.id) ?? null,  // ← ADD
  }))
}
```

**Why `isPrimary: true` filter**: The `ListingPhoto` model has an `isPrimary` boolean field. Filtering server-side avoids fetching all photos for all listings and uses the `@@index([listingId])` index.

### City Landing Page Query Update

In `src/app/[citySlug]/page.tsx`, update `getCity()` (line 13):

```typescript
const getCity = cache(async function getCity(citySlug: string) {
  return prisma.city.findUnique({
    where: { slug: citySlug },
    include: {
      listings: {
        include: {
          serviceTags: true,
          photos: { where: { isPrimary: true }, take: 1 },  // ← ADD
        },
        orderBy: { starRating: "desc" },
      },
    },
  })
})
```

Then in the `ListingResult` mapping (around line 102):

```typescript
const results: ListingResult[] = city.listings.map((listing) => ({
  // ... existing fields ...
  citySlug: city.slug,
  companySlug: listing.slug,
  primaryPhotoUrl: listing.photos[0]?.url ?? null,  // ← ADD
}))
```

### ListingCard Component Update

**Current card anatomy** (text-only):
```
┌─────────────────────────────────────────┐
│ Company Name                            │
│ ★★★★★ 4.9 (187 reviews)               │
│ [Rodent] [Insulation] [Decontam]       │
│ "They found evidence of rats..."        │
│ ─────────────────────────────────────── │
│ (602) 555-0142        Visit Website     │
└─────────────────────────────────────────┘
```

**New card anatomy** (with photo):
```
┌─────────────────────────────────────────┐
│ ┌──────────┐ Company Name               │
│ │  Photo   │ ★★★★★ 4.9 (187 reviews)  │
│ │ 80x80    │ [Rodent] [Insulation]      │
│ └──────────┘                            │
│ "They found evidence of rats..."        │
│ ─────────────────────────────────────── │
│ (602) 555-0142        Visit Website     │
└─────────────────────────────────────────┘
```

**Implementation approach** in `src/components/listing-card.tsx`:

```tsx
import Image from "next/image"

// Inside the <article> element, replace the top section:

{/* Header: Photo + Identity */}
{listing.primaryPhotoUrl ? (
  <div className="flex gap-3">
    <Image
      src={listing.primaryPhotoUrl}
      alt={`${listing.name} business photo`}
      width={96}
      height={96}
      loading="lazy"
      sizes="96px"
      className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-24 md:w-24"
    />
    <div className="min-w-0">
      <Link
        href={`/${listing.citySlug}/${listing.companySlug}`}
        className="inline-flex min-h-[44px] items-center font-sans text-lg font-semibold leading-snug text-foreground hover:text-primary transition-colors duration-200"
      >
        {listing.name}
      </Link>
      <div className="mt-1">
        <StarRating rating={listing.starRating} reviewCount={listing.reviewCount} variant="compact" />
      </div>
      {listing.serviceTags.length > 0 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto md:flex-wrap">
          {listing.serviceTags.map((tag) => (
            <ServiceTagChip key={tag} serviceType={tag} variant="card" />
          ))}
        </div>
      )}
    </div>
  </div>
) : (
  <>
    <Link
      href={`/${listing.citySlug}/${listing.companySlug}`}
      className="inline-flex min-h-[44px] items-center font-sans text-lg font-semibold leading-snug text-foreground hover:text-primary transition-colors duration-200"
    >
      {listing.name}
    </Link>
    <div className="mt-1">
      <StarRating rating={listing.starRating} reviewCount={listing.reviewCount} variant="compact" />
    </div>
    {listing.serviceTags.length > 0 && (
      <div className="mt-2 flex gap-1.5 overflow-x-auto md:flex-wrap">
        {listing.serviceTags.map((tag) => (
          <ServiceTagChip key={tag} serviceType={tag} variant="card" />
        ))}
      </div>
    )}
  </>
)}

{/* Review snippet, distance, and contact sections remain unchanged */}
```

**Key design decisions:**

- `width={96} height={96}` (not `fill`) — explicit dimensions prevent CLS and match the 96px max size. Using `w-20 h-20 md:w-24 md:h-24` CSS classes scale the rendered size (80px mobile, 96px desktop) while Next.js optimizes from the 96px source.
- `sizes="96px"` — tells the browser the image will never be wider than 96px, preventing unnecessary large image downloads.
- `loading="lazy"` — thumbnails are NOT LCP candidates (the page heading is). Lazy loading keeps initial page weight low.
- `shrink-0` — prevents the thumbnail from shrinking when the company name is long.
- `min-w-0` on the text container — prevents text from overflowing the flex container (standard Tailwind truncation pattern).
- The `else` branch (`<>...</>`) renders the **exact same JSX** as the current component — zero visual change for photo-less listings.

### Files NOT to Modify

| File | Reason |
|---|---|
| `src/components/filter-toolbar.tsx` | Passes `ListingResult` through to `ListingCard` — no changes needed |
| `src/app/search/page.tsx` | Passes results from `searchListings()` through — no changes needed |
| `src/components/photo-gallery.tsx` | Story 12.2 only (listing detail page) |
| `src/lib/seo.ts` | Story 12.4 (OG image from listing photo) |
| `next.config.ts` | Remote patterns already configured in Story 12.1 |
| `prisma/schema.prisma` | Schema already has `ListingPhoto` model from Story 12.1 |

### Existing Patterns to Follow

**Image component pattern** (from `src/components/photo-gallery.tsx`):
- Google CDN URLs work with Next.js Image proxy — no URL manipulation needed
- `object-cover` for consistent framing
- `rounded-lg` for design system consistency

**Batch query pattern** (from `enrichResults()` in `src/lib/search.ts`, lines 229-282):
```typescript
const [serviceTags, reviews] = await Promise.all([...])
const tagsByListing = new Map<string, ServiceType[]>()
const reviewByListing = new Map<string, string>()
```
Follow this exact pattern: parallel `Promise.all`, Map-based lookup, null fallback.

**Conditional rendering pattern** (from listing detail page `page.tsx`):
```tsx
{listing.photos.length > 0 && (<PhotoGallery ... />)}
```
Follow: `{listing.primaryPhotoUrl ? (photo layout) : (text-only layout)}`

### Anti-Patterns to Avoid

- **DO NOT** add `"use client"` to `ListingCard` — it's rendered inside `FilterToolbar` which is already a client component. `ListingCard` itself has no state or effects.
- **DO NOT** use `<Image fill>` for thumbnails — explicit `width`/`height` is correct for fixed-size images and simpler than wrapping in a relative container.
- **DO NOT** add a placeholder/fallback image — the spec explicitly says "no placeholder, no broken image icon".
- **DO NOT** modify `FilterToolbar` — it just passes `ListingResult` through.
- **DO NOT** modify the search page (`/search/page.tsx`) — it just passes results through.
- **DO NOT** add `priority` to thumbnail images — they are below the fold and not LCP candidates.
- **DO NOT** change the contact section, review snippet, or distance text in `ListingCard`.

### Key Technical Stack Versions

| Package | Version | Relevance |
|---|---|---|
| next | 16.1.6 | `<Image>` with `width`/`height`, `remotePatterns`, `loading="lazy"` |
| react | 19.2.3 | Server Components in pages, client component in FilterToolbar |
| @prisma/client | ^7.4.0 | `where` + `take` on nested includes, `findMany` with `in` filter |
| tailwindcss | 4.x | `w-20 h-20 md:w-24 md:h-24`, `shrink-0`, `min-w-0`, `rounded-lg` |

### Photo Data Available from Database

From Story 12.1's import:
- **1,112 listings** with exactly 1 photo each (all marked `isPrimary: true`)
- URLs: `https://lh5.googleusercontent.com/p/AF1QipN...=w800-h500-k-no`
- The `@@index([listingId])` on `ListingPhoto` ensures efficient batch lookups

### CLS Prevention Strategy

Thumbnail uses explicit `width={96} height={96}` on the `<Image>` element plus CSS `w-20 h-20 md:w-24 md:h-24`. This reserves exact space before image loads. The flex layout with `shrink-0` ensures the photo container never collapses. Combined with `loading="lazy"`, the thumbnail loads after layout is painted — zero CLS.

### Build Verification

After all changes:
```bash
rm -rf .next && npx next build
```

Build should succeed with same page count (~1304+ static pages). No new pages — this story only modifies component rendering and data queries.

Visual verification:
```bash
npx next start
# Visit /phoenix-az (city page with many listings that have photos)
# Verify: listing cards show 80x80 thumbnails on mobile, 96x96 on desktop
# Visit a listing card without photos
# Verify: card looks identical to current text-only layout
# Visit /search?q=Phoenix (search results)
# Verify: same thumbnail behavior on search result cards
```

### Project Structure Notes

**Files to create:** None

**Files to modify:**
| File | Change |
|---|---|
| `src/types/index.ts` | Add `primaryPhotoUrl: string \| null` to `ListingResult` |
| `src/lib/search.ts` | Add `listingPhoto` batch query in `enrichResults()`, build photo map, add to result |
| `src/app/[citySlug]/page.tsx` | Add `photos` to `getCity()` include, map to `primaryPhotoUrl` |
| `src/components/listing-card.tsx` | Import `Image`, add conditional flex layout with thumbnail |

### References

- [Source: src/components/listing-card.tsx] — Current ListingCard component (text-only)
- [Source: src/lib/search.ts#L229-282] — `enrichResults()` batch query pattern
- [Source: src/app/[citySlug]/page.tsx#L13-25] — `getCity()` Prisma include
- [Source: src/app/[citySlug]/page.tsx#L98-110] — `ListingResult` mapping
- [Source: src/types/index.ts] — `ListingResult` interface
- [Source: src/components/filter-toolbar.tsx] — Client component that passes `ListingResult` to `ListingCard`
- [Source: prisma/schema.prisma] — `ListingPhoto` model with `isPrimary`, `@@index([listingId])`
- [Source: src/components/photo-gallery.tsx] — Story 12.2 Image patterns (Google CDN, object-cover, rounded-lg)
- [Source: _bmad-output/implementation-artifacts/12-2-listing-detail-page-photo-gallery.md] — Previous story learnings
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-20.md] — Story 12.3 specifications
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-12] — Epic 12 acceptance criteria

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build verified: `rm -rf .next && npx next build` — 1722 static pages generated successfully (355 city + 1307 listing + 50 article + others). No TypeScript errors, no build warnings.
- Thumbnail uses explicit `width={96} height={96}` with CSS `w-20 h-20 md:w-24 md:h-24` for 80px mobile / 96px desktop sizing — prevents CLS and avoids `fill` complexity for fixed-size images.

### Completion Notes List

- Task 1: Added `primaryPhotoUrl: string | null` to `ListingResult` interface in `src/types/index.ts`. This field flows through `FilterToolbar` → `ListingCard` without changes to `FilterToolbar`.
- Task 2: Extended `enrichResults()` in `src/lib/search.ts` — added `prisma.listingPhoto.findMany()` as third parallel query in `Promise.all`, built `photoByListing` Map lookup, mapped to `primaryPhotoUrl` in result. Follows exact same batch pattern as existing `tagsByListing` and `reviewByListing`.
- Task 3: Updated `getCity()` Prisma include in city page to add `photos: { where: { isPrimary: true }, take: 1 }`. Mapped `listing.photos[0]?.url ?? null` to `primaryPhotoUrl` in `ListingResult` construction.
- Task 4: Updated `ListingCard` with conditional thumbnail. When photo exists: flex row with 80x80/96x96 `<Image>`, company identity beside it. When no photo: exact same JSX as before (Fragment wrapper). `loading="lazy"` since thumbnails are not LCP candidates. `shrink-0` prevents photo from collapsing, `min-w-0` on text container prevents overflow.
- Task 5: Full build passes. No test framework exists — validation via TypeScript compilation + `next build` success.

### Change Log

- 2026-02-20: All 5 tasks implemented and verified. Type extended, search API enriched with photos, city page query updated, ListingCard component enhanced with conditional thumbnail, build passes.
- 2026-02-20: Code review fixes (3 issues): H1 — refactored ListingCard to eliminate ~20 lines of duplicated JSX using conditional wrapper pattern; M1 — added `distinct: ["listingId"]` to search API photo query for data integrity guard; M2 — standardized alt text to use em dash separator matching photo-gallery pattern. Build re-verified.

### File List

- `src/types/index.ts` — Added `primaryPhotoUrl: string | null` to `ListingResult` interface
- `src/lib/search.ts` — Added photo batch query in `enrichResults()`, `photoByListing` Map, `primaryPhotoUrl` mapping, `distinct` guard
- `src/app/[citySlug]/page.tsx` — Added `photos` to `getCity()` Prisma include, mapped to `primaryPhotoUrl`
- `src/components/listing-card.tsx` — Added `Image` import, conditional wrapper with thumbnail (DRY refactored)
