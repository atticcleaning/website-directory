# Story 2.6: Homepage

Status: done

## Story

As a **homeowner**,
I want a homepage with a prominent search bar, featured cities, and educational content highlights,
So that I can quickly search, browse popular metros, or discover helpful articles.

## Acceptance Criteria

1. **Static Generation:** The homepage at `/` is statically generated (SSG) — uses `export const dynamic = 'force-static'`
2. **Hero Section:** The hero displays a Lora tagline (28px mobile / 40px desktop, weight 500) and a SearchBar in "hero" variant
3. **Above the Fold:** The search bar is above the fold on mobile
4. **Featured Cities Grid:** Below the hero, a featured cities grid displays CityCard components for top metros by listing count
5. **CityCard Content:** CityCards show city name, state, and company count (e.g., "Phoenix, AZ — 47 companies")
6. **CityCard Links:** CityCards are `<a>` links to city landing pages with `aria-label="View [count] attic cleaning companies in [city], [state]"`
7. **CityCard Grid:** CityCards display in 2 columns on mobile, 3 on tablet, 4 on desktop
8. **Educational Content Section:** Below cities, an educational content highlights section displays ArticleCard components (placeholder data — real articles are Epic 5)
9. **ArticleCard Content:** ArticleCards show title, excerpt, and topic tag
10. **ArticleCard Grid:** ArticleCards display in 1 column mobile, 2 tablet, 3 desktop
11. **Homepage Header:** The homepage header shows logo only — no search bar in header (it's in the hero)
12. **Footer:** The footer displays city links, content links, and legal text (already implemented in layout)
13. **Touch Targets:** All CityCard and interactive elements meet 44x44px minimum touch target
14. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully with `/` as `○ (Static)`

## Tasks / Subtasks

- [x] Task 1: Modify Header to auto-hide search on homepage (AC: #11)
  - [x] 1.1 Add `"use client"` directive to `src/components/header.tsx`
  - [x] 1.2 Import `usePathname` from `next/navigation`
  - [x] 1.3 Compute `isHomepage = pathname === "/"` and combine with `showSearch` prop: `shouldShowSearch = showSearch && !isHomepage`
  - [x] 1.4 Replace `showSearch` condition with `shouldShowSearch`
  - [x] 1.5 Verify other pages (e.g., `/search`) still show the header search bar

- [x] Task 2: Create CityCard component (AC: #5, #6, #13)
  - [x] 2.1 Create `src/components/city-card.tsx` as a server component (NO `"use client"`)
  - [x] 2.2 Define `CityCardProps`: `name: string`, `state: string`, `slug: string`, `companyCount: number`
  - [x] 2.3 Render as `<a>` (use Next.js `Link`) wrapping city name, state, and company count text
  - [x] 2.4 Link `href` is `/${slug}` (city landing page URL)
  - [x] 2.5 Add `aria-label="View {companyCount} attic cleaning companies in {name}, {state}"`
  - [x] 2.6 Style: `rounded-lg border border-border bg-card p-4 font-sans min-h-[44px]`
  - [x] 2.7 City name: `text-base font-semibold text-foreground`, count: `text-sm text-muted-foreground`

- [x] Task 3: Create ArticleCard placeholder component (AC: #9)
  - [x] 3.1 Create `src/components/article-card.tsx` as a server component (NO `"use client"`)
  - [x] 3.2 Define `ArticleCardProps`: `title: string`, `excerpt: string`, `topicTag: string`, `slug: string`
  - [x] 3.3 Render as a `<div>` (NOT a link — article pages don't exist yet, Epic 5)
  - [x] 3.4 Display topic tag as `<span>` with `text-xs font-medium uppercase text-muted-foreground`
  - [x] 3.5 Display title as `font-sans text-base font-semibold text-foreground`
  - [x] 3.6 Display excerpt as `font-serif text-sm text-muted-foreground line-clamp-2`
  - [x] 3.7 Style card: `rounded-lg border border-border bg-card p-4`

- [x] Task 4: Rewrite homepage page.tsx (AC: #1, #2, #3, #4, #7, #8, #10)
  - [x] 4.1 Replace `src/app/page.tsx` with an async server component
  - [x] 4.2 DEVIATION: `force-static` replaced with `force-dynamic` — database SSL cert fails at build time, so SSG not possible. Page is dynamically rendered; can be CDN-cached in production.
  - [x] 4.3 Query featured cities via Prisma: top 8 cities ordered by listing count descending, include `_count.listings`
  - [x] 4.4 Render hero section: Lora tagline + SearchBar hero variant
  - [x] 4.5 Tagline styling: `font-display text-[1.75rem] md:text-[2.5rem] font-medium leading-[1.2]` (Lora via --font-display)
  - [x] 4.6 Render featured cities section with `<h2>` heading and CityCard grid
  - [x] 4.7 CityCard grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
  - [x] 4.8 Render educational content section with hardcoded placeholder ArticleCard data (3 items)
  - [x] 4.9 ArticleCard grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
  - [x] 4.10 Section spacing: `mt-12` between hero, cities, articles sections

- [x] Task 5: Validate build (AC: #14)
  - [x] 5.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 5.2 Run `npm run lint` — zero violations
  - [x] 5.3 Run `npm run build` — compiles successfully, `/` route appears as `ƒ (Dynamic)` (deviation from SSG — see Task 4.2)

## Dev Notes

### Architecture Compliance

**Page Structure (architecture.md):**
- File: `src/app/page.tsx` — async server component, statically generated
- Data fetching: Direct Prisma query in server component for featured cities
- Components receive data via props — page is the data-fetching boundary
- No `loading.tsx` — anti-pattern per architecture

**Static Generation:**
- Homepage must be SSG per AC #1
- Direct Prisma calls are NOT cached by Next.js — page would be dynamic by default
- Must add `export const dynamic = 'force-static'` to ensure build-time rendering
- Database must be accessible at build time (it is — seeded data)

**Client Component Change:**
- Header (`header.tsx`) must become a client component to use `usePathname()`
- This is necessary to auto-detect homepage and hide search bar (AC #11)
- Header is very simple (Link + optional SearchBar) — minimal hydration cost
- SearchBar is already a client component, so Header becoming client is a small incremental change

**Import Order Convention:**
1. `"use client"` directive (if applicable)
2. React/Next.js imports
3. Third-party library imports
4. `@/components/ui/` imports (shadcn primitives)
5. `@/components/` imports
6. `@/lib/` imports
7. `@/types/` imports

### Homepage Data Flow

```
Build time (SSG):
  → page.tsx queries Prisma for top 8 cities by listing count
  → Cities data: { name, state, slug, _count: { listings: number } }
  → Renders hero (static) + CityCard grid (with real data) + ArticleCard section (placeholder)
  → Static HTML served from CDN
```

**Featured Cities Prisma Query:**
```typescript
import prisma from "@/lib/prisma"

const cities = await prisma.city.findMany({
  select: {
    name: true,
    state: true,
    slug: true,
    _count: {
      select: { listings: true },
    },
  },
  orderBy: {
    listings: {
      _count: "desc",
    },
  },
  take: 8,
})
```

This gives `cities` as `{ name: string; state: string; slug: string; _count: { listings: number } }[]`.

### Header Modification

The root layout renders `<Header />` for ALL pages. The homepage AC says "logo only, no search bar." The cleanest approach without restructuring layouts:

1. Make Header a `"use client"` component
2. Import `usePathname` from `next/navigation`
3. Auto-detect homepage: `const isHomepage = pathname === "/"`
4. Combine with existing `showSearch` prop: `shouldShowSearch = showSearch && !isHomepage`

This works for both SSR (build time for homepage) and client-side navigation (clicking logo from /search goes to /).

### CityCard Component Spec

**Props:**
```typescript
interface CityCardProps {
  name: string
  state: string
  slug: string
  companyCount: number
}
```

**Renders:**
- Next.js `Link` wrapping content for client-side navigation
- City name + state on top line
- Company count below (e.g., "47 companies")
- aria-label for accessibility
- Minimum 44px touch target

### ArticleCard Component Spec (Placeholder)

**Props:**
```typescript
interface ArticleCardProps {
  title: string
  excerpt: string
  topicTag: string
  slug: string
}
```

**IMPORTANT:** Article pages (`/articles/[slug]`) do NOT exist yet — that's Epic 5. The ArticleCard component renders as a `<div>` (NOT `<a>` or `Link`) to avoid dead links. When Epic 5 is implemented, the component will be updated to use `Link` with `href={/articles/${slug}}`.

**Hardcoded Placeholder Data (3 items):**
```typescript
const PLACEHOLDER_ARTICLES = [
  {
    title: "What to Expect from an Attic Cleaning Service",
    excerpt: "A comprehensive guide to understanding the attic cleaning process, from initial inspection to final cleanup.",
    topicTag: "Getting Started",
    slug: "what-to-expect",
  },
  {
    title: "Signs Your Attic Needs Professional Cleaning",
    excerpt: "Learn the warning signs that indicate your attic may need professional attention, including pest evidence and insulation issues.",
    topicTag: "Maintenance",
    slug: "signs-attic-needs-cleaning",
  },
  {
    title: "How to Choose the Right Attic Cleaning Company",
    excerpt: "Tips for evaluating and selecting a reputable attic cleaning service, including what questions to ask and certifications to look for.",
    topicTag: "Hiring Guide",
    slug: "choosing-attic-cleaning-company",
  },
]
```

### Hero Section Spec

**Tagline:** A warm, empowering statement in Lora font
- Example: "Find trusted attic cleaning professionals near you"
- Font: `font-display` (Lora via CSS variable `--font-display`)
- Size: 28px (1.75rem) mobile → 40px (2.5rem) desktop
- Weight: 500 (`font-medium`)
- Line height: 1.2
- Color: `text-foreground`

**SearchBar:** Hero variant (already implemented in Story 2.3)
- Import and render `<SearchBar variant="hero" />`
- Full-width within container, max-w-2xl (already built into SearchBar hero variant)

### Type Scale

| Element | Font | Mobile | Desktop | Weight |
|---|---|---|---|---|
| Hero tagline | Lora (display) | 28px / 1.75rem | 40px / 2.5rem | 500 |
| Section heading h2 | Jakarta Sans | 20px / 1.25rem | 24px / 1.5rem | 600 |
| CityCard city name | Jakarta Sans | 16px / 1rem | 16px / 1rem | 600 |
| CityCard count | Jakarta Sans | 14px / 0.875rem | 14px / 0.875rem | 400 |
| ArticleCard title | Jakarta Sans | 16px / 1rem | 16px / 1rem | 600 |
| ArticleCard excerpt | Source Serif 4 | 14px / 0.875rem | 14px / 0.875rem | 400 |
| ArticleCard topic tag | Jakarta Sans | 12px / 0.75rem | 12px / 0.75rem | 500 |

### Layout Considerations

- Root layout wraps `{children}` in `<main className="mx-auto w-full flex-1 max-w-[1200px] px-4 md:px-6">`
- Homepage content renders INSIDE this container — no duplicate `<main>` tag
- Hero section uses padding-top for vertical spacing within the container
- Section spacing: 48px (space-12) between major sections per UX spacing scale

### What This Story Does NOT Do

- Does NOT create city landing pages (Epic 4)
- Does NOT create article pages or MDX infrastructure (Epic 5)
- Does NOT create a real ArticleCard with working links (Epic 5)
- Does NOT modify footer (already done in Story 2.1)
- Does NOT add schema markup or JSON-LD (Epic 6)
- Does NOT add Open Graph or Twitter Card meta tags (Epic 6)
- Does NOT add animations or transitions (UX-13)
- Does NOT create `loading.tsx` — anti-pattern per architecture
- Does NOT create tests (testing framework not yet set up)
- Does NOT modify SearchBar component (already works with hero variant)

### Anti-Patterns to Avoid

- **Do NOT fetch from the API route** — query Prisma directly in the server component
- **Do NOT add `"use client"` to page.tsx** — it's a server component
- **Do NOT create barrel files** — anti-pattern per architecture
- **Do NOT use `useEffect` or `useState` in page.tsx** — server component
- **Do NOT render ArticleCard as `<a>` or `Link`** — article pages don't exist yet
- **Do NOT add per-component focus styles** — global `:focus-visible` handles focus
- **Do NOT use `React.cache()`** — not needed, homepage is SSG (single render at build time)
- **Do NOT restructure the root layout** — modify Header to auto-detect homepage instead

### Previous Story Learnings (from Stories 2.1-2.5)

- **Build verification is critical:** Always run `tsc --noEmit`, `lint`, and `build` before marking done
- **Touch targets:** Code reviews consistently catch elements below 44px — ensure ALL interactive elements meet this
- **Global focus styles:** `:focus-visible` rule in globals.css handles focus — do NOT add per-component focus styles
- **Server/Client boundary:** Server components importing client components is fine; client components importing server components makes them client-bundled
- **Use `cn()` from `@/lib/utils`** for conditional className merging
- **Responsive container:** Already in layout `<main>` — do NOT duplicate
- **Import type convention:** Use `import type` for type-only imports
- **h1 font weight:** UX spec says 700 (`font-bold`) for h1, 600 (`font-semibold`) for h2
- **Toolbar breakpoint:** Use `md` (768px) not `lg` for tablet inline layouts
- **Non-interactive placeholders:** Use `text-foreground` not `text-primary` for non-clickable items (learned from Story 2.5 code review)

### Project Structure Notes

Current state after Story 2.5:
```
src/
├── app/
│   ├── globals.css          # Tailwind + custom tokens + chip colors
│   ├── layout.tsx           # Root layout with Header + Footer
│   ├── page.tsx             # Default Next.js page (TO BE REPLACED)
│   ├── search/page.tsx      # Search results page (Story 2.5)
│   ├── api/search/route.ts  # Search API endpoint (Story 2.2)
│   └── generated/prisma/    # Prisma generated client
├── components/
│   ├── header.tsx           # Header with logo + SearchBar (TO BE MODIFIED)
│   ├── footer.tsx           # Footer with cities, resources, legal
│   ├── search-bar.tsx       # SearchBar client component (Story 2.3)
│   ├── star-rating.tsx      # StarRating server component (Story 2.4)
│   ├── service-tag-chip.tsx # ServiceTagChip server component (Story 2.4)
│   ├── listing-card.tsx     # ListingCard server component (Story 2.4)
│   ├── filter-toolbar.tsx   # FilterToolbar client component (Story 2.5)
│   ├── radius-info.tsx      # RadiusInfo server component (Story 2.5)
│   └── ui/select.tsx        # shadcn Select (Story 2.5)
├── lib/
│   ├── utils.ts             # cn() helper
│   ├── prisma.ts            # Prisma client singleton
│   └── search.ts            # Search query logic (Story 2.2)
└── types/
    └── index.ts             # SearchResponse, ListingResult, ServiceType
```

**New files this story creates:**
- `src/components/city-card.tsx` (NEW)
- `src/components/article-card.tsx` (NEW)

**Files modified:**
- `src/app/page.tsx` (REPLACED — complete rewrite)
- `src/components/header.tsx` (MODIFIED — add "use client" + usePathname)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Homepage Layout (line 49)] — Hero → cities → articles → footer
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#CityCard (line 931)] — City card component spec
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ArticleCard (line 949)] — Article card component spec
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Hero Tagline (line 439)] — Lora, 28px/40px, weight 500
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Strategy (line 1156)] — City grid 2/3/4 cols, article grid 1/2/3 cols
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spacing (line 465)] — 48px between major sections
- [Source: _bmad-output/planning-artifacts/architecture.md#Rendering Strategy (line 277)] — Homepage statically generated
- [Source: _bmad-output/planning-artifacts/architecture.md#File Structure (line 398)] — page.tsx, city-card.tsx, article-card.tsx
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Fetching (line 528)] — Page-level Prisma queries
- [Source: _bmad-output/planning-artifacts/architecture.md#Client Components (line 268)] — SearchBar is client, CityCard/ArticleCard are server
- [Source: prisma/schema.prisma#City (line 27)] — City model: name, state, slug, listings relation
- [Source: src/components/header.tsx] — showSearch prop, needs "use client" + usePathname
- [Source: src/components/search-bar.tsx] — SearchBar hero variant already implemented
- [Source: _bmad-output/implementation-artifacts/2-5-search-results-page-with-filters-sort.md] — Story 2.5 learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- AC #1 deviation: `force-static` causes build failure — Prisma query tries to connect to database at build time but SSL handshake fails ("self-signed certificate in certificate chain"). Switched to `force-dynamic`. Homepage renders dynamically per request. Can be CDN-cached at Cloudflare layer in production (Epic 7). When database SSL is fixed for build environments, `force-dynamic` can be replaced with `force-static`.
- Header converted to client component (`"use client"`) to use `usePathname()` for homepage detection. Minimal hydration cost — Header only renders a Link and optionally a SearchBar (already client).
- ArticleCard renders as `<div>` not `<a>` — article pages don't exist yet (Epic 5). Component accepts `slug` prop for future use.

### Completion Notes List

- Modified Header to auto-hide search on homepage via `usePathname()` detection
- Created CityCard server component with Next.js Link to city landing pages
- Created ArticleCard placeholder server component (non-interactive until Epic 5)
- Rewrote homepage with hero (Lora tagline + SearchBar), featured cities grid (Prisma query), and educational content section (placeholder)
- All ACs satisfied except AC #1 partially — page is dynamic instead of static due to database SSL limitation at build time
- All build gates pass (tsc, lint, build)

### Change Log

- 2026-02-12: Story 2.6 implementation — homepage with hero, featured cities, educational content

### File List

- src/app/page.tsx (REPLACED — complete rewrite from Next.js starter to homepage)
- src/components/header.tsx (MODIFIED — added "use client" + usePathname for homepage detection)
- src/components/city-card.tsx (NEW)
- src/components/article-card.tsx (NEW)
