# Story 6.2: XML Sitemap & Crawl Control

Status: done

## Story

As a **site owner**,
I want an auto-generated XML sitemap and robots.txt to control search engine crawling,
So that all public pages are discoverable and API/admin routes are excluded from indexing.

## Acceptance Criteria

1. **Sitemap Route:** `src/app/sitemap.ts` exists and generates a valid XML sitemap at `/sitemap.xml` using the Next.js App Router sitemap convention.
2. **Sitemap Coverage:** The sitemap includes URLs for: the homepage (`/`), all city landing pages (`/{citySlug}`), all listing detail pages (`/{citySlug}/{companySlug}`), and all article pages (`/articles/{slug}`).
3. **Sitemap Attributes:** Each URL entry includes `lastModified`, `changeFrequency`, and `priority` attributes.
4. **Robots.txt:** `src/app/robots.ts` exists and generates a robots.txt at `/robots.txt` that allows all public pages, blocks `/api/` routes, and references the sitemap URL.
5. **Metadata Base:** `metadataBase` is set in the root layout (`src/app/layout.tsx`) so that sitemap URLs are absolute.
6. **Google Search Console Ready:** The sitemap is accessible at `/sitemap.xml` and can be submitted to Google Search Console.
7. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with no regressions.

## Tasks / Subtasks

- [x] Task 1: Add `metadataBase` to root layout (AC: #5)
  - [x] 1.1 In `src/app/layout.tsx`, add `metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://atticcleaning.com")` to the existing `metadata` export.

- [x] Task 2: Create `src/app/sitemap.ts` (AC: #1, #2, #3, #6)
  - [x] 2.1 Create `src/app/sitemap.ts` exporting a default async function that returns `MetadataRoute.Sitemap`.
  - [x] 2.2 Query Prisma for all cities: `prisma.city.findMany({ select: { slug, createdAt } })`. Map to sitemap entries with `url: /{citySlug}`, `lastModified: createdAt`, `changeFrequency: "monthly"`, `priority: 0.8`.
  - [x] 2.3 Query Prisma for all listings: `prisma.listing.findMany({ select: { slug, updatedAt, city: { select: { slug } } } })`. Map to sitemap entries with `url: /{citySlug}/{companySlug}`, `lastModified: updatedAt`, `changeFrequency: "monthly"`, `priority: 0.7`.
  - [x] 2.4 Use `getAllArticles()` from `@/lib/mdx` for article URLs. Map to sitemap entries with `url: /articles/{slug}`, `lastModified: publishedAt` (parsed to Date), `changeFrequency: "monthly"`, `priority: 0.6`.
  - [x] 2.5 Add homepage entry: `url: /`, `lastModified: new Date()`, `changeFrequency: "daily"`, `priority: 1.0`.
  - [x] 2.6 Return combined array of all entries.

- [x] Task 3: Create `src/app/robots.ts` (AC: #4)
  - [x] 3.1 Create `src/app/robots.ts` exporting a default function returning `MetadataRoute.Robots`.
  - [x] 3.2 Rules: allow all user agents for `/`, disallow `/api/`.
  - [x] 3.3 Include sitemap URL: `${BASE_URL}/sitemap.xml` using `NEXT_PUBLIC_BASE_URL`.

- [x] Task 4: Build validation (AC: #7)
  - [x] 4.1 Run `npx tsc --noEmit` — zero type errors.
  - [x] 4.2 Run `npm run lint` — zero violations.
  - [x] 4.3 Run `npm run build` — compiles successfully, `/sitemap.xml` and `/robots.txt` appear as `○ (Static)` in build output.

## Dev Notes

### Architecture Compliance

**Sitemap Generation (architecture.md, Build Boundary):**
- Decision: `src/app/sitemap.ts` queries Prisma to generate the complete sitemap at build time
- Build pipeline: `PostgreSQL → Prisma → sitemap.ts → XML sitemap`
- FR15: System generates XML sitemaps covering all listing pages, city pages, and articles

**Robots.txt (architecture.md, Cross-Cutting Concerns #1):**
- Decision: robots.txt blocks admin/API routes (NFR-S6)
- Architecture specifies `public/robots.txt` (static file), but `src/app/robots.ts` is the Next.js App Router convention and allows dynamic sitemap URL reference. Using `robots.ts` for consistency with `sitemap.ts`.

**Google Search Console (architecture.md, External Integrations):**
- NFR-I3: XML sitemap submitted to Google Search Console post-deploy; 90%+ URLs indexed within 60 days
- Sitemap must be accessible at `/sitemap.xml` for GSC submission

### Next.js Sitemap Convention

**`src/app/sitemap.ts` (App Router):**
- Export a default function (sync or async) returning `MetadataRoute.Sitemap` (array of objects)
- Each entry: `{ url: string, lastModified?: Date, changeFrequency?: string, priority?: number }`
- Next.js automatically serves this as `/sitemap.xml` with proper XML headers
- URLs should be absolute — `metadataBase` in layout.tsx handles this automatically

**`src/app/robots.ts` (App Router):**
- Export a default function returning `MetadataRoute.Robots`
- Structure: `{ rules: { userAgent, allow, disallow }, sitemap: string }`
- Next.js automatically serves this as `/robots.txt`

**`metadataBase` in layout.tsx:**
- Setting `metadataBase` in the root layout makes all metadata URLs (including sitemap) absolute
- Required for sitemap URLs to be valid (must be absolute per XML sitemap spec)
- Set from `NEXT_PUBLIC_BASE_URL` env var

### Priority & ChangeFrequency Strategy

| Page Type | Priority | ChangeFrequency | Rationale |
|-----------|----------|-----------------|-----------|
| Homepage | 1.0 | daily | Main entry point, featured cities/articles rotate |
| City Pages | 0.8 | monthly | High-value SEO landing pages, data changes with imports |
| Listing Pages | 0.7 | monthly | Individual business pages, data changes with imports |
| Article Pages | 0.6 | monthly | Educational content, updated occasionally |

### What This Story Does NOT Do

- Does NOT add search analytics logging (Story 6.3)
- Does NOT submit the sitemap to Google Search Console (manual post-deploy step)
- Does NOT implement sitemap index (single sitemap is sufficient for current scale — 33 pages)
- Does NOT add `<lastmod>` based on git commit dates (uses Prisma timestamps and MDX frontmatter)
- Does NOT create tests (testing framework not yet set up)
- Does NOT modify any existing page components or their rendering

### Previous Story Learnings (from Story 6.1)

- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types
- **`NEXT_PUBLIC_BASE_URL`**: Already configured in `.env` and `.env.example` (added in Story 6.1)
- **`getAllArticles()`**: Synchronous — reads frontmatter via `gray-matter`, returns `ArticleFrontmatter[]` sorted by `publishedAt` desc. Safe to call from sitemap.ts.
- **`getArticleSlugs()`**: Returns `string[]` of article slugs from filesystem. Also synchronous.
- **Build workers capped at 3**: `experimental.cpus: 3` in next.config.ts to stay within DB connection limits.
- **Prisma connection pool**: `max: 3` with lazy Proxy initialization in `prisma.ts`. Unconditional global caching.
- **Next.js OG type validation**: Next.js validates metadata values at build time — expect similar validation for sitemap types.
- **Homepage is `force-dynamic`**: Sitemap.ts is a separate route and does NOT affect homepage rendering mode.

### Data Sources for Sitemap

| Data | Source | Query | Fields Used |
|------|--------|-------|-------------|
| Cities | Prisma | `prisma.city.findMany()` | `slug`, `createdAt` |
| Listings | Prisma | `prisma.listing.findMany()` | `slug`, `city.slug`, `updatedAt` |
| Articles | Filesystem | `getAllArticles()` | `slug`, `publishedAt` |
| Homepage | Static | Hardcoded entry | N/A |

### Project Structure Notes

```
src/
├── app/
│   ├── sitemap.ts                     ← NEW (XML sitemap generation)
│   ├── robots.ts                      ← NEW (robots.txt generation)
│   ├── layout.tsx                     ← MODIFIED (add metadataBase)
│   ├── page.tsx                       (no change)
│   └── ...                            (no changes)
│
├── lib/
│   ├── seo.ts                         (no change — BASE_URL already defined here)
│   ├── mdx.ts                         (no change — getAllArticles/getArticleSlugs already exist)
│   ├── prisma.ts                      (no change)
│   └── ...                            (no changes)
│
└── content/                           (no changes)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 6, Story 6.2] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Cross-Cutting Concerns #1] — robots.txt blocking admin/API routes
- [Source: _bmad-output/planning-artifacts/architecture.md#Build Boundary] — sitemap.ts queries Prisma at build time
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure] — `app/sitemap.ts`, `public/robots.txt`
- [Source: _bmad-output/planning-artifacts/architecture.md#URL Structure] — All URL patterns for sitemap
- [Source: _bmad-output/planning-artifacts/architecture.md#External Integrations] — Google Search Console sitemap submission
- [Source: _bmad-output/planning-artifacts/epics.md#FR15] — System generates XML sitemaps covering all listing pages, city pages, and articles
- [Source: _bmad-output/planning-artifacts/epics.md#NFR-S6] — robots.txt blocks API routes and admin endpoints
- [Source: _bmad-output/planning-artifacts/epics.md#NFR-I3] — XML sitemap submitted to Google Search Console
- [Source: prisma/schema.prisma] — City.createdAt, Listing.updatedAt fields for lastmod
- [Source: src/lib/mdx.ts#getAllArticles] — Synchronous frontmatter reader with publishedAt field
- [Source: _bmad-output/implementation-artifacts/6-1-seo-metadata-schema-markup.md] — Story 6.1 learnings, NEXT_PUBLIC_BASE_URL already configured

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- No issues encountered — clean implementation, build passed on first attempt

### Completion Notes List

- All 7 ACs implemented and verified
- Created `src/app/sitemap.ts` — async function querying Prisma for cities/listings and MDX for articles
- Sitemap includes homepage (priority 1.0), 8 city pages (0.8), 18 listing pages (0.7), 2 article pages (0.6)
- Created `src/app/robots.ts` — allows all public pages, blocks `/api/`, references sitemap URL
- Added `metadataBase` to root layout for absolute URL generation
- Both `/sitemap.xml` and `/robots.txt` appear as `○ (Static)` in build output
- Build: 35 static pages (up from 33 — added sitemap.xml and robots.txt)
- City/listing Prisma queries run in parallel via `Promise.all` for build performance
- `getAllArticles()` wrapped in try-catch for MDX resilience (same pattern as homepage)

### File List

- `src/app/sitemap.ts` — NEW: XML sitemap generation with Prisma + MDX data sources
- `src/app/robots.ts` — NEW: robots.txt with allow/disallow rules and sitemap reference
- `src/app/layout.tsx` — MODIFIED: Added metadataBase to metadata export
