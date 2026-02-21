# Sprint Change Proposal — Epic 12: Listing Photo Pipeline & Display

**Date:** 2026-02-20
**Triggered by:** Strategic initiative — enhance listings with business photos from Outscraper/Google Maps
**Mode:** Batch
**Change Scope:** Moderate

---

## Section 1: Issue Summary

### Problem Statement
The attic cleaning directory is currently a text-only listing site. While the MVP "pure signal, no photos" approach was intentional, the site now has zero visual proof of the businesses it lists. Every competitor (Google Maps, Yelp, HomeAdvisor) displays business photos prominently. Outscraper's Google Maps data includes business photo URLs that are currently being discarded during import. Adding photos would strengthen the "trust through transparency" principle — real photos of real businesses, not stock imagery.

### Context
All 11 epics are complete. The existing Outscraper import pipeline (`import-listings.ts`) maps text fields but ignores the `photos` array that Outscraper exports include. The Prisma schema has no photo-related fields. The Next.js Image component is already available but unconfigured for remote image sources. The `docs/images/` directory contains 5 sample business images, suggesting this enhancement was already being explored.

### Evidence
- Zero listing photos in the database or on the site
- Outscraper exports include `photos` array (photo URLs from Google Maps) — currently discarded
- PRD Phase 3 references "photos" as part of contractor profiles
- 5 sample business images in `docs/images/` suggest prior exploration
- Competitors prominently feature business photos

---

## Section 2: Impact Analysis

### Epic Impact
| Epic | Status | Impact |
|------|--------|--------|
| Epics 1-11 | Done | **No impact.** All existing work preserved. |
| Epic 12 (NEW) | Proposed | New epic: Photo import pipeline + listing display |

### Story Impact
- No existing stories modified
- 4 new stories proposed for Epic 12

### Artifact Conflicts

**PRD:** No conflict. Enhancement aligns with success criteria and trust principles. Phase 3 already mentions photos.

**Architecture:** Changes needed:
- New `ListingPhoto` Prisma model
- Import pipeline extension (map `photos` field)
- `next.config.ts`: Add `remotePatterns` for Google image domains
- CSP header: Update `img-src` directive
- Image serving via Next.js `<Image>` with automatic optimization

**UX Design:** Enhancement:
- Listing detail page: Photo gallery section
- Listing cards: Optional thumbnail (graceful fallback to text-only)
- Design philosophy evolves from "pure signal" to "signal + visual proof"

**Other:** No CI/CD, deployment, or testing infrastructure changes needed.

### Technical Impact
- **Risk level: Low-Medium** — external URL reliability is the main risk
- **Performance impact: Managed** — Next.js Image lazy-loads, optimizes to WebP/AVIF, serves responsive sizes
- **Build time impact: None** — Next.js Image optimizes on-demand, not at build time
- **Storage impact: None** — photos served from Google's servers via Next.js Image proxy

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (Option 1)

Add **new Epic 12** with 4 stories that extend the existing Outscraper pipeline to import photo URLs, update the database schema, and display photos on listing pages and cards.

### Key Architectural Decision: Image Serving Strategy

**Use Next.js `<Image>` with `remotePatterns`** — reference Google-hosted photo URLs, let Next.js handle optimization (WebP/AVIF conversion, responsive srcset, lazy loading). Cloudflare CDN caches the optimized images at the edge.

**Why not self-host?** With 15,000-20,000 listings and potentially 5-10 photos each (75K-200K images), self-hosting would bloat the repo, increase build time, and require storage infrastructure. Next.js Image proxy + CDN achieves the same performance result with zero storage overhead.

**Fallback plan:** If Google-hosted URLs prove unreliable over time, a future story can add a download-and-host pipeline using Cloudflare R2.

### Effort Estimate: Medium
- Database migration + pipeline extension: 1 story
- UI components (gallery + thumbnails): 2 stories
- Performance/SEO validation: 1 story

### Risk Assessment: Low-Medium
- **Main risk**: Google Maps photo URLs may expire or be rate-limited
- **Mitigation**: Store multiple photo URLs per listing; if primary fails, Next.js Image shows fallback
- **Mitigation**: Next.js Image caches optimized versions — reduces external requests after first load

---

## Section 4: Detailed Change Proposals

### Epic 12: Listing Photo Pipeline & Display

**Epic Description:** Extend the Outscraper import pipeline to capture Google Maps business photos and display them on listing pages, listing cards, and city landing pages. Uses Next.js Image component for automatic optimization and Cloudflare CDN for edge delivery. All existing text-only functionality preserved — photos are additive enhancements with graceful fallback.

---

### Story 12.1: Photo Data Model & Import Pipeline Extension

**Objective:** Add photo storage to the database schema and extend the import pipeline to capture photo URLs from Outscraper exports.

**Changes:**

#### Prisma Schema — New ListingPhoto model

```
OLD:
(No photo model exists)

NEW:
model ListingPhoto {
  id          String   @id @default(cuid())
  listing     Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  listingId   String
  url         String
  width       Int?
  height      Int?
  isPrimary   Boolean  @default(false)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())

  @@index([listingId])
}
```

Add relation to Listing model:
```
OLD (Listing model):
  serviceTags   ServiceTag[]

NEW:
  serviceTags   ServiceTag[]
  photos        ListingPhoto[]
```

#### import-listings.ts — Map photos field

```
OLD:
(No photo field mapping)

NEW:
Add field alias for photos:
  photos → photos (aliases: photos_data, images)
  photo  → primaryPhoto (alias for single primary photo URL)

For each listing with photos:
  - Extract photo URLs from Outscraper's photos array
  - Create ListingPhoto records with URL, dimensions (if available), and sort order
  - First photo marked as isPrimary: true
  - Maximum 10 photos per listing (avoid excessive data)
```

#### next.config.ts — Remote image patterns

```
OLD:
(No images configuration)

NEW:
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
    { protocol: 'https', hostname: '*.googleusercontent.com' },
    { protocol: 'https', hostname: 'streetviewpixels-pa.googleapis.com' },
  ],
}
```

#### next.config.ts — CSP header update

```
OLD:
img-src 'self' data:

NEW:
img-src 'self' data: https://*.googleusercontent.com https://streetviewpixels-pa.googleapis.com
```

**Acceptance Criteria:**
- [ ] `ListingPhoto` model added to Prisma schema with migration
- [ ] Listing model has `photos` relation
- [ ] Import script maps Outscraper's `photos` field to `ListingPhoto` records
- [ ] Maximum 10 photos imported per listing
- [ ] First photo flagged as `isPrimary: true`
- [ ] Import is idempotent — re-running clears and re-imports photos for each listing
- [ ] Import summary report includes: "Photos imported: X listings with photos, Y total photos"
- [ ] `remotePatterns` configured for Google image domains
- [ ] CSP `img-src` updated to allow Google image domains
- [ ] Existing import data re-run to populate photos for all listings

---

### Story 12.2: Listing Detail Page Photo Gallery

**Objective:** Add a responsive photo gallery to listing detail pages, displaying business photos from Google Maps.

**Changes:**

#### New component: photo-gallery.tsx

```
Server component displaying listing photos in a responsive grid.

Mobile (< 768px):
  - Primary photo: full-width, 16:9 aspect ratio
  - Additional photos: 2-column grid below primary
  - Maximum 6 photos displayed (primary + 5)

Desktop (> 1024px):
  - Primary photo: large, left side (2/3 width)
  - Additional photos: 2-column grid, right side (1/3 width)
  - Maximum 8 photos displayed

All photos use Next.js <Image> component:
  - sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  - loading="lazy" (except primary photo which uses priority)
  - Descriptive alt text: "[Company Name] - business photo [N]"
  - Rounded corners (rounded-lg) consistent with card system
```

#### Listing detail page — Integrate gallery

```
OLD:
(No photos section)

NEW:
Below company name/rating, above reviews section:
  <PhotoGallery photos={listing.photos} companyName={listing.name} />

Graceful fallback: If listing has 0 photos, gallery section not rendered.
Page layout unchanged for listings without photos.
```

**Acceptance Criteria:**
- [ ] Photo gallery component renders responsive grid
- [ ] Primary photo uses `priority` loading (LCP candidate)
- [ ] Additional photos use `loading="lazy"`
- [ ] All photos have descriptive alt text with company name
- [ ] Gallery hidden when listing has no photos (no empty state)
- [ ] Mobile: full-width primary + 2-col grid
- [ ] Desktop: primary (2/3) + thumbnails (1/3)
- [ ] Photos use `rounded-lg` consistent with design system
- [ ] Touch targets for any photo interaction meet 44x44px minimum
- [ ] Gallery does not cause CLS (dimensions set via width/height or aspect ratio)

---

### Story 12.3: Listing Card & City Page Photo Thumbnails

**Objective:** Add an optional primary photo thumbnail to listing cards on search results and city landing pages.

**Changes:**

#### ListingCard — Add photo thumbnail

```
OLD card anatomy:
┌─────────────────────────────────────────┐
│ Company Name                            │
│ ★★★★★ 4.9 (187 reviews)               │
│ [Rodent] [Insulation] [Decontam]       │
│ "They found evidence of rats..."        │
│ ─────────────────────────────────────── │
│ (602) 555-0142        Visit Website     │
└─────────────────────────────────────────┘

NEW card anatomy (with photo):
┌─────────────────────────────────────────┐
│ ┌──────────┐ Company Name               │
│ │  Photo   │ ★★★★★ 4.9 (187 reviews)  │
│ │ 80x80    │ [Rodent] [Insulation]      │
│ └──────────┘                            │
│ "They found evidence of rats..."        │
│ ─────────────────────────────────────── │
│ (602) 555-0142        Visit Website     │
└─────────────────────────────────────────┘

NEW card anatomy (no photo — identical to current):
┌─────────────────────────────────────────┐
│ Company Name                            │
│ ★★★★★ 4.9 (187 reviews)               │
│ [Rodent] [Insulation] [Decontam]       │
│ "They found evidence of rats..."        │
│ ─────────────────────────────────────── │
│ (602) 555-0142        Visit Website     │
└─────────────────────────────────────────┘
```

**Implementation:**
- Thumbnail: 80x80px (mobile), 96x96px (desktop), `rounded-lg`, `object-cover`
- Photo + text in a flex row for the top section of the card
- Graceful fallback: When `listing.photos.length === 0`, render current text-only layout (no placeholder, no broken image icon)
- Next.js `<Image>` with `sizes="96px"` for optimal optimization

#### City landing page — Include photos in listing query

```
OLD:
prisma.listing.findMany({ include: { serviceTags: true, reviews: true } })

NEW:
prisma.listing.findMany({ include: { serviceTags: true, reviews: true, photos: { where: { isPrimary: true }, take: 1 } } })
```

**Acceptance Criteria:**
- [ ] Listing cards display primary photo thumbnail when available
- [ ] Cards without photos render identically to current text-only layout
- [ ] Thumbnail is 80x80 mobile / 96x96 desktop with `rounded-lg`
- [ ] Photo uses `object-cover` for consistent framing
- [ ] Card layout maintains data-dense design — photo is supporting, not dominant
- [ ] City landing page queries include primary photo
- [ ] Search results page queries include primary photo
- [ ] No CLS from photo loading (dimensions explicitly set)
- [ ] `shadow-card` and `hover:shadow-card-hover` tokens maintained on cards
- [ ] All card touch targets remain 44x44px minimum

---

### Story 12.4: Photo SEO, Performance & Quality Validation

**Objective:** Optimize photos for SEO, validate performance targets, and ensure cross-browser quality.

**Changes:**

#### SEO — Listing page OG/Twitter images

```
OLD (seo.ts):
All pages share the hero image for OG/Twitter

NEW:
Listing detail pages with photos use primary photo for og:image and twitter:image
Fallback to hero image when no listing photo available
```

#### SEO — Image alt text pattern

```
All listing photos:
  Primary: "[Company Name] - attic cleaning company in [City], [State]"
  Additional: "[Company Name] - business photo [N]"

Thumbnail on cards:
  "[Company Name] attic cleaning services"
```

#### Performance validation

- LCP < 1.5s on listing detail pages with photos (primary photo is LCP candidate)
- Page weight < 500KB initial load (photos lazy-loaded except primary)
- No CLS from photo loading
- Build time unchanged (Next.js Image optimizes on-demand)

**Acceptance Criteria:**
- [ ] Listing pages with photos use primary photo for OG/Twitter image
- [ ] All photos have SEO-optimized alt text with business name and location
- [ ] LCP < 1.5s on listing detail pages with gallery (mobile 4G)
- [ ] Page weight < 500KB initial load (lazy-loaded photos excluded)
- [ ] Zero CLS from photo loading on all page types
- [ ] Photos render correctly in Chrome, Firefox, Safari
- [ ] Next.js Image optimization produces WebP/AVIF formats
- [ ] Cloudflare CDN caches optimized images
- [ ] Lighthouse performance score maintained >= 90
- [ ] Lighthouse accessibility score maintained >= 95

---

## Section 5: Implementation Handoff

### Change Scope Classification: Moderate

This is a **Moderate** change requiring:
- **Scrum Master / Product Owner**: Add Epic 12 to sprint-status.yaml, create 4 story files
- **Developer**: Database migration, pipeline extension, new UI components (4 story sessions)
- **QA**: Performance and cross-browser validation (Story 12.4)

### Handoff Plan

| Role | Responsibility | Deliverable |
|------|---------------|-------------|
| SM / PO | Create Epic 12 entry in sprint-status.yaml | Updated sprint-status.yaml |
| SM / PO | Create 4 story files from proposals above | Story files in implementation-artifacts |
| Developer | Implement Stories 12.1-12.3 in sequence | Schema, pipeline, UI changes |
| Developer/QA | Execute Story 12.4 validation | Performance and SEO verification |

### Implementation Sequence
1. **Story 12.1** first — database schema and import pipeline (foundation — all other stories depend on photo data)
2. **Story 12.2** second — listing detail page gallery (highest-impact visual change)
3. **Story 12.3** third — card thumbnails (builds on query changes from 12.2)
4. **Story 12.4** last — SEO and performance validation (must follow all implementation)

### Success Criteria
- Photo data populated for listings across all 25 metros
- Listing detail pages display photo galleries where photos exist
- Listing cards show thumbnails where photos exist, gracefully degrade where they don't
- All performance targets maintained (LCP < 1.5s, CLS < 0.1, < 500KB)
- Accessibility maintained (Lighthouse >= 95)
- No regressions to existing text-only experience

### Artifacts to Update After Approval
- `sprint-status.yaml`: Add Epic 12 entries
- `epics.md`: Add Epic 12 definition and 4 stories
- `next.config.ts`: Remote image patterns and CSP
- `prisma/schema.prisma`: ListingPhoto model

---

## Change Navigation Checklist Status

| # | Item | Status |
|---|------|--------|
| 1.1 | Identify triggering story | [x] Done — Strategic initiative post-MVP |
| 1.2 | Define core problem | [x] Done — Text-only listings lack visual trust signals |
| 1.3 | Assess impact with evidence | [x] Done — 5 evidence points documented |
| 2.1 | Evaluate current epic | [N/A] — All epics done |
| 2.2 | Determine epic-level changes | [x] Done — Add new Epic 12 |
| 2.3 | Review remaining planned epics | [N/A] — No remaining epics |
| 2.4 | Check for invalidated/new epics | [x] Done — No invalidation, 1 new epic |
| 2.5 | Consider resequencing | [N/A] — No resequencing needed |
| 3.1 | Check PRD conflicts | [x] Done — No conflict, aligns with Phase 3 |
| 3.2 | Review Architecture conflicts | [!] Action-needed — Schema, config, CSP changes |
| 3.3 | Examine UI/UX conflicts | [!] Action-needed — Gallery + card thumbnail |
| 3.4 | Consider other artifacts | [x] Done — No additional impact |
| 4.1 | Evaluate Direct Adjustment | [x] Done — Viable (selected) |
| 4.2 | Evaluate Potential Rollback | [N/A] — Nothing to rollback |
| 4.3 | Evaluate PRD MVP Review | [N/A] — MVP complete |
| 4.4 | Select recommended path | [x] Done — Direct Adjustment |
| 5.1 | Create issue summary | [x] Done |
| 5.2 | Document impact | [x] Done |
| 5.3 | Present recommended path | [x] Done |
| 5.4 | Define action plan | [x] Done |
| 5.5 | Establish handoff plan | [x] Done |
| 6.1 | Review checklist completion | [x] Done |
| 6.2 | Verify proposal accuracy | [x] Done |
| 6.3 | Obtain user approval | [x] Done — Approved 2026-02-20 |
| 6.4 | Update sprint-status.yaml | [x] Done — Epic 12 added with 4 stories (backlog) |
| 6.5 | Confirm next steps | [x] Done — Route to SM for story creation |
