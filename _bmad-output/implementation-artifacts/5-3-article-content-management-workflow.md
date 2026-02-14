# Story 5.3: Article Content Management Workflow

Status: done

## Story

As an **admin**,
I want to add and manage educational articles by creating MDX files,
So that I can grow the content library to drive organic traffic and authority.

## Acceptance Criteria

1. **Homepage Uses Real Articles:** The homepage "Learn About Attic Cleaning" section renders ArticleCard components from `getAllArticles()` instead of `PLACEHOLDER_ARTICLES`. Displays the 3 most recent articles (sorted by `publishedAt` desc).
2. **New Article Auto-Discovery:** When an admin creates a new `.mdx` file in `src/content/articles/` following the established frontmatter schema, the article is picked up by `generateStaticParams` on the next `npm run build` and appears as a static page at `/articles/[slug]`.
3. **Homepage Integration:** New articles automatically appear in the homepage educational content highlights (ArticleCard grid) on the next build — no code changes required.
4. **Related Articles Integration:** New articles automatically appear in related article sections of articles with matching `topicTag` values — no code changes required.
5. **Content Lifecycle:** Articles are git-versioned in `src/content/articles/`. Articles can be created, edited, updated, or removed by modifying the MDX files. A full site rebuild (`npm run build`) regenerates all article pages with current data.
6. **PLACEHOLDER Removal:** The `PLACEHOLDER_ARTICLES` constant is completely removed from `src/app/page.tsx`. No hardcoded article data remains.
7. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with article pages as `● (SSG)` and homepage as `ƒ (Dynamic)`.

## Tasks / Subtasks

- [x] Task 1: Replace homepage placeholder articles with real data (AC: #1, #3, #6)
  - [x]1.1 In `src/app/page.tsx`, import `getAllArticles` from `@/lib/mdx`.
  - [x]1.2 Remove the `PLACEHOLDER_ARTICLES` constant entirely.
  - [x]1.3 In the `HomePage` component body, call `const articles = getAllArticles()` (synchronous — reads frontmatter only, no Prisma needed).
  - [x]1.4 Replace `PLACEHOLDER_ARTICLES.map(...)` with `articles.slice(0, 3).map(...)` to show the 3 most recent articles.
  - [x]1.5 Conditionally render the "Learn About Attic Cleaning" section only when `articles.length > 0` (same pattern as the Featured Cities section).

- [x] Task 2: Validate content management workflow end-to-end (AC: #2, #4, #5)
  - [x]2.1 Verify existing 2 articles render on homepage via `getAllArticles()`.
  - [x]2.2 Verify related articles section on article pages continues to work (already powered by `getAllArticles()` from Story 5.2).
  - [x]2.3 Verify `npm run build` generates article pages as `● (SSG)`.

- [x]Task 3: Build validation (AC: #7)
  - [x]3.1 Run `npx tsc --noEmit` — zero type errors.
  - [x]3.2 Run `npm run lint` — zero violations.
  - [x]3.3 Run `npm run build` — compiles successfully. Homepage renders with real articles. Article pages as `● (SSG)`.

## Dev Notes

### Architecture Compliance

**Content Management Workflow (architecture.md, FR31):**
- Decision: MDX files stored in `src/content/articles/`, git-versioned, read at build time by `src/lib/mdx.ts`
- Implementation: `getAllArticles()` already exists and returns frontmatter sorted by `publishedAt` desc. Just wire it to the homepage.
- Build pipeline: `MDX files → mdx.ts → Article pages` and `MDX files → mdx.ts → getAllArticles() → Homepage ArticleCards`

**Homepage Educational Content (UX spec, David's Journey):**
- Homepage layout: hero → featured cities → educational article highlights (3 cards) → footer
- ArticleCard grid: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3`
- Cards link to `/articles/[slug]` — David's content-to-directory conversion flow

**Static Generation (architecture.md):**
- Article pages: SSG via `generateStaticParams` (already implemented in Stories 5.1/5.2)
- Homepage: Dynamic (`force-dynamic`) due to Prisma city query — this does NOT change
- `getAllArticles()` is synchronous (reads filesystem), safe to call from dynamic pages

### What This Story Changes

**Only one file is modified: `src/app/page.tsx`**

The change is minimal:
1. Add `import { getAllArticles } from "@/lib/mdx"`
2. Remove `PLACEHOLDER_ARTICLES` constant (lines 10-32)
3. Add `const articles = getAllArticles()` in the component body
4. Replace `PLACEHOLDER_ARTICLES.map(...)` with `articles.slice(0, 3).map(...)`
5. Wrap educational section in conditional `{articles.length > 0 && (...)}`

### What This Story Does NOT Do

- Does NOT create an `/articles` listing/index page (not in scope — articles are surfaced on homepage and in related sections)
- Does NOT add JSON-LD schema markup for articles (Epic 6)
- Does NOT add articles to XML sitemap (Epic 6)
- Does NOT create new MDX articles beyond the existing 2 samples
- Does NOT modify article page rendering, MDX components, or related articles logic (all done in Stories 5.1/5.2)
- Does NOT change the homepage layout, styling, or structure — only the data source
- Does NOT change the `force-dynamic` rendering mode on the homepage
- Does NOT create tests (testing framework not yet set up)

### Previous Story Learnings (from Stories 5.1 & 5.2)

- **`getAllArticles()`** is synchronous — reads frontmatter via `gray-matter`, returns `ArticleFrontmatter[]` sorted by `publishedAt` desc. No Prisma, no async needed. Safe to call from any component.
- **`ArticleFrontmatter` interface**: `{ title, slug, excerpt, topicTag, publishedAt, relatedCities }` — matches ArticleCard props exactly (minus `publishedAt` and `relatedCities` which aren't rendered on the card).
- **ArticleCard props**: `{ title, excerpt, topicTag, slug }` — destructured from frontmatter, same as the placeholder objects.
- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types
- **Homepage is `force-dynamic`**: Do NOT add `generateStaticParams` or change to static. The Prisma city query requires runtime.
- **Conditional rendering pattern**: Wrap sections in `{data.length > 0 && (...)}` — used for Featured Cities, reuse for articles.
- **Prisma connection pool**: `max: 3` with lazy Proxy initialization in `prisma.ts`. Build workers capped at 3 via `next.config.ts` `experimental.cpus: 3`.
- **Stale `.next` cache**: If tsc shows spurious errors, `rm -rf .next` fixes it.

### Project Structure Notes

```
src/
├── app/
│   ├── page.tsx                       ← MODIFIED (replace PLACEHOLDER_ARTICLES with getAllArticles())
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx               (no change — already uses generateStaticParams + getAllArticles)
│   ├── globals.css                    (no change)
│   └── layout.tsx                     (no change)
│
├── components/
│   ├── article-card.tsx               (no change — already clickable with Link + hover state)
│   ├── mdx/                           (no change — CityStats, FindPros, index.ts)
│   └── ... (all existing, no changes)
│
├── content/
│   └── articles/
│       ├── signs-attic-needs-cleaning.mdx    (no change — read by getAllArticles())
│       └── choosing-attic-cleaning-company.mdx (no change — read by getAllArticles())
│
├── lib/
│   ├── mdx.ts                         (no change — getAllArticles() already implemented)
│   ├── prisma.ts                      (no change)
│   └── ...
│
└── types/
    └── index.ts                       (no change)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5, Story 5.3] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Content Storage] — MDX files in-repo, git-versioned, build-time read
- [Source: _bmad-output/planning-artifacts/architecture.md#Build Boundary] — src/content/articles/ read at build time by mdx.ts
- [Source: _bmad-output/planning-artifacts/architecture.md#FR31] — Full rebuild regenerates all article pages
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Homepage Layout] — Hero → cities → article highlights (3 cards) → footer
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#David's Journey] — Content-to-directory conversion via educational articles
- [Source: src/app/page.tsx] — Current homepage with PLACEHOLDER_ARTICLES (lines 10-32)
- [Source: src/lib/mdx.ts#getAllArticles] — Synchronous frontmatter reader, sorted by publishedAt desc
- [Source: src/components/article-card.tsx] — ArticleCard with Link wrapper, hover state, 44px touch target
- [Source: _bmad-output/implementation-artifacts/5-2-article-internal-linking-data-enrichment.md] — Story 5.2 learnings and patterns
- [Source: _bmad-output/implementation-artifacts/5-1-mdx-content-infrastructure-article-rendering.md] — Story 5.1 learnings and patterns

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- No issues encountered — single-file change, build passed on first attempt

### Completion Notes List

- All 7 ACs implemented and verified
- Replaced `PLACEHOLDER_ARTICLES` with `getAllArticles()` from `@/lib/mdx`
- Homepage now renders the 3 most recent real articles from `src/content/articles/`
- Educational content section conditionally rendered (hidden when no articles exist)
- Build: 33 static pages, homepage as `ƒ (Dynamic)`, articles as `● (SSG)`
- Content management workflow complete: add `.mdx` file → rebuild → article appears on homepage + article pages + related sections

### File List

- `src/app/page.tsx` — MODIFIED: Replaced PLACEHOLDER_ARTICLES with getAllArticles(), added conditional rendering
