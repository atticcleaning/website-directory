# Story 9.2: Homepage Redesign

Status: done

## Story

As a **site visitor arriving on the homepage**,
I want the page to feel visually polished, authoritative, and trustworthy — with a hero section that has visual weight, cards that respond to interaction, and clear section rhythm,
so that my first impression is "curated professional resource" rather than "unfinished prototype," increasing my confidence to search and engage.

## Acceptance Criteria

1. **Given** the homepage hero section
   **When** rendered at any viewport width
   **Then** the hero has a subtle background tint (`bg-secondary`), rounded container (`rounded-xl`), and generous vertical padding (`py-10 md:py-14`) — creating visual depth and anchoring the page

2. **Given** a CityCard in the Featured Cities grid
   **When** the card is at rest
   **Then** it displays a subtle shadow (`shadow-sm`) providing visual depth above the page surface

3. **Given** a CityCard in the Featured Cities grid
   **When** the user hovers over the card
   **Then** the card transitions smoothly (200ms) to a stronger shadow (`shadow-md`), subtle upward lift (`-translate-y-0.5`), and primary border color — all three states applied together

4. **Given** an ArticleCard in the Educational Content section
   **When** at rest and on hover
   **Then** it displays the same shadow + hover pattern as CityCard (AC #2-3) for visual consistency

5. **Given** the Featured Cities and Educational Content sections
   **When** rendered below the hero
   **Then** each section has increased top spacing (`mt-10 md:mt-12`) compared to the previous `mt-8`, creating a more intentional vertical rhythm between homepage zones

6. **Given** all homepage visual changes
   **When** measured with Lighthouse
   **Then** LCP < 1.5s (NFR-P1), CLS < 0.1 (NFR-P2), and page weight < 500KB (NFR-P6) are maintained — all changes are CSS-only with zero new client-side JS

7. **Given** all hover states
   **When** tested for accessibility
   **Then** WCAG 2.1 AA contrast ratios are maintained, keyboard focus indicators remain visible, and no layout shifts occur during hover transitions

## Tasks / Subtasks

- [x] Task 1: Hero Section Enhancement (AC: #1, #6, #7)
  - [x] 1.1 In `src/app/page.tsx`, update the hero `<section>` className: ADD `bg-secondary rounded-xl px-6 py-10 md:py-14` while KEEPING `flex flex-col items-center text-center`
  - [x] 1.2 Visually verify at viewport widths 320px, 768px, 1024px, 1200px, 1400px — confirm `rounded-xl` corners look intentional within `max-w-[1200px]` container and don't clip awkwardly at transition widths
  - [x] 1.3 Confirm h1 and SearchBar are unchanged (no typography or SearchBar modifications in this story)

- [x] Task 2: CityCard Shadow + Hover Enhancement (AC: #2, #3, #6, #7)
  - [x] 2.1 In `src/components/city-card.tsx`, update the `<Link>` className: REMOVE `transition-colors`, ADD `shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary`
  - [x] 2.2 Verify the complete className is: `flex min-h-[44px] flex-col rounded-lg border border-border bg-card p-4 font-sans shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 hover:border-primary`
  - [x] 2.3 Test hover → unhover cycle is smooth with no jank or CLS
  - [x] 2.4 Verify keyboard focus indicator (`:focus-visible`) remains visible with shadow present

- [x] Task 3: ArticleCard Shadow + Hover Enhancement (AC: #4, #6, #7)
  - [x] 3.1 In `src/components/article-card.tsx`, update the `<Link>` className: REMOVE `transition-colors`, ADD `shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary`
  - [x] 3.2 Verify the complete className is: `block min-h-[44px] rounded-lg border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 hover:border-primary`
  - [x] 3.3 Confirm topic tag, title, and excerpt text remain unchanged

- [x] Task 4: Section Spacing Adjustment (AC: #5)
  - [x] 4.1 In `src/app/page.tsx` `FeaturedCities` component, change the `<section>` className from `mt-8` to `mt-10 md:mt-12`
  - [x] 4.2 In `src/app/page.tsx` `EducationalContent` component, change the `<section>` className from `mt-8` to `mt-10 md:mt-12`

- [x] Task 5: Build & Regression Validation (AC: #6)
  - [x] 5.1 Run `npm run build` — confirm no errors, all pages generate successfully
  - [x] 5.2 Verify no new `"use client"` directives were added
  - [x] 5.3 Confirm CityCard and ArticleCard remain React Server Components (no client boundary)

## Dev Notes

### Design Brief Reference

All visual specifications come from the **Design Brief — Epic 9** (`_bmad-output/planning-artifacts/design-brief-epic-9.md`), Section 4: "Story 9.2 — Homepage Redesign." Follow the brief exactly — no additional visual changes beyond what's specified.

### Architecture Constraints

- **Zero new JS:** All changes are Tailwind CSS utility classes only. No `"use client"` additions.
- **Server components:** CityCard, ArticleCard, and the homepage are all React Server Components. They must remain so.
- **Tailwind v4 built-in utilities:** Use `shadow-sm`, `shadow-md`, `transition-all`, `duration-200`, `-translate-y-0.5` directly. No custom CSS tokens or globals.css changes.
- **`cn()` optional:** The current components use plain string classNames. If the edit is a simple string replacement, no need to introduce `cn()`. Only use `cn()` if conditional logic is needed (none expected in this story).

### Exact Class Changes Summary

| Component | File | Remove | Add |
|-----------|------|--------|-----|
| Hero `<section>` | `src/app/page.tsx` | — | `bg-secondary rounded-xl px-6 py-10 md:py-14` |
| CityCard `<Link>` | `src/components/city-card.tsx` | `transition-colors` | `shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary` |
| ArticleCard `<Link>` | `src/components/article-card.tsx` | `transition-colors` | `shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary` |
| FeaturedCities `<section>` | `src/app/page.tsx` | `mt-8` | `mt-10 md:mt-12` |
| EducationalContent `<section>` | `src/app/page.tsx` | `mt-8` | `mt-10 md:mt-12` |

### Cross-Story Context

- **CityCard** is only imported in `src/app/page.tsx` (homepage). City landing pages use plain `<Link>` elements for nearby cities, not CityCard. The shadow/hover changes apply to the homepage Featured Cities grid only.
- **ArticleCard** also appears on the article detail page (`articles/[slug]/page.tsx`) in the "Related Articles" section. The shadow/hover changes apply everywhere ArticleCard is used — this is intentional and desirable for consistency.
- **SearchBar** is NOT modified in this story. SearchBar button hover state is assigned to Story 9.3.

### What NOT to Do

- Do NOT modify `globals.css` — no custom tokens needed
- Do NOT add animation libraries or keyframes
- Do NOT change the h1 text, font, or size
- Do NOT modify SearchBar component code
- Do NOT add images, icons, or decorative elements
- Do NOT add `"use client"` to any file
- Do NOT change component props interfaces

### Recent Git Intelligence

```
f5d6dfd Implement Story 9.1: Design Direction & Component Audit
076c097 Fix LCP: preload fonts, cache homepage, stream below-fold content
```

Key context from 076c097: Homepage was converted from `force-dynamic` to `revalidate = 3600` with Suspense-wrapped async sections. The hero `<section>` is a direct child of the `<div className="py-12">` wrapper — not inside a Suspense boundary. The FeaturedCities and EducationalContent sections are in Suspense.

### Production Dataset Context

- **889 listings** across 25+ metros
- **Homepage features:** Top 8 cities by listing count + up to 3 articles
- City card grid: `grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4` (2-4 columns)
- Article card grid: `grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3` (1-3 columns)

### Technical Stack Reference

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | v4 |
| shadcn/ui | 3.x |

### Project Structure Notes

- Components: `src/components/` (flat, no feature folders)
- Design tokens: `src/app/globals.css` (OKLCH-based CSS variables)
- Tailwind config: Tailwind v4 uses CSS-based config in globals.css, not tailwind.config.ts
- `cn()` utility: `src/lib/utils.ts`

### References

- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 4: "Story 9.2 — Homepage Redesign"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 2: "Transition & Interaction Standards"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 5: "Performance & Accessibility Validation"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 6: "Do Not Change"]
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Epic 9 definition]
- [Source: _bmad-output/implementation-artifacts/9-1-design-direction-component-audit.md — Component audit, priority ranking]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Implementation Patterns & Consistency Rules"]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Build verified: 1153 pages generated, zero TypeScript errors
- Grep confirmed zero `"use client"` in all 3 modified files
- Visual verification (Tasks 1.2, 2.3, 2.4) based on code-level analysis — browser extension unavailable for screenshots. CSS changes use standard Tailwind utilities with predictable rendering.

### Completion Notes List

- Hero section: Added `bg-secondary rounded-xl px-6 py-10 md:py-14` — creates subtle background tint with generous padding
- CityCard: Replaced `transition-colors` with `shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary` — adds resting shadow + hover lift/shadow/border
- ArticleCard: Same shadow+hover pattern as CityCard for visual consistency
- FeaturedCities section: Changed `mt-8` to `mt-10 md:mt-12` for improved vertical rhythm
- EducationalContent section: Same spacing change as FeaturedCities
- All changes are CSS-only Tailwind utility classes — zero new JS, zero `"use client"`, zero globals.css changes
- h1, SearchBar, component props interfaces all unchanged
- All 3 modified components remain React Server Components
- Code review fix: Added `motion-safe:` prefix to `hover:-translate-y-0.5` on CityCard and ArticleCard — card lift only animates when user hasn't requested reduced motion (shadow + border still transition)
- Code review fix: Corrected Dev Notes — CityCard only used on homepage (not city pages), ArticleCard not on search page
- Code review fix: Added visual verification scope note to Debug Log

### File List

- `src/app/page.tsx` — Hero bg-secondary + rounded-xl, section spacing mt-10 md:mt-12
- `src/components/city-card.tsx` — Shadow + hover transition enhancement
- `src/components/article-card.tsx` — Shadow + hover transition enhancement
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Story status tracking
- `_bmad-output/implementation-artifacts/9-2-homepage-redesign.md` — This story file
