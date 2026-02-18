# Story 9.4: City Landing & Listing Detail Enhancement

Status: done

## Story

As a **user browsing a city landing page, listing detail page, or article**,
I want each page to feel visually consistent and polished — with styled nearby-city links, subtle review card depth, readable business hours, and clear content-to-directory CTAs,
so that the entire site feels like a cohesive professional resource regardless of which page I land on, increasing my trust and engagement.

## Acceptance Criteria

1. **Given** the Nearby Cities section on a city landing page
   **When** displayed
   **Then** nearby cities render as a responsive grid (`grid-cols-1 sm:grid-cols-2`) of styled link items with `rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary`, replacing the current plain `<ul>` list

2. **Given** the aggregated stats section on a city landing page
   **When** displayed below the h1
   **Then** the stats ("N companies · X.X avg") are wrapped in a subtle pill container (`bg-secondary rounded-lg px-3 py-2 inline-flex`)

3. **Given** the contact links (phone, website) on the listing detail page
   **When** the user hovers over them
   **Then** an underline appears with a smooth 200ms transition (`hover:underline transition-colors duration-200`)

4. **Given** a review card on the listing detail page
   **When** displayed
   **Then** it has a subtle shadow (`shadow-sm`) providing visual depth consistent with other cards in the system

5. **Given** the business hours section on the listing detail page
   **When** displayed
   **Then** the `<dl>` is wrapped in a subtle container (`rounded-lg bg-secondary p-4`) providing visual grouping

6. **Given** the city back-link at the bottom of the listing detail page
   **When** the user hovers over it
   **Then** the text transitions to `text-primary` with a smooth 200ms color transition (`hover:text-primary transition-colors duration-200`)

7. **Given** the topic tag on the article detail page
   **When** displayed
   **Then** it renders as a subtle pill (`bg-secondary rounded-full px-2.5 py-0.5 inline-flex items-center`) rather than plain text

8. **Given** the Related Articles section on the article detail page
   **When** displayed
   **Then** it has increased top spacing (`mt-10 md:mt-12`) consistent with the homepage section spacing from Story 9.2

9. **Given** the FindPros CTA component inside MDX articles
   **When** displayed
   **Then** the link uses primary-colored semibold sans-serif styling (`inline-flex items-center gap-1 font-sans text-sm font-semibold text-primary hover:underline transition-colors duration-200`) with vertical breathing room (`mt-4 mb-4` on wrapper), visually distinguished from surrounding serif body text

10. **Given** the CityStats component inside MDX articles
    **When** displayed
    **Then** the text uses sans-serif font (`font-sans text-sm font-medium`) to signal "data" vs surrounding "prose" content

11. **Given** the RadiusInfo component on the search results page
    **When** displayed
    **Then** it shows an info icon (`Info` from lucide-react, `h-4 w-4`) inline before the text for visual anchor

12. **Given** all visual changes in this story
    **When** measured
    **Then** LCP < 1.5s, CLS < 0.1, page weight < 500KB, zero new client-side JS beyond existing client components, WCAG 2.1 AA maintained

## Tasks / Subtasks

- [x] Task 1: City Landing Page — Nearby Cities Grid (AC: #1, #12)
  - [x] 1.1 In `src/app/[citySlug]/page.tsx`, change the Nearby Cities container from `<ul className="mt-3 space-y-2">` to `<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">`
  - [x] 1.2 Change each nearby city from `<li><Link>` to just `<Link>` with className: `flex min-h-[44px] items-center rounded-lg border border-border bg-card px-4 py-3 font-sans text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary`
  - [x] 1.3 Remove the wrapping `<li>` elements entirely (the grid container replaces the list semantics)
  - [x] 1.4 Verify the `hover:underline` is REMOVED from nearby city links (replaced by card-style hover:shadow-md + hover:border-primary)
  - [x] 1.5 Verify page remains a server component — no `"use client"` addition

- [x] Task 2: City Landing Page — Stats Pill (AC: #2, #12)
  - [x] 2.1 In `src/app/[citySlug]/page.tsx`, wrap the stats `<div>` (that contains company count + StarRating avg) with additional classes: change `className="mt-2 flex items-center gap-2"` to `className="mt-2 inline-flex items-center gap-2 bg-secondary rounded-lg px-3 py-2"`
  - [x] 2.2 Verify the stats pill renders correctly at different data states (1 company, many companies, 0 reviews)
  - [x] 2.3 Verify StarRating compact variant inside the pill renders unchanged at h-4 w-4

- [x] Task 3: Listing Detail Page — Contact Links + Review Cards + Business Hours + Back-Link (AC: #3, #4, #5, #6, #12)
  - [x] 3.1 In `src/app/[citySlug]/[companySlug]/page.tsx`, update both contact `<a>` links (phone + website): ADD `hover:underline transition-colors duration-200` to their classNames
  - [x] 3.2 Update each review card `<div>`: ADD `shadow-sm` to the existing `className="rounded-lg border border-border bg-card p-3 md:p-4"`
  - [x] 3.3 Wrap the business hours `<dl>` (and the string fallback `<p>`) in a container `<div className="mt-3 rounded-lg bg-secondary p-4">`. Move the `mt-3` from the `<dl>` / `<p>` to this new wrapper, and remove `mt-3` from the inner elements
  - [x] 3.4 Update the city back-link `<Link>`: ADD `hover:text-primary transition-colors duration-200`
  - [x] 3.5 Verify the page remains a server component — no `"use client"` addition

- [x] Task 4: Article Detail Page — Topic Tag Pill + Section Spacing (AC: #7, #8, #12)
  - [x] 4.1 In `src/app/articles/[slug]/page.tsx`, update the topic tag `<span>`: ADD `bg-secondary rounded-full px-2.5 py-0.5 inline-flex items-center` to the existing className
  - [x] 4.2 Update the Related Articles `<section>`: change `className="mt-8"` to `className="mt-10 md:mt-12"` (consistent with homepage section spacing from Story 9.2)
  - [x] 4.3 Verify the page remains a server component — no `"use client"` addition

- [x] Task 5: MDX FindPros CTA Enhancement (AC: #9, #12)
  - [x] 5.1 In `src/components/mdx/find-pros.tsx`, update the `<p>` wrapper: ADD `className="mt-4 mb-4"`
  - [x] 5.2 Update the `<Link>`: ADD `className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-primary hover:underline transition-colors duration-200"`
  - [x] 5.3 Verify FindPros remains a server component — no `"use client"` addition

- [x] Task 6: MDX CityStats Enhancement (AC: #10, #12)
  - [x] 6.1 In `src/components/mdx/city-stats.tsx`, update the `<span>`: ADD `className="font-sans text-sm font-medium"` to signal data vs prose
  - [x] 6.2 Verify CityStats remains a server component (already async RSC with prisma query)

- [x] Task 7: RadiusInfo Icon Enhancement (AC: #11, #12)
  - [x] 7.1 In `src/components/radius-info.tsx`, import `Info` icon from `lucide-react`
  - [x] 7.2 Add `<Info className="h-4 w-4 shrink-0" aria-hidden="true" />` before the text inside the `<p>` element
  - [x] 7.3 Change the `<p>` to use `inline-flex items-center gap-1.5` to align the icon with text
  - [x] 7.4 Verify RadiusInfo remains a server component — no `"use client"` addition

- [x] Task 8: Build & Regression Validation (AC: #12)
  - [x] 8.1 Run `npm run build` — confirm no errors, all 1153+ pages generate successfully
  - [x] 8.2 Verify no new `"use client"` directives were added to server components
  - [x] 8.3 Verify all modified components remain React Server Components
  - [x] 8.4 Verify no changes to globals.css, component props interfaces, or data-fetching logic

## Dev Notes

### Design Brief Reference

All visual specifications come from **Design Brief — Epic 9** (`_bmad-output/planning-artifacts/design-brief-epic-9.md`), Section 4: "Story 9.4 — City Landing + Listing Detail Enhancement." Follow the brief exactly — no additional visual changes beyond what's specified.

### Architecture Constraints

- **Zero new JS on server components:** All page files and MDX components are RSCs — no `"use client"` additions
- **Tailwind v4 built-in utilities only:** `shadow-sm`, `bg-secondary`, `rounded-lg`, `transition-all`, `duration-200` — no custom tokens or globals.css changes
- **`cn()` utility:** Only introduce if conditional logic requires it. Most changes are simple string concatenation or class additions.
- **lucide-react import:** RadiusInfo will add `Info` icon — lucide-react is already a project dependency (used in listing-card.tsx, search-bar.tsx, listing detail page)

### Exact Class Changes Summary

| Component | File | Element | Remove | Add |
|-----------|------|---------|--------|-----|
| City Landing | `[citySlug]/page.tsx` | Nearby cities container | `<ul className="mt-3 space-y-2">` | `<div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">` |
| City Landing | `[citySlug]/page.tsx` | Each nearby city | `<li><Link ... hover:underline>` | `<Link ... rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary>` |
| City Landing | `[citySlug]/page.tsx` | Stats container | `mt-2 flex items-center gap-2` | `mt-2 inline-flex items-center gap-2 bg-secondary rounded-lg px-3 py-2` |
| Listing Detail | `[companySlug]/page.tsx` | Contact `<a>` (x2) | — | `hover:underline transition-colors duration-200` |
| Listing Detail | `[companySlug]/page.tsx` | Review cards `<div>` | — | `shadow-sm` |
| Listing Detail | `[companySlug]/page.tsx` | Business hours wrapper | none (new `<div>`) | `mt-3 rounded-lg bg-secondary p-4` (wrap `<dl>` and string `<p>`) |
| Listing Detail | `[companySlug]/page.tsx` | City back-link `<Link>` | — | `hover:text-primary transition-colors duration-200` |
| Article Detail | `articles/[slug]/page.tsx` | Topic tag `<span>` | — | `bg-secondary rounded-full px-2.5 py-0.5 inline-flex items-center` |
| Article Detail | `articles/[slug]/page.tsx` | Related articles `<section>` | `mt-8` | `mt-10 md:mt-12` |
| MDX FindPros | `mdx/find-pros.tsx` | `<p>` wrapper | — | `mt-4 mb-4` |
| MDX FindPros | `mdx/find-pros.tsx` | `<Link>` | — | `inline-flex items-center gap-1 font-sans text-sm font-semibold text-primary hover:underline transition-colors duration-200` |
| MDX CityStats | `mdx/city-stats.tsx` | `<span>` | — | `font-sans text-sm font-medium` |
| RadiusInfo | `radius-info.tsx` | `<p>` | `<p>` only | `<p>` → `<p className="... inline-flex items-center gap-1.5">` + `<Info>` icon |

### Story 9.2/9.3 Intelligence (Previous Story Learnings)

**Patterns established in 9.2 + 9.3 — MUST follow:**
- Card hover pattern: `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 hover:border-primary`
- The `motion-safe:` prefix on translate-y was added during 9.2 code review (commit 92c47b0) — respects `prefers-reduced-motion` OS setting
- **Important for 9.4:** The nearby cities cards get `hover:shadow-md hover:border-primary` but do NOT need `motion-safe:hover:-translate-y-0.5` per the design brief — the brief only specifies shadow+border for these smaller link items, not the lift effect
- `hover:brightness-90` established for buttons (9.3) — not needed in 9.4
- `hover:underline transition-colors duration-200` established for contact links (9.3) — reuse exact same pattern on listing detail contact links
- `hover:text-primary transition-colors duration-200` — reuse for city back-link
- All changes are CSS-only Tailwind utilities — zero new JS

**What went well in 9.3:** Simple CSS-only changes, build passes as validation, no surprises. Code review found only a Dev Notes factual error (not a code issue).

### Component Usage Context

- **City Landing Page** (`[citySlug]/page.tsx`) — 254 city pages. Server component with Prisma queries. Contains FilterToolbar (client component) for listing results. Nearby cities section currently plain `<ul>` with `<li><Link>` elements.
- **Listing Detail Page** (`[companySlug]/page.tsx`) — 889 listing pages. Server component. Contains contact links, review cards, business hours `<dl>`, and city back-link. StarRating already uses `variant="full"` (enhanced in Story 9.3). Google Map component is separate (not modified).
- **Article Detail Page** (`articles/[slug]/page.tsx`) — 2 articles currently. Server component. Topic tag is plain `<span>`, related articles uses ArticleCard (already enhanced in 9.2). Content rendered via MDX `<article className="prose">`.
- **MDX FindPros** (`mdx/find-pros.tsx`) — Server component. Used inside MDX articles as `<FindPros service="attic cleaning" />`. Currently renders as plain `<p><Link>` — completely unstyled.
- **MDX CityStats** (`mdx/city-stats.tsx`) — Async server component with Prisma query. Used inside MDX articles as `<CityStats city="phoenix-az" />`. Currently renders as plain `<span>`.
- **RadiusInfo** (`radius-info.tsx`) — Server component. Used on search results page. Currently plain `<p>` with no icon or visual anchor.

### Listing Detail — Business Hours Implementation Detail

The business hours section has two rendering paths:
1. **Structured array** → `<dl className="mt-3 space-y-1">` with `<div>` + `<dt>` + `<dd>` per day
2. **Plain string** → `<p className="mt-3 font-sans text-sm text-foreground whitespace-pre-line">`

Both need to be wrapped in the new `<div className="mt-3 rounded-lg bg-secondary p-4">` container. When wrapping:
- Remove `mt-3` from the inner `<dl>` (becomes `<dl className="space-y-1">`)
- Remove `mt-3` from the inner `<p>`
- The wrapper `<div>` provides the `mt-3` gap instead

### Nearby Cities — Semantic HTML Note

Changing from `<ul><li>` to `<div><Link>` removes list semantics. The nearby cities section heading (`<h2>Nearby Cities</h2>`) provides context. The links are navigational, and the grid layout with card-style items is a valid pattern (CityCard on the homepage uses `<Link>` without list semantics). No ARIA additions needed — the section heading provides the landmark.

### What NOT to Do

- Do NOT modify globals.css — no custom tokens needed
- Do NOT add animation libraries or keyframes
- Do NOT change component props interfaces
- Do NOT change search results page layout (`search/page.tsx`)
- Do NOT change FilterToolbar, SearchBar, or ListingCard (already done in 9.3)
- Do NOT add `"use client"` to any server component
- Do NOT change data-fetching logic or Prisma queries
- Do NOT change the Google Map component
- Do NOT modify the prose/MDX rendering pipeline
- Do NOT change the h1 text, font, or size on any page

### Recent Git Intelligence

```
f7164c6 Implement Story 9.3: ListingCard & Search Results Enhancement — shadow, hover, and interactive polish
92c47b0 Implement Story 9.2: Homepage Redesign — shadow, hover, and hero visual polish
f5d6dfd Implement Story 9.1: Design Direction & Component Audit
076c097 Fix LCP: preload fonts, cache homepage, stream below-fold content
```

Key patterns: `shadow-sm` resting / `hover:shadow-md` hover. `motion-safe:hover:-translate-y-0.5` for card lift. `bg-secondary` for subtle background tints. `transition-all duration-200` as standard transition.

### Production Dataset Context

- **254 city pages** with 889 total listings
- **Listing detail pages:** 889 pages with variable data (some have reviews, some don't; some have business hours, some don't; some have phone/website, some don't)
- **Article pages:** 2 articles with MDX content, FindPros and CityStats components used within them
- **Search results page:** RadiusInfo appears when user searches (radius expansion info)

### Technical Stack Reference

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | v4 |
| shadcn/ui | 3.x |
| lucide-react | (icons in listing-card, search-bar, listing detail, now radius-info) |

### Project Structure Notes

- Components: `src/components/` (flat, no feature folders)
- MDX components: `src/components/mdx/` (find-pros.tsx, city-stats.tsx)
- Page routes: `src/app/[citySlug]/page.tsx`, `src/app/[citySlug]/[companySlug]/page.tsx`, `src/app/articles/[slug]/page.tsx`
- Design tokens: `src/app/globals.css` (OKLCH-based CSS variables)
- `cn()` utility: `src/lib/utils.ts`

### References

- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 4: "Story 9.4 — City Landing + Listing Detail Enhancement"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 2: "Transition & Interaction Standards"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 5: "Performance & Accessibility Validation"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 6: "Do Not Change"]
- [Source: _bmad-output/implementation-artifacts/9-3-listing-card-search-results-enhancement.md — Previous story learnings]
- [Source: _bmad-output/implementation-artifacts/9-2-homepage-redesign.md — motion-safe pattern, bg-secondary usage]
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Story 9.4 definition]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Build output: 1153 pages generated, zero errors
- Grep verified no `"use client"` in any of the 7 modified files
- All changes are CSS-only Tailwind utility additions — zero JS logic changes

### Completion Notes List

- All 7 source files modified with CSS-only Tailwind class additions
- Nearby cities section converted from `<ul><li><Link>` to `<div><Link>` grid with card-style hover (shadow-md + border-primary)
- Stats pill uses `bg-secondary rounded-lg` consistent with business hours and topic tag containers
- Business hours wrapper required careful handling of two rendering paths (structured `<dl>` and plain string `<p>`) — both wrapped in same container, `mt-3` moved to wrapper
- Contact link hover pattern (`hover:underline transition-colors duration-200`) reuses exact same pattern established in Story 9.3 listing-card.tsx
- RadiusInfo imports `Info` from lucide-react (already a project dependency) — uses `aria-hidden="true"` and `shrink-0` for proper accessibility and layout
- Same `transition-colors` / `hover:underline` awareness note from Story 9.3 code review applies to listing detail contact links — `text-decoration` isn't a color property so `transition-colors` won't animate the underline appearance, but this matches the established pattern
- No `motion-safe:hover:-translate-y-0.5` on nearby city cards — per design brief, only shadow+border hover for these smaller link items
- Build validation: 1153 pages (254 city + 889 listing + 2 article + 8 static), zero errors
- **[Code Review L1]** FindPros Link has `inline-flex items-center gap-1` with single text child — no-op classes, follows AC spec verbatim, harmless
- **[Code Review L2]** Listing detail contact links reuse `hover:underline transition-colors duration-200` pattern from 9.3 — `transition-colors` doesn't animate `text-decoration`, underline appears instantly. Consistent with established pattern.

### File List

- `src/app/[citySlug]/page.tsx` — Nearby cities grid + stats pill
- `src/app/[citySlug]/[companySlug]/page.tsx` — Contact hover, review shadow, business hours wrapper, back-link hover
- `src/app/articles/[slug]/page.tsx` — Topic tag pill, related articles spacing
- `src/components/mdx/find-pros.tsx` — CTA styling with primary color + spacing
- `src/components/mdx/city-stats.tsx` — Sans-serif font for data display
- `src/components/radius-info.tsx` — Info icon + inline-flex layout
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status tracking (9-4 → review/done)
- `_bmad-output/implementation-artifacts/9-4-city-landing-listing-detail-enhancement.md` — This story file
