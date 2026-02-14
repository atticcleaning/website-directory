# Story 5.1: MDX Content Infrastructure & Article Rendering

Status: done

## Story

As a **homeowner**,
I want to read educational articles about attic cleaning topics,
So that I can make informed decisions about my attic problem before hiring a contractor.

## Acceptance Criteria

1. **MDX File Storage:** Article content is stored as `.mdx` files in `src/content/articles/` directory
2. **MDX Parsing:** `src/lib/mdx.ts` reads and parses MDX files using `next-mdx-remote/rsc` (server component compatible). It exposes functions to get all article slugs and get a single article by slug.
3. **Static Generation:** The article page at `/articles/[slug]` is statically generated via `generateStaticParams` enumerating all MDX files in the content directory
4. **Frontmatter Schema:** MDX frontmatter supports: `title` (string), `slug` (string), `excerpt` (string), `topicTag` (string), `publishedAt` (string, ISO date), and `relatedCities` (string array of city slugs)
5. **Article Body Typography:** Article body text renders in Source Serif 4 (`font-serif`), 16px mobile / 18px desktop, with a max-width 680px reading column
6. **Article Headings:** Article headings render in Jakarta Sans (`font-sans`): h2 at 20px mobile / 24px desktop (weight 600), h3 at 18px (weight 600)
7. **Prose Styling:** MDX content renders with proper prose styling — paragraphs, lists, blockquotes, inline code, links — all using the design system's colors and spacing
8. **Persistent Header:** The persistent header with SearchBar (header variant) is visible on article pages — homeowners can switch to search at any time (FR23). This is already handled by the root layout — no modification needed.
9. **Semantic HTML:** The page uses semantic HTML with proper heading hierarchy (h1 article title, h2/h3 from MDX content)
10. **SEO Title:** The page `<title>` is: "[Article Title] | AtticCleaning.com"
11. **SEO Description:** The meta description uses the article's frontmatter excerpt
12. **404 Handling:** If the article slug doesn't match any MDX file, the page returns `notFound()`
13. **Sample Articles:** At least 2 sample MDX articles exist in `src/content/articles/` to validate the pipeline works end-to-end
14. **LCP Performance:** LCP < 1.5s on mobile 4G — articles are static HTML with no client JS, no external resources blocking render
15. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with article pages appearing as `● (SSG)`

## Tasks / Subtasks

- [x] Task 1: Install MDX dependencies (AC: #2)
  - [x] 1.1 Install `next-mdx-remote` — provides `compileMDX` for RSC-compatible MDX rendering from arbitrary file paths. Use `next-mdx-remote/rsc` import for server component support.
  - [x] 1.2 Install `gray-matter` — for parsing YAML frontmatter from MDX files. The `compileMDX` function in next-mdx-remote also supports frontmatter parsing, but gray-matter is used in `getAllArticles()` to read frontmatter without compiling full MDX (faster for listing/enumeration).
  - [x] 1.3 Install `remark-gfm` — for GitHub Flavored Markdown support (tables, strikethrough, task lists) in article content.
  - [x] 1.4 Install `@types/mdx` as dev dependency if needed for TypeScript MDX support.

- [x] Task 2: Create MDX utility library (AC: #2, #4)
  - [x] 2.1 Create `src/lib/mdx.ts` with the following exports:
    - `getArticleSlugs(): string[]` — reads `src/content/articles/` directory, returns array of slugs (filename without `.mdx` extension)
    - `getArticleBySlug(slug: string): Promise<{ frontmatter: ArticleFrontmatter, content: React.ReactElement }>` — reads the MDX file, compiles with `compileMDX` from `next-mdx-remote/rsc`, returns frontmatter and compiled content
    - `getAllArticles(): ArticleFrontmatter[]` — reads all MDX files, parses frontmatter only (using `gray-matter`), returns sorted by `publishedAt` desc. Does NOT compile MDX — only extracts frontmatter for listing purposes.
  - [x] 2.2 Define `ArticleFrontmatter` type: `{ title: string, slug: string, excerpt: string, topicTag: string, publishedAt: string, relatedCities: string[] }`
  - [x] 2.3 Use `fs.readFileSync` and `path.join(process.cwd(), 'src/content/articles')` for file access. This works at build time for static generation.
  - [x] 2.4 Pass custom MDX components to `compileMDX` for typography styling (see Task 4).
  - [x] 2.5 Pass `remark-gfm` plugin to `compileMDX` options: `options: { mdxOptions: { remarkPlugins: [remarkGfm] } }`

- [x] Task 3: Create article page route (AC: #3, #8, #9, #10, #11, #12)
  - [x] 3.1 Create `src/app/articles/[slug]/page.tsx` as an async server component
  - [x] 3.2 Implement `generateStaticParams()` using `getArticleSlugs()` from `src/lib/mdx.ts`. Return `{ slug }` for each article.
  - [x] 3.3 Implement `generateMetadata()` with `params: Promise<{ slug: string }>` (Next.js 16 convention). Title: "[Article Title] | AtticCleaning.com". Description: article excerpt from frontmatter.
  - [x] 3.4 Page component: call `getArticleBySlug(slug)`, return `notFound()` if article not found (file doesn't exist or frontmatter invalid). Use try/catch around file read.
  - [x] 3.5 Render article layout: h1 article title, topic tag, published date, then MDX content, all within a 680px max-width reading column
  - [x] 3.6 h1 styling: `font-sans text-2xl font-bold text-foreground md:text-[2rem]` (same as other pages)
  - [x] 3.7 Topic tag: `font-sans text-xs font-medium uppercase text-muted-foreground` (same styling as ArticleCard topic tag)
  - [x] 3.8 Published date: `font-sans text-sm text-muted-foreground` formatted with `Intl.DateTimeFormat`
  - [x] 3.9 MDX content wrapper: `<article className="prose mt-8">` — the `prose` class is defined in Task 4
  - [x] 3.10 Page container: `<div className="mx-auto max-w-[680px] py-6 md:py-8">` for 680px reading column within the existing 1200px layout container

- [x] Task 4: Create prose styles for MDX content (AC: #5, #6, #7)
  - [x] 4.1 Add prose styles to `src/app/globals.css` using Tailwind `@layer` for article typography. Define a `.prose` class that styles MDX output:
    - `p`: `font-serif text-base md:text-lg leading-[1.65] text-foreground mb-6` (Source Serif 4, 16px/18px, 1.65 line-height)
    - `h2`: `font-sans text-xl md:text-2xl font-semibold text-foreground mt-8 mb-3` (Jakarta Sans, 20px/24px, weight 600)
    - `h3`: `font-sans text-lg font-semibold text-foreground mt-6 mb-2` (Jakarta Sans, 18px, weight 600)
    - `ul`, `ol`: `font-serif text-base md:text-lg leading-[1.65] text-foreground mb-6 pl-6` with proper list styling
    - `li`: `mb-2` spacing between list items
    - `blockquote`: `border-l-4 border-primary pl-4 italic font-serif text-base md:text-lg text-muted-foreground mb-6`
    - `a`: `text-primary underline hover:no-underline` (blue links)
    - `code` (inline): `bg-muted px-1.5 py-0.5 rounded text-sm font-mono`
    - `strong`: `font-semibold`
    - `hr`: `border-border my-8`
  - [x] 4.2 Alternatively, pass custom components to `compileMDX` in `mdx.ts` to style each element. Prefer CSS `.prose` class for simplicity and separation of concerns, since MDX custom components add complexity for simple typography mapping.

- [x] Task 5: Create sample MDX articles (AC: #1, #13)
  - [x] 5.1 Create `src/content/articles/` directory
  - [x] 5.2 Create `src/content/articles/signs-attic-needs-cleaning.mdx` — a real article about signs your attic needs professional cleaning. Include frontmatter with all required fields. 400-600 words with h2 sections, a list, and a paragraph. Use `relatedCities: ["phoenix-az", "tucson-az"]`.
  - [x] 5.3 Create `src/content/articles/choosing-attic-cleaning-company.mdx` — a real article about how to choose the right company. Include frontmatter with all required fields. 400-600 words with h2 sections, a list, and a blockquote. Use `relatedCities: ["scottsdale-az", "mesa-az"]`.

- [x] Task 6: Validate build (AC: #14, #15)
  - [x] 6.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 6.2 Run `npm run lint` — zero violations
  - [x] 6.3 Run `npm run build` — compiles successfully. `generateStaticParams` generates article routes as `● (SSG)`

## Dev Notes

### Architecture Compliance

**Content Storage (architecture.md):**
- Decision: MDX files stored in-repo at `src/content/articles/`
- Rationale: 50 articles at launch is manageable in-repo. Git-versioned, easy to review, simple for AI generation.
- Migration path: Move to Postgres if content velocity demands it post-MVP.

**MDX Processing Library (architecture.md):**
- Decision: Use `next-mdx-remote` (NOT `@next/mdx`)
- Rationale: Articles live in `src/content/articles/`, not in `src/app/`. `next-mdx-remote` supports loading MDX from any file path. `@next/mdx` only works for MDX files colocated in the app directory.
- Import: `import { compileMDX } from 'next-mdx-remote/rsc'` for React Server Component support

**Page Structure:**
- Route: `src/app/articles/[slug]/page.tsx` — async server component
- Static generation: `generateStaticParams` enumerates all MDX files
- Data fetching: File system reads via `fs` in `src/lib/mdx.ts`
- No `loading.tsx` — anti-pattern per architecture
- Layout: Single column, max-width 680px reading column (narrower than listing detail's 800px)

**URL Structure (architecture.md):**
- `/articles/[slug]` — e.g., `/articles/signs-attic-needs-cleaning`
- Slug derived from MDX filename (without `.mdx` extension)

**Build Pipeline (architecture.md):**
```
MDX files → mdx.ts → Article pages (static HTML)
```

### MDX Technical Details

**`next-mdx-remote/rsc` API:**
```typescript
import { compileMDX } from 'next-mdx-remote/rsc'

const { content, frontmatter } = await compileMDX<ArticleFrontmatter>({
  source: rawMdxContent,
  options: {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [remarkGfm],
    },
  },
  components: mdxComponents, // optional custom components
})
// content is a React.ReactElement — render directly in JSX
// frontmatter is typed as ArticleFrontmatter
```

**File System Access:**
```typescript
import fs from 'fs'
import path from 'path'

const ARTICLES_DIR = path.join(process.cwd(), 'src/content/articles')

// Read all article filenames
const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx'))

// Read single article
const rawContent = fs.readFileSync(path.join(ARTICLES_DIR, `${slug}.mdx`), 'utf-8')
```

This works at build time because `generateStaticParams` runs in Node.js. File system access is valid in server components during static generation.

**Frontmatter Schema:**
```yaml
---
title: "Signs Your Attic Needs Professional Cleaning"
slug: "signs-attic-needs-cleaning"
excerpt: "Learn the warning signs that indicate your attic may need professional attention."
topicTag: "Maintenance"
publishedAt: "2026-01-15"
relatedCities:
  - phoenix-az
  - tucson-az
---
```

### Typography System for Articles (UX spec)

| Element | Font | Mobile | Desktop | Weight | Line Height |
|---|---|---|---|---|---|
| Article title (h1) | Jakarta Sans | 24px / 1.5rem | 32px / 2rem | 700 | 1.25 |
| Article h2 | Jakarta Sans | 20px / 1.25rem | 24px / 1.5rem | 600 | 1.3 |
| Article h3 | Jakarta Sans | 18px / 1.125rem | 18px | 600 | 1.3 |
| Body text | Source Serif 4 | 16px / 1rem | 18px / 1.125rem | 400 | 1.65 |
| Topic tag | Jakarta Sans | 12px / 0.75rem | 12px | 500 | — |

### Article Page Layout (UX spec)

| Page | Mobile Layout | Desktop Layout | Key Components |
|---|---|---|---|
| Article | Single column, max-width 680px | Single column, max-width 680px | Source Serif 4 body, persistent search bar in header |

The 680px reading column lives within the root layout's 1200px container. Use `mx-auto max-w-[680px]` on the article page wrapper.

### Existing Components

**ArticleCard** (`src/components/article-card.tsx`):
- Props: `{ title: string, excerpt: string, topicTag: string, slug: string }`
- Currently NOT clickable — `slug` prop exists but isn't used
- This story does NOT modify ArticleCard (Story 5.3 will make it clickable and use real article data)

**Homepage** (`src/app/page.tsx`):
- Uses hardcoded `PLACEHOLDER_ARTICLES` array for the educational content section
- This story does NOT modify the homepage (Story 5.3 will replace placeholders with real MDX data)

### Dependencies to Install

| Package | Purpose | Type |
|---|---|---|
| `next-mdx-remote` | MDX compilation and rendering for RSC | dependency |
| `gray-matter` | Fast frontmatter-only parsing for article listing | dependency |
| `remark-gfm` | GitHub Flavored Markdown (tables, strikethrough) | dependency |

**Do NOT install `@next/mdx`** — wrong tool for file-based MDX content. That's for MDX files colocated in the app directory.

**Do NOT install `@tailwindcss/typography`** — we're writing our own `.prose` styles to match the design system exactly (OKLCH colors, specific font sizes, specific line heights). The Tailwind typography plugin would need extensive overrides.

### What This Story Does NOT Do

- Does NOT modify the ArticleCard component (Story 5.3)
- Does NOT modify the homepage to use real articles (Story 5.3)
- Does NOT add related articles section (Story 5.2)
- Does NOT add city mention links in article content (Story 5.2)
- Does NOT add contextual CTAs in articles (Story 5.2)
- Does NOT add data enrichment with Prisma queries (Story 5.2)
- Does NOT add JSON-LD schema markup (Epic 6)
- Does NOT add Open Graph meta tags (Epic 6)
- Does NOT add to XML sitemap (Epic 6)
- Does NOT create `mdx-components.tsx` at project root — that's for `@next/mdx`, not `next-mdx-remote`
- Does NOT create tests (testing framework not yet set up)
- Does NOT modify `next.config.ts` — `next-mdx-remote` doesn't require Next.js config changes (unlike `@next/mdx`)
- Does NOT modify `tsconfig.json` — MDX files are read as strings via `fs`, not imported as modules

### Anti-Patterns to Avoid

- **Do NOT use `@next/mdx`** — articles are in `src/content/articles/`, not `src/app/`. Use `next-mdx-remote`.
- **Do NOT use `next-mdx-remote` v4 serialize API** — use `next-mdx-remote/rsc` with `compileMDX` for server component support
- **Do NOT import MDX files as modules** — read them as strings via `fs.readFileSync` and pass to `compileMDX`
- **Do NOT create barrel files** — anti-pattern per architecture
- **Do NOT install `@tailwindcss/typography`** — write custom `.prose` styles matching the design system
- **Do NOT add `"use client"` to the article page** — it's a server component, MDX renders server-side
- **Do NOT duplicate `<main>` tag** — root layout already provides `<main>` with 1200px container
- **Do NOT modify the homepage or ArticleCard** — that's Story 5.3
- **Do NOT add `loading.tsx`** — anti-pattern per architecture
- **Do NOT use dynamic imports or lazy loading for MDX** — articles are static, compile at build time

### Previous Story Learnings (from Stories 1.1–4.1)

- **SSL at build time works**: Database queries work during `generateStaticParams` (though this story uses file system, not Prisma)
- **Next.js 16 params**: Route params are `Promise` — must be awaited: `const { slug } = await params`
- **React `cache()`**: Wrap data-fetching functions in `cache()` to deduplicate between `generateMetadata` and page component. For this story, wrap `getArticleBySlug` in `cache()`.
- **Touch targets**: ALL interactive elements must have `min-h-[44px]`
- **h1 weight 700**: Use `font-bold` not `font-semibold` for h1
- **Section spacing 32px**: Use `mt-8` between major sections
- **Build verification is critical**: Always run tsc, lint, and build before marking done
- **Import order**: React/Next.js → third-party → @/components → @/lib → @/types
- **Connection pool**: `prisma.ts` has `max: 3` — this story doesn't use Prisma, but be aware for Story 5.2

### Project Structure Notes

```
src/
├── app/
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx               ← NEW (article page)
│   ├── [citySlug]/
│   │   ├── page.tsx                   (existing — city landing)
│   │   └── [companySlug]/
│   │       └── page.tsx               (existing — listing detail)
│   ├── search/page.tsx
│   ├── api/search/route.ts
│   ├── globals.css                    ← MODIFIED (add .prose styles)
│   ├── layout.tsx                     (no change — persistent header already works)
│   └── page.tsx                       (no change — Story 5.3 handles homepage)
│
├── content/
│   └── articles/                      ← NEW (MDX content directory)
│       ├── signs-attic-needs-cleaning.mdx
│       └── choosing-attic-cleaning-company.mdx
│
├── lib/
│   ├── mdx.ts                         ← NEW (MDX utilities)
│   ├── prisma.ts
│   ├── search.ts
│   └── utils.ts
│
├── components/
│   ├── article-card.tsx               (no change — Story 5.3)
│   └── ... (all existing, no changes)
│
└── types/
    └── index.ts                       (no change)
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5, Story 5.1] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Content Storage] — MDX files in-repo decision
- [Source: _bmad-output/planning-artifacts/architecture.md#MDX Processing Library] — next-mdx-remote decision
- [Source: _bmad-output/planning-artifacts/architecture.md#URL Structure] — /articles/[slug] route
- [Source: _bmad-output/planning-artifacts/architecture.md#Rendering Strategy] — Article pages are static
- [Source: _bmad-output/planning-artifacts/architecture.md#File Structure] — content/articles/ directory, lib/mdx.ts
- [Source: _bmad-output/planning-artifacts/architecture.md#FR20-FR23 Mapping] — Educational content file mapping
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Article Page Layout] — Single column 680px, Source Serif 4
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography] — Body text 16px/18px, h2 20px/24px, h3 18px
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ArticleCard] — Component props and states
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Article Page Patterns] — Prose styling, heading patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#David's Journey] — Content-to-directory conversion flow
- [Source: src/app/layout.tsx] — Root layout with persistent header, font variables, 1200px container
- [Source: src/components/article-card.tsx] — Existing ArticleCard props (slug unused)
- [Source: src/app/page.tsx] — Homepage with PLACEHOLDER_ARTICLES
- [Source: src/app/globals.css] — Design system colors, font theme variables
- [Source: package.json] — No MDX dependencies currently installed

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Stale `.next` cache caused `duplicate identifier` TS error during tsc — resolved by `rm -rf .next`
- `@types/mdx` not installed — not needed since MDX files are read as strings via `fs`, not imported as modules
- Task 2.4 (custom MDX components) — used CSS `.prose` class approach instead for simplicity

### Completion Notes List

- All 15 ACs implemented and verified
- `next-mdx-remote`, `gray-matter`, `remark-gfm` installed (139 packages added)
- `src/lib/mdx.ts` provides 3 exports: `getArticleSlugs()`, `getArticleBySlug()`, `getAllArticles()`
- Article page at `/articles/[slug]` with SSG via `generateStaticParams`
- Custom `.prose` CSS class in `globals.css` matches design system exactly (Source Serif 4 body, Jakarta Sans headings, OKLCH colors)
- 2 sample articles created (~450 and ~500 words each) with realistic attic cleaning content
- Build: 33 static pages (31 previous + 2 article pages), both routes as `● (SSG)`
- No modifications to existing files except `globals.css` (added prose styles) and `package.json`/`package-lock.json` (dependencies)

### File List

- `src/lib/mdx.ts` — NEW: MDX utility library (getArticleSlugs, getArticleBySlug, getAllArticles)
- `src/app/articles/[slug]/page.tsx` — NEW: Article page route with SSG, metadata, 680px reading column
- `src/app/globals.css` — MODIFIED: Added `.prose` styles in `@layer components` block
- `src/content/articles/signs-attic-needs-cleaning.mdx` — NEW: Sample article (~450 words)
- `src/content/articles/choosing-attic-cleaning-company.mdx` — NEW: Sample article (~500 words)
- `package.json` — MODIFIED: Added next-mdx-remote, gray-matter, remark-gfm dependencies
- `package-lock.json` — MODIFIED: Lock file updated
