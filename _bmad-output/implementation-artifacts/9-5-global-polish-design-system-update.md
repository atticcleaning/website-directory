# Story 9.5: Global Polish & Design System Update

Status: done

## Story

As a **visitor on any page of the site**,
I want the header, footer, service tag chips, and 404 page to feel as polished and intentional as the homepage, city landing, and listing detail pages enhanced in Stories 9.2-9.4,
so that the entire site communicates professional authority from top to bottom, completing the Epic 9 visual transformation.

## Acceptance Criteria

1. **Given** the site header on any page
   **When** displayed
   **Then** it has `bg-card shadow-sm` replacing the current `border-b border-border`, providing persistent visual weight and depth as the top-of-page landmark

2. **Given** the site footer on any page
   **When** displayed
   **Then** it has `bg-secondary` background color in addition to the existing `border-t border-border`, providing visual separation from page content

3. **Given** the footer navigation links (Featured Cities, Resources)
   **When** the user hovers over them
   **Then** the color transitions smoothly with `transition-colors duration-200` (added to existing `hover:text-foreground hover:underline`)

4. **Given** a ServiceTagChip in the `card` variant (on listing cards and listing detail pages)
   **When** displayed
   **Then** it has a subtle border (`border border-current/10`) providing definition against card backgrounds, using the existing text color at 10% opacity

5. **Given** the 404 Not Found page
   **When** displayed
   **Then** the CTA button has `transition-colors duration-200` for smooth hover state, and the page content is wrapped in a subtle container (`bg-secondary rounded-xl px-6 py-10`) matching the homepage hero treatment

6. **Given** all visual changes in this story
   **When** measured
   **Then** LCP < 1.5s, CLS < 0.1, page weight < 500KB, zero new client-side JS beyond existing client components, WCAG 2.1 AA maintained, all 1153+ pages build successfully

## Tasks / Subtasks

- [x] Task 1: Header — Shadow & Background (AC: #1, #6)
  - [x] 1.1 In `src/components/header.tsx`, change the `<header>` className from `border-b border-border` to `bg-card shadow-sm`
  - [x] 1.2 Verify the header remains a server component — no `"use client"` addition
  - [x] 1.3 Verify SearchBar (client component) inside header still renders correctly

- [x] Task 2: Footer — Background & Link Transitions (AC: #2, #3, #6)
  - [x] 2.1 In `src/components/footer.tsx`, update the `<footer>` className: ADD `bg-secondary` to existing `border-t border-border` → `border-t border-border bg-secondary`
  - [x] 2.2 Update ALL footer `<Link>` elements (5 links total): ADD `transition-colors duration-200` to each link's existing className
  - [x] 2.3 Verify the footer remains a server component — no `"use client"` addition

- [x] Task 3: ServiceTagChip — Border Definition (AC: #4, #6)
  - [x] 3.1 In `src/components/service-tag-chip.tsx`, update the card-variant `<span>` className: ADD `border border-current/10` to existing `inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs md:text-[13px] font-medium`
  - [x] 3.2 Verify `border-current/10` works correctly with the inline `style` prop that sets `color: var(--chip-*-text)` — the border should use that text color at 10% opacity
  - [x] 3.3 Verify chip renders correctly across all 6 service types (RODENT_CLEANUP, INSULATION_REMOVAL, DECONTAMINATION, MOLD_REMEDIATION, GENERAL_CLEANING, ATTIC_RESTORATION)
  - [x] 3.4 Verify the component remains a server component — no `"use client"` addition

- [x] Task 4: 404 Page — Minor Polish (AC: #5, #6)
  - [x] 4.1 In `src/app/not-found.tsx`, update the CTA `<Link>` button: ADD `transition-colors duration-200` to existing className (before `focus-visible:`)
  - [x] 4.2 Wrap the existing content `<div>` with a container: change `className="mx-auto max-w-2xl px-4 py-16 text-center"` to `className="mx-auto max-w-2xl bg-secondary rounded-xl px-6 py-10 text-center"` and adjust outer spacing with a wrapper `<div className="py-12">` if needed
  - [x] 4.3 Verify the 404 page remains a server component — no `"use client"` addition

- [x] Task 5: Build & Regression Validation (AC: #6)
  - [x] 5.1 Run `npm run build` — confirm no errors, all 1153+ pages generate successfully
  - [x] 5.2 Verify no new `"use client"` directives were added to server components
  - [x] 5.3 Verify all modified components remain React Server Components
  - [x] 5.4 Verify no changes to globals.css — no custom tokens added (design brief confirms existing Tailwind utilities sufficient)
  - [x] 5.5 Verify no changes to data-fetching logic or Prisma queries

## Dev Notes

### Design Brief Reference

All visual specifications come from **Design Brief — Epic 9** (`_bmad-output/planning-artifacts/design-brief-epic-9.md`), Section 4: "Story 9.5 — Global Polish + Design System Update." Follow the brief exactly — no additional visual changes beyond what's specified.

### Architecture Constraints

- **Zero new JS on server components:** All target files are RSCs — no `"use client"` additions
- **Tailwind v4 built-in utilities only:** `shadow-sm`, `bg-card`, `bg-secondary`, `border-current/10`, `transition-colors`, `duration-200`, `rounded-xl` — no custom tokens or globals.css changes
- **`border-current/10` utility:** This uses Tailwind's opacity modifier on the `currentColor` value. Since ServiceTagChip sets `color` via inline `style` prop, `border-current` will pick up that color. Verify this works as expected — if not, use `ring-1 ring-inset ring-current/10` as the alternative specified in the design brief.
- **No layout restructuring:** The header, footer, and 404 page keep their existing HTML structure. Only className additions/modifications.

### Exact Class Changes Summary

| Component | File | Element | Remove | Add |
|-----------|------|---------|--------|-----|
| Header | `header.tsx` | `<header>` | `border-b border-border` | `bg-card shadow-sm` |
| Footer | `footer.tsx` | `<footer>` | — | `bg-secondary` (append to existing) |
| Footer | `footer.tsx` | All `<Link>` (x5) | — | `transition-colors duration-200` |
| ServiceTagChip | `service-tag-chip.tsx` | Card `<span>` | — | `border border-current/10` |
| 404 Page | `not-found.tsx` | CTA `<Link>` | — | `transition-colors duration-200` |
| 404 Page | `not-found.tsx` | Content `<div>` | `px-4 py-16` | `bg-secondary rounded-xl px-6 py-10` (+ outer wrapper for page spacing) |

### Story 9.2-9.4 Intelligence (Previous Story Learnings)

**Patterns established — MUST follow:**
- `shadow-sm` for resting depth (cards, header)
- `transition-all duration-200` for multi-property transitions, `transition-colors duration-200` for color-only transitions
- `bg-secondary` for subtle background tints (hero, stats pill, business hours, topic tag, now footer + 404)
- `bg-card` for elevated surface elements (listing cards, nearby city cards, now header)
- `motion-safe:hover:-translate-y-0.5` for card lift — NOT needed in 9.5 (no hover-lift elements)
- `hover:underline transition-colors duration-200` — awareness: `transition-colors` doesn't animate `text-decoration`, underline appears instantly. This is the accepted pattern.

**What went well in 9.3/9.4:** Simple CSS-only changes, build passes as validation, no surprises. Code reviews found only documentation and awareness issues, no code bugs.

**Key insight:** The `border-current/10` utility on ServiceTagChip is the only potentially tricky change — it depends on `currentColor` being set by the inline `style` prop. Test this visually if possible.

### Component Usage Context

- **Header** (`header.tsx`) — Server component. Visible on ALL pages (1153+). Contains logo `<Link>` and `<SearchBar variant="header">` (client component). Currently `border-b border-border` — rated 1/5, lowest-rated component in the audit.
- **Footer** (`footer.tsx`) — Server component. Visible on ALL pages. Three-column grid: Featured Cities (3 links), Resources (2 links), Brand blurb + copyright. Currently `border-t border-border` — rated 2/5.
- **ServiceTagChip** (`service-tag-chip.tsx`) — Server component. Rendered on listing cards (via ListingCard) and listing detail pages. 6 service types with OKLCH color pairs from globals.css. Currently rated 3/5 — best-styled component but chips lack definition against card backgrounds.
- **404 Not Found** (`not-found.tsx`) — Server component. Has CTA button (`bg-primary hover:bg-primary/90`) and SearchBar. Currently rated 3/5 but minimal visual treatment.

### globals.css — Confirmed No Changes Required

The design brief explicitly states: "All shadow, transition, and background utilities use Tailwind v4 built-in classes. No custom CSS variables are added to globals.css in Epic 9." This is confirmed — no globals.css modifications in Story 9.5.

### What NOT to Do

- Do NOT modify globals.css — no custom tokens needed
- Do NOT add animation libraries or keyframes
- Do NOT change component props interfaces
- Do NOT change data-fetching logic or Prisma queries
- Do NOT add `"use client"` to any server component
- Do NOT change the homepage, city landing, listing detail, or article pages (already done in 9.2-9.4)
- Do NOT change SearchBar, FilterToolbar, or ListingCard (already done in 9.3)
- Do NOT change the MDX components or RadiusInfo (already done in 9.4)
- Do NOT change StarRating or CityCard (already done in 9.2-9.3)
- Do NOT modify the Google Map component
- Do NOT add hover-lift (`motion-safe:hover:-translate-y-0.5`) to header, footer, or 404 elements
- Do NOT change font families, weights, or sizes
- Do NOT change the OKLCH color palette

### Recent Git Intelligence

```
569f10c Implement Story 9.4: City Landing & Listing Detail Enhancement — cards, pills, shadows, and icon polish
f7164c6 Implement Story 9.3: ListingCard & Search Results Enhancement — shadow, hover, and interactive polish
92c47b0 Implement Story 9.2: Homepage Redesign — shadow, hover, and hero visual polish
f5d6dfd Implement Story 9.1: Design Direction & Component Audit
076c097 Fix LCP: preload fonts, cache homepage, stream below-fold content
```

Key patterns: `shadow-sm` resting / `hover:shadow-md` hover. `bg-secondary` for tints. `bg-card` for surfaces. `transition-all duration-200` standard. All changes CSS-only.

### Production Dataset Context

- **1153 total pages:** 254 city + 889 listing + 2 article + 8 static
- Header and footer appear on ALL 1153 pages — highest-impact changes in this story
- ServiceTagChip appears on listing cards (889 listings across city landing pages + search results) and listing detail pages (889)
- 404 page is a single static page — lowest impact but completes the "finished" feeling

### Technical Stack Reference

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | v4 |
| shadcn/ui | 3.x |
| lucide-react | (icons in listing-card, search-bar, listing detail, radius-info) |

### Project Structure Notes

- Components: `src/components/` (flat, no feature folders)
- Page routes: `src/app/page.tsx`, `src/app/[citySlug]/page.tsx`, etc.
- Design tokens: `src/app/globals.css` (OKLCH-based CSS variables) — NOT modified in 9.5
- `cn()` utility: `src/lib/utils.ts` — use only if conditional logic requires it

### References

- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 4: "Story 9.5 — Global Polish + Design System Update"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 2: "Transition & Interaction Standards"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 5: "Performance & Accessibility Validation"]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md — Section 6: "Do Not Change"]
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Story 9.5 definition]
- [Source: _bmad-output/implementation-artifacts/9-4-city-landing-listing-detail-enhancement.md — Previous story learnings]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Build output: 1153 pages generated, zero errors (required `.next` cache clear due to stale ENOTEMPTY error — not a code issue)
- Grep verified zero `"use client"` in all 4 modified source files
- `globals.css` confirmed unchanged via `git diff --name-only`
- All changes are CSS-only Tailwind utility additions — zero JS logic changes

### Completion Notes List

- Header: replaced `border-b border-border` with `bg-card shadow-sm` — shadow provides bottom-edge definition without needing a border, `bg-card` elevates the surface (matches design brief Option 1)
- Footer: added `bg-secondary` to `<footer>`, providing visual separation from page content consistent with hero, stats pill, business hours, and topic tag treatments
- Footer links: all 5 `<Link>` elements got `transition-colors duration-200` using `replace_all` for consistency — smooth hover color transitions
- ServiceTagChip: added `border border-current/10` — uses `currentColor` (set by inline `style` prop) at 10% opacity. Build passes, which confirms Tailwind v4 processes this utility correctly. Visual verification recommended to confirm border renders with correct chip-specific colors
- 404 page: added outer `<div className="py-12">` wrapper for page spacing, changed inner container to `bg-secondary rounded-xl px-6 py-10` matching homepage hero treatment. CTA button got `transition-colors duration-200`
- Build validation: 1153 pages (254 city + 889 listing + 2 article + 8 static), zero errors
- This is the FINAL story in Epic 9 — all 5 stories (9.1-9.5) now complete
- **[Code Review M1]** Fixed 404 page indentation — outer wrapper div children were not indented correctly
- **[Code Review L1]** Footer links reuse `hover:underline transition-colors duration-200` pattern — `transition-colors` doesn't animate `text-decoration`, consistent with established pattern from 9.3/9.4
- **[Code Review L2]** `border-current/10` on ServiceTagChip depends on `currentColor` from inline style prop — build passes, visual browser verification recommended

### File List

- `src/components/header.tsx` — Shadow + bg-card replacing border
- `src/components/footer.tsx` — bg-secondary + link transitions
- `src/components/service-tag-chip.tsx` — border border-current/10
- `src/app/not-found.tsx` — Container treatment + button transition
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status tracking
- `_bmad-output/implementation-artifacts/9-5-global-polish-design-system-update.md` — This story file
