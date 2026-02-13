# Story 2.5: Search Results Page with Filters & Sort

Status: done

## Story

As a **homeowner**,
I want to view search results with filter and sort controls,
So that I can narrow results to my specific service need and compare contractors efficiently.

## Acceptance Criteria

1. **Server-Rendered Page:** The `/search` page is server-rendered dynamically (not static) using `searchListings()` from `lib/search.ts` — NOT the API route
2. **Result Count:** A result count line displays: "{totalCount} attic cleaning companies in {location}" (or "for '{query}'" if no location resolved)
3. **Card Grid:** Listing cards render in a single column on mobile, 2-column grid on desktop (`lg:grid-cols-2`), with 16px gap mobile / 20px gap desktop
4. **Page Metadata:** The page `<title>` and meta description reflect the search query (e.g., "Attic Cleaning Companies in Phoenix, AZ")
5. **Filter Chips:** Service-type filter chips display horizontally: All Services, Rodent Cleanup, Insulation Removal, Decontamination, Mold Remediation, General Cleaning, Attic Restoration
6. **Filter Toggle:** Chips use `<button aria-pressed="true/false">` toggle; inactive chips outlined, active chips filled `bg-primary text-primary-foreground`; multiple can be active (multi-select)
7. **Client-Side Filtering:** Filtering is instant client-side JS on the pre-rendered result list — no page reload, no server re-fetch (FR3)
8. **Sort Control:** A Select component offers 3 options: "Highest Rated" (default), "Most Reviews", "Distance" (FR4); changing sort reorders instantly client-side
9. **Radius Info:** When `meta.expanded === true`, a subtle info line displays: "Showing results within {radiusMiles} miles of {location}" (UX-17)
10. **Distance Labels:** Each ListingCard receives `distanceMiles` from results — cards show distance when available (FR6)
11. **Educational Content Stub:** When results < 3, an educational content section renders below results as a placeholder (FR7) — full article system is Epic 5
12. **No Empty States:** The page never shows "No results found" or error messages — always renders whatever exists plus educational content (UX-18)
13. **Filter Toolbar Layout:** On mobile: chips horizontally scrollable, sort below chips (stacked). On desktop: chips + sort inline on one toolbar row
14. **Touch Targets:** All filter chips and sort control meet 44x44px minimum touch target
15. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully

## Tasks / Subtasks

- [x] Task 1: Install shadcn Select component (AC: #8)
  - [x] 1.1 Run `npx shadcn@latest add select` to install the Select primitive into `src/components/ui/`
  - [x] 1.2 Verify the component files are created in `src/components/ui/`

- [x] Task 2: Export SERVICE_TAG_CONFIG from service-tag-chip.tsx (AC: #5, #6)
  - [x] 2.1 Add `export` keyword to the `SERVICE_TAG_CONFIG` constant in `src/components/service-tag-chip.tsx`
  - [x] 2.2 No other changes to service-tag-chip.tsx — the card variant stays unchanged, filter variant still returns null (filter rendering moves to filter-toolbar)

- [x] Task 3: Create RadiusInfo component (AC: #9)
  - [x] 3.1 Create `src/components/radius-info.tsx` as a server component (NO `"use client"`)
  - [x] 3.2 Define `RadiusInfoProps`: `radiusMiles: number`, `location: { city: string; state: string } | null`
  - [x] 3.3 Render: "Showing results within {radiusMiles} miles of {city}, {state}" in `font-sans text-sm text-muted-foreground`
  - [x] 3.4 Only renders when location is non-null (if no location, skip the info line)

- [x] Task 4: Create FilterToolbar client component (AC: #5, #6, #7, #8, #13, #14)
  - [x] 4.1 Create `src/components/filter-toolbar.tsx` with `"use client"` directive
  - [x] 4.2 Define `FilterToolbarProps`: `results: ListingResult[]` (meta prop removed — unused by component, all meta rendering handled by page)
  - [x] 4.3 Import `SERVICE_TAG_CONFIG` from `@/components/service-tag-chip` for label names
  - [x] 4.4 Implement filter state: `activeFilters: Set<ServiceType>` via `useState` — empty set means "All Services" (no filtering)
  - [x] 4.5 Render "All Services" chip + one chip per service type as `<button aria-pressed>` with toggle behavior
  - [x] 4.6 Style filter chips: inactive = `border border-border bg-transparent text-foreground`, active = `bg-primary text-primary-foreground border-primary`; all chips `rounded-full px-3 min-h-[44px] font-sans text-sm font-medium`
  - [x] 4.7 "All Services" chip: active when `activeFilters` is empty; clicking it clears all filters
  - [x] 4.8 Service chip toggle: clicking adds/removes from `activeFilters`; clicking when it's the only active filter clears all (returns to "All Services")
  - [x] 4.9 Implement sort state: `sortBy: "rating" | "reviews" | "distance"` via `useState`, default `"rating"`
  - [x] 4.10 Render shadcn Select for sort with 3 options: "Highest Rated", "Most Reviews", "Distance"
  - [x] 4.11 Layout: mobile = chips in scrollable row (`overflow-x-auto`), sort below (`mt-2`); desktop = chips + sort inline (`flex items-center justify-between`)
  - [x] 4.12 Compute filtered results: if `activeFilters` is empty, show all; otherwise show results where `listing.serviceTags` includes ANY active filter
  - [x] 4.13 Compute sorted results: sort filtered results by `starRating` desc (rating), `reviewCount` desc (reviews), or `distanceMiles` asc (distance, nulls last)
  - [x] 4.14 Render filtered/sorted results in a grid: `grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5`
  - [x] 4.15 Import and render `ListingCard` for each result (ListingCard becomes client-bundled in this context — this is expected and fine)

- [x] Task 5: Create search results page (AC: #1, #2, #3, #4, #9, #10, #11, #12)
  - [x] 5.1 Create `src/app/search/page.tsx` as an async server component
  - [x] 5.2 Read `searchParams` (Promise in Next.js 16) — extract `q` parameter
  - [x] 5.3 Call `searchListings({ q })` from `@/lib/search` — NOT the API route
  - [x] 5.4 Generate page metadata via `generateMetadata()`: title = "Attic Cleaning Companies in {location} | AtticCleaning.com", description reflects query
  - [x] 5.5 Page renders inside existing layout `<main>` (already has responsive container) — no duplicate `<main>` tag
  - [x] 5.6 Render `<h1>` with result count: "{totalCount} attic cleaning companies in {city}, {state}" or "Results for '{query}'"
  - [x] 5.7 Render `<RadiusInfo>` when `meta.expanded === true`
  - [x] 5.8 Render `<FilterToolbar results={results} />`
  - [x] 5.9 Render educational content stub when `results.length < 3`: a simple section with heading "Learn About Attic Cleaning" and 3 placeholder text items
  - [x] 5.10 No `loading.tsx` — anti-pattern per architecture

- [x] Task 6: Validate build (AC: #15)
  - [x] 6.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 6.2 Run `npm run lint` — zero violations
  - [x] 6.3 Run `npm run build` — compiles successfully, `/search` route appears as `ƒ (Dynamic)`

## Dev Notes

### Architecture Compliance

**Page Structure (architecture.md):**
- File: `src/app/search/page.tsx` — async server component, dynamically rendered
- The page calls `searchListings()` directly from `lib/search.ts` — NOT the API route
- Page reads `searchParams` (a Promise in Next.js 16) to get the query
- Components receive data via props — page is the data-fetching boundary

**Client Component Boundary:**
- `filter-toolbar.tsx` is a `"use client"` component — the ONLY new client component in this story
- It receives ALL results from the server and handles filter/sort client-side
- ListingCard (originally a server component) gets imported into FilterToolbar — in this context it becomes client-bundled. This is expected per Next.js App Router behavior: components without `"use client"` that are imported by client components become part of the client bundle.
- This is architecturally correct — the filter/sort needs to manipulate which cards are visible/ordered

**Filter/Sort Pattern:**
- Filter state and sort state live in component `useState` — NOT URL params for this MVP
- The architecture says "URL search params as state" but also "instant client-side JS, no page reload"
- For instant filtering without server round-trip, local state is correct
- URL param sync can be added later for bookmarkability (not in MVP scope)

**Import Order Convention:**
1. `"use client"` directive (if applicable)
2. React/Next.js imports
3. Third-party library imports
4. `@/components/ui/` imports (shadcn primitives)
5. `@/components/` imports
6. `@/lib/` imports
7. `@/types/` imports

### Search Results Page Spec

**Data Flow:**
```
/search?q=phoenix
  → page.tsx reads searchParams.q
  → calls searchListings({ q: "phoenix" })
  → gets SearchResponse { results, meta }
  → renders <h1>, <RadiusInfo>, <FilterToolbar results={results} meta={meta} />
  → FilterToolbar handles filter/sort client-side
  → renders ListingCard for each filtered/sorted result
```

**searchParams in Next.js 16:**
In Next.js 15+, `searchParams` is a Promise that must be awaited:
```typescript
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q = "" } = await searchParams
  const data = await searchListings({ q })
  // ...
}
```

**generateMetadata:**
```typescript
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const { q = "" } = await searchParams
  const data = await searchListings({ q })
  const locationStr = data.meta.location
    ? `${data.meta.location.city}, ${data.meta.location.state}`
    : q
  return {
    title: `Attic Cleaning Companies in ${locationStr} | AtticCleaning.com`,
    description: `Find top-rated attic cleaning companies in ${locationStr}. Compare ratings, reviews, and services.`,
  }
}
```

**IMPORTANT: Avoid double data fetching.** Both `generateMetadata` and the page component call `searchListings()`. Next.js 16 with Turbopack deduplicates `fetch()` calls but NOT direct function calls. To avoid querying the database twice, use React `cache()`:
```typescript
import { cache } from "react"
import { searchListings as _searchListings } from "@/lib/search"

const getSearchResults = cache((q: string) => _searchListings({ q }))
```
Then both `generateMetadata` and the page use `getSearchResults(q)`.

### FilterToolbar Component Spec

**Props:**
```typescript
import type { ListingResult, SearchResponse } from "@/types"

interface FilterToolbarProps {
  results: ListingResult[]
  meta: SearchResponse["meta"]
}
```

**Filter Logic:**
- `activeFilters: Set<ServiceType>` — empty means show all ("All Services" active)
- Filtering: `results.filter(r => r.serviceTags.some(tag => activeFilters.has(tag)))`
- When no filters active, show all results
- "All Services" chip: active when set is empty, clicking clears all filters

**Sort Logic:**
- Default: `"rating"` (highest rated first)
- `"rating"`: sort by `starRating` descending
- `"reviews"`: sort by `reviewCount` descending
- `"distance"`: sort by `distanceMiles` ascending, nulls last

**Filter Chip Styling:**
```
Inactive: border border-border bg-transparent text-foreground rounded-full px-3 min-h-[44px]
Active:   bg-primary text-primary-foreground border-primary rounded-full px-3 min-h-[44px]
```

**Sort Select:**
- Use shadcn `Select` component
- Trigger: `min-h-[44px]` for touch target
- Right-aligned on desktop, full-width below chips on mobile

### RadiusInfo Component Spec

**Props:**
```typescript
interface RadiusInfoProps {
  radiusMiles: number
  location: { city: string; state: string } | null
}
```

**Renders:** "Showing results within {radiusMiles} miles of {city}, {state}" — only when location exists

### SERVICE_TAG_CONFIG Export

The `SERVICE_TAG_CONFIG` in `service-tag-chip.tsx` needs to be exported so `filter-toolbar.tsx` can import the service type labels for chip rendering. The filter toolbar renders its own `<button>` elements (not ServiceTagChip components) because the filter variant is interactive and lives in a client component.

### Educational Content Stub

For results < 3, render a placeholder section:
```html
<section class="mt-8">
  <h2 class="font-sans text-xl font-semibold text-foreground">Learn About Attic Cleaning</h2>
  <p class="mt-2 font-serif text-sm text-muted-foreground">
    Explore our guides to help you make informed decisions about attic cleaning services.
  </p>
  <!-- Hardcoded placeholder links — will be replaced by ArticleCard components in Epic 5 -->
</section>
```

### What This Story Does NOT Do

- Does NOT create the homepage (Story 2.6)
- Does NOT create ArticleCard components (Story 2.6 / Epic 5)
- Does NOT create real educational articles (Epic 5)
- Does NOT create CityCard components (Story 2.6)
- Does NOT sync filter/sort state to URL params (can be added later for bookmarkability)
- Does NOT add `loading.tsx` — anti-pattern per architecture
- Does NOT create `error.tsx` for the search route (can be added in Epic 7)
- Does NOT modify the search API route or lib/search.ts
- Does NOT add animations or transitions (UX-13)
- Does NOT create tests (testing framework not yet set up)

### Anti-Patterns to Avoid

- **Do NOT fetch from the API route (`/api/search`)** — call `searchListings()` directly from `lib/search.ts` in the server component
- **Do NOT use `useRouter()` for filter/sort changes** — use local `useState` for instant client-side filtering
- **Do NOT add `loading.tsx`** — anti-pattern per architecture
- **Do NOT add `"use client"` to page.tsx** — it's a server component; FilterToolbar is the client boundary
- **Do NOT make ServiceTagChip "use client"** — the card variant must remain server-renderable; filter variant is handled by FilterToolbar
- **Do NOT use `useSearchParams()` for filter/sort state** — local `useState` for instant updates; URL sync is a future enhancement
- **Do NOT show "No results found" or error messages** — always render what exists plus educational content
- **Do NOT create barrel files** — anti-pattern per architecture
- **Do NOT add `React.use()` or `useSWR()`** — server component fetches data directly

### Previous Story Learnings (from Stories 2.1-2.4)

- **Build verification is critical:** Always run `tsc --noEmit`, `lint`, and `build` before marking done
- **Touch targets:** Code reviews consistently catch elements below 44px — ensure ALL interactive elements meet this
- **Global focus styles:** `:focus-visible` rule in globals.css handles focus — do NOT add per-component focus styles
- **Server/Client boundary:** Server components importing client components is fine; client components importing server components makes them client-bundled
- **Use `cn()` from `@/lib/utils`** for conditional className merging
- **Responsive container:** `mx-auto w-full max-w-[1200px] px-4 md:px-6`
- **Import type convention:** Use `import type` for type-only imports
- **ServiceTagChip card variant:** Uses inline `style` with CSS variables — the filter variant in FilterToolbar uses Tailwind classes directly (different approach)
- **Next.js 16 searchParams:** `searchParams` is a Promise — must be awaited

### Project Structure Notes

Current state after Story 2.4:
```
src/
├── app/
│   ├── globals.css          # Tailwind + custom tokens + chip colors
│   ├── layout.tsx           # Root layout with Header + Footer
│   ├── page.tsx             # Default Next.js page (unmodified — Story 2.6)
│   ├── api/search/route.ts  # Search API endpoint (created in 2.2)
│   └── generated/prisma/    # Prisma generated client
├── components/
│   ├── header.tsx           # Header with logo + SearchBar
│   ├── footer.tsx           # Footer with cities, resources, legal
│   ├── search-bar.tsx       # SearchBar client component (Story 2.3)
│   ├── star-rating.tsx      # StarRating server component (Story 2.4)
│   ├── service-tag-chip.tsx # ServiceTagChip server component (Story 2.4)
│   ├── listing-card.tsx     # ListingCard server component (Story 2.4)
│   └── ui/                  # shadcn/ui primitives (empty)
├── lib/
│   ├── utils.ts             # cn() helper
│   ├── prisma.ts            # Prisma client singleton
│   └── search.ts            # Search query logic (Story 2.2)
└── types/
    └── index.ts             # SearchResponse, ListingResult, ServiceType
```

**New files this story creates:**
- `src/app/search/page.tsx` (NEW)
- `src/components/filter-toolbar.tsx` (NEW)
- `src/components/radius-info.tsx` (NEW)
- `src/components/ui/select.tsx` (NEW — installed via shadcn CLI)

**Files modified:**
- `src/components/service-tag-chip.tsx` (MODIFIED — export SERVICE_TAG_CONFIG)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.5] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Card Scan (line 367)] — Card layout, vertical stack mobile, 2-col desktop
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Filter Pattern (line 1039)] — Filter chip behavior, multi-select, client-side
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Sort Pattern (line 1050)] — Sort control, 3 options, instant reorder
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ServiceTagChip (line 863)] — Filter variant: button with aria-pressed
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Radius Expansion (line 705)] — Info line, distance labels, educational content
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Empty States (line 1111)] — No empty states by design
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Strategy (line 1150)] — Mobile/tablet/desktop layouts
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Type Scale (line 440)] — h1, result count, meta text sizing
- [Source: _bmad-output/planning-artifacts/architecture.md#Rendering Strategy (line 277)] — Search page dynamically rendered
- [Source: _bmad-output/planning-artifacts/architecture.md#Client Components (line 268)] — filter-toolbar.tsx is "use client"
- [Source: _bmad-output/planning-artifacts/architecture.md#State Patterns (line 508)] — URL params as state, useSearchParams
- [Source: _bmad-output/planning-artifacts/architecture.md#Data Fetching (line 528)] — Page-level fetching, components receive props
- [Source: _bmad-output/planning-artifacts/architecture.md#No Loading States (line 520)] — No loading.tsx
- [Source: _bmad-output/planning-artifacts/architecture.md#File Structure (line 398)] — search/page.tsx, filter-toolbar.tsx, radius-info.tsx
- [Source: src/lib/search.ts#searchListings] — Function signature, SearchParams interface
- [Source: src/types/index.ts] — SearchResponse, ListingResult, ServiceType
- [Source: src/components/service-tag-chip.tsx] — SERVICE_TAG_CONFIG to be exported
- [Source: _bmad-output/implementation-artifacts/2-4-listingcard-starrating-servicetagchip-components.md] — Story 2.4 learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Removed unused `meta` prop from FilterToolbar — story spec included it but component doesn't use it (all meta rendering done by page). Eliminates lint warning.
- Layout already wraps `{children}` in `<main>` with responsive container — search page renders directly into it, no duplicate `<main>` tag.
- `searchParams` coerced from `string | string[] | undefined` to `string` using type check (handles array case from Next.js).

### Completion Notes List

- Installed shadcn Select component via CLI (`npx shadcn@latest add select`)
- Exported `SERVICE_TAG_CONFIG` from service-tag-chip.tsx for filter-toolbar to import labels
- Created RadiusInfo server component — conditional rendering based on location
- Created FilterToolbar client component — single client boundary for filter/sort
  - Filter chips with `<button aria-pressed>` for accessible multi-select
  - shadcn Select for sort with 3 options (Highest Rated, Most Reviews, Distance)
  - `useMemo` for computed filtered+sorted results
  - Mobile: horizontal scroll chips + stacked sort; Desktop: inline toolbar
- Created search page with `React.cache()` dedup between `generateMetadata` and page
- Educational content stub renders when results < 3
- All ACs satisfied, all build gates pass

### Change Log

- 2026-02-12: Story 2.5 implementation — search results page with filters & sort

### File List

- src/components/ui/select.tsx (NEW — installed via shadcn CLI)
- src/components/service-tag-chip.tsx (MODIFIED — exported SERVICE_TAG_CONFIG)
- src/components/radius-info.tsx (NEW)
- src/components/filter-toolbar.tsx (NEW)
- src/app/search/page.tsx (NEW)
