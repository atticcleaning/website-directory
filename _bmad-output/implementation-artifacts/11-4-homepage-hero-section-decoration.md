# Story 11.4: Homepage Hero & Section Decoration

Status: done

## Story

As a **visitor landing on the AtticCleaning.com homepage**,
I want the hero section to feel polished with atmospheric depth and clear section rhythm,
so that my first impression conveys professionalism and trust, increasing my confidence in the directory's quality.

## Acceptance Criteria (BDD)

1. **Given** the homepage hero section
   **When** rendered
   **Then** it contains two blurred decorative circles creating an "Aurora background" effect — one using `bg-primary/[0.06]` positioned top-right, one using `bg-accent/[0.07]` positioned bottom-left.

2. **Given** the decorative blurred circles
   **When** rendered
   **Then** they use `pointer-events-none` and `aria-hidden="true"` to ensure zero accessibility or interaction impact.

3. **Given** the decorative blurred circles
   **When** viewed at 1440px viewport on a standard LCD monitor
   **Then** both shapes are perceptible as subtle color washes (minimum 5% opacity per guardrail).

4. **Given** the homepage hero `<section>` wrapper
   **When** rendered
   **Then** it has `relative overflow-hidden` to properly clip decorative shapes at the container edge.

5. **Given** homepage section headings ("Featured Cities", "Learn About Attic Cleaning")
   **When** rendered
   **Then** they use `font-bold` (700) instead of `font-semibold` (600) for clear weight hierarchy distinction from card-level headings.

6. **Given** the Featured Cities `<section>` wrapper
   **When** rendered
   **Then** it includes `pt-8 md:pt-10 border-t border-border/50` creating a subtle divider and breathing room between the hero and content sections.

7. **Given** all non-homepage pages (search results, listing detail, city landing, articles)
   **When** rendered
   **Then** they have NO decorative elements — decoration is reserved for the homepage hero only.

8. **Given** all decorative elements
   **When** measured
   **Then** zero Cumulative Layout Shift (CLS) — absolutely-positioned elements don't affect document flow.

9. **Given** all text elements on the homepage
   **When** tested with a contrast checker
   **Then** AA contrast is maintained — decorative circles at 6-7% opacity do not obstruct readable content.

10. **Given** all changes in this story
    **When** built
    **Then** all pages build successfully (1201 pages), no new `"use client"` directives, WCAG 2.1 AA maintained.

## Tasks / Subtasks

- [x] Task 1: Add decorative Aurora shapes to homepage hero (AC: #1, #2, #3, #4, #8, #9, #10)
  - [x] 1.1 In `src/app/page.tsx` line 100, add `relative overflow-hidden` to the hero `<section>` className
  - [x] 1.2 Add two decorative `<div>` elements inside the hero section (before existing content):
    - Top-right circle: `pointer-events-none absolute -z-10 -right-20 -top-20 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl` with `aria-hidden="true"`
    - Bottom-left circle: `pointer-events-none absolute -z-10 -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/[0.07] blur-3xl` with `aria-hidden="true"`
  - [x] 1.3 Verify decorative shapes are clipped at container edge by `overflow-hidden`
  - [x] 1.4 Verify hero text and SearchBar remain fully readable over decorative shapes

- [x] Task 2: Increase section heading font weight to bold (AC: #5, #10)
  - [x] 2.1 In `src/app/page.tsx` line 44, change `font-semibold` to `font-bold` on Featured Cities `<h2>`
  - [x] 2.2 In `src/app/page.tsx` line 74, change `font-semibold` to `font-bold` on Educational Content `<h2>`
  - [x] 2.3 Verify bold weight creates clear hierarchy distinction from card-level `font-semibold` headings

- [x] Task 3: Add section divider above Featured Cities (AC: #6, #8, #10)
  - [x] 3.1 In `src/app/page.tsx` line 43, change `mt-10 md:mt-12` to `mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50` on Featured Cities `<section>`
  - [x] 3.2 Verify border at 50% opacity is barely visible but creates page rhythm
  - [x] 3.3 Verify added padding remains on 4px/8px grid (pt-8 = 32px, pt-10 = 40px)

- [x] Task 4: Confirm no decoration on transactional pages (AC: #7)
  - [x] 4.1 Verify `src/app/search/page.tsx` has NO decorative elements (grep confirmed)
  - [x] 4.2 Verify `src/app/[citySlug]/page.tsx` has NO decorative elements (grep confirmed)
  - [x] 4.3 Verify `src/app/[citySlug]/[companySlug]/page.tsx` has NO decorative elements (grep confirmed)
  - [x] 4.4 Verify `src/app/articles/[slug]/page.tsx` has NO decorative elements (grep confirmed)

- [x] Task 5: Build & Regression Validation (AC: #8, #9, #10)
  - [x] 5.1 `rm -rf .next && npm run build` — all 1201 pages generated successfully, 0 errors
  - [x] 5.2 No new `"use client"` directives — `src/app/page.tsx` remains a server component
  - [x] 5.3 AA contrast verified — decorative shapes at 6-7% opacity are purely decorative (`aria-hidden`), do not obstruct text (foreground on secondary = ~17:1 ratio unaffected)

- [x] Task 6: Desktop visual verification at 1440px (AC: #3, #9)
  - [x] 6.1 View homepage hero at 1440px+ viewport — Aurora shapes perceptible as subtle atmospheric depth (verified via Chrome at 1440x900)
  - [x] 6.2 Verify section headings appear bolder than card headings (verified: bold 700 vs semibold 600 clearly distinct)
  - [x] 6.3 Verify Featured Cities divider creates visible page rhythm (verified: border-t visible with breathing room)
  - [x] 6.4 Capture before/after screenshots for visual review (verified via Chrome browser automation)

## Dev Notes

### Design Source Reference

All specifications come from the **Sprint Change Proposal** (`_bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md`), Story 11.4 section, incorporating Party Mode guardrails.

### Malewicz Principles Applied

1. **Aurora Background Technique** — 2-3 large blurred circles creating organic color transitions. At 6-7% opacity (minimum 5% per guardrail), these add atmospheric depth to what was a flat rectangle. The technique uses `blur-3xl` (48px blur) for soft, diffuse edges.
2. **"Important transactional screens should be clean."** — Decoration is explicitly reserved for marketing/hero areas ONLY. Search results, listing details, city landing, and article pages receive NO decoration per this rule.
3. **Weight hierarchy** — Section headings use bold (700) to clearly separate from card-level headings that use semibold (600). Malewicz: "Different font weights communicate different importance levels."
4. **"Let elements breathe"** — The section divider (`border-border/50`) with increased padding (`pt-8 md:pt-10`) creates visual breathing room and page rhythm between hero and content sections.

### Architecture Constraints

- **CSS-only className changes + 2 decorative divs**: Only `src/app/page.tsx` is modified. No new components, no API changes, no Prisma queries.
- **Zero new JS**: `src/app/page.tsx` is a React Server Component. No `"use client"` additions. The decorative divs are pure HTML/CSS.
- **Zero CLS**: Decorative divs use `absolute` positioning and `pointer-events-none` — they do not affect document flow or element sizing.
- **Tailwind v4 opacity modifier**: The `/[0.06]` syntax (e.g., `bg-primary/[0.06]`) is Tailwind v4's arbitrary color opacity value. Square brackets are needed for non-standard opacity values (unlike `/60` which is a shorthand for 60%).

### Exact File to Modify

**Only `src/app/page.tsx` is modified in this story.**

| Location | Line | Change |
|----------|------|--------|
| Hero `<section>` | ~100 | Add `relative overflow-hidden` to className |
| Hero section body | after 100 | Add 2 decorative `<div>` elements |
| Featured Cities `<h2>` | ~44 | `font-semibold` → `font-bold` |
| Educational Content `<h2>` | ~74 | `font-semibold` → `font-bold` |
| Featured Cities `<section>` | ~43 | Add `pt-8 md:pt-10 border-t border-border/50` |

### DO NOT Modify

- `src/components/search-bar.tsx` — Already enhanced in Story 11.2, not this story
- `src/components/city-card.tsx` — Modified in Story 11.3, not this story
- `src/components/listing-card.tsx` — Modified in Story 11.3, not this story
- `src/app/[citySlug]/page.tsx` — Modified in Story 11.3 (stats bar shadow), not this story
- `src/app/globals.css` — No CSS custom property changes needed for this story
- `src/components/article-card.tsx` — No changes in this story
- Any search, listing detail, city, or article page — decoration is homepage-only
- Any Prisma queries, API routes, or data-fetching logic
- Any `"use client"` directives

### Current File State (pre-implementation)

**Hero section (`src/app/page.tsx` line 100):**
```tsx
<section className="flex flex-col items-center text-center rounded-xl bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)] px-6 py-10 md:py-14">
  <h1 className="font-display text-[1.75rem] font-medium leading-[1.2] text-foreground md:text-[2.5rem]">
    Find trusted attic cleaning professionals near you
  </h1>
  <div className="mt-6 w-full max-w-2xl">
    <SearchBar variant="hero" />
  </div>
</section>
```

**Featured Cities section (`src/app/page.tsx` line 43-44):**
```tsx
<section className="mt-10 md:mt-12">
  <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
```

**Educational Content section (`src/app/page.tsx` line 73-74):**
```tsx
<section className="mt-10 md:mt-12">
  <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
```

### Expected File State (post-implementation)

**Hero section:**
```tsx
<section className="relative overflow-hidden flex flex-col items-center text-center rounded-xl bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)] px-6 py-10 md:py-14">
  <div className="pointer-events-none absolute -z-10 -right-20 -top-20 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />
  <div className="pointer-events-none absolute -z-10 -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/[0.07] blur-3xl" aria-hidden="true" />
  <h1 className="font-display text-[1.75rem] font-medium leading-[1.2] text-foreground md:text-[2.5rem]">
    Find trusted attic cleaning professionals near you
  </h1>
  <div className="mt-6 w-full max-w-2xl">
    <SearchBar variant="hero" />
  </div>
</section>
```

**Featured Cities section:**
```tsx
<section className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50">
  <h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
```

**Educational Content heading:**
```tsx
  <h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
```

### OKLch Color Values Reference

- `--primary`: `oklch(0.546 0.215 264)` — Blue-purple (used at 6% opacity for top-right decorative circle)
- `--accent`: `oklch(0.742 0.157 85)` — Gold/amber (used at 7% opacity for bottom-left decorative circle)
- `--secondary`: `oklch(0.965 0.003 100)` — Very light off-white (hero background base)
- `--border`: `oklch(0.916 0.005 90)` — Light warm gray (at 50% opacity for section divider)
- At 6% opacity, `primary` on `secondary` bg → purely decorative, no contrast requirement
- At 7% opacity, `accent` on `secondary` bg → purely decorative, no contrast requirement
- Section divider at 50% border opacity → decorative separator, no contrast requirement

### Project Structure Notes

- Flat component structure in `src/components/` (PATTERN-2)
- Page-level components in `src/app/[route]/page.tsx` (PATTERN-4)
- No tailwind.config.ts — Tailwind v4 uses `@theme inline` in CSS
- PostCSS config: `@tailwindcss/postcss` plugin
- `shadow-hero` token exists in `@theme inline` from Story 11.1 but is NOT used in this story (it's for future use on the hero shadow, not the Aurora shapes)

### Previous Story Intelligence (from 11.3)

- CSS-only className changes across 3 files — same pattern here (1 file only)
- Clean `.next` cache before builds to avoid ENOTEMPTY errors: `rm -rf .next`
- Build validates 1201 pages successfully
- Visual verification at 1440px+ is required per party mode guardrails
- Code review caught falsely-checked tasks — verify ALL claims are real (no marking Task 6 visual verification tasks as done without browser verification)
- Code review caught wrong oklch color values — verify all color references against `src/app/globals.css` actual values
- Turbopack dev server has CSS parsing error with `shadow-[var(...)]` — use production server (`next start`) for visual verification instead of `next dev`

### Git Intelligence

Last relevant commits:
- `ddea530` Story 11.3: Card Component Depth & Typography Refinement
- `f4fa540` Story 11.2: Gradient & Button Hierarchy Enhancement
- `9b87333` Story 11.1: Shadow System & Color-Matched Depth Foundation

Pattern: All Epic 11 stories are CSS-only className changes, each verified with `npm run build` and visual review.

### Party Mode Guardrails (from Sprint Change Proposal)

1. **Decoration opacity floor** — Aurora shapes minimum 5-8% opacity, verified in-browser on standard LCD before committing values
2. **Before/after browser screenshots** — Capture visual state for review
3. **Visual review gate** — Jon reviews before/after comparison at story completion
4. **Accessibility on every story** — AA contrast checks are acceptance criteria (not deferred to 11.5)
5. **Color-scheme-aware tokens** — Shadow custom properties structured for future dark mode override

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md#Story 11.4]
- [Source: _bmad-output/implementation-artifacts/11-3-card-component-depth-typography-refinement.md]
- [Source: _bmad-output/implementation-artifacts/11-2-gradient-button-hierarchy-enhancement.md]
- [Source: _bmad-output/implementation-artifacts/11-1-shadow-system-color-matched-depth-foundation.md]
- [Source: docs/malewicz.txt — Aurora Background, Decoration Philosophy, Weight Hierarchy, Breathing Room]
- [Guardrails: Party Mode agent review 2026-02-18]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Clean `.next` cache before build per 11.3 learnings — no ENOTEMPTY errors encountered
- Build completed: 1201 static pages generated, 0 errors
- Grep search confirmed no `blur-3xl` or decorative elements in any non-homepage page files
- Task 6 (visual verification) intentionally left unchecked — requires browser verification per 11.3 code review learnings

### Completion Notes List

- All 5 code changes applied to `src/app/page.tsx` exactly as specified in story tasks
- Task 1: Two Aurora decorative circles added to hero section with `relative overflow-hidden`, `pointer-events-none`, `aria-hidden="true"`, `-z-10`, `blur-3xl` at 6% (primary) and 7% (accent) opacity
- Task 2: Both section headings (`Featured Cities` and `Learn About Attic Cleaning`) changed from `font-semibold` to `font-bold`
- Task 3: Featured Cities section wrapper received `pt-8 md:pt-10 border-t border-border/50` for section rhythm
- Task 4: Grep verification confirmed zero decorative elements on search, city, listing, and article pages
- Task 5: Full build validation passed — 1201 pages, no new "use client" directives, no regressions
- Task 6: Visual verification at 1440px PENDING — requires Chrome browser automation (not falsely marked per 11.3 learnings)
- Code review fix: Added `-z-10` to both decorative divs for correct CSS painting order (decorative shapes now paint behind content)
- No files outside story scope were modified. No Prisma, API, or data-fetching changes.

### Change Log

- 2026-02-18: Implemented all CSS className changes for homepage hero decoration, section headings, and section divider (Tasks 1-5 complete)
- 2026-02-18: Task 6 (visual verification) left pending for browser QA
- 2026-02-19: Code review fix — added `-z-10` to decorative divs for correct z-stacking (decorative circles now paint behind hero content per CSS painting algorithm)
- 2026-02-19: Rebuild confirmed: 1201 pages, 0 errors
- 2026-02-19: Visual verification completed via Chrome browser automation at 1440x900 — all Task 6 subtasks verified

### File List

- `src/app/page.tsx` (modified: hero Aurora shapes with -z-10, section heading weights, Featured Cities divider)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified: story status transitions)
