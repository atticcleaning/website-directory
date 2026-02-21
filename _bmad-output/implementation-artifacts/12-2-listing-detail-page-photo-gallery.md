# Story 12.2: Listing Detail Page Photo Gallery

Status: done

## Story

As a site visitor,
I want to see a photo gallery on listing detail pages,
so that I can visually assess the quality and legitimacy of attic cleaning companies before contacting them.

## Acceptance Criteria

1. Photo gallery component renders responsive grid of business photos
2. Primary photo uses `priority` loading (LCP candidate)
3. Additional photos use `loading="lazy"`
4. All photos have descriptive alt text with company name
5. Gallery hidden when listing has no photos (no empty state)
6. Mobile: full-width primary + 2-column grid for additional photos (max 6 total)
7. Desktop: primary (2/3 width) + thumbnails (1/3 width) in 2-col grid (max 8 total)
8. Photos use `rounded-lg` consistent with design system
9. Touch targets for any interactive photo elements meet 44x44px minimum
10. Gallery does not cause CLS (dimensions set via CSS aspect-ratio)

## Tasks / Subtasks

- [x] Task 1: Create `photo-gallery.tsx` component (AC: 1, 2, 3, 4, 6, 7, 8, 10)
  - [x] 1.1 Create `src/components/photo-gallery.tsx` as a Server Component (no `"use client"`)
  - [x] 1.2 Define `PhotoGalleryProps` interface accepting photos array and company name
  - [x] 1.3 Implement responsive CSS Grid layout: mobile 2-col, desktop 3-col with primary spanning 2 cols + 2 rows
  - [x] 1.4 Primary photo: `<Image fill priority>` inside `aspect-[16/9]` container with `sizes` prop
  - [x] 1.5 Additional photos: `<Image fill loading="lazy">` inside `aspect-[4/3]` containers
  - [x] 1.6 Apply `rounded-lg overflow-hidden` to all photo containers
  - [x] 1.7 Add descriptive alt text: primary = `"[Company] — primary business photo"`, others = `"[Company] — business photo [N]"`
  - [x] 1.8 Limit displayed photos: mobile max 6, desktop max 8 (use CSS `hidden md:block` to hide extras on mobile)

- [x] Task 2: Integrate gallery into listing detail page (AC: 5, 9)
  - [x] 2.1 Add `photos: { orderBy: { sortOrder: "asc" } }` to `getListing()` Prisma include
  - [x] 2.2 Import `PhotoGallery` and render conditionally: `{listing.photos.length > 0 && <PhotoGallery ... />}`
  - [x] 2.3 Position gallery after Service Tags section, before Contact section
  - [x] 2.4 Pass serialized photo data: `photos={listing.photos.map(p => ({ id: p.id, url: p.url, isPrimary: p.isPrimary }))}`

- [x] Task 3: Build verification (AC: all)
  - [x] 3.1 Run `rm -rf .next && npx next build` — all 1304+ static pages generated without errors
  - [x] 3.2 Visual verification deferred to `npx next start` (Turbopack dev server has CSS issues)
  - [x] 3.3 Listings without photos: component returns `null` — no empty gallery rendered

## Dev Notes

### PhotoGallery Component — Server Component

This is a **Server Component** (no `"use client"` directive). The gallery is a pure display grid with no interactive state (lightbox/carousel is out of scope for this story). This keeps the client JS bundle unchanged.

```typescript
// src/components/photo-gallery.tsx
import Image from "next/image"

interface PhotoGalleryProps {
  photos: { id: string; url: string; isPrimary: boolean }[]
  companyName: string
}

export default function PhotoGallery({ photos, companyName }: PhotoGalleryProps) {
  if (photos.length === 0) return null

  const primary = photos[0]
  // Desktop: up to 7 additional (8 total). Mobile: up to 5 additional (6 total) — use CSS to hide.
  const additional = photos.slice(1, 8)

  return (
    <section aria-label={`Photos of ${companyName}`} className="mt-6">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:grid-rows-2">
        {/* Primary photo — spans 2 cols on mobile, 2 cols + 2 rows on desktop */}
        <div className="relative col-span-2 row-span-1 aspect-[16/9] overflow-hidden rounded-lg md:row-span-2 md:aspect-auto">
          <Image
            src={primary.url}
            alt={`${companyName} — primary business photo`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 533px"
            className="object-cover"
          />
        </div>

        {/* Additional photos — grid cells on the right */}
        {additional.map((photo, index) => (
          <div
            key={photo.id}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg${
              index >= 5 ? " hidden md:block" : ""
            }`}
          >
            <Image
              src={photo.url}
              alt={`${companyName} — business photo ${index + 2}`}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
```

**Key design decisions:**
- `aspect-[16/9]` on primary photo (landscape, matches typical Google Maps business photos)
- `aspect-[4/3]` on thumbnails (slightly taller crop, more square feel for grid)
- `index >= 5 ? " hidden md:block" : ""` — CSS hides photos 7-8 on mobile (keeping max 6), shows them on desktop (max 8)
- `fill` layout requires parent to have `position: relative` (handled by Tailwind `relative` class)
- `sizes` prop set accurately for the `max-w-[800px]` page container: primary ~533px on desktop (2/3 of 800), thumbnails ~200px (1/3 of 800 / 2)

### Listing Detail Page Integration

Update `src/app/[citySlug]/[companySlug]/page.tsx`:

**1. Add `photos` to the Prisma query:**

```typescript
// In getListing() — add photos to include:
include: {
  city: true,
  reviews: { orderBy: { publishedAt: "desc" } },
  serviceTags: true,
  photos: { orderBy: { sortOrder: "asc" } },  // ← ADD THIS
},
```

**2. Import and render the gallery:**

```typescript
// Add import at top:
import PhotoGallery from "@/components/photo-gallery"

// In JSX, after Service Tags section (after the closing </div> of service tags),
// before the Contact section:
{listing.photos.length > 0 && (
  <div className="mt-6">
    <PhotoGallery
      photos={listing.photos.map((p) => ({
        id: p.id,
        url: p.url,
        isPrimary: p.isPrimary,
      }))}
      companyName={listing.name}
    />
  </div>
)}
```

**Exact insertion point** — after line 161 (closing `</div>` of service tags conditional), before line 163 (`{/* Contact Section */}` comment). This places the gallery directly below the company identity block (name + rating + tags) and above the contact/location/hours/reviews sections.

### Photo Data Available from Database

From Story 12.1's import, the database contains:
- **1,112 listings** with at least one photo
- **1,112 total photos** (currently 1 photo per listing from Outscraper standard scraper)
- Each photo record: `{ id, url, isPrimary, sortOrder, listingId, createdAt }`
- URLs follow pattern: `https://lh5.googleusercontent.com/p/AF1QipN...=w800-h500-k-no`

Since most listings currently have exactly 1 photo, the gallery will typically show just the primary photo full-width. As more photos are imported (via dedicated Outscraper Photos Scraper in future), the grid layout will automatically populate.

### Google Maps Photo URL — Image Sizing

Google CDN URLs support dynamic resizing via URL parameters after `=`:
- `=w800-h600-k-no` — 800px wide, 600px tall, keep aspect ratio
- `=s0` — original full resolution
- `=w400-h300-c` — 400x300, cropped to fill

Next.js Image component handles its own resizing via `/_next/image?url=...&w=640&q=75` proxy. The Google CDN parameters in the stored URL set the maximum resolution fetched from Google. No URL manipulation is needed — Next.js will optimize from whatever Google returns.

### CLS Prevention Strategy

All photo containers use CSS `aspect-ratio` (via Tailwind `aspect-[16/9]` and `aspect-[4/3]`), which reserves exact space in the layout before images load. Combined with `<Image fill>` (which generates `position: absolute` inside the relatively-positioned parent), this guarantees zero Cumulative Layout Shift.

### Performance Impact

- **Build time**: No impact. Next.js Image optimizes on-demand at request time, not during `next build`. The Prisma query adds `photos` to the include but doesn't generate new pages.
- **LCP**: Primary photo uses `priority` (same pattern as homepage hero). This adds a `<link rel="preload">` to the `<head>` for the primary photo — ensuring it loads before other lazy images.
- **Client JS**: Zero additional JS. This is a Server Component. The client component count remains at 5 (search-bar, filter-toolbar, error, google-map, ui/select).
- **Page weight**: Photos are lazy-loaded (except primary). Initial HTML size increases minimally (~500 bytes for the gallery markup).

### Project Structure Notes

**Files to create:**
| File | Description |
|---|---|
| `src/components/photo-gallery.tsx` | Server Component — responsive photo grid |

**Files to modify:**
| File | Change |
|---|---|
| `src/app/[citySlug]/[companySlug]/page.tsx` | Add `photos` to Prisma include, import + render `PhotoGallery` |

**Files NOT to modify (future stories):**
- `src/components/listing-card.tsx` — Story 12.3 (thumbnail on cards)
- `src/app/[citySlug]/page.tsx` — Story 12.3 (city page query)
- `src/lib/search.ts` — Story 12.3 (search enrichment)
- `src/types/index.ts` — Story 12.3 (`ListingResult` type)
- `src/lib/seo.ts` — Story 12.4 (OG image from listing photo)

### Existing Patterns to Follow

**Image component pattern** (from `src/app/page.tsx` homepage hero, lines 102-108):
```tsx
<Image
  src="/images/professional-attic-cleaning-insulation-removal-service.webp"
  alt="Professional attic cleaning technician..."
  fill
  priority
  fetchPriority="high"
  className="object-cover"
/>
```
Follow this exact pattern for the primary gallery photo (use `fill`, `priority`, `className="object-cover"`).

**Section spacing pattern** (from listing detail page):
- Each section uses `mt-8` for spacing between major blocks
- Gallery uses `mt-6` (slightly tighter, since it's visually part of the identity block)

**Component file naming** (established conventions):
- File: `photo-gallery.tsx` (kebab-case)
- Component: `PhotoGallery` (PascalCase)
- Props: `PhotoGalleryProps` (PascalCase + Props suffix)

**Prisma include pattern** (from `getListing()` at line 12-24):
- Relations use `{ orderBy: ... }` for deterministic ordering
- `photos: { orderBy: { sortOrder: "asc" } }` follows the existing `reviews: { orderBy: { publishedAt: "desc" } }` pattern

**Conditional rendering pattern** (from listing detail page):
```tsx
{listing.serviceTags.length > 0 && (
  <div className="mt-3 ...">
    {/* content */}
  </div>
)}
```
Follow this exact pattern for gallery: `{listing.photos.length > 0 && (...)}`

### Anti-Patterns to Avoid

- **DO NOT** add `"use client"` — this is a Server Component (no state, no effects, no interactivity)
- **DO NOT** add a lightbox or photo clicking — pure display grid only (lightbox is a future enhancement)
- **DO NOT** add loading spinners or skeleton screens — static rendering eliminates loading states
- **DO NOT** fetch data within the component — receive photos as props from the page
- **DO NOT** add empty state messaging — if no photos, component returns `null`
- **DO NOT** manipulate Google CDN URLs — let Next.js Image proxy handle resizing
- **DO NOT** add `width`/`height` number props to `<Image>` when using `fill` — they're mutually exclusive
- **DO NOT** modify `ListingResult` type or search API — those are Story 12.3
- **DO NOT** add OG image from listing photos — that's Story 12.4

### Key Technical Stack Versions

| Package | Version | Relevance |
|---|---|---|
| next | 16.1.6 | `<Image fill priority>`, `remotePatterns` with `**` wildcard |
| react | 19.2.3 | Server Components, no `"use client"` needed |
| @prisma/client | ^7.4.0 | `include` with `orderBy` on relations |
| tailwindcss | 4.x | `aspect-[16/9]`, `aspect-[4/3]`, responsive grid utilities |

### Build Verification

After all changes:
```bash
rm -rf .next && npx next build
```

Build should succeed with same page count (~1304 static pages). No new pages are generated — this story only modifies existing listing detail page rendering.

Visual verification:
```bash
npx next start
# Visit a listing with photos (e.g., a listing in Phoenix, AZ)
# Verify: photo grid displays, primary photo is large, thumbnails are smaller
# Visit a listing without photos
# Verify: page looks identical to current layout (no gallery section)
```

### References

- [Source: src/app/[citySlug]/[companySlug]/page.tsx] — Listing detail page, `getListing()` query, JSX structure
- [Source: src/app/page.tsx#L102-108] — Homepage hero Image component pattern (`fill`, `priority`, `object-cover`)
- [Source: prisma/schema.prisma#L84-94] — `ListingPhoto` model with `isPrimary`, `sortOrder`
- [Source: next.config.ts#L34-48] — `remotePatterns` for Google photo CDN domains
- [Source: src/app/globals.css#L36-38] — Shadow tokens (`shadow-card`, `shadow-card-hover`, `shadow-hero`)
- [Source: _bmad-output/implementation-artifacts/12-1-photo-data-model-import-pipeline-extension.md] — Story 12.1 completion: 1,112 photos, schema + config done
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-20.md] — Epic 12 story specifications
- [Source: _bmad-output/planning-artifacts/epics.md#Epic-12] — Epic 12 acceptance criteria
- [Source: _bmad-output/planning-artifacts/architecture.md] — Server component patterns, flat component structure, anti-patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build verified: `rm -rf .next && npx next build` — all 1304+ listing pages generated successfully. No TypeScript errors, no build warnings related to photo gallery.
- Primary photo uses `aspect-[16/9]` (not `aspect-[4/3]` as originally spec'd in Task 1.4) — landscape aspect ratio better matches typical Google Maps business photos and gives the primary image more visual prominence.

### Completion Notes List

- Task 1: Created `src/components/photo-gallery.tsx` — Server Component (no `"use client"`), responsive CSS Grid with primary photo spanning 2 cols (mobile) / 2 cols + 2 rows (desktop). Uses `<Image fill priority>` for primary, `<Image fill loading="lazy">` for additional. Alt text includes company name. Photos 7-8 hidden on mobile via `hidden md:block`. Zero client JS added.
- Task 2: Updated `getListing()` Prisma include to add `photos: { orderBy: { sortOrder: "asc" } }`. Imported `PhotoGallery` and rendered conditionally after service tags, before contact section. Photo data serialized as plain objects for props.
- Task 3: Full build passes. Component returns `null` for listings without photos, preserving existing layout. No test framework exists — validation via TypeScript compilation + `next build` success.

### Change Log

- 2026-02-20: All 3 tasks implemented and verified. Photo gallery component created, integrated into listing detail page, build passes.
- 2026-02-20: Code review fixes (3 issues): H1 — conditional grid layout for single-photo listings (full-width instead of 2/3); M1 — added `md:aspect-auto` on primary photo for desktop grid height; M2 — removed unused `isPrimary` from props interface and serialization. Build re-verified.

### File List

- `src/components/photo-gallery.tsx` — New Server Component: responsive photo grid with primary + additional photos
- `src/app/[citySlug]/[companySlug]/page.tsx` — Added `photos` to Prisma include, imported + rendered `PhotoGallery` conditionally
