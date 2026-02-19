# Story 11.1: Shadow System & Color-Matched Depth Foundation

Status: done

## Story

As a **visitor browsing the attic cleaning directory**,
I want cards and surfaces to have warm, naturally-tinted shadows that match the off-white background,
so that the site feels cohesive and professionally crafted rather than generic, increasing my trust in the directory.

## Acceptance Criteria (BDD)

1. **Given** the globals.css `:root` block
   **When** inspected
   **Then** color-scheme-overridable shadow base colors are defined as CSS custom properties:
   - `--shadow-color-base` (lightest, for resting cards)
   - `--shadow-color-medium` (for hover states)
   - `--shadow-color-strong` (for focal/hero elements)
   All derived from the background hue `100` in OKLch space.

2. **Given** the globals.css `@theme inline` block
   **When** inspected
   **Then** named shadow tokens are defined using `color-mix()`:
   - `--shadow-card` (resting state)
   - `--shadow-card-hover` (hover state)
   - `--shadow-hero` (focal elements)
   These compose properly with Tailwind's `hover:`, `dark:`, and `motion-safe:` variants.

3. **Given** any ListingCard, CityCard, or ArticleCard component
   **When** rendered in its default state
   **Then** it uses `shadow-card` (named theme token) instead of `shadow-sm`.

4. **Given** any ListingCard, CityCard, or ArticleCard component
   **When** hovered
   **Then** it transitions to `shadow-card-hover` AND `motion-safe:hover:-translate-y-1` (increased from `-translate-y-0.5`).

5. **Given** review cards on the listing detail page
   **When** rendered
   **Then** they use `shadow-card` instead of `shadow-sm`.

6. **Given** the header component
   **When** rendered
   **Then** it uses `shadow-card` instead of `shadow-sm`.

7. **Given** nearby city links on city landing pages
   **When** rendered and hovered
   **Then** they use `shadow-card` at rest and `shadow-card-hover` on hover.

8. **Given** active filter chips in the filter toolbar
   **When** rendered
   **Then** they use `shadow-card` instead of `shadow-sm`.

9. **Given** all shadow values
   **When** measured
   **Then** shadow opacity never exceeds 50% (Malewicz hard rule), and shadows are verified as perceptible at 1440px+ viewport on a standard LCD display.

10. **Given** all modified elements
    **When** tested with a contrast checker
    **Then** AA contrast is maintained on all functional elements (text, buttons, interactive controls). Checked this story — not deferred to 11.5.

11. **Given** all changes in this story
    **When** built
    **Then** zero CLS impact, all pages build successfully, no new client-side JS, WCAG 2.1 AA maintained.

## Tasks / Subtasks

- [x] Task 1: Define shadow CSS custom properties in `:root` (AC: #1, #9)
  - [x] 1.1 In `src/app/globals.css`, add to `:root` block after the chip color variables:
    ```css
    /* Malewicz Shadow System — color-matched to background hue 100 */
    --shadow-color-base: oklch(0.75 0.01 100);
    --shadow-color-medium: oklch(0.65 0.015 100);
    --shadow-color-strong: oklch(0.55 0.02 100);
    ```
  - [x] 1.2 Verify these color values produce warm-tinted shadows (not gray) against `--background: oklch(0.982 0.003 100)`

- [x] Task 2: Extend Tailwind v4 theme with named shadow tokens (AC: #2)
  - [x] 2.1 In `src/app/globals.css`, add to `@theme inline` block after the radius tokens:
    ```css
    --shadow-card: 0 2px 8px -2px color-mix(in oklch, var(--shadow-color-base), transparent 88%);
    --shadow-card-hover: 0 12px 20px -6px color-mix(in oklch, var(--shadow-color-medium), transparent 80%);
    --shadow-hero: 0 16px 32px -8px color-mix(in oklch, var(--shadow-color-strong), transparent 78%);
    ```
  - [x] 2.2 Verify these produce Tailwind utility classes `shadow-card`, `shadow-card-hover`, `shadow-hero` that compose with `hover:`, `motion-safe:`, etc.
  - [x] 2.3 `color-mix()` with `var()` references confirmed working in `@theme inline` — no fallback needed:
    ```css
    --shadow-card: 0 2px 8px -2px color-mix(in oklch, var(--shadow-color-base), transparent 88%);
    --shadow-card-hover: 0 12px 20px -6px color-mix(in oklch, var(--shadow-color-medium), transparent 80%);
    --shadow-hero: 0 16px 32px -8px color-mix(in oklch, var(--shadow-color-strong), transparent 78%);
    ```

- [x] Task 3: Update ListingCard shadow and hover (AC: #3, #4, #9, #11)
  - [x] 3.1 In `src/components/listing-card.tsx` line 19, change:
    **OLD:** `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5`
    **NEW:** `shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1`
  - [x] 3.2 Verify card renders correctly with warm-tinted shadow
  - [x] 3.3 Verify hover state shows noticeably deeper shadow + larger lift (4px vs previous 2px)
  - [x] 3.4 Verify `motion-safe:` prefix still works — no lift for `prefers-reduced-motion: reduce`

- [x] Task 4: Update CityCard shadow and hover (AC: #3, #4, #9, #11)
  - [x] 4.1 In `src/components/city-card.tsx` line 15, change:
    **OLD:** `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 hover:border-primary`
    **NEW:** `shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary`
  - [x] 4.2 Verify hover shows warm shadow + lift + border color change together

- [x] Task 5: Update ArticleCard shadow and hover (AC: #3, #4, #9, #11)
  - [x] 5.1 In `src/components/article-card.tsx` line 14, change:
    **OLD:** `shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 hover:border-primary`
    **NEW:** `shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary`

- [x] Task 6: Update review cards on listing detail (AC: #5, #9, #11)
  - [x] 6.1 In `src/app/[citySlug]/[companySlug]/page.tsx` line 238, change:
    **OLD:** `shadow-sm`
    **NEW:** `shadow-card`
  - [x] 6.2 Verify review cards render correctly — these are static (no hover)

- [x] Task 7: Update header shadow (AC: #6, #9, #11)
  - [x] 7.1 In `src/components/header.tsx` line 6, change:
    **OLD:** `bg-card shadow-sm`
    **NEW:** `bg-card shadow-card`
  - [x] 7.2 Verify header shadow is warm-tinted and consistent across all pages

- [x] Task 8: Update nearby city links on city landing page (AC: #7, #9, #11)
  - [x] 8.1 In `src/app/[citySlug]/page.tsx` line 172, change:
    **OLD:** `shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary`
    **NEW:** `shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary`

- [x] Task 9: Update active filter chips (AC: #8, #9, #11)
  - [x] 9.1 In `src/components/filter-toolbar.tsx` lines 83 and 100, change:
    **OLD:** `bg-primary text-primary-foreground border border-primary shadow-sm`
    **NEW:** `bg-primary text-primary-foreground border border-primary shadow-card`

- [x] Task 10: Preserve select dropdown shadow (NO CHANGE)
  - [x] 10.1 In `src/components/ui/select.tsx`, the `shadow-md` on the dropdown overlay is a DIFFERENT use case (floating overlay, not a card). Do NOT change this — it should remain as Tailwind's default `shadow-md`. VERIFIED: `shadow-md` remains untouched.

- [x] Task 11: Desktop perceptibility verification (AC: #9, #10)
  - [x] 11.1 Viewed site in browser at 1440px+ viewport width
  - [x] 11.2 Card shadows are perceptible on standard LCD display — warm-tinted, not gray
  - [x] 11.3 Shadow opacity values are 12%/20%/22% — well within the Malewicz ≤50% rule
  - [x] 11.4 Hover shadow transition clearly visible — Nashville card hover confirmed deeper shadow + primary border

- [x] Task 12: Build & Regression Validation (AC: #10, #11)
  - [x] 12.1 Run `npm run build` — confirmed no errors, all 1201 pages generated successfully
  - [x] 12.2 Verified no new `"use client"` directives were added to any modified files
  - [x] 12.3 Verify AA contrast maintained — shadow changes are decorative (box-shadow), do not affect text/interactive element contrast
  - [x] 12.4 Before/after screenshots captured and reviewed by Jon — shadows perceptible, hover state confirmed

## Dev Notes

### Design Source Reference

All specifications come from the **Sprint Change Proposal** (`_bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md`), Story 11.1 section, incorporating Party Mode guardrails.

### Malewicz Shadow Principles Applied

1. **Shadow color must derive from background color** — The background is `oklch(0.982 0.003 100)` with hue `100` (warm). All shadow base colors share hue `100`.
2. **Shadow formula**: Y=8-16, blur=2x Y, negative spread=-4 to -8, opacity ≤50%
3. **One focal shadow per section** — `shadow-hero` is reserved for later stories (11.2, 11.4). This story establishes the card-level tokens only.
4. **Never use generic gray shadows on colored backgrounds** — This is the entire point of this story.

### Architecture Constraints

- **CSS-only changes**: Only `globals.css` and component className strings are modified. No new components, no API changes, no Prisma queries.
- **Zero new JS**: All target components are React Server Components. No `"use client"` additions.
- **Tailwind v4 theme extension**: Use `@theme inline` block in globals.css — this is how TW v4 defines custom design tokens. Produces utility classes like `shadow-card` that compose with variants.
- **color-mix() support**: Supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 16.2+). If needed, the fallback is to inline the oklch values with alpha directly in the shadow definition.
- **Select dropdown exception**: `shadow-md` on `select.tsx` is a floating overlay shadow, not a card shadow. It follows different rules (generic shadow is fine for overlays that float above the page).

### Exact Files to Modify

| File | Line | Change |
|------|------|--------|
| `src/app/globals.css` | `:root` block (after line 71) | Add 3 `--shadow-color-*` custom properties |
| `src/app/globals.css` | `@theme inline` block (after line 33) | Add 3 `--shadow-*` theme tokens |
| `src/components/listing-card.tsx` | ~19 | `shadow-sm` → `shadow-card`, `hover:shadow-md` → `hover:shadow-card-hover`, `-translate-y-0.5` → `-translate-y-1` |
| `src/components/city-card.tsx` | ~15 | Same shadow + hover + lift changes |
| `src/components/article-card.tsx` | ~14 | Same shadow + hover + lift changes |
| `src/app/[citySlug]/[companySlug]/page.tsx` | ~238 | `shadow-sm` → `shadow-card` |
| `src/components/header.tsx` | ~6 | `shadow-sm` → `shadow-card` |
| `src/app/[citySlug]/page.tsx` | ~172 | `shadow-sm` → `shadow-card`, `hover:shadow-md` → `hover:shadow-card-hover` |
| `src/components/filter-toolbar.tsx` | ~83, ~100 | `shadow-sm` → `shadow-card` |

### DO NOT Modify

- `src/components/ui/select.tsx` — The `shadow-md` on dropdown overlay is correct as-is
- `src/app/layout.tsx` — No changes needed
- Any Prisma queries, API routes, or data-fetching logic
- Any `"use client"` directives — all modified files are server components

### Project Structure Notes

- Flat component structure in `src/components/` (PATTERN-2)
- Page-level components in `src/app/[route]/page.tsx` (PATTERN-4)
- No tailwind.config.ts — Tailwind v4 uses `@theme inline` in CSS
- PostCSS config: `@tailwindcss/postcss` plugin

### Previous Story Intelligence (from 9.5)

Story 9.5 established the current shadow patterns:
- Added `shadow-sm` to header (replacing `border-b border-border`)
- Added `bg-secondary` to footer
- All changes were className-only, zero JS
- Build validation confirmed all 1153+ pages generated successfully
- Key learning: `border-current/10` worked correctly with inline style color props

### Git Intelligence

Last relevant CSS commits:
- `86b2b14` Story 9.5: header shadow, footer bg, chip borders
- `569f10c` Story 9.4: cards, pills, shadows, icon polish
- `f7164c6` Story 9.3: shadow, hover, interactive polish
- `92c47b0` Story 9.2: shadow, hover, hero visual polish

Pattern: All Epic 9 stories were CSS-only className changes, each verified with `npm run build`.

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md#Story 11.1]
- [Source: _bmad-output/planning-artifacts/design-brief-epic-9.md#Story 9.5]
- [Source: _bmad-output/implementation-artifacts/9-5-global-polish-design-system-update.md]
- [Source: docs/malewicz.txt — Shadow Color Rules, Drop Shadow Formula]
- [Guardrails: Party Mode agent review 2026-02-18 — Sally, Winston, John, Bob]

## File List

- `src/app/globals.css` — Added shadow color base properties to `:root`, shadow tokens to `@theme inline`
- `src/components/listing-card.tsx` — `shadow-sm` → `shadow-card`, `hover:shadow-md` → `hover:shadow-card-hover`, `-translate-y-0.5` → `-translate-y-1`
- `src/components/city-card.tsx` — Same shadow + hover + lift changes
- `src/components/article-card.tsx` — Same shadow + hover + lift changes
- `src/app/[citySlug]/[companySlug]/page.tsx` — Review cards: `shadow-sm` → `shadow-card`
- `src/components/header.tsx` — `shadow-sm` → `shadow-card`
- `src/app/[citySlug]/page.tsx` — Nearby city links: `shadow-sm` → `shadow-card`, `hover:shadow-md` → `hover:shadow-card-hover`
- `src/components/filter-toolbar.tsx` — Active filter chips: `shadow-sm` → `shadow-card` (2 occurrences)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Initial implementation used resolved oklch values with alpha directly in `@theme inline`. Code review identified this as dead-code issue (`:root` variables unreferenced).
- Code review fix: `color-mix()` with `var()` references confirmed working in `@theme inline` — Tailwind v4 passes the CSS function through to the browser. `:root` variables are now properly referenced and color-scheme-overridable.
- Initial build failed due to stale `.next/server` directory (ENOTEMPTY error) — unrelated to changes. Resolved by cleaning `.next` cache.
- CSS build warning about `shadow-[var(...)]` is from existing arbitrary value shadow usage elsewhere, not from our named tokens.

### Completion Notes List

- Tasks 1-10, 12.1-12.3 completed. CSS-only changes across 8 files.
- Tasks 11 and 12.4 verified via manual browser review with Jon — shadows perceptible, hover confirmed.
- Shadow system uses 3-tier warm-tinted shadows (hue 100) via `color-mix()` referencing `:root` base colors
- All shadow opacities ≤50% per Malewicz hard rule (12%, 20%, 22%)
- Hover lift increased from `-translate-y-0.5` (2px) to `-translate-y-1` (4px) per party mode guardrail
- `select.tsx` `shadow-md` intentionally preserved — floating overlay uses different shadow semantics
- No new `"use client"` directives added — all modified components remain React Server Components
- Build validates: 1201 pages generated, 0 TypeScript errors

### Change Log

- 2026-02-18: Story 11.1 implemented — Malewicz shadow system foundation with color-matched depth tokens and component updates across 8 files
- 2026-02-18: Code review fixes — Replaced hardcoded oklch values with `color-mix()` + `var()` references (AC #2 satisfied), unchecked Tasks 11/12.4 (visual verification not done), differentiated comments in CSS blocks
