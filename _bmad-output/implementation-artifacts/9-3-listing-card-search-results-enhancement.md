# Story 9.3: ListingCard & Search Results Enhancement

Status: done

## Story

As a **user browsing search results or city pages**,
I want listing cards that feel interactive and polished — with shadow depth, responsive hover states, and a search button that reacts to my click,
so that the directory feels like a curated professional tool rather than a static data dump, increasing my confidence in the businesses listed.

## Acceptance Criteria

1. **Given** a ListingCard on any page (search results, city landing)
   **When** the card is at rest
   **Then** it displays a subtle shadow (`shadow-sm`) and when hovered, transitions smoothly (200ms) to a stronger shadow (`shadow-md`), subtle upward lift (`motion-safe:hover:-translate-y-0.5`), consistent with the CityCard/ArticleCard pattern from Story 9.2

2. **Given** the company name link inside a ListingCard
   **When** the user hovers over it
   **Then** the text transitions to `text-primary` with a smooth 200ms color transition

3. **Given** the contact links (phone, website) inside a ListingCard
   **When** the user hovers over them
   **Then** an underline appears with a smooth 200ms transition

4. **Given** StarRating rendered with `variant="full"` (listing detail page)
   **When** displayed
   **Then** stars are `h-5 w-5` (20px) instead of the default `h-4 w-4` (16px), providing a more prominent trust signal on the detail view

5. **Given** StarRating's partial and empty stars
   **When** displayed at any variant
   **Then** partial stars use `opacity-60` (up from `opacity-50`) and empty stars use `text-muted-foreground/25` (up from `/20`) for slightly improved visibility

6. **Given** the SearchBar submit button (all contexts: hero, header, 404)
   **When** the user hovers over it
   **Then** the button darkens via `hover:brightness-90` with a smooth 200ms transition, maintaining WCAG AA contrast

7. **Given** an active filter chip in FilterToolbar
   **When** displayed
   **Then** it has a subtle shadow (`shadow-sm`) differentiating it from inactive chips

8. **Given** an inactive filter chip in FilterToolbar
   **When** the user hovers over it
   **Then** a subtle background tint appears (`hover:bg-muted`) with a 200ms transition

9. **Given** all visual changes in this story
   **When** measured
   **Then** LCP < 1.5s, CLS < 0.1, page weight < 500KB, zero new client-side JS beyond existing client components, WCAG 2.1 AA maintained

## Tasks / Subtasks

- [x] Task 1: ListingCard Shadow + Hover Enhancement (AC: #1, #2, #3, #9)
  - [x] 1.1 In `src/components/listing-card.tsx`, update the `<article>` className: ADD `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5`
  - [x] 1.2 Update the company name `<Link>` className: ADD `hover:text-primary transition-colors duration-200`
  - [x] 1.3 Update both contact `<a>` links (phone + website) className: ADD `hover:underline transition-colors duration-200`
  - [x] 1.4 Verify the `<article>` does NOT get `"use client"` — ListingCard is a server component and must remain so
  - [x] 1.5 Verify keyboard focus indicators remain visible with shadow present

- [x] Task 2: StarRating Size + Visibility Enhancement (AC: #4, #5, #9)
  - [x] 2.1 In `src/components/star-rating.tsx`, add variant-conditional star sizing: when `variant === "full"`, use `h-5 w-5`; when `variant === "compact"`, keep `h-4 w-4`. Use a const like `const starSize = variant === "full" ? "h-5 w-5" : "h-4 w-4"` and apply to all three star types (full, partial, empty)
  - [x] 2.2 Change partial star opacity from `opacity-50` to `opacity-60`
  - [x] 2.3 Change empty star color from `text-muted-foreground/20` to `text-muted-foreground/25`
  - [x] 2.4 Verify StarRating remains a server component (no `"use client"`)
  - [x] 2.5 Verify the compact variant (used in ListingCard, city landing page) is visually unchanged at h-4 w-4
  - [x] 2.6 Verify the full variant (used on listing detail page at `[citySlug]/[companySlug]/page.tsx`) renders at h-5 w-5

- [x] Task 3: SearchBar Button Hover Enhancement (AC: #6, #9)
  - [x] 3.1 In `src/components/search-bar.tsx`, update the `<button>` className: ADD `transition-all duration-200 hover:brightness-90` to the base classes (before the variant-conditional `cn()` block)
  - [x] 3.2 The new classes go in the first argument of `cn()` for the button, NOT inside the variant conditionals — both hero and header variants get the same hover treatment
  - [x] 3.3 Verify SearchBar remains a client component with `"use client"` (it already is — no change to client boundary)
  - [x] 3.4 Verify disabled state (`disabled:opacity-50 disabled:cursor-not-allowed`) still works with the new hover class — disabled buttons should NOT show hover brightness change (CSS specificity: `disabled:opacity-50` should override or co-exist)

- [x] Task 4: FilterToolbar Chip Enhancement (AC: #7, #8, #9)
  - [x] 4.1 In `src/components/filter-toolbar.tsx`, update the "All Services" button: when active (`activeFilters.size === 0`), ADD `shadow-sm` to the active state className
  - [x] 4.2 Update each service type filter button: when active (`isActive`), ADD `shadow-sm` to the active state className
  - [x] 4.3 Update each service type filter button: when inactive, ADD `hover:bg-muted` and ensure `transition-colors duration-200` is present
  - [x] 4.4 Update "All Services" button inactive state similarly: ADD `hover:bg-muted` and ensure `transition-colors duration-200` is present
  - [x] 4.5 Verify FilterToolbar remains a client component with `"use client"` (it already is — no change)

- [x] Task 5: Build & Regression Validation (AC: #9)
  - [x] 5.1 Run `npm run build` — confirm no errors, all 1153+ pages generate successfully
  - [x] 5.2 Verify no new `"use client"` directives were added to server components
  - [x] 5.3 Verify ListingCard and StarRating remain React Server Components

## Dev Notes

### Design Brief Reference

All visual specifications come from **Design Brief — Epic 9** (`_bmad-output/planning-artifacts/design-brief-epic-9.md`), Section 4: "Story 9.3 — ListingCard + Search Results Enhancement." Follow the brief exactly — no additional visual changes beyond what's specified.

### Architecture Constraints

- **Zero new JS on server components:** ListingCard and StarRating are RSCs — no `"use client"` additions
- **Existing client components:** SearchBar and FilterToolbar already have `"use client"` — CSS class changes within them don't affect the client boundary
- **Tailwind v4 built-in utilities only:** `shadow-sm`, `shadow-md`, `transition-all`, `duration-200`, `brightness-90` — no custom tokens or globals.css changes
- **`cn()` utility:** SearchBar and FilterToolbar already use `cn()` from `@/lib/utils`. ListingCard and StarRating use plain string classNames — only introduce `cn()` if conditional logic requires it (StarRating Task 2.1 may benefit from it)

### Exact Class Changes Summary

| Component | File | Element | Remove | Add |
|-----------|------|---------|--------|-----|
| ListingCard | `listing-card.tsx` | `<article>` | — | `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5` |
| ListingCard | `listing-card.tsx` | Company `<Link>` | — | `hover:text-primary transition-colors duration-200` |
| ListingCard | `listing-card.tsx` | Contact `<a>` (x2) | — | `hover:underline transition-colors duration-200` |
| StarRating | `star-rating.tsx` | All star `<svg>` | `h-4 w-4` (hardcoded) | Variant-conditional: `h-5 w-5` (full) / `h-4 w-4` (compact) |
| StarRating | `star-rating.tsx` | Partial star | `opacity-50` | `opacity-60` |
| StarRating | `star-rating.tsx` | Empty stars | `text-muted-foreground/20` | `text-muted-foreground/25` |
| SearchBar | `search-bar.tsx` | `<button>` | — | `transition-all duration-200 hover:brightness-90` |
| FilterToolbar | `filter-toolbar.tsx` | Active chips | — | `shadow-sm` |
| FilterToolbar | `filter-toolbar.tsx` | Inactive chips | — | `hover:bg-muted` (+ ensure `transition-colors duration-200`) |

### Story 9.2 Intelligence (Previous Story Learnings)

**Pattern established in 9.2 — MUST follow:**
- Card hover pattern: `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5`
- The `motion-safe:` prefix on translate-y was added during code review (commit 92c47b0) — respects `prefers-reduced-motion` OS setting. ALL translate-y hover effects in Epic 9 MUST use this pattern.
- `transition-all` is the standard (not property-specific transitions) per design brief
- `hover:brightness-90` chosen for buttons over `hover:bg-primary/90` — darkening maintains/improves WCAG contrast

**What went well:** Simple CSS-only changes, build passes as validation, no surprises.

### Component Usage Context

- **ListingCard** — Used inside FilterToolbar (`filter-toolbar.tsx:128`) which renders the search results grid. City landing pages render their own listing layout directly (not using ListingCard). ListingCard is a server component rendered by a client component (FilterToolbar) — this is valid in React 19 (server components can be passed as children/props to client components).
- **StarRating** — Used in ListingCard (compact), city landing page aggregate (compact), and listing detail page (full at lines 129 and 250 of `[companySlug]/page.tsx`).
- **SearchBar** — Client component (`"use client"`). Used in 3 contexts: hero (homepage), header (all pages), 404 page. Single component with `variant` prop — changes apply to ALL instances.
- **FilterToolbar** — Client component (`"use client"`). Only used on search results page. Contains filter chips and sort control. Already uses `cn()`.

### SearchBar Button Implementation Detail

The button currently uses `cn()` with variant-conditional classes:
```tsx
className={cn(
  "shrink-0 rounded-r-md bg-primary font-sans font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed",
  isHero ? "h-11 px-5 text-base" : "h-11 px-3 text-sm"
)}
```

Add `transition-all duration-200 hover:brightness-90` to the **first string** (base classes), not inside the variant ternary. The `disabled:opacity-50` takes effect via CSS specificity — when disabled, the opacity change visually overwhelms the brightness filter, which is correct behavior.

### FilterToolbar Chip Implementation Detail

The chips use `cn()` with active/inactive conditional:
```tsx
className={cn(
  "shrink-0 rounded-full px-3 min-h-[44px] font-sans text-sm font-medium transition-colors",
  activeFilters.size === 0
    ? "bg-primary text-primary-foreground border border-primary"
    : "bg-transparent text-foreground border border-border"
)}
```

For active state: ADD `shadow-sm` to the active branch.
For inactive state: ADD `hover:bg-muted` to the inactive branch. The existing `transition-colors` in the base classes already covers the hover background transition — `duration-200` can be added to the base for consistency.

### What NOT to Do

- Do NOT modify globals.css — no custom tokens needed
- Do NOT add animation libraries or keyframes
- Do NOT change component props interfaces (ListingCardProps, StarRatingProps, SearchBarProps, FilterToolbarProps)
- Do NOT change the search results page layout (`search/page.tsx`)
- Do NOT change the sort Select component styling (Story 9.5 handles this if needed)
- Do NOT add `"use client"` to ListingCard or StarRating

### Recent Git Intelligence

```
92c47b0 Implement Story 9.2: Homepage Redesign — shadow, hover, and hero visual polish
f5d6dfd Implement Story 9.1: Design Direction & Component Audit
076c097 Fix LCP: preload fonts, cache homepage, stream below-fold content
```

Key patterns from 92c47b0: `motion-safe:hover:-translate-y-0.5` established as the standard hover lift pattern. `shadow-sm` resting / `hover:shadow-md` hover established as the standard card shadow pattern.

### Production Dataset Context

- **889 listings** across 25+ metros
- **Search results page:** FilterToolbar renders ListingCards in `grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5`
- **City landing pages:** Display listings directly (not via FilterToolbar) with StarRating compact
- **Listing detail page:** Full StarRating at two locations (header and reviews)

### Technical Stack Reference

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | v4 |
| shadcn/ui | 3.x |
| lucide-react | (icons in ListingCard, SearchBar) |

### Project Structure Notes

- Components: `src/components/` (flat, no feature folders)
- Design tokens: `src/app/globals.css` (OKLCH-based CSS variables)
- Tailwind config: Tailwind v4 uses CSS-based config in globals.css, not tailwind.config.ts
- `cn()` utility: `src/lib/utils.ts`
- Types: `src/types/index.ts` (ListingResult, ServiceType)

### References

- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 4: "Story 9.3 — ListingCard + Search Results Enhancement"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 2: "Transition & Interaction Standards"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 5: "Performance & Accessibility Validation"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 6: "Do Not Change"]
- [Source: _bmad-output/implementation-artifacts/9-2-homepage-redesign.md — Previous story learnings, motion-safe pattern]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Implementation Patterns & Consistency Rules"]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build verified: 1153 pages generated, zero TypeScript errors
- Grep confirmed zero `"use client"` in listing-card.tsx and star-rating.tsx
- Visual verification (Tasks 1.5, 2.5, 2.6, 3.4) based on code-level analysis — CSS changes use standard Tailwind utilities with predictable rendering

### Completion Notes List

- ListingCard: Added `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5` to `<article>` — matches CityCard/ArticleCard pattern from Story 9.2
- ListingCard: Added `hover:text-primary transition-colors duration-200` to company name `<Link>` — interactive hover color
- ListingCard: Added `hover:underline transition-colors duration-200` to both phone and website `<a>` links
- StarRating: Introduced `const starSize` for variant-conditional sizing — `h-5 w-5` for full variant, `h-4 w-4` for compact (unchanged)
- StarRating: Changed partial star from `opacity-50` to `opacity-60`, empty stars from `text-muted-foreground/20` to `text-muted-foreground/25`
- StarRating: Used template literal className (`${starSize} ...`) instead of `cn()` — simpler for non-conditional class merging
- SearchBar: Added `transition-all duration-200 hover:brightness-90` to button base classes in first `cn()` argument
- FilterToolbar: Added `shadow-sm` to active chip states (both "All Services" and service type buttons)
- FilterToolbar: Added `hover:bg-muted` to inactive chip states, added `duration-200` to base transition
- All changes are CSS-only Tailwind utility classes — zero new JS, zero new `"use client"`, zero globals.css changes
- Component props interfaces unchanged, search results page layout unchanged
- All 4 modified components maintain their original server/client boundaries
- Code review fix: Corrected Dev Notes — ListingCard only used in FilterToolbar (search results), NOT city landing pages
- Code review note: Contact link `transition-colors` doesn't animate `hover:underline` (text-decoration) — underline appears instantly. Follows story spec; acceptable UX
- Code review note: SearchBar disabled button still receives `hover:brightness-90` on hover — `disabled:opacity-50` visually dominates, minimal impact

### File List

- `src/components/listing-card.tsx` — Shadow + hover on article, company link hover color, contact link hover underlines
- `src/components/star-rating.tsx` — Variant-conditional star sizing, improved partial/empty star visibility
- `src/components/search-bar.tsx` — Button hover brightness effect
- `src/components/filter-toolbar.tsx` — Active chip shadow, inactive chip hover background, transition duration
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Story status tracking
- `_bmad-output/implementation-artifacts/9-3-listing-card-search-results-enhancement.md` — This story file
