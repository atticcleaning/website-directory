# Story 3.1: Listing Detail Page

Status: done

## Story

As a **homeowner**,
I want to view a detailed profile page for a company with all their information, reviews, and a map,
So that I can fully evaluate a contractor before contacting them.

## Acceptance Criteria

1. **Static Generation:** The listing detail page at `/[citySlug]/[companySlug]` is statically generated via `generateStaticParams` querying all listings from Prisma. NOTE: If database SSL still fails at build time (as with Story 2.6), fall back to `export const dynamic = "force-dynamic"` and document the deviation.
2. **Company Name:** The page displays the company name as h1 (Jakarta Sans, 24px mobile / 32px desktop, weight 700)
3. **Business Info:** The page displays full address, phone number, website link, and business hours (FR8)
4. **Phone Link:** The phone number renders as `<a href="tel:...">` with `aria-label="Call [company name]"` (FR11)
5. **Website Link:** The website link opens in a new tab with `target="_blank" rel="noopener"` (FR11)
6. **Reviews:** All imported Google reviews display with individual star ratings, author name, review text, and date (FR9)
7. **Review Typography:** Reviews are rendered in Source Serif 4 for the review text body
8. **Star Rating:** The StarRating component displays in "full" variant showing "(X reviews)"
9. **Service Tags:** All service tags display as ServiceTagChip "card" variant chips (FR10)
10. **Google Maps Embed:** A Google Maps embed shows the company location via lazy-loaded iframe with `loading="lazy"` (NFR-I2)
11. **Maps Fallback:** If the Maps embed fails to load, the full address text displays as fallback within 2 seconds (NFR-I2)
12. **City Back-Link:** The page links back to the parent city landing page — e.g., "More attic cleaning companies in Phoenix, AZ" (FR18)
13. **Layout:** The page layout is single column, max-width 800px on desktop
14. **Semantic HTML:** The page uses semantic HTML with proper heading hierarchy (h1 company name, h2 sections)
15. **SEO Metadata:** The page has a unique `<title>` tag: "[Company Name] - Attic Cleaning in [City], [State]" and a meta description summarizing rating, review count, and services
16. **Keyboard Accessible:** All contact links and navigation links are keyboard accessible with visible focus indicators
17. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully

## Tasks / Subtasks

- [x] Task 1: Create listing detail page with data fetching & metadata (AC: #1, #2, #3, #4, #5, #8, #9, #12, #13, #14, #15)
  - [x] 1.1 Create route file at `src/app/[citySlug]/[companySlug]/page.tsx` as an async server component
  - [x] 1.2 Implement `generateStaticParams()` querying all listings with city slugs from Prisma. SSL fix enabled static generation — no fallback needed.
  - [x] 1.3 Implement `generateMetadata()` with title "[Company Name] - Attic Cleaning in [City], [State]" and description summarizing rating/reviews/services. Use `params: Promise<{ citySlug: string; companySlug: string }>` (Next.js 16 convention — params is a Promise, must be awaited)
  - [x] 1.4 Page component: fetch listing from Prisma with city, reviews, and serviceTags included. Query: `prisma.listing.findFirst({ where: { slug: companySlug, city: { slug: citySlug } }, include: { city: true, reviews: { orderBy: { publishedAt: "desc" } }, serviceTags: true } })`. Return `notFound()` if listing is null.
  - [x] 1.5 Wrap page content in `<div className="mx-auto max-w-[800px] py-8">` for 800px max-width within the existing 1200px layout container
  - [x] 1.6 Render h1 company name: `font-sans text-2xl font-bold text-foreground md:text-[2rem]` (24px mobile, 32px desktop, weight 700)
  - [x] 1.7 Render StarRating with `variant="full"` below h1
  - [x] 1.8 Render service tags as `ServiceTagChip variant="card"` in a flex-wrap row
  - [x] 1.9 Render contact section: phone as `<a href="tel:{digits}">` with `aria-label="Call {name}"`, icon from lucide-react `Phone`. Website as `<a href={website} target="_blank" rel="noopener">` with `aria-label="Visit {name} website"`, icon from lucide-react `ExternalLink`. Both min-h-[44px] for touch targets. Style: `text-primary` (blue, secondary action per UX spec — no button styling)
  - [x] 1.10 Render address as text
  - [x] 1.11 Render business hours from `listing.workingHours` (String? — may be JSON from Outscraper or null). Parse gracefully: if valid JSON object, render structured hours; if plain string, render as-is; if null, omit section
  - [x] 1.12 Render "Reviews" h2 section with all reviews. Each review: author name (font-sans font-medium), individual StarRating compact, review text (font-serif for Source Serif 4 body), formatted date. Reviews already ordered by publishedAt desc from query.
  - [x] 1.13 Render city back-link: `<Link href={/${listing.city.slug}}>` with text "More attic cleaning companies in {city.name}, {city.state}". Style: `text-foreground` tertiary link per UX spec. Min-h-[44px] touch target.
  - [x] 1.14 Section spacing: `mt-8` (32px) between major sections per UX spacing scale

- [x] Task 2: Create GoogleMap client component (AC: #10, #11)
  - [x] 2.1 Create `src/components/google-map.tsx` as a `"use client"` component
  - [x] 2.2 Props: `latitude: number`, `longitude: number`, `address: string`, `companyName: string`, `apiKey: string`
  - [x] 2.3 Render Google Maps embed iframe: `src="https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}"` with `loading="lazy"`, `title="Map showing location of {companyName}"`, `className="h-[300px] w-full rounded-lg border border-border"`
  - [x] 2.4 Pass `GOOGLE_MAPS_API_KEY` as a prop from the server component page (access `process.env.GOOGLE_MAPS_API_KEY` in the page, pass to client component). Do NOT use `NEXT_PUBLIC_` prefix — the key is server-read and embedded in rendered HTML only.
  - [x] 2.5 Implement 2-second fallback: use `useState` + `onLoad` handler on iframe. After 2 seconds without `onLoad` firing, hide iframe and show address text fallback. If `onLoad` fires, mark as loaded and show iframe.
  - [x] 2.6 If no `GOOGLE_MAPS_API_KEY` env var, render address-only fallback immediately (no iframe)

- [x] Task 3: Validate build (AC: #17)
  - [x] 3.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 3.2 Run `npm run lint` — zero violations
  - [x] 3.3 Run `npm run build` — compiles successfully. `generateStaticParams` works — listing routes appear as `● (SSG)` with 18 paths generated.

## Dev Notes

### Architecture Compliance

**Page Structure (architecture.md):**
- Route: `src/app/[citySlug]/[companySlug]/page.tsx` — async server component
- Static generation: `generateStaticParams` queries all listings (architecture.md line 277-281)
- Data fetching: Direct Prisma query in server component — page is the data-fetching boundary
- Components receive data via props — never fetch internally
- No `loading.tsx` — anti-pattern per architecture
- Layout: Single column, max-width 800px (UX spec: "Single column, max-width 800px" for listing detail)

**URL Structure (architecture.md line 283-289):**
- `/[city-state]/[company-slug]` e.g., `/phoenix-az/abc-attic-cleaning`
- Route params: `citySlug` = `City.slug`, `companySlug` = `Listing.slug`
- Listing slug uniqueness: `@@unique([cityId, slug])` in Prisma schema

**Rendering Strategy:**
- Architecture says listing detail pages are statically generated via `generateStaticParams`
- Story 2.6 discovered that database SSL cert fails at build time (self-signed cert)
- The SSL fix in `prisma.ts` (stripping sslmode, using `ssl: { rejectUnauthorized: false }`) was applied AFTER Story 2.6's build test — it MAY enable static generation at build time now
- Try `generateStaticParams` first. If build fails, fall back to `export const dynamic = "force-dynamic"`

**Client Component Change:**
- GoogleMap component (`google-map.tsx`) must be client component (`"use client"`) for iframe onLoad handling and 2-second fallback state
- Everything else is server-rendered — no other client components needed on this page

### Prisma Schema — Listing Model

```prisma
model Listing {
  id            String       @id @default(cuid())
  googlePlaceId String       @unique
  name          String
  slug          String
  starRating    Float
  reviewCount   Int
  phone         String?
  website       String?
  address       String
  description   String?
  subtypes      String?
  workingHours  String?
  latitude      Float
  longitude     Float
  city          City         @relation(fields: [cityId], references: [id])
  cityId        String
  reviews       Review[]
  serviceTags   ServiceTag[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  @@unique([cityId, slug])
}

model Review {
  id          String   @id @default(cuid())
  listing     Listing  @relation(fields: [listingId], references: [id])
  listingId   String
  authorName  String
  rating      Float
  text        String?
  publishedAt DateTime
  createdAt   DateTime @default(now())
}
```

**Key fields for detail page:**
- `name`, `starRating`, `reviewCount` — header section
- `phone` (nullable), `website` (nullable), `address` — contact section
- `workingHours` (nullable String) — may be Outscraper JSON or plain text
- `latitude`, `longitude` — Google Maps embed
- `city` (relation) — city name, state, slug for back-link and metadata
- `reviews` (relation) — all reviews with authorName, rating, text, publishedAt
- `serviceTags` (relation) — ServiceTag with serviceType enum

### Existing Components to Reuse

**StarRating** (`src/components/star-rating.tsx`):
- Already supports `variant="full"` → shows "(X reviews)" instead of "(X)"
- Props: `rating: number`, `reviewCount: number`, `variant: "compact" | "full"`

**ServiceTagChip** (`src/components/service-tag-chip.tsx`):
- Already supports `variant="card"` → display-only colored chip
- Props: `serviceType: ServiceType`, `variant: "card" | "filter"`
- `SERVICE_TAG_CONFIG` is exported for label lookup

**ListingCard** (`src/components/listing-card.tsx`) — reference for patterns:
- Phone link pattern: `href={tel:${listing.phone.replace(/[^\d+]/g, "")}}` with `aria-label="Call ${listing.name}"`
- Website link pattern: `href={listing.website}` with `target="_blank" rel="noopener"`
- lucide-react icons: `Phone`, `ExternalLink` (already used, same import pattern)

### Type Scale (from UX spec)

| Element | Font | Mobile | Desktop | Weight |
|---|---|---|---|---|
| Company name (h1) | Jakarta Sans | 24px / 1.5rem | 32px / 2rem | 700 |
| Section heading (h2) | Jakarta Sans | 20px / 1.25rem | 24px / 1.5rem | 600 |
| Review author name | Jakarta Sans | 14px | 14px | 500 |
| Review text body | Source Serif 4 | 14px | 15px | 400 |
| Contact links | Jakarta Sans | 14px | 14px | 500 |
| Address text | Jakarta Sans | 14px | 14px | 400 |

### UX Action Hierarchy

Per UX spec, contact links are **secondary actions** (blue text, no background):
- Phone: `text-primary` link with Phone icon
- Website: `text-primary` link with ExternalLink icon
- No button styling — "they feel like information, not buttons"

City back-link is a **tertiary link** (dark text, underline on hover):
- `text-foreground` with optional hover underline

### Google Maps Embed

**Embed URL format:**
```
https://www.google.com/maps/embed/v1/place?key={GOOGLE_MAPS_API_KEY}&q={latitude},{longitude}
```

**API key:** Available as `process.env.GOOGLE_MAPS_API_KEY` (already in .env). Access in server component, pass as prop to client GoogleMap component.

**Fallback logic (client component):**
1. Render iframe with `loading="lazy"` and `onLoad` handler
2. Start 2-second timer on mount
3. If `onLoad` fires → show iframe, clear timer
4. If timer expires without `onLoad` → hide iframe, show address text

### Import Order Convention

1. `"use client"` directive (if applicable)
2. React/Next.js imports (`import { notFound } from "next/navigation"`, `import Link from "next/link"`)
3. Third-party library imports (`lucide-react`)
4. `@/components/ui/` imports (shadcn primitives)
5. `@/components/` imports
6. `@/lib/` imports
7. `@/types/` imports

### What This Story Does NOT Do

- Does NOT create city landing pages at `/[citySlug]/page.tsx` (Epic 4)
- Does NOT add LocalBusiness JSON-LD schema markup (Epic 6, Story 6.1)
- Does NOT add Open Graph or Twitter Card meta tags (Epic 6)
- Does NOT add animations or transitions (UX-13: no animations in MVP)
- Does NOT create `loading.tsx` — anti-pattern per architecture
- Does NOT create tests (testing framework not yet set up)
- Does NOT modify existing components (StarRating, ServiceTagChip, ListingCard)
- Does NOT add a Google Maps embed without the API key — graceful fallback to address text

### Anti-Patterns to Avoid

- **Do NOT fetch from the API route** — query Prisma directly in the server component
- **Do NOT add `"use client"` to page.tsx** — it's a server component (only GoogleMap is client)
- **Do NOT create barrel files** — anti-pattern per architecture
- **Do NOT add per-component focus styles** — global `:focus-visible` handles focus
- **Do NOT duplicate `<main>` tag** — root layout already provides `<main>` with 1200px container
- **Do NOT use `React.cache()`** — if page is static, there's only one render; if dynamic, metadata and page share the same request context
- **Do NOT use `useEffect` or `useState` in page.tsx** — server component; only GoogleMap client component uses hooks
- **Do NOT render the map without `loading="lazy"`** — performance requirement
- **Do NOT hardcode the Google Maps API key** — read from `process.env.GOOGLE_MAPS_API_KEY`

### Previous Story Learnings (from Stories 2.1-2.6)

- **SSL at build time**: Database SSL cert fails at build time. The `prisma.ts` SSL fix (stripping sslmode, rejectUnauthorized: false) was applied in commit `ef09279`. This MAY enable `generateStaticParams` — test it.
- **Next.js 16 params**: Route params are `Promise` — must be awaited: `const { citySlug, companySlug } = await params`
- **Touch targets**: ALL interactive elements (links, buttons) must have `min-h-[44px]`
- **h1 weight 700**: Use `font-bold` not `font-semibold` for h1 (caught in Story 2.5 code review)
- **Section spacing 32px**: Use `mt-8` between major sections (caught in Story 2.6 code review)
- **Non-interactive placeholders**: Use `text-foreground` not `text-primary` for non-clickable items
- **Build verification is critical**: Always run `tsc --noEmit`, `lint`, and `build` before marking done

### Project Structure Notes

```
src/app/
├── [citySlug]/
│   └── [companySlug]/
│       └── page.tsx          ← NEW (listing detail page)
├── search/page.tsx
├── api/search/route.ts
├── globals.css
├── layout.tsx
└── page.tsx

src/components/
├── google-map.tsx            ← NEW (client component)
├── star-rating.tsx           (reuse, "full" variant)
├── service-tag-chip.tsx      (reuse, "card" variant)
├── listing-card.tsx          (reference for patterns)
├── header.tsx
├── footer.tsx
├── search-bar.tsx
├── filter-toolbar.tsx
├── city-card.tsx
├── article-card.tsx
├── radius-info.tsx
└── ui/select.tsx
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] — Acceptance criteria, user story, BDD scenarios
- [Source: _bmad-output/planning-artifacts/architecture.md#Rendering Strategy (line 277)] — Static generation via generateStaticParams
- [Source: _bmad-output/planning-artifacts/architecture.md#URL Structure (line 283)] — /[city-state]/[company-slug]
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Fetching (line 528)] — Page-level Prisma queries
- [Source: _bmad-output/planning-artifacts/architecture.md#File Structure (line 390)] — Route directory structure
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Page Layouts (line 572)] — Single column, max-width 800px
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Type Scale (line 439)] — h1 24px/32px, h2 20px/24px
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Action Hierarchy (line 1009)] — Contact links as secondary actions
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#StarRating (line 885)] — "full" variant shows "(X reviews)"
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Touch Targets (line 493)] — 44px minimum, phone link
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Motion (line 518)] — No animations in MVP; Maps embed is only dynamic element
- [Source: prisma/schema.prisma#Listing] — All fields: slug, workingHours, description, etc.
- [Source: prisma/schema.prisma#Review] — authorName, rating, text, publishedAt
- [Source: src/components/listing-card.tsx] — Phone/website link patterns, lucide-react icons
- [Source: src/components/star-rating.tsx] — "full" variant implementation
- [Source: src/lib/prisma.ts] — SSL fix: stripping sslmode + rejectUnauthorized: false

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- SSL fix from commit ef09279 enabled `generateStaticParams` at build time — no deviation from AC #1 needed
- `generateStaticParams` produced 18 static paths (● SSG) for listing detail pages
- Individual review StarRating uses `variant="compact"` with `reviewCount=0` to suppress count display on per-review ratings
- GoogleMap component passes `apiKey` as prop from server component to avoid NEXT_PUBLIC_ exposure
- `workingHours` parsing handles JSON object, JSON array, plain string, and null gracefully

### Completion Notes List

- Created listing detail page at `src/app/[citySlug]/[companySlug]/page.tsx` with full SSG via generateStaticParams
- Page renders: h1 company name, StarRating (full), service tags, contact links (phone tel:, website external), address, Google Maps embed, business hours, all reviews, city back-link
- Created GoogleMap client component with 2-second iframe fallback and API key graceful degradation
- generateMetadata produces unique title and description per listing
- All 17 ACs satisfied, all build gates pass

### Change Log

- 2026-02-12: Story 3.1 implementation — listing detail page with SSG, reviews, Google Maps embed

### File List

- src/app/[citySlug]/[companySlug]/page.tsx (NEW — listing detail page)
- src/components/google-map.tsx (NEW — Google Maps embed client component)
