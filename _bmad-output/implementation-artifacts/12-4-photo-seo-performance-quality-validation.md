# Story 12.4: Photo SEO, Performance & Quality Validation

Status: done

## Story

As a site owner,
I want listing pages to use business photos for social sharing and search engine optimization,
so that listings with photos get higher click-through rates from search results and social media.

## Acceptance Criteria

1. Listing detail pages with photos use the primary photo for `og:image` and `twitter:image`
2. Pages without photos fall back to the shared hero image
3. All photos have SEO-optimized alt text with business name and location
4. `image` property added to LocalBusiness JSON-LD schema with primary photo URL
5. LCP < 1.5s on listing detail pages with gallery (mobile 4G)
6. Page weight < 500KB initial load (lazy-loaded photos excluded)
7. Zero CLS from photo loading on all page types
8. Lighthouse performance score >= 90
9. Lighthouse accessibility score >= 95
10. Listing detail page included in Lighthouse CI URL list

## Tasks / Subtasks

- [x] Task 1: Extend `buildMetadata` for per-page OG images (AC: 1, 2)
  - [x] 1.1 Add optional `imageUrl` param to `buildMetadata()` in `src/lib/seo.ts`
  - [x] 1.2 When `imageUrl` is provided, use it for `openGraph.images` and `twitter.images`
  - [x] 1.3 When `imageUrl` is not provided, fall back to the hero image (current behavior)

- [x] Task 2: Pass listing primary photo to metadata (AC: 1, 2)
  - [x] 2.1 In `generateMetadata()` in `src/app/[citySlug]/[companySlug]/page.tsx`, extract primary photo URL from `listing.photos[0]?.url`
  - [x] 2.2 Pass as `imageUrl` to `buildMetadata()` when available

- [x] Task 3: Add `image` to LocalBusiness JSON-LD (AC: 4)
  - [x] 3.1 Add optional `imageUrl` to `LocalBusinessInput` interface in `src/lib/seo.ts`
  - [x] 3.2 Include `image` property in JSON-LD output when `imageUrl` is provided
  - [x] 3.3 Pass primary photo URL from listing detail page to `buildLocalBusinessJsonLd()`

- [x] Task 4: SEO-optimize alt text with location keywords (AC: 3)
  - [x] 4.1 Add `cityName` and `state` props to `PhotoGalleryProps` in `src/components/photo-gallery.tsx`
  - [x] 4.2 Primary photo alt: `"[Company] — attic cleaning company in [City], [State]"`
  - [x] 4.3 Pass `cityName` and `state` from listing detail page to `<PhotoGallery>`
  - [x] 4.4 Card thumbnail alt in `src/components/listing-card.tsx`: `"[Company] — attic cleaning services"`

- [x] Task 5: Add listing detail page to Lighthouse CI (AC: 5-10)
  - [x] 5.1 Add a listing page URL (e.g., `/phoenix-az/attic-construction`) to `lighthouserc.json` collect URLs
  - [x] 5.2 Add `categories:performance` assertion `["error", { "minScore": 0.90 }]`

- [x] Task 6: Build verification (AC: all)
  - [x] 6.1 Run `rm -rf .next && npx next build` — all pages generated without errors
  - [x] 6.2 Visual verification deferred to `npx next start`

## Dev Notes

### `buildMetadata` — Optional Image URL

Update `src/lib/seo.ts` to accept an optional `imageUrl` parameter:

```typescript
export function buildMetadata({
  title,
  description,
  path,
  imageUrl,
}: {
  title: string
  description: string
  path: string
  imageUrl?: string
}): Metadata {
  const url = `${BASE_URL}${path}`
  const ogImage = imageUrl
    ? { url: imageUrl, alt: title }
    : {
        url: `${BASE_URL}/images/professional-attic-cleaning-insulation-removal-service.webp`,
        width: 1376,
        height: 768,
        alt: "Professional attic cleaning technician removing old insulation and installing fresh fiberglass insulation",
      }
  const twitterImage = imageUrl
    ?? `${BASE_URL}/images/professional-attic-cleaning-insulation-removal-service.webp`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [twitterImage],
    },
  }
}
```

**Key decisions:**
- When `imageUrl` is provided (Google CDN URL), we DON'T pass `width`/`height` since the dimensions are unknown and vary per photo. The `alt` uses the page title which already contains the company name and location.
- When `imageUrl` is NOT provided, the existing hero image with known dimensions is used — zero change to current behavior.
- The `imageUrl` is the raw Google CDN URL, NOT the Next.js `/_next/image` proxy URL. Social media crawlers (Facebook, Twitter) need direct URLs they can fetch — they can't follow the Next.js image optimization proxy.

### Listing Detail Page — Pass Photo to Metadata

In `src/app/[citySlug]/[companySlug]/page.tsx`, update `generateMetadata()`:

```typescript
return buildMetadata({
  title: `${listing.name} - Attic Cleaning in ${listing.city.name}, ${listing.city.state}`,
  description: `...`,
  path: `/${citySlug}/${companySlug}`,
  imageUrl: listing.photos[0]?.url,  // ← ADD: undefined when no photos
})
```

The `listing.photos` array is already loaded by `getListing()` (added in Story 12.2). `listing.photos[0]?.url` returns `undefined` (not `null`) when no photos exist, which correctly triggers the fallback in `buildMetadata`.

### JSON-LD `image` Property

Update `LocalBusinessInput` and `buildLocalBusinessJsonLd()` in `src/lib/seo.ts`:

```typescript
interface LocalBusinessInput {
  // ... existing fields ...
  imageUrl?: string  // ← ADD
}

export function buildLocalBusinessJsonLd(listing: LocalBusinessInput) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.name,
    // ... existing fields ...
    ...(listing.imageUrl ? { image: listing.imageUrl } : {}),
  }
}
```

Then in the listing detail page, pass the photo URL:

```typescript
const jsonLd = buildLocalBusinessJsonLd({
  // ... existing fields ...
  imageUrl: listing.photos[0]?.url,  // ← ADD
})
```

The `image` property in schema.org LocalBusiness accepts a URL string. Google's Rich Results Test validates this format.

### Alt Text SEO Optimization

**Sprint proposal alt text patterns:**
- Gallery primary: `"[Company] — attic cleaning company in [City], [State]"`
- Gallery additional: `"[Company] — business photo [N]"` (unchanged)
- Card thumbnail: `"[Company] — attic cleaning services"`

**Changes needed:**

1. `src/components/photo-gallery.tsx` — Add `cityName` and `state` to props:

```typescript
interface PhotoGalleryProps {
  photos: { id: string; url: string }[]
  companyName: string
  cityName: string   // ← ADD
  state: string      // ← ADD
}
```

Primary photo alt update:
```typescript
alt={`${companyName} — attic cleaning company in ${cityName}, ${state}`}
```

Additional photos alt remains: `"[Company] — business photo [N]"` (no location needed for secondary photos).

2. `src/app/[citySlug]/[companySlug]/page.tsx` — Pass new props:

```tsx
<PhotoGallery
  photos={listing.photos.map((p) => ({ id: p.id, url: p.url }))}
  companyName={listing.name}
  cityName={listing.city.name}
  state={listing.city.state}
/>
```

3. `src/components/listing-card.tsx` — Update thumbnail alt:

```typescript
alt={`${listing.name} — attic cleaning services`}
```

Changed from `"— business photo"` to `"— attic cleaning services"` for keyword relevance on card thumbnails.

### Lighthouse CI Configuration Update

Current `lighthouserc.json` tests 3 URLs but NOT a listing detail page. Add one:

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/phoenix-az",
        "http://localhost:3000/phoenix-az/attic-construction",
        "http://localhost:3000/articles/choosing-attic-cleaning-company"
      ]
    },
    "assert": {
      "assertions": {
        "largest-contentful-paint": ["warn", { "maxNumericValue": 1500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-byte-weight": ["error", { "maxNumericValue": 512000 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:performance": ["error", { "minScore": 0.90 }]
      }
    }
  }
}
```

**Changes:**
- Added `/phoenix-az/attic-construction` — a real listing page with photos (validates LCP, CLS, page weight with photo gallery)
- Added `categories:performance` assertion at 0.90 (90%) — validates AC 8

**Note:** Lighthouse runs locally in CI (no real network). `LCP < 1.5s` assertion already exists as `largest-contentful-paint: maxNumericValue 1500`. The `categories:performance` score is an aggregate of all Core Web Vitals.

### Performance Context

Photos are already optimized by the existing architecture:
- **LCP**: Primary gallery photo uses `priority` (preloaded via `<link rel="preload">`)
- **CLS**: All photos use explicit dimensions (`aspect-[16/9]`, `width/height`, `w-20 h-20`)
- **Page weight**: Only primary photo loads initially; thumbnails + additional use `loading="lazy"`
- **Format**: Next.js Image automatically serves WebP/AVIF based on browser `Accept` header
- **CDN**: Cloudflare caches optimized images at the edge (configured in Story 7.2)

No code changes needed for ACs 5-7 and 9 — they validate existing behavior.

### Files NOT to Modify

| File | Reason |
|---|---|
| `src/types/index.ts` | No type changes needed |
| `src/lib/search.ts` | Search API unchanged |
| `src/app/[citySlug]/page.tsx` | City page metadata keeps hero image |
| `src/app/search/page.tsx` | Search page metadata keeps hero image |
| `src/components/filter-toolbar.tsx` | Passes data through unchanged |
| `prisma/schema.prisma` | Schema unchanged |
| `next.config.ts` | Remote patterns and CSP already configured |

### Existing Patterns to Follow

**OG image pattern** (from `seo.ts` lines 30-36):
```typescript
images: [{
  url: `${BASE_URL}/images/...`,
  width: 1376,
  height: 768,
  alt: "...",
}]
```
For listing photos, omit `width`/`height` since Google CDN photo dimensions vary.

**JSON-LD spread pattern** (from `seo.ts` lines 71-81):
```typescript
...(listing.phone ? { telephone: listing.phone } : {}),
```
Follow this exact pattern for optional `image` property.

**Conditional prop pattern** (from listing detail page):
```typescript
listing.photos[0]?.url  // returns undefined when empty — works with optional param
```

### Anti-Patterns to Avoid

- **DO NOT** use Next.js `/_next/image?url=...` proxy URLs for OG images — social crawlers can't follow the proxy. Use raw Google CDN URLs.
- **DO NOT** add `width`/`height` to OG image when using Google CDN URLs — dimensions are unknown and vary.
- **DO NOT** modify alt text for the homepage hero image — that's separate from listing photos.
- **DO NOT** add photo validation logic (URL checks, HEAD requests) — Google CDN URLs are validated at import time (Story 12.1).
- **DO NOT** modify the a11y test file (`tests/a11y.spec.ts`) — it already tests a listing detail page via dynamic discovery.

### Key Technical Stack Versions

| Package | Version | Relevance |
|---|---|---|
| next | 16.1.6 | `generateMetadata`, Image optimization, OG tags |
| @lhci/cli | (CI only) | Lighthouse CI assertions |
| @playwright/test | (CI only) | Accessibility tests with axe-core |

### Project Structure Notes

**Files to create:** None

**Files to modify:**
| File | Change |
|---|---|
| `src/lib/seo.ts` | Add optional `imageUrl` to `buildMetadata` + `buildLocalBusinessJsonLd` |
| `src/app/[citySlug]/[companySlug]/page.tsx` | Pass `listing.photos[0]?.url` to metadata + JSON-LD, pass city/state to PhotoGallery |
| `src/components/photo-gallery.tsx` | Add `cityName`/`state` props, update primary alt text |
| `src/components/listing-card.tsx` | Update thumbnail alt text to include service keyword |
| `lighthouserc.json` | Add listing page URL, add performance score assertion |

### References

- [Source: src/lib/seo.ts] — `buildMetadata()` and `buildLocalBusinessJsonLd()` current implementation
- [Source: src/app/[citySlug]/[companySlug]/page.tsx#L50-75] — `generateMetadata()` and `buildLocalBusinessJsonLd()` call sites
- [Source: src/components/photo-gallery.tsx] — `PhotoGalleryProps` interface and alt text patterns
- [Source: src/components/listing-card.tsx#L25] — Thumbnail alt text
- [Source: lighthouserc.json] — Current CI performance assertions
- [Source: .github/workflows/ci.yml] — CI pipeline with Lighthouse + Playwright
- [Source: tests/a11y.spec.ts] — Accessibility tests (already includes listing detail page)
- [Source: _bmad-output/implementation-artifacts/12-2-listing-detail-page-photo-gallery.md] — Gallery component learnings
- [Source: _bmad-output/implementation-artifacts/12-3-listing-card-city-page-photo-thumbnails.md] — Card thumbnail learnings
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-20.md] — Story 12.4 specifications

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — clean implementation with no errors.

### Completion Notes List

- Task 1+3 combined: Updated `seo.ts` with optional `imageUrl` param in both `buildMetadata()` and `buildLocalBusinessJsonLd()`. When `imageUrl` is provided, OG/Twitter use the raw Google CDN URL (no width/height since dimensions vary). Fallback to hero image when undefined.
- Task 2: `generateMetadata()` in listing detail page now passes `listing.photos[0]?.url` to `buildMetadata()`. Returns `undefined` when no photos, triggering hero image fallback.
- Task 3.3: `buildLocalBusinessJsonLd()` call now includes `imageUrl: listing.photos[0]?.url` — adds schema.org `image` property for Google Rich Results.
- Task 4: PhotoGallery now accepts `cityName`/`state` props. Primary alt text updated to `"[Company] — attic cleaning company in [City], [State]"`. Card thumbnail alt updated to `"[Company] — attic cleaning services"` for keyword relevance.
- Task 5: Added `/phoenix-az/attic-construction` to Lighthouse CI URL list and `categories:performance >= 0.90` assertion.
- Task 6: Build verified — 1722 static pages, zero errors.

### File List

| File | Change |
|---|---|
| `src/lib/seo.ts` | Added optional `imageUrl` to `buildMetadata` and `buildLocalBusinessJsonLd` |
| `src/app/[citySlug]/[companySlug]/page.tsx` | Pass `listing.photos[0]?.url` to metadata + JSON-LD, pass city/state to PhotoGallery |
| `src/components/photo-gallery.tsx` | Added `cityName`/`state` props, updated primary alt text with location keywords |
| `src/components/listing-card.tsx` | Updated thumbnail alt text to `"— attic cleaning services"` |
| `lighthouserc.json` | Added listing page URL, added `categories:performance` assertion |
