# Story 11.2: Gradient & Button Hierarchy Enhancement

Status: done

## Story

As a **visitor arriving at the attic cleaning directory homepage**,
I want the search button to visually stand out from the input field and the hero section to have subtle depth,
so that I immediately understand where to take action and the site feels polished and trustworthy.

## Acceptance Criteria (BDD)

1. **Given** the homepage hero section
   **When** rendered
   **Then** it has a subtle diagonal gradient from `secondary` to a slightly warmer/darker variant (`oklch(0.955 0.008 90)`), using `bg-gradient-to-br`.

2. **Given** the hero search button
   **When** rendered
   **Then** it is visibly taller than the input field (`h-12` vs `h-11`) with increased horizontal padding (`px-6`).

3. **Given** the hero search button
   **When** rendered
   **Then** it has a subtle top-to-bottom gradient from `primary` to a ~5-point darker variant (`oklch(0.50 0.215 264)`), with the darker end at the bottom per Malewicz rule.

4. **Given** the hero search input
   **When** rendered
   **Then** it has a faint inset shadow (`inset 0 2px 4px 0 oklch(0.85 0.005 100 / 0.15)`) creating a subtle receptacle effect.

5. **Given** the header search button (non-hero variant)
   **When** rendered
   **Then** it remains unchanged — same `h-11`, no gradient, no height increase. Only the hero variant is modified.

6. **Given** all gradient hue shifts
   **When** measured
   **Then** no gradient exceeds a 30-point hue shift (hero gradient shifts 10 points: hue 100→90; button gradient shifts 0 points: same hue 264).

7. **Given** all buttons and text
   **When** tested with a contrast checker
   **Then** AA contrast is maintained on all functional elements. Button text against gradient background must pass 4.5:1.

8. **Given** all gradients
   **When** viewed at 1440px+ viewport on a standard LCD display
   **Then** gradients are perceptible but subtle — "more of a feeling than an obvious gradation."

9. **Given** all changes in this story
   **When** built
   **Then** zero CLS impact, all pages build successfully, no new client-side JS beyond existing `"use client"` in search-bar.tsx, WCAG 2.1 AA maintained.

## Tasks / Subtasks

- [x] Task 1: Add diagonal gradient to homepage hero section (AC: #1, #6, #8, #9)
  - [x] 1.1 In `src/app/page.tsx` line 100, changed `bg-secondary` to `bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)]`
  - [x] 1.2 Gradient is barely visible — subtle warmth shift (10-point hue shift: 100→90)
  - [x] 1.3 Gradient direction is diagonal bottom-right (`bg-gradient-to-br`)

- [x] Task 2: Make hero search button taller than input (AC: #2, #5, #9)
  - [x] 2.1 In `src/components/search-bar.tsx`, hero variant button changed from `h-11 px-5` to `h-12 px-6`
  - [x] 2.2 Header variant button remains `h-11 px-3 text-sm bg-primary` — unchanged
  - [x] 2.3 Button is 48px tall vs input 44px — visually taller
  - [x] 2.4 Flex container aligns button and input correctly

- [x] Task 3: Add subtle vertical gradient to hero search button (AC: #3, #6, #7, #9)
  - [x] 3.1 Hero variant button uses `bg-gradient-to-b from-primary to-[oklch(0.50_0.215_264)]`; header variant uses plain `bg-primary`
  - [x] 3.2 Gradient is subtle — only ~5 points darker (0.546→0.50 lightness)
  - [x] 3.3 `hover:brightness-90` works with gradient (CSS filter applies to entire element)
  - [x] 3.4 White text on `oklch(0.50 0.215 264)` darkest point — contrast ratio well above 4.5:1 (dark blue-purple vs white)

- [x] Task 4: Add inset shadow to hero search input (AC: #4, #8, #9)
  - [x] 4.1 Hero variant input has `shadow-[inset_0_2px_4px_0_oklch(0.85_0.005_100_/_0.15)]`
  - [x] 4.2 Header variant input has NO inset shadow — unchanged
  - [x] 4.3 Inset shadow at 15% opacity is barely visible — subtle receptacle cue
  - [x] 4.4 Inset shadow uses warm hue 100 matching the shadow system from Story 11.1

- [x] Task 5: Filter chips — NO CHANGE needed (AC: N/A)
  - [x] 5.1 Filter chips already use `shadow-card` from Story 11.1 — confirmed no changes needed
  - [x] 5.2 Sprint Change Proposal confirms: "No additional changes needed beyond shadow system"

- [x] Task 6: Desktop perceptibility verification (AC: #8, #7)
  - [x] 6.1 View homepage at 1440px+ viewport
  - [x] 6.2 Verify hero gradient is perceptible but subtle on LCD display
  - [x] 6.3 Verify button gradient is perceptible — darker at bottom
  - [x] 6.4 Verify input inset shadow creates a visible receptacle effect
  - [x] 6.5 Verify button is clearly taller than input field

- [x] Task 7: Build & Regression Validation (AC: #7, #9)
  - [x] 7.1 `npm run build` — all 1201 pages generated successfully, 0 errors
  - [x] 7.2 No new `"use client"` directives — search-bar.tsx already had one (existing)
  - [x] 7.3 AA contrast: white text on oklch(0.50 0.215 264) is well above 4.5:1
  - [x] 7.4 Before/after screenshot reviewed by Jon — all changes visually confirmed

## Dev Notes

### Design Source Reference

All specifications come from the **Sprint Change Proposal** (`_bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md`), Story 11.2 section, incorporating Party Mode guardrails.

### Malewicz Gradient & Button Principles Applied

1. **"Gradients are like the new colors"** — Everything in nature is a gradient, not a flat color. Hero gets a barely-visible diagonal gradient.
2. **Gradient formula**: Diagonal (135°/to-br is most natural), 10-30 hue shift, darker at bottom, ≤30 point hue shift.
3. **"Buttons must be visibly taller than form fields"** — The current h-11/h-11 parity violates this. h-12 button creates the visual progression from input → action.
4. **Button gradient**: Top-to-bottom, same hue, ~5 points darker at bottom. "More of a feeling than an obvious gradation."
5. **Input receptacle**: "A reversed inner shadow from the bottom creates a subtle depth effect suggesting the field can receive input."

### Architecture Constraints

- **CSS-only className changes**: Only component className strings are modified. No new components, no API changes, no Prisma queries.
- **search-bar.tsx is `"use client"`**: This is EXISTING and expected — it uses `useState`. Do NOT add new `"use client"` to any other file.
- **Tailwind v4 arbitrary values**: The `to-[oklch(...)]` and `shadow-[inset_...]` syntax uses Tailwind v4 arbitrary value brackets. Underscores represent spaces within the brackets.
- **Hero variant only**: Changes to SearchBar MUST be guarded by `isHero` conditional classes. The header variant stays untouched.

### Exact Files to Modify

| File | Line | Change |
|------|------|--------|
| `src/app/page.tsx` | ~100 | Add `bg-gradient-to-br from-secondary via-secondary to-[oklch(...)]` to hero section |
| `src/components/search-bar.tsx` | ~48 | Add `shadow-[inset_...]` to hero input classes |
| `src/components/search-bar.tsx` | ~56 | Change `bg-primary` to `bg-gradient-to-b from-primary to-[oklch(...)]` |
| `src/components/search-bar.tsx` | ~58 | Change `h-11 px-5` to `h-12 px-6` for hero button |

### DO NOT Modify

- Header variant SearchBar (lines 49, 59) — these must remain unchanged
- `src/app/globals.css` — No CSS changes needed for this story
- `src/components/filter-toolbar.tsx` — Already updated in Story 11.1
- Any Prisma queries, API routes, or data-fetching logic
- Any other components or pages

### Current File State (key lines)

**`src/app/page.tsx` line 100:**
```tsx
<section className="flex flex-col items-center text-center bg-secondary rounded-xl px-6 py-10 md:py-14">
```

**`src/components/search-bar.tsx` lines 45-60:**
```tsx
// Input classes (line 46-50):
className={cn(
  "w-full rounded-l-md border border-r-0 border-border bg-background font-sans text-foreground placeholder:text-muted-foreground",
  isHero
    ? "h-11 pl-11 pr-4 text-base"
    : "h-11 pl-9 pr-3 text-sm"
)}

// Button classes (line 55-60):
className={cn(
  "shrink-0 rounded-r-md bg-primary font-sans font-semibold text-primary-foreground transition-all duration-200 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed",
  isHero
    ? "h-11 px-5 text-base"
    : "h-11 px-3 text-sm"
)}
```

### OKLch Color Values Reference

- `--primary`: `oklch(0.546 0.215 264)` — Blue-purple
- `--secondary`: `oklch(0.965 0.003 100)` — Very light warm gray
- `--primary-foreground`: `oklch(1 0 0)` — White
- Button gradient target: `oklch(0.50 0.215 264)` — ~5 points darker than primary, same hue
- Hero gradient target: `oklch(0.955 0.008 90)` — ~1 point darker, 10-point hue shift toward yellow-green

### Project Structure Notes

- Flat component structure in `src/components/` (PATTERN-2)
- Page-level components in `src/app/[route]/page.tsx` (PATTERN-4)
- No tailwind.config.ts — Tailwind v4 uses `@theme inline` in CSS
- PostCSS config: `@tailwindcss/postcss` plugin

### Previous Story Intelligence (from 11.1)

Story 11.1 established the shadow system foundation:
- `color-mix()` with `var()` references works in `@theme inline` — no fallback needed
- Clean `.next` cache before builds to avoid ENOTEMPTY errors
- CSS build warning about `shadow-[var(...)]` is pre-existing, not from our tokens
- All changes were className-only, zero new JS
- Build validates 1201 pages successfully
- Visual verification at 1440px+ is required per party mode guardrails
- Code review caught falsely-checked tasks — verify all claims are real

### Git Intelligence

Last relevant commit:
- `9b87333` Story 11.1: Malewicz shadow system foundation with color-matched depth tokens

Pattern: All Epic 11 stories are CSS-only className changes, each verified with `npm run build` and visual review.

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-18.md#Story 11.2]
- [Source: _bmad-output/implementation-artifacts/11-1-shadow-system-color-matched-depth-foundation.md]
- [Source: docs/malewicz.txt — Gradient Rules, Button Height Rules, Input Receptacle Effect]
- [Guardrails: Party Mode agent review 2026-02-18 — Sally, Winston, John, Bob]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Initial implementation put button gradient in shared className (both hero + header). Caught during self-review — moved gradient to hero-only conditional, keeping `bg-primary` for header variant.
- Same pre-existing CSS build warning about `shadow-[var(...)]` — unrelated to our changes.

### Completion Notes List

- All tasks completed. CSS-only changes across 2 files.
- Tasks 6 and 7.4 verified visually by Jon at 1440px+ — all changes confirmed.
- Hero gradient: `bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)]` — 10-point hue shift, barely visible
- Button height: hero h-12 (48px) vs input h-11 (44px) — visible height hierarchy
- Button gradient: `bg-gradient-to-b from-primary to-[oklch(0.50_0.215_264)]` — ~5 points darker at bottom
- Input inset shadow: `shadow-[inset_0_2px_4px_0_oklch(0.85_0.005_100_/_0.15)]` — warm hue 100, 15% opacity
- Header variant completely untouched — gradient and height changes are hero-only
- Build validates: 1201 pages generated, 0 TypeScript errors

### File List

- `src/app/page.tsx` — Hero section: `bg-secondary` → `bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)]`
- `src/components/search-bar.tsx` — Hero button: `h-11 px-5` → `h-12 px-6`, `bg-primary` → `bg-gradient-to-b from-primary to-[...]`; Hero input: added inset shadow

### Change Log

- 2026-02-18: Story 11.2 implemented — Hero gradient, button height hierarchy, button gradient, input inset shadow across 2 files
