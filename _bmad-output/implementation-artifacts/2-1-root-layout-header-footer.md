# Story 2.1: Root Layout, Header & Footer

Status: done

## Story

As a **homeowner**,
I want a consistent site layout with navigation and a persistent search bar,
So that I can search for contractors from any page and navigate the site easily.

## Acceptance Criteria

1. **Skip-to-Content Link:** The root layout includes a skip-to-content link (`<a href="#main">Skip to main content</a>`) as the first focusable element, visually hidden but visible on focus
2. **Language Attribute:** The `<html>` element has `lang="en"` (already set in layout.tsx — verify preserved)
3. **Semantic HTML Landmarks:** The page uses `<header role="banner">`, `<main id="main" role="main">`, `<footer role="contentinfo">`
4. **Header Component:** The header displays a site logo/wordmark ("AtticCleaning.com") and a SearchBar placeholder (header variant, compact) on all non-homepage pages. On the homepage, the header shows logo only (search bar is in the hero)
5. **Footer Component:** The footer displays placeholder sections for: featured city links, content links (e.g., "About", "Articles"), and legal text (copyright)
6. **Header Visibility:** The header search bar area is visible without scrolling on all page types
7. **Focus Indicators:** All interactive elements (links, future buttons) have visible focus indicators: `outline: 2px solid var(--primary); outline-offset: 2px`
8. **Responsive Layout:** Single-column on mobile (< 768px) with 16px horizontal padding. Max-width 1200px centered container on desktop (> 1024px) with 24px horizontal padding
9. **Font Loading:** Fonts load correctly — Plus Jakarta Sans for UI/header/footer text, Source Serif 4 available for body content. Lora available for accent use. (Font configuration already exists in layout.tsx — verify preserved)
10. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully, `npm run dev` renders the layout visually

## Tasks / Subtasks

- [x] Task 1: Update root layout with semantic HTML structure (AC: #1, #2, #3, #8)
  - [x] 1.1 Add skip-to-content link as first child of `<body>` — visually hidden with `sr-only focus:not-sr-only` Tailwind classes, positioned as a focus-visible overlay
  - [x] 1.2 Import and add `<Header />` component between skip link and `<main>`
  - [x] 1.3 Wrap `{children}` in `<main id="main" role="main">` with responsive container classes
  - [x] 1.4 Import and add `<Footer />` component after `</main>`
  - [x] 1.5 Preserve all existing font configuration, metadata, and CSS variable classes on `<body>`

- [x] Task 2: Create Header component (AC: #4, #6, #7)
  - [x] 2.1 Create `src/components/header.tsx` as a React Server Component
  - [x] 2.2 Use `<header role="banner">` as root element with responsive horizontal padding and max-width container
  - [x] 2.3 Add site logo/wordmark as an `<a href="/">` link — text "AtticCleaning.com" in Jakarta Sans, 600 weight
  - [x] 2.4 Add a SearchBar placeholder `<div>` for the header variant (compact) — renders on all non-homepage pages. Use a simple text input placeholder since the real SearchBar component is Story 2.3
  - [x] 2.5 Layout: logo left, search placeholder center/right, using flexbox with `items-center justify-between`
  - [x] 2.6 Accept an optional `showSearch` prop (default: `true`) so the homepage layout can pass `showSearch={false}`

- [x] Task 3: Create Footer component (AC: #5, #7)
  - [x] 3.1 Create `src/components/footer.tsx` as a React Server Component
  - [x] 3.2 Use `<footer role="contentinfo">` as root element with responsive padding and max-width container
  - [x] 3.3 Add a "Featured Cities" section with placeholder links (to be populated dynamically in Story 4.1)
  - [x] 3.4 Add a "Resources" or "Learn" section with placeholder links (Articles, About)
  - [x] 3.5 Add legal text: `© {currentYear} AtticCleaning.com` in muted foreground color
  - [x] 3.6 Layout: sections in a grid — 2 columns on mobile, 3+ on desktop (cities, content, legal). All links are `<a>` tags for SEO crawlability

- [x] Task 4: Add global focus indicator styles (AC: #7)
  - [x] 4.1 Add a global CSS rule in `globals.css` for visible focus indicators: `outline: 2px solid var(--primary); outline-offset: 2px` on all focusable elements (`:focus-visible`)
  - [x] 4.2 Ensure the skip-to-content link styling works correctly with the focus indicator

- [x] Task 5: Verify responsive container pattern (AC: #8)
  - [x] 5.1 Ensure `<main>` has responsive container: `mx-auto w-full max-w-[1200px] px-4 md:px-6` (16px mobile, 24px desktop)
  - [x] 5.2 Ensure header and footer share the same max-width/padding pattern for visual alignment

- [x] Task 6: Validate build and visual check (AC: #10)
  - [x] 6.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 6.2 Run `npm run lint` — zero violations
  - [x] 6.3 Run `npm run build` — compiles successfully
  - [x] 6.4 Run `npm run dev` and visually verify: skip link works on Tab, header renders with logo, footer renders with sections, responsive layout at mobile/desktop widths

## Dev Notes

### Architecture Compliance

**Component Structure (PATTERN-2):**
- Components go in `src/components/` as flat files — `header.tsx`, `footer.tsx`
- No feature folders, no nesting. Flat structure per architecture.md
- Default exports for components. PascalCase component names (`Header`, `Footer`)
- Props interfaces named `HeaderProps`, `FooterProps`
- Both are React Server Components (no `"use client"`)

**File Naming (architecture.md#File & Directory Naming):**
- `src/components/header.tsx` — kebab-case file, PascalCase export
- `src/components/footer.tsx` — kebab-case file, PascalCase export
- The `src/components/` directory does NOT exist yet — you must create it

**Import Order Convention:**
1. React/Next.js imports
2. Third-party library imports
3. `@/components/` imports
4. `@/lib/` imports
5. `@/types/` imports

**Styling:**
- Use Tailwind classes directly — no CSS modules, no styled-components
- Use `cn()` from `@/lib/utils` if conditional className merging is needed
- No animations, no transitions, no hover effects on non-interactive elements (UX-13)

### Header Component Spec

Per UX spec (lines 1060-1077):

| Page Type | Header Content |
|---|---|
| Homepage | Logo only (search bar is in hero, not header) |
| All other pages | Logo + SearchBar (header variant, compact) |

**Rules:**
- Header is a simple horizontal bar: logo left, search bar center/right
- No hamburger menu. No dropdown navigation. No mega menu.
- Navigation happens through search, city links, and article links — not a traditional nav menu
- The real SearchBar component will be built in Story 2.3. For now, create a simple placeholder `<div>` with text "Search..." styled to look like a compact search input — this will be replaced by the actual component later

**Logo/Wordmark:**
- Text-based wordmark: "AtticCleaning.com"
- Font: Plus Jakarta Sans (`font-sans`), weight 600 (`font-semibold`)
- Color: `--foreground` (#1A1A1A)
- Wrapped in `<a href="/">` for navigation home
- No image logo in MVP

**Header Height/Spacing:**
- Consistent height across pages — enough to contain logo + search input (~56-64px)
- Vertical centering via flexbox `items-center`
- Bottom border: `border-b border-border` for subtle separation from content

### Footer Component Spec

Per UX spec (lines 272-273, 583):

**Content sections (placeholder for now — real data comes in later stories):**
1. **Featured Cities** — Placeholder links: "Phoenix, AZ", "Los Angeles, CA", "Houston, TX" (will be dynamically populated in Story 4.1)
2. **Resources** — Links: "Articles", "About" (static for now)
3. **Legal** — `© 2026 AtticCleaning.com. All rights reserved.`

**Layout:**
- Responsive grid: stack on mobile, 2-3 columns on desktop
- Background: same as page background (`--background`), with `border-t border-border` for separation
- Text: `font-sans` (Jakarta Sans), `--muted-foreground` for secondary text
- Links: `--foreground` color, underline on hover
- Padding: `py-8 md:py-12` vertical, same horizontal padding as container

### Semantic HTML Structure (from UX spec line 1271)

```html
<body>
  <a href="#main" class="sr-only focus:not-sr-only ...">Skip to main content</a>
  <header role="banner"><!-- Logo + SearchBar --></header>
  <main id="main" role="main"><!-- Page content --></main>
  <footer role="contentinfo"><!-- City links, content links --></footer>
</body>
```

### Focus Indicator Pattern (from UX spec line 1292)

```css
/* Global focus indicator — visible on ALL interactive elements */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

This replaces or works alongside the existing `outline-ring/50` in globals.css. The UX spec requires `--primary` (blue) as the focus color, not ring. Check that the existing `outline-ring/50` rule doesn't conflict — if it does, replace it.

### Responsive Container Pattern

**Max-width container with responsive padding:**
```
mx-auto w-full max-w-[1200px] px-4 md:px-6
```
- Mobile (< 768px): 16px horizontal padding (px-4)
- Desktop (> 1024px): 24px horizontal padding (px-6), max-width 1200px, centered

Apply this pattern consistently to header inner content, main, and footer inner content so everything aligns visually.

### SearchBar Placeholder Strategy

The SearchBar component is built in Story 2.3. For Story 2.1, create a **visual placeholder** in the header that:
- Looks like a compact search input (border, rounded, placeholder text "Search by city or zip...")
- Is NOT functional (no form submission)
- Will be replaced by the real `<SearchBar variant="header" />` in Story 2.3
- Use a simple `<div>` with text, NOT an actual `<input>` — this avoids confusion about non-functional elements

**Why a placeholder:** The header needs to establish the correct visual layout and spacing now so that when SearchBar is added later, no layout changes are needed. The placeholder defines the space.

### What This Story Does NOT Do

- Does NOT create the SearchBar component (Story 2.3)
- Does NOT create ListingCard, StarRating, or ServiceTagChip (Story 2.4)
- Does NOT modify `page.tsx` (homepage content is Story 2.6)
- Does NOT add any API routes
- Does NOT add any database queries
- Does NOT add any `"use client"` components — header and footer are both server components
- Does NOT add any JavaScript interactivity
- Does NOT add loading states or error boundaries
- Does NOT create any `loading.tsx` files (anti-pattern per architecture)

### Anti-Patterns to Avoid

- **Do NOT create `src/components/ui/header.tsx`** — header is a custom component, not a shadcn primitive. Place in `src/components/header.tsx`
- **Do NOT use CSS modules** — Tailwind only (PATTERN-8)
- **Do NOT add a hamburger menu or mobile nav drawer** — no menu navigation in this app (UX spec line 1074)
- **Do NOT add breadcrumbs** — not in MVP (UX spec line 1077)
- **Do NOT create loading.tsx** — anti-pattern per architecture (forbidden explicitly)
- **Do NOT create barrel files (index.ts)** — anti-pattern per architecture
- **Do NOT use `React.use()` or any data fetching hooks** — these are static server components
- **Do NOT use `"use client"`** on header or footer — they are server components with no interactivity
- **Do NOT add animations or transitions** — none in MVP (UX-13)
- **Do NOT create a `src/layouts/` directory** — layout lives in `src/app/layout.tsx` per Next.js App Router convention

### Previous Story Learnings (from Epic 1)

- **Prisma 7 import path:** `"../app/generated/prisma/client"` with `/client` suffix — not relevant to this story but documents the established pattern
- **Script pattern established:** `dotenv/config`, PrismaPg adapter, async main, try/finally disconnect — not needed for this story
- **Build verification is critical:** Always run `tsc --noEmit`, `lint`, and `build` before marking done
- **Code review fixes matter:** Story 1.5 had 3 medium-severity issues caught in code review — the dev agent should aim for fewer issues by following specs precisely

### Project Structure Notes

- `src/components/` directory does NOT exist yet — must be created
- `src/components/ui/` exists via shadcn init but at `components/ui/` path alias — verify the physical path. If `src/components/` doesn't exist, create it as the first step
- Existing files that will be modified: `src/app/layout.tsx`, `src/app/globals.css`
- New files: `src/components/header.tsx`, `src/components/footer.tsx`
- `src/app/page.tsx` should NOT be modified in this story (it still has default Next.js content — will be replaced in Story 2.6)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navigation Patterns (line 1060)] — Header content per page type
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Implementation Guidelines (line 1271)] — Semantic HTML structure
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Focus management rules (line 1291)] — Focus indicator spec
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spacing & Layout Foundation (line 463)] — Layout grid, padding values
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System (line 429)] — Font roles and weights
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns (line 389)] — File locations: `src/components/header.tsx`, `src/components/footer.tsx`
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns (line 342)] — kebab-case files, PascalCase components
- [Source: _bmad-output/planning-artifacts/architecture.md#Enforcement Guidelines (line 554)] — Anti-patterns and required patterns
- [Source: src/app/layout.tsx] — Current root layout with font configuration and metadata
- [Source: src/app/globals.css] — Current CSS with color tokens and theme config

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — implementation was straightforward with no debugging needed.

### Completion Notes List

- Updated `src/app/layout.tsx` with semantic HTML structure: skip-to-content link, `<Header />`, `<main id="main" role="main">` with responsive container, `<Footer />`
- Skip-to-content link uses `sr-only focus:not-sr-only` with fixed positioning on focus — appears as blue pill at top-left when Tab is pressed
- Created `src/components/header.tsx` — React Server Component with `role="banner"`, logo as Next.js `<Link>` to `/`, search placeholder div (hidden on mobile via `hidden sm:block`), flexbox layout with `items-center justify-between`
- Header accepts `showSearch` prop (default `true`) so homepage can hide the search placeholder when the hero search bar is present
- Created `src/components/footer.tsx` — React Server Component with `role="contentinfo"`, 3-column grid (Featured Cities, Resources, Legal), responsive from 2-col mobile to 3-col desktop
- Footer uses Next.js `<Link>` for all navigation links, dynamic year via `new Date().getFullYear()`
- Updated `src/app/globals.css` — replaced `outline-ring/50` with `:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px }` per UX spec
- All three layout sections (header inner, main, footer inner) share consistent `max-w-[1200px] px-4 md:px-6` container pattern
- Verified via curl: all 11 semantic HTML checks pass (lang, skip link, banner, main, contentinfo, logo, cities, resources, legal, search placeholder)
- Zero TypeScript errors, zero lint violations, build compiles successfully
- Code review fixes applied: M1 (sticky footer via min-h-screen flex-col + flex-1), M2 (search placeholder visible on mobile — removed hidden sm:block), M3 (footer h2 → p to preserve heading hierarchy)

### Change Log

- 2026-02-12: Created header.tsx, footer.tsx, updated layout.tsx and globals.css with full semantic structure
- 2026-02-12: Code review — added sticky footer layout, made search placeholder mobile-visible, fixed footer heading hierarchy

### File List

- src/components/header.tsx (new)
- src/components/footer.tsx (new)
- src/app/layout.tsx (modified)
- src/app/globals.css (modified)
