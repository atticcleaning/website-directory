# Story 6.1: SEO Metadata & Schema Markup

Status: done

## Story

As a **site owner**,
I want every page to have proper SEO metadata and structured data markup,
So that search engines can understand, index, and display rich results for all directory pages.

## Acceptance Criteria

1. **SEO Helper Library:** `src/lib/seo.ts` exists with metadata generation helpers: a `buildMetadata()` function that produces canonical URLs, Open Graph tags (og:title, og:description, og:url, og:type, og:site_name), and Twitter Card tags (twitter:card, twitter:title, twitter:description) for any page. A `buildLocalBusinessJsonLd()` function that produces LocalBusiness JSON-LD for listing pages.
2. **Canonical URLs:** Every page has a self-referencing canonical URL via Next.js Metadata API `alternates.canonical`. The canonical base URL is configured via `NEXT_PUBLIC_BASE_URL` environment variable (default: `https://atticcleaning.com`).
3. **Open Graph Tags:** Every page has Open Graph tags: og:title, og:description, og:url, og:type (`website` for all pages), og:site_name (`AtticCleaning.com`). Note: `business.business` is not a valid Next.js OG type — all pages use `website`.
4. **Twitter Card Tags:** Every page has Twitter Card tags: twitter:card (`summary`), twitter:title, twitter:description.
5. **Listing Page JSON-LD:** Listing detail pages (`/[citySlug]/[companySlug]`) embed LocalBusiness JSON-LD in a `<script type="application/ld+json">` tag with: @type (`LocalBusiness`), name, address (streetAddress, addressLocality, addressRegion), telephone, url, aggregateRating (ratingValue, reviewCount), geo (latitude, longitude).
6. **All Pages Updated:** All 5 page routes use `buildMetadata()` from `seo.ts` in their `generateMetadata` functions: homepage (`page.tsx`), city page (`[citySlug]/page.tsx`), listing page (`[citySlug]/[companySlug]/page.tsx`), article page (`articles/[slug]/page.tsx`), search page (`search/page.tsx`).
7. **Semantic HTML:** All pages maintain proper heading hierarchy (single h1), landmark regions (`<header>`, `<main>`, `<footer>`), and structured content. (Already implemented via layout.tsx — verify no regressions.)
8. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with no regressions in page rendering modes.

## Tasks / Subtasks

- [x] Task 1: Create `src/lib/seo.ts` with metadata helpers (AC: #1, #2, #3, #4)
  - [x] 1.1 Define `SITE_NAME` constant (`"AtticCleaning.com"`) and `BASE_URL` from `process.env.NEXT_PUBLIC_BASE_URL ?? "https://atticcleaning.com"`.
  - [x] 1.2 Create `buildMetadata(options: { title: string; description: string; path: string })` that returns a Next.js `Metadata` object with: `title`, `description`, `alternates.canonical` (BASE_URL + path), `openGraph` (title, description, url, type: "website", siteName), `twitter` (card: "summary", title, description).
  - [x] 1.3 Create `buildLocalBusinessJsonLd(listing: { name, address, city: { name, state }, phone?, website?, starRating, reviewCount, latitude, longitude })` that returns a JSON-LD object conforming to schema.org LocalBusiness with nested PostalAddress, GeoCoordinates, and AggregateRating.

- [x] Task 2: Update homepage metadata (AC: #6)
  - [x] 2.1 In `src/app/page.tsx`, add a `generateMetadata` function using `buildMetadata()` with path `/`, title and description matching the current layout.tsx defaults. The root layout.tsx title/description will serve as fallback only.

- [x] Task 3: Update city landing page metadata (AC: #6)
  - [x] 3.1 In `src/app/[citySlug]/page.tsx`, replace the existing `generateMetadata` return with `buildMetadata()` call, passing the dynamic title, description, and `path: /${citySlug}`.

- [x] Task 4: Update listing detail page metadata + JSON-LD (AC: #5, #6)
  - [x] 4.1 In `src/app/[citySlug]/[companySlug]/page.tsx`, replace the existing `generateMetadata` return with `buildMetadata()` call, passing title, description, and `path: /${citySlug}/${companySlug}`.
  - [x] 4.2 In the page component, render a `<script type="application/ld+json">` tag with `buildLocalBusinessJsonLd()` output. Use `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}`.

- [x] Task 5: Update article page metadata (AC: #6)
  - [x] 5.1 In `src/app/articles/[slug]/page.tsx`, replace the existing `generateMetadata` return with `buildMetadata()` call, passing the frontmatter title, excerpt, and `path: /articles/${slug}`.

- [x] Task 6: Update search results page metadata (AC: #6)
  - [x] 6.1 In `src/app/search/page.tsx`, replace the existing `generateMetadata` return with `buildMetadata()` call, passing the dynamic title, description, and `path: /search`. Note: search page canonical should be `/search` without query params (standard practice — search results are not indexable pages).

- [x] Task 7: Add `NEXT_PUBLIC_BASE_URL` to environment (AC: #2)
  - [x] 7.1 Add `NEXT_PUBLIC_BASE_URL=http://localhost:3000` to `.env` for local dev.
  - [x] 7.2 Add `NEXT_PUBLIC_BASE_URL` to `.env.example` with comment.

- [x] Task 8: Verify semantic HTML (AC: #7)
  - [x] 8.1 Verify `layout.tsx` has `<header>`, `<main>`, `<footer>` landmark regions and skip-to-content link. No code changes expected — just verify no regressions.

- [x] Task 9: Build validation (AC: #8)
  - [x] 9.1 Run `npx tsc --noEmit` — zero type errors.
  - [x] 9.2 Run `npm run lint` — zero violations.
  - [x] 9.3 Run `npm run build` — compiles successfully with same page rendering modes as before.

## Dev Notes

### Architecture Compliance

**SEO Infrastructure (architecture.md, Cross-Cutting Concerns #1):**
- Decision: `src/lib/seo.ts` contains generateMetadata helpers and JSON-LD generators
- FR14: LocalBusiness JSON-LD on listing detail pages
- FR16: Canonical URLs, Open Graph, Twitter Cards on all pages
- Implementation: Centralized `buildMetadata()` helper used by all page routes

**Next.js Metadata API:**
- Use the native Next.js `Metadata` type from `next` — no external SEO libraries needed
- `generateMetadata` is already implemented on 4 of 5 pages (homepage lacks it)
- Canonical URLs use `alternates.canonical` (Next.js renders as `<link rel="canonical">`)
- Open Graph uses `openGraph` property (Next.js renders as `<meta property="og:*">`)
- Twitter Cards use `twitter` property (Next.js renders as `<meta name="twitter:*">`)

**JSON-LD Rendering Pattern:**
- Next.js does NOT have built-in JSON-LD support in the Metadata API
- Standard pattern: Render `<script type="application/ld+json">` in the page component body
- Use `JSON.stringify()` for the JSON-LD object — no sanitization needed (server-rendered, data comes from our database)
- Place the `<script>` tag at the top of the returned JSX (before visible content)

**Canonical URL Strategy:**
- Base URL from `NEXT_PUBLIC_BASE_URL` env var (production: `https://atticcleaning.com`)
- Path-only canonicals: `/{citySlug}`, `/{citySlug}/{companySlug}`, `/articles/{slug}`, `/search`
- Search page canonical is `/search` WITHOUT query params (search results pages are not canonical resources)
- Homepage canonical is `/`

### What This Story Does NOT Do

- Does NOT create robots.txt (Story 6.2)
- Does NOT create XML sitemap (Story 6.2)
- Does NOT add search analytics logging (Story 6.3)
- Does NOT add Article/BlogPosting JSON-LD for article pages (only LocalBusiness JSON-LD on listings is in FR14 scope)
- Does NOT add og:image tags (no images to reference in MVP)
- Does NOT modify page rendering modes (SSG/dynamic stay as-is)
- Does NOT add structured data for reviews (individual Review JSON-LD is not in FR14 scope)
- Does NOT create tests (testing framework not yet set up)

### Previous Story Learnings

- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types
- **Homepage is `force-dynamic`**: The Prisma city query requires runtime. Adding `generateMetadata` here just adds metadata — it does NOT change the rendering mode.
- **Build workers capped at 3**: `experimental.cpus: 3` in next.config.ts to stay within DB connection limits.
- **Stale `.next` cache**: If tsc shows spurious errors, `rm -rf .next` fixes it.
- **Prisma connection pool**: `max: 3` with lazy Proxy initialization in `prisma.ts`. Unconditional global caching.
- **Next.js OG type validation**: Next.js validates OpenGraph type values at build time. `business.business` is NOT a valid type — only standard OG types like `website`, `article`, `profile` etc. are accepted. Use `website` for all page types.

### Current Metadata State (What Exists)

| Page | generateMetadata | Title | Description | Canonical | OG | Twitter | JSON-LD |
|------|-----------------|-------|-------------|-----------|-----|---------|---------|
| Homepage | NO | Inherited from layout | Inherited from layout | NO | NO | NO | NO |
| City | YES | Dynamic | Dynamic | NO | NO | NO | NO |
| Listing | YES | Dynamic | Dynamic | NO | NO | NO | NO |
| Article | YES | Dynamic | Dynamic | NO | NO | NO | NO |
| Search | YES | Dynamic | Dynamic | NO | NO | NO | NO |

### Project Structure Notes

```
src/
├── app/
│   ├── page.tsx                       ← MODIFIED (add generateMetadata)
│   ├── layout.tsx                     ← NO CHANGE (verify semantic HTML)
│   ├── [citySlug]/
│   │   ├── page.tsx                   ← MODIFIED (use buildMetadata)
│   │   └── [companySlug]/
│   │       └── page.tsx               ← MODIFIED (use buildMetadata + JSON-LD)
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx               ← MODIFIED (use buildMetadata)
│   ├── search/
│   │   └── page.tsx                   ← MODIFIED (use buildMetadata)
│   └── globals.css                    (no change)
│
├── lib/
│   ├── seo.ts                         ← NEW (buildMetadata, buildLocalBusinessJsonLd)
│   ├── prisma.ts                      (no change)
│   ├── search.ts                      (no change)
│   ├── mdx.ts                         (no change)
│   ├── utils.ts                       (no change)
│   └── constants.ts                   (no change)
│
└── content/                           (no changes)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 6, Story 6.1] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Cross-Cutting Concerns #1] — SEO as cross-cutting concern: JSON-LD, canonical, OG, Twitter
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — `lib/seo.ts` — generateMetadata helpers, JSON-LD generators
- [Source: _bmad-output/planning-artifacts/architecture.md#FR Category: Programmatic SEO] — FR14 → `lib/seo.ts`, FR16 → `lib/seo.ts`
- [Source: _bmad-output/planning-artifacts/epics.md#FR16] — System generates self-referencing canonical URLs, Open Graph tags, and Twitter Card metadata on all pages
- [Source: _bmad-output/planning-artifacts/epics.md#FR14] — System generates LocalBusiness JSON-LD schema markup on all listing pages
- [Source: _bmad-output/planning-artifacts/epics.md#NFR-A10] — Semantic HTML — proper heading hierarchy, landmark regions, structured content
- [Source: src/app/[citySlug]/[companySlug]/page.tsx] — Current listing page with basic generateMetadata
- [Source: src/app/[citySlug]/page.tsx] — Current city page with basic generateMetadata
- [Source: src/app/articles/[slug]/page.tsx] — Current article page with basic generateMetadata
- [Source: src/app/search/page.tsx] — Current search page with basic generateMetadata
- [Source: src/app/layout.tsx] — Root layout with static Metadata and semantic HTML landmarks

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Build failed on first attempt: `Invalid OpenGraph type: business.business` — Next.js validates OG types at build time and `business.business` is not a supported type. Fixed by removing `ogType` parameter and using `"website"` for all pages.

### Completion Notes List

- All 8 ACs implemented and verified
- Created `src/lib/seo.ts` with `buildMetadata()` and `buildLocalBusinessJsonLd()` helpers
- All 5 page routes now use centralized `buildMetadata()` for canonical URLs, Open Graph, and Twitter Cards
- Homepage now has its own `generateMetadata` (previously inherited from layout only)
- Listing detail pages embed LocalBusiness JSON-LD with address, phone, website, ratings, and geo coordinates
- `NEXT_PUBLIC_BASE_URL` env var added to `.env` and `.env.example`
- Semantic HTML verified: skip-to-content link, header/main/footer landmarks, single h1 per page
- Build: 33 static pages, homepage as `ƒ (Dynamic)`, city/listing/article pages as `● (SSG)`
- Discovery: Next.js rejects non-standard OG types at build time — removed `ogType` parameter, hardcoded `"website"`

### File List

- `src/lib/seo.ts` — NEW: buildMetadata() and buildLocalBusinessJsonLd() helpers
- `src/app/page.tsx` — MODIFIED: Added generateMetadata using buildMetadata()
- `src/app/[citySlug]/page.tsx` — MODIFIED: Replaced generateMetadata return with buildMetadata()
- `src/app/[citySlug]/[companySlug]/page.tsx` — MODIFIED: Replaced generateMetadata return with buildMetadata(), added JSON-LD script tag
- `src/app/articles/[slug]/page.tsx` — MODIFIED: Replaced generateMetadata return with buildMetadata()
- `src/app/search/page.tsx` — MODIFIED: Replaced generateMetadata return with buildMetadata()
- `.env` — MODIFIED: Added NEXT_PUBLIC_BASE_URL
- `.env.example` — MODIFIED: Added NEXT_PUBLIC_BASE_URL with comment
