# Story 11.3: Card Component Depth & Typography Refinement

Status: done

## Story

As a **visitor browsing the attic cleaning directory**,
I want cards to have generous internal spacing, clear typographic hierarchy, and refined hover interactions,
so that each listing feels like a well-crafted information panel rather than a generic data dump, increasing my confidence in the directory's quality.

## Acceptance Criteria (BDD)

1. **Given** any ListingCard component
   **When** rendered
   **Then** internal padding is `p-4 md:p-5` (16px mobile / 20px desktop), meeting Malewicz's 16pt minimum.

2. **Given** a ListingCard company name
   **When** rendered
   **Then** it has `leading-snug` (line-height: 1.375) for tighter multi-line heading layout.

3. **Given** a ListingCard review snippet
   **When** rendered
   **Then** it has reduced opacity (`text-muted-foreground/90`) creating visual hierarchy differentiation from primary content while maintaining AA contrast (5.17:1).

4. **Given** a CityCard component
   **When** hovered
   **Then** the border transitions to `hover:border-primary/60` (partial opacity) instead of full `hover:border-primary`, for a more cohesive subtle interaction.

5. **Given** the aggregated stats bar on a city landing page
   **When** rendered
   **Then** it has `shadow-card` applied, giving it subtle depth as a distinct data element.

6. **Given** all spacing values in modified components
   **When** measured
   **Then** all spacing remains on the 4px/8px grid system.

7. **Given** all text elements modified in this story
   **When** tested with a contrast checker
   **Then** AA contrast is maintained (4.5:1 for normal text, 3:1 for large text). The `/90` opacity on review snippets against `bg-card` must still pass.

8. **Given** all padding changes
   **When** built and rendered
   **Then** zero CLS impact, no layout shifts from padding increases, all pages build successfully.

9. **Given** all changes in this story
   **When** built
   **Then** all pages build successfully, no new client-side JS, WCAG 2.1 AA maintained.

## Tasks / Subtasks

- [x] Task 1: Increase ListingCard internal padding (AC: #1, #6, #8, #9)
  - [x] 1.1 In `src/components/listing-card.tsx` line 19, change `p-3 md:p-4` to `p-4 md:p-5`
  - [x] 1.2 Verify card renders correctly with increased breathing room
  - [x] 1.3 Verify no layout shifts from padding change

- [x] Task 2: Add leading-snug to ListingCard company name (AC: #2, #9)
  - [x] 2.1 In `src/components/listing-card.tsx` line 22, change `text-lg font-semibold text-foreground` to `text-lg font-semibold leading-snug text-foreground`
  - [x] 2.2 Verify multi-line company names render more compactly

- [x] Task 3: Reduce review snippet opacity for hierarchy (AC: #3, #7, #9)
  - [x] 3.1 In `src/components/listing-card.tsx` line 44, change `text-muted-foreground` to `text-muted-foreground/90` (review fix: /80 failed AA at 4.12:1, /90 passes at 5.17:1)
  - [x] 3.2 Verify review snippet is visually lighter than primary content but still readable
  - [x] 3.3 Verify AA contrast: `text-muted-foreground` is `oklch(0.478 0 0)` (6.60:1 full) — at 90% opacity on `bg-card` (white) → 5.17:1, passes AA 4.5:1

- [x] Task 4: Soften CityCard hover border to partial opacity (AC: #4, #9)
  - [x] 4.1 In `src/components/city-card.tsx` line 15, change `hover:border-primary` to `hover:border-primary/60`
  - [x] 4.2 Verify hover interaction is more subtle and cohesive with shadow depth increase

- [x] Task 5: Add shadow-card to city landing stats bar (AC: #5, #9)
  - [x] 5.1 In `src/app/[citySlug]/page.tsx` line 142, change `bg-secondary rounded-lg px-3 py-2` to `bg-secondary rounded-lg px-3 py-2 shadow-card`
  - [x] 5.2 Verify stats bar has subtle warm-tinted shadow matching the card system from Story 11.1

- [x] Task 6: Build & Regression Validation (AC: #7, #8, #9)
  - [x] 6.1 `npm run build` — all pages generated successfully, 0 errors (1201 pages)
  - [x] 6.2 No new `"use client"` directives — all modified files are server components
  - [x] 6.3 AA contrast verified on all modified text elements

- [x] Task 7: Desktop perceptibility verification (AC: #7, #8)
  - [x] 7.1 View listing cards at 1440px+ viewport — padding feels generous (verified via Chrome at 1440px)
  - [x] 7.2 Verify review snippet hierarchy differentiation is visible (verified: /90 opacity creates clear hierarchy on search results)
  - [x] 7.3 Verify CityCard hover border is softer but still perceptible (verified: hover:border-primary/60 shows subtle blue-purple border)
  - [x] 7.4 Verify stats bar shadow registers as a distinct element (verified: shadow-card visible on Phoenix, AZ stats bar)
  - [x] 7.5 Visual review verified via Chrome browser automation at 1440px viewport (code review session)

## Dev Notes

### Design Source Reference

All specifications come from the **Sprint Change Proposal** (`_bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md`), Story 11.3 section, incorporating Party Mode guardrails.

### Malewicz Principles Applied

1. **"16pt minimum internal padding. 24pt is the sweet spot."** — Current `p-3` (12px mobile) is below minimum. Moving to `p-4` (16px) hits the minimum; `md:p-5` (20px desktop) approaches the sweet spot.
2. **"Different font weights communicate different importance levels."** — Review snippets get reduced opacity (not weight change) to create supporting-content hierarchy vs primary content.
3. **Golden ratio line height**: font × 1.618. For `text-lg` (18px), ideal ~29px. `leading-snug` (1.375) gives 24.75px — close while keeping multi-line names compact.
4. **Subtle hover interactions** — Partial-opacity border (`primary/60`) is more cohesive with the shadow depth system than a hard jump to full `border-primary`.

### Architecture Constraints

- **CSS-only className changes**: Only component className strings are modified. No new components, no API changes, no Prisma queries.
- **Zero new JS**: All target files (`listing-card.tsx`, `city-card.tsx`, `[citySlug]/page.tsx`) are React Server Components. No `"use client"` additions.
- **Tailwind v4 opacity modifier**: The `/80` and `/60` syntax (e.g., `text-muted-foreground/80`, `hover:border-primary/60`) is Tailwind v4's color opacity modifier. It applies alpha to the color value.

### Exact Files to Modify

| File | Line | Change |
|------|------|--------|
| `src/components/listing-card.tsx` | ~19 | `p-3 md:p-4` → `p-4 md:p-5` |
| `src/components/listing-card.tsx` | ~22 | Add `leading-snug` to company name classes |
| `src/components/listing-card.tsx` | ~44 | `text-muted-foreground` → `text-muted-foreground/90` |
| `src/components/city-card.tsx` | ~15 | `hover:border-primary` → `hover:border-primary/60` |
| `src/app/[citySlug]/page.tsx` | ~142 | Add `shadow-card` to stats bar classes |

### DO NOT Modify

- `src/components/article-card.tsx` — No changes in this story
- `src/components/search-bar.tsx` — Updated in Story 11.2, not this story
- `src/app/page.tsx` — Updated in Story 11.2, not this story
- `src/app/globals.css` — No CSS changes needed for this story
- Any Prisma queries, API routes, or data-fetching logic
- Any `"use client"` directives
- Nearby city links on city landing page (`[citySlug]/page.tsx` line 172) — Only the stats bar is modified, not the nearby links

### Current File State (post-implementation)

**`src/components/listing-card.tsx` line 19:**
```tsx
<article className="rounded-lg border border-border bg-card p-4 md:p-5 shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1">
```

**`src/components/listing-card.tsx` line 22:**
```tsx
className="inline-flex min-h-[44px] items-center font-sans text-lg font-semibold leading-snug text-foreground hover:text-primary transition-colors duration-200"
```

**`src/components/listing-card.tsx` line 44:**
```tsx
<p className="mt-2 font-serif text-sm italic text-muted-foreground/90 line-clamp-2">
```

**`src/components/city-card.tsx` line 15:**
```tsx
className="flex min-h-[44px] flex-col rounded-lg border border-border bg-card p-4 font-sans shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary/60"
```

**`src/app/[citySlug]/page.tsx` line 142:**
```tsx
<div className="mt-2 inline-flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 shadow-card">
```

### OKLch Color Values Reference

- `--muted-foreground`: `oklch(0.478 0 0)` — Medium-dark gray (6.60:1 on white)
- `--primary`: `oklch(0.546 0.215 264)` — Blue-purple
- `--card`: `oklch(1 0 0)` — White
- `--border`: `oklch(0.916 0.005 90)` — Light warm gray
- At 90% opacity, `muted-foreground` on `card` → 5.17:1 (passes AA 4.5:1)
- At 80% opacity, `muted-foreground` on `card` → 4.12:1 (FAILS AA — do not use for text-sm)
- At 60% opacity, `primary` border → still visible on hover (decorative, no contrast requirement)

### Project Structure Notes

- Flat component structure in `src/components/` (PATTERN-2)
- Page-level components in `src/app/[route]/page.tsx` (PATTERN-4)
- No tailwind.config.ts — Tailwind v4 uses `@theme inline` in CSS
- PostCSS config: `@tailwindcss/postcss` plugin

### Previous Story Intelligence (from 11.2)

Story 11.2 established gradient and button hierarchy:
- CSS-only className changes across 2 files — same pattern here
- Bug caught during self-review: changes initially applied to shared className instead of conditional branch. This story has NO conditional branches (all changes apply to all instances), so this risk doesn't apply.
- Clean `.next` cache before builds to avoid ENOTEMPTY errors
- Build validates 1201 pages successfully
- Visual verification at 1440px+ is required per party mode guardrails
- Code review caught falsely-checked tasks — verify all claims are real

### Git Intelligence

Last relevant commits:
- `f4fa540` Story 11.2: Gradient & Button Hierarchy Enhancement
- `9b87333` Story 11.1: Shadow System & Color-Matched Depth Foundation

Pattern: All Epic 11 stories are CSS-only className changes, each verified with `npm run build` and visual review.

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md#Story 11.3]
- [Source: _bmad-output/implementation-artifacts/11-2-gradient-button-hierarchy-enhancement.md]
- [Source: _bmad-output/implementation-artifacts/11-1-shadow-system-color-matched-depth-foundation.md]
- [Source: docs/malewicz.txt — Padding Rules, Typography Hierarchy, Line Height Rules]
- [Guardrails: Party Mode agent review 2026-02-18 — Sally, Winston, John, Bob]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Clean `.next` cache before build per 11.2 learnings — no ENOTEMPTY errors encountered
- Build completed: 1201 static pages generated, 0 errors
- CSS warning about `shadow-[var(...)]` is pre-existing Tailwind v4 artifact, not related to this story

### Completion Notes List

- All 5 CSS-only className changes applied exactly as specified in story tasks
- Task 1: ListingCard padding increased from `p-3 md:p-4` to `p-4 md:p-5` — meets Malewicz 16pt minimum
- Task 2: `leading-snug` added to company name link for tighter multi-line heading layout
- Task 3: Review snippet opacity reduced to `text-muted-foreground/90` — creates visual hierarchy differentiation. Code review caught /80 failing AA (4.12:1), fixed to /90 (5.17:1 — passes AA)
- Task 4: CityCard hover border softened to `hover:border-primary/60` — cohesive with shadow depth system
- Task 5: `shadow-card` added to city landing stats bar — matches warm-tinted shadow system from Story 11.1
- Task 6: Full build validation passed — 1201 pages, no new "use client" directives, no regressions
- Task 7.5 (visual screenshots review by Jon) remains as manual QA step during code review
- No files outside story scope were modified. No Prisma, API, or data-fetching changes.

### Change Log

- 2026-02-18: Implemented all CSS className changes for card depth, typography, and hover refinement (Tasks 1-6 complete)
- 2026-02-18: Code review fixes — changed review snippet opacity /80→/90 for AA compliance (4.12:1→5.17:1), corrected OKLch color references in Dev Notes
- 2026-02-18: Visual verification completed via Chrome browser automation at 1440px — all tasks 7.1-7.5 verified

### File List

- `src/components/listing-card.tsx` (modified: padding, leading-snug, opacity)
- `src/components/city-card.tsx` (modified: hover border opacity)
- `src/app/[citySlug]/page.tsx` (modified: stats bar shadow)
