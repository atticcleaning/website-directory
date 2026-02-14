# Story 5.2: Article Internal Linking & Data Enrichment

Status: done

## Story

As a **homeowner**,
I want articles that link to related content and show real local data,
So that I can explore topics in depth and see how the information applies to my area.

## Acceptance Criteria

1. **Related Articles Section:** At the bottom of each article page, 2-3 ArticleCard components display articles matching the same `topicTag` (excluding the current article). If fewer than 2 articles share the same topicTag, show the most recent articles instead.
2. **ArticleCard Clickable:** Each ArticleCard is wrapped in a Next.js `<Link>` linking to `/articles/[slug]`. The entire card is clickable with a hover state that changes the border color to `--primary`. Touch target minimum 44px.
3. **City Mention Links:** City names mentioned in article body content link to their city landing pages (e.g., "Phoenix" links to `/phoenix-az/`). Authors write explicit markdown links in MDX content — no auto-detection needed.
4. **Data Enrichment via Custom MDX Components:** Articles are enriched at build time with real directory data via Prisma queries. A `<CityStats>` MDX component renders local company counts and average ratings inline (e.g., "There are 12 attic cleaning companies in Phoenix with an average rating of 4.6 stars").
5. **Contextual CTAs:** A `<FindPros>` MDX component renders inline text link CTAs: "Find [service type] pros near you →". Styled as blue text links (uses `.prose a` styling), not buttons or banners. Links to `/search?q=[query]` with relevant query pre-filled.
6. **CTA Placement Rules:** Maximum 1 CTA per article section (not per paragraph). CTAs appear after substantive content paragraphs, never as the first thing a reader sees.
7. **MDX Components Registered:** Custom components (`CityStats`, `FindPros`) are passed to `compileMDX` in `src/lib/mdx.ts` via the `components` option. Components are async server components that query Prisma at build time.
8. **Sample Articles Updated:** Both existing sample MDX articles are updated to include inline city links, at least one `<CityStats>` component, and at least one `<FindPros>` CTA, demonstrating the full enrichment pipeline.
9. **Related Articles Heading:** The related articles section uses an `<h2>` heading "Related Articles" styled consistently with the page (Jakarta Sans, outside the `.prose` wrapper).
10. **Semantic HTML:** Related articles section uses `<section>` with proper heading hierarchy. ArticleCard links use semantic `<a>` elements.
11. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with article pages as `● (SSG)`.

## Tasks / Subtasks

- [x] Task 1: Create custom MDX components for data enrichment (AC: #4, #5, #6)
  - [x] 1.1 Create `src/components/mdx/city-stats.tsx` — An async server component that accepts a `city` prop (city slug string). Queries Prisma for the city's listing count and average star rating. Renders a `<span>` with text like "There are 12 attic cleaning companies in Phoenix with an average rating of 4.6 stars". If city not found, renders nothing (graceful fallback).
  - [x] 1.2 Create `src/components/mdx/find-pros.tsx` — A component that accepts `service` (string, display text) and optional `query` (string, search query, defaults to `service`). Renders: `<a href="/search?q={query}">Find {service} pros near you →</a>`. Uses standard anchor tag (styled by `.prose a` as primary color underline).
  - [x] 1.3 Create `src/components/mdx/index.ts` — Barrel export for MDX components. Export a `mdxComponents` object mapping component names to implementations: `{ CityStats, FindPros }`.

- [x] Task 2: Register MDX components in compileMDX pipeline (AC: #7)
  - [x] 2.1 Update `src/lib/mdx.ts` `getArticleBySlug()` to import `mdxComponents` from `@/components/mdx` and pass to `compileMDX` via `components` option.
  - [x] 2.2 Verify that async server components work within `compileMDX` during static generation (they should — `next-mdx-remote/rsc` is designed for RSC).

- [x] Task 3: Make ArticleCard clickable (AC: #2, #10)
  - [x] 3.1 Update `src/components/article-card.tsx`: Wrap the outer `<div>` with Next.js `<Link href={/articles/${slug}}>`. Import Link from `next/link`.
  - [x] 3.2 Add hover state: `hover:border-primary` on the card container. Add `transition-colors` for smooth transition.
  - [x] 3.3 Ensure 44px minimum touch target: Add `min-h-[44px]` to the card link wrapper.
  - [x] 3.4 Destructure `slug` from props (currently unused in the component).

- [x] Task 4: Add related articles section to article page (AC: #1, #9, #10)
  - [x] 4.1 Update `src/app/articles/[slug]/page.tsx`: After the `<article>` element, add a `<section>` for related articles.
  - [x] 4.2 Import `getAllArticles` from `@/lib/mdx` and use it to get all articles.
  - [x] 4.3 Filter articles by matching `topicTag` with the current article, exclude current slug. If fewer than 2 matches, fall back to most recent articles (excluding current).
  - [x] 4.4 Take top 3 results (or however many are available, minimum display is 2).
  - [x] 4.5 Render `<h2>` heading "Related Articles" with styling: `font-sans text-xl font-semibold text-foreground md:text-2xl`. Place OUTSIDE the `.prose` wrapper to avoid prose heading styles.
  - [x] 4.6 Render ArticleCard components in a responsive grid: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`.
  - [x] 4.7 Only render the related articles section if there are articles to display.

- [x] Task 5: Update sample MDX articles with enrichment content (AC: #3, #8)
  - [x] 5.1 Update `src/content/articles/signs-attic-needs-cleaning.mdx`:
    - Add inline city link: `[Phoenix](/phoenix-az)` in article body text where Phoenix is mentioned
    - Add `<CityStats city="phoenix-az" />` after the intro paragraph to show real data
    - Add `<FindPros service="attic cleaning" />` CTA after the "When to Take Action" section (1 CTA, last section)
  - [x] 5.2 Update `src/content/articles/choosing-attic-cleaning-company.mdx`:
    - Add inline city link: `[Scottsdale](/scottsdale-az)` in article body text
    - Add `<CityStats city="scottsdale-az" />` after the intro paragraph
    - Add `<FindPros service="attic cleaning" query="attic cleaning company" />` CTA after the final section (1 CTA, last section)

- [x] Task 6: Validate build (AC: #11)
  - [x] 6.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 6.2 Run `npm run lint` — zero violations
  - [x] 6.3 Run `npm run build` — compiles successfully. Article pages as `● (SSG)`. Verify CityStats queries execute during build without errors.

## Dev Notes

### Architecture Compliance

**Data Enrichment (architecture.md, FR22):**
- Decision: Articles enriched at build time with Prisma data
- Implementation: Custom MDX components (`CityStats`) that are async server components querying Prisma during static generation
- `CityStats` is rendered during `compileMDX` which runs inside `generateStaticParams` / page rendering at build time — all server-side

**Internal Linking (architecture.md, FR21):**
- Decision: MDX content with Next.js Link for internal links
- Implementation: Authors write markdown links `[City Name](/city-slug)` in MDX. `compileMDX` converts these to `<a>` tags. Standard HTML links work fine for static pages served from CDN.
- Related articles: Queried from `getAllArticles()` and filtered by `topicTag`

**Contextual CTAs (UX spec):**
- "Find [service type] pros near you →" — styled as blue text links, not buttons or banners
- Maximum 1 CTA per article section
- CTAs link to `/search?q=[query]`
- David's Journey: Reader discovers CTA → transitions from reader to searcher

**Page Structure:**
- Related articles section is OUTSIDE the 680px `.prose` wrapper but still within the 680px `max-w-[680px]` page container
- Uses `<section>` with `<h2>` heading for semantics
- ArticleCard grid is responsive: 1 col mobile → 2 col tablet → 3 col desktop

### Custom MDX Components Design

**How `compileMDX` components work:**

```typescript
import { compileMDX } from 'next-mdx-remote/rsc'

const { content, frontmatter } = await compileMDX<ArticleFrontmatter>({
  source: rawMdxContent,
  options: { parseFrontmatter: true, mdxOptions: { remarkPlugins: [remarkGfm] } },
  components: {
    CityStats: CityStats,   // async server component
    FindPros: FindPros,      // regular component
  },
})
```

When the MDX file contains `<CityStats city="phoenix-az" />`, the `CityStats` component is instantiated with `city="phoenix-az"` as a prop. Since this runs during server-side static generation, the async Prisma query executes at build time.

**CityStats component pattern:**

```typescript
// src/components/mdx/city-stats.tsx
import prisma from "@/lib/prisma"

export default async function CityStats({ city }: { city: string }) {
  const cityData = await prisma.city.findUnique({
    where: { slug: city },
    include: { _count: { select: { listings: true } }, listings: { select: { starRating: true } } },
  })
  if (!cityData || cityData._count.listings === 0) return null

  const avgRating = (cityData.listings.reduce((sum, l) => sum + l.starRating, 0) / cityData.listings.length).toFixed(1)

  return (
    <span>
      There are {cityData._count.listings} attic cleaning companies in {cityData.name} with an average rating of {avgRating} stars
    </span>
  )
}
```

**FindPros component pattern:**

```typescript
// src/components/mdx/find-pros.tsx
export default function FindPros({ service, query }: { service: string; query?: string }) {
  const searchQuery = encodeURIComponent(query || service)
  return (
    <a href={`/search?q=${searchQuery}`}>
      Find {service} pros near you →
    </a>
  )
}
```

### CityStats Prisma Query Impact

- `CityStats` queries Prisma during build. With `max: 3` connection pool and 11 build workers, each article page that uses `<CityStats>` adds 1 Prisma query per component instance.
- Current articles: 2 articles × 1 CityStats each = 2 extra Prisma queries during build. This is negligible.
- At scale (50 articles × 2 CityStats each = 100 queries), still well within limits since queries are lightweight and run sequentially per page.

### ArticleCard Clickability

**Current state:** `slug` prop exists but is NOT destructured or used. Card is a `<div>`, not clickable.

**Target state:** Entire card wrapped in `<Link href={/articles/${slug}}>`. Card becomes an `<a>` element with:
- `hover:border-primary` for hover state (UX spec: border color changes to --primary)
- `transition-colors` for smooth transition
- `block` display for full-card click area
- `min-h-[44px]` for touch target compliance

### What This Story Does NOT Do

- Does NOT modify the homepage to use real articles (Story 5.3)
- Does NOT add JSON-LD schema markup for articles (Epic 6)
- Does NOT add articles to XML sitemap (Epic 6)
- Does NOT create new MDX articles beyond updating the existing 2 samples
- Does NOT add a "Cities Mentioned" section below the article — city links are inline in MDX content and driven by `relatedCities` frontmatter for SEO (Epic 6)
- Does NOT add breadcrumbs or navigation between articles
- Does NOT modify the header or SearchBar component (persistent header already works from root layout)
- Does NOT create barrel files for existing modules (anti-pattern per architecture) — the `src/components/mdx/index.ts` barrel is specifically for the MDX components mapping object
- Does NOT create tests (testing framework not yet set up)

### Previous Story Learnings (from Story 5.1)

- **`next-mdx-remote/rsc` API**: `compileMDX` accepts `components` option for custom MDX components. Use `next-mdx-remote/rsc` import, NOT v4 serialize API.
- **CSS `.prose` class**: Custom prose styles in `globals.css` already handle `a` elements with `color: var(--primary); text-decoration: underline`. FindPros links will inherit this styling automatically.
- **`getAllArticles()`**: Already exists in `mdx.ts`, returns frontmatter only (no MDX compilation), sorted by `publishedAt` desc. Fast for listing/filtering.
- **`dynamicParams = false`**: Article page already locked to static-only (added in code review). New articles require a rebuild to appear.
- **`formatDate` timezone fix**: Uses `timeZone: "UTC"` in Intl.DateTimeFormat.
- **Frontmatter validation**: `getAllArticles()` validates required fields (title, slug, publishedAt) — throws clear error for malformed MDX.
- **Stale `.next` cache**: If tsc shows spurious errors, `rm -rf .next` fixes it.
- **React `cache()`**: Already wraps `getArticleBySlug` in `cache()` for deduplication.
- **Build with Prisma**: `max: 3` connection pool in `prisma.ts` handles build-time concurrency (11 workers).
- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types

### Project Structure Notes

```
src/
├── app/
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx               ← MODIFIED (add related articles section)
│   ├── [citySlug]/page.tsx            (no change)
│   ├── globals.css                    (no change — .prose a styles already correct)
│   ├── layout.tsx                     (no change)
│   └── page.tsx                       (no change — Story 5.3 handles homepage)
│
├── components/
│   ├── mdx/                           ← NEW directory
│   │   ├── city-stats.tsx             ← NEW (CityStats async server component)
│   │   ├── find-pros.tsx              ← NEW (FindPros CTA component)
│   │   └── index.ts                   ← NEW (mdxComponents mapping export)
│   ├── article-card.tsx               ← MODIFIED (add Link wrapper, hover state)
│   └── ... (all existing, no changes)
│
├── content/
│   └── articles/
│       ├── signs-attic-needs-cleaning.mdx    ← MODIFIED (add enrichment)
│       └── choosing-attic-cleaning-company.mdx ← MODIFIED (add enrichment)
│
├── lib/
│   ├── mdx.ts                         ← MODIFIED (add components to compileMDX)
│   ├── prisma.ts                      (no change)
│   └── ...
│
└── types/
    └── index.ts                       (no change)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5, Story 5.2] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Content Storage] — Build-time enrichment with Prisma data
- [Source: _bmad-output/planning-artifacts/architecture.md#FR20-FR23 Mapping] — FR21 internal links, FR22 data enrichment
- [Source: _bmad-output/planning-artifacts/architecture.md#Internal Linking Strategy] — City ↔ article cross-links
- [Source: _bmad-output/planning-artifacts/architecture.md#Build Boundary] — MDX files read at build time by mdx.ts
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Article Page Patterns] — Related articles 2-3 cards, CTAs as inline text links, city mention links
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ArticleCard] — Component props, hover state, accessibility
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#David's Journey] — Content-to-directory conversion flow, CTA placement rules
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Contextual CTA Rules] — Max 1 per section, after substantive content, inline text links only
- [Source: src/lib/mdx.ts] — Existing MDX utilities (getArticleSlugs, getArticleBySlug, getAllArticles)
- [Source: src/app/articles/[slug]/page.tsx] — Current article page (680px column, prose wrapper, SSG)
- [Source: src/components/article-card.tsx] — Current ArticleCard (slug prop unused, not clickable)
- [Source: src/lib/prisma.ts] — Prisma client with max: 3 connection pool
- [Source: _bmad-output/implementation-artifacts/5-1-mdx-content-infrastructure-article-rendering.md] — Story 5.1 learnings and patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- No issues encountered — clean implementation, build passed on first attempt

### Completion Notes List

- All 11 ACs implemented and verified
- Created `CityStats` async server component — queries Prisma at build time for city listing count and average rating
- Created `FindPros` component — renders contextual CTA link to `/search?q=...`
- Registered both components in `compileMDX` via `mdxComponents` mapping in `mdx.ts`
- Made ArticleCard clickable with Next.js `<Link>`, hover state `hover:border-primary`, 44px touch target
- Added related articles section to article page — filters by matching `topicTag`, falls back to most recent if <2 matches
- Updated both sample MDX articles with inline city links, `<CityStats>`, and `<FindPros>` CTAs
- Build: 33 static pages, CityStats Prisma queries execute successfully during SSG

### File List

- `src/components/mdx/city-stats.tsx` — NEW: CityStats async server component (Prisma query for city data)
- `src/components/mdx/find-pros.tsx` — NEW: FindPros CTA component (search link)
- `src/components/mdx/index.ts` — NEW: mdxComponents barrel export for compileMDX
- `src/lib/mdx.ts` — MODIFIED: Import and pass mdxComponents to compileMDX
- `src/components/article-card.tsx` — MODIFIED: Wrapped in Link, added hover state and touch target
- `src/app/articles/[slug]/page.tsx` — MODIFIED: Added related articles section with ArticleCard grid
- `src/content/articles/signs-attic-needs-cleaning.mdx` — MODIFIED: Added city links, CityStats, FindPros
- `src/content/articles/choosing-attic-cleaning-company.mdx` — MODIFIED: Added city links, CityStats, FindPros
