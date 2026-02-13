# Story 2.3: SearchBar Component

Status: done

## Story

As a **homeowner**,
I want a prominent search bar where I can type a location to find attic cleaning companies,
So that I can quickly start my search from any page.

## Acceptance Criteria

1. **Hero Variant (Homepage):** The SearchBar renders full-width with 44px height, Jakarta Sans font (`font-sans`), a search icon (lucide-react `Search`), and placeholder text "Search by city, zip code, or company name"
2. **Hero Submit Button:** A visible "Search" submit button with `--primary` background and white text (`text-primary-foreground`)
3. **Header Variant (All Other Pages):** The SearchBar renders compact, integrated into the header navigation bar
4. **Form Submit:** When the user types a location and presses Enter or taps the Search button, the form navigates to `/search?q=<query>` via full page navigation (not SPA/AJAX)
5. **Empty Disable:** The submit button is disabled when the input is empty
6. **Semantic HTML:** The input has `type="search"` with `aria-label="Search for attic cleaning companies by city or zip code"`, wrapped in `<form role="search">`
7. **Associated Label:** The input has an associated `<label>` element (can be visually hidden with `sr-only`) per NFR-A8
8. **Touch Target:** Touch target meets 44x44px minimum (NFR-A5) on both input and submit button
9. **Client Component:** The component uses `"use client"` directive for interactivity
10. **Default Value:** Accepts an optional `defaultValue` prop to pre-fill the search input (used by city landing pages)
11. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully

## Tasks / Subtasks

- [x] Task 1: Create SearchBar component (AC: #1, #2, #3, #4, #5, #6, #7, #8, #9, #10)
  - [x] 1.1 Create `src/components/search-bar.tsx` as a client component (`"use client"`)
  - [x] 1.2 Define `SearchBarProps` interface: `variant: "hero" | "header"`, `defaultValue?: string`
  - [x] 1.3 Implement `<form role="search" action="/search">` wrapping input + button — uses native form action for progressive enhancement and full page navigation
  - [x] 1.4 Add visually hidden `<label htmlFor="search-input" className="sr-only">` for accessibility
  - [x] 1.5 Add `<input type="search" id="search-input" name="q">` with `aria-label`, placeholder text, controlled value via `useState`
  - [x] 1.6 Add search icon (lucide-react `Search`) prepended inside the input area
  - [x] 1.7 Add `<button type="submit">Search</button>` with `disabled` when input is empty
  - [x] 1.8 Style hero variant: full-width, 44px height (`h-11`), rounded border, `font-sans`, submit button with `bg-primary text-primary-foreground`
  - [x] 1.9 Style header variant: compact width, shorter height, smaller text, inline layout
  - [x] 1.10 Ensure 44x44px minimum touch target on both input and button

- [x] Task 2: Update Header component to use real SearchBar (AC: #3)
  - [x] 2.1 Replace the placeholder `<div>` in `src/components/header.tsx` with `<SearchBar variant="header" />`
  - [x] 2.2 Import SearchBar component
  - [x] 2.3 Keep `showSearch` prop behavior — when `false`, don't render SearchBar (homepage case)

- [x] Task 3: Validate build and visual check (AC: #11)
  - [x] 3.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 3.2 Run `npm run lint` — zero violations
  - [x] 3.3 Run `npm run build` — compiles successfully
  - [x] 3.4 Run `npm run dev` and verify: hero variant renders full-width with search icon and button, header variant renders compact in header, form submits to `/search?q=...`, button disabled when empty

## Dev Notes

### Architecture Compliance

**Component Structure (architecture.md):**
- File: `src/components/search-bar.tsx` — kebab-case file, PascalCase export `SearchBar`
- Props interface: `SearchBarProps` (named `{ComponentName}Props` per convention)
- This is a `"use client"` component — one of only 3 client components in the entire app (SearchBar, ServiceTagChip filter variant, sort control)
- Uses `useState` for controlled input value — this is the ONLY hook needed
- NO `useSearchParams()`, NO `useRouter()` — form uses native `action="/search"` for full page navigation

**File Naming (architecture.md#Naming Patterns):**
- `src/components/search-bar.tsx` — kebab-case file
- Export: `SearchBar` — PascalCase default export

**Import Order Convention:**
1. React/Next.js imports (`"use client"` directive, `useState`)
2. Third-party library imports (`lucide-react`)
3. `@/components/` imports
4. `@/lib/` imports (e.g., `cn()` if needed)
5. `@/types/` imports

### SearchBar Component Spec

**Props:**
```typescript
interface SearchBarProps {
  variant: "hero" | "header"
  defaultValue?: string
}
```

**HTML Structure:**
```html
<form role="search" action="/search" class="...">
  <label for="search-input" class="sr-only">Search for attic cleaning companies</label>
  <div class="relative flex ...">
    <Search class="absolute left-3 ..." />  <!-- lucide-react icon -->
    <input
      type="search"
      id="search-input"
      name="q"
      aria-label="Search for attic cleaning companies by city or zip code"
      placeholder="Search by city, zip code, or company name"
      value={query}
      onChange={...}
    />
    <button type="submit" disabled={!query.trim()}>
      Search
    </button>
  </div>
</form>
```

**Key Implementation Details:**
- `action="/search"` on the form enables progressive enhancement — works without JS, does full page navigation
- `name="q"` on the input means the form submits as `/search?q=<value>` automatically
- `useState` tracks input value for the disabled button logic only
- NO `onSubmit` handler needed — native form submission handles navigation
- The `id="search-input"` must be unique per page — since there can be both a hero and header variant, use `id={variant === "hero" ? "search-hero" : "search-header"}` to avoid duplicate IDs

**States (from UX spec):**
| State | Visual |
|---|---|
| Empty | Placeholder text visible, submit button disabled |
| Focused | Blue border (`ring-2 ring-primary`), placeholder fades |
| Filled | User text visible, submit button enabled |
| Submitting | Full page navigation (native form behavior) |

### Hero Variant Styling

- Full-width within parent container
- Height: 44px (`h-11`)
- Font: Jakarta Sans (`font-sans`) — inherited from body
- Rounded border: `rounded-lg` or `rounded-md`
- Search icon: lucide-react `Search`, positioned absolute left, `text-muted-foreground`
- Input: left padding for icon (`pl-10`), right padding for button
- Submit button: visible, `bg-primary text-primary-foreground`, `px-4 py-2`, `font-sans font-semibold`
- Mobile: full-width, stacked or inline
- On homepage: rendered in the hero section (Story 2.6 will place it), NOT in the header

### Header Variant Styling

- Compact width: `max-w-sm` or `w-64` — fits within header flex layout
- Shorter height: `h-9` (36px)
- Smaller text: `text-sm`
- Search icon: smaller (`h-4 w-4`)
- Submit button: can be icon-only on mobile, text on desktop — OR always text. Keep it simple: always show "Search" text button
- Layout: inline flex, logo left, search bar center/right in the header

### Header Integration

**Current header.tsx (Story 2.1):**
The header currently has a placeholder `<div>` when `showSearch` is true. Replace this with the real SearchBar:

```tsx
// BEFORE (placeholder):
{showSearch && (
  <div className="ml-4 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground sm:px-4 sm:text-sm">
    Search by city or zip...
  </div>
)}

// AFTER (real component):
{showSearch && (
  <SearchBar variant="header" />
)}
```

**Important:** Header is currently a React Server Component (no `"use client"`). Since SearchBar is a client component, importing it into the header is fine — Next.js handles the server/client boundary automatically. The header itself does NOT need `"use client"`.

### Accessibility Requirements

**From UX spec:**
- `<form role="search">` — identifies the search landmark for screen readers
- `<input type="search">` — enables native browser clear button on mobile, semantic search input
- `aria-label="Search for attic cleaning companies by city or zip code"` — describes the input purpose
- Associated `<label>` element (visually hidden with `sr-only`) — required by NFR-A8
- 44x44px minimum touch target — both input height and button size must meet this
- Focus indicator: inherited from global `:focus-visible` rule in globals.css (`outline: 2px solid var(--primary); outline-offset: 2px`)
- Tab order: input → button (natural DOM order)

### What This Story Does NOT Do

- Does NOT create the search results page `/search` (Story 2.5)
- Does NOT modify `page.tsx` / homepage layout (Story 2.6 — the hero SearchBar will be placed there)
- Does NOT add autocomplete/suggestions functionality
- Does NOT add any API calls — form uses native navigation
- Does NOT create ListingCard, StarRating, or ServiceTagChip (Story 2.4)
- Does NOT add filter chips or sort controls
- Does NOT add any state management beyond the input `useState`
- Does NOT install shadcn/ui Input component — build the search input from scratch with Tailwind (shadcn Input has extra styling we don't need)

### Anti-Patterns to Avoid

- **Do NOT use `useRouter()` or `router.push()`** — form uses native `action="/search"` for full page navigation
- **Do NOT add `onSubmit` with `e.preventDefault()`** — let the native form handle submission
- **Do NOT use `useSearchParams()`** — this component only needs `useState` for the controlled input
- **Do NOT create `loading.tsx`** — anti-pattern per architecture
- **Do NOT add `"use client"` to header.tsx** — it remains a server component; SearchBar is the client boundary
- **Do NOT install shadcn/ui Input** — custom search input with Tailwind classes directly
- **Do NOT add animations or transitions** — none in MVP (UX-13)
- **Do NOT create barrel files** — anti-pattern per architecture
- **Do NOT add a dropdown or autocomplete** — not in MVP scope

### Previous Story Learnings (from Stories 2.1 and 2.2)

- **Build verification is critical:** Always run `tsc --noEmit`, `lint`, and `build` before marking done
- **Code review catches real issues:** Story 2.1 had 3 medium-severity fixes, Story 2.2 had 1 high (text filter bug in radius search), 3 medium fixes — follow specs precisely
- **Header component pattern:** Header accepts `showSearch` prop (default `true`), uses flexbox `items-center justify-between`, max-width 1200px container
- **Server/Client boundary:** Header is a server component, so importing a client component (`SearchBar`) into it is fine — Next.js handles the boundary
- **Global focus styles:** `:focus-visible` rule already in globals.css — no need to add per-component focus styles
- **Responsive container pattern:** `mx-auto w-full max-w-[1200px] px-4 md:px-6`

### Project Structure Notes

Current state after Story 2.2:
```
src/
├── app/
│   ├── globals.css          # Tailwind + custom tokens
│   ├── layout.tsx           # Root layout with Header + Footer
│   ├── page.tsx             # Default Next.js page (unmodified — Story 2.6)
│   ├── api/search/route.ts  # Search API endpoint (created in 2.2)
│   └── generated/prisma/    # Prisma generated client
├── components/
│   ├── header.tsx           # Header with logo + search placeholder (to be updated)
│   ├── footer.tsx           # Footer with cities, resources, legal
│   └── ui/                  # shadcn/ui primitives (empty — no components installed yet)
├── lib/
│   ├── utils.ts             # cn() helper (shadcn default)
│   ├── prisma.ts            # Prisma client singleton
│   └── search.ts            # Search query logic (created in 2.2)
└── types/
    └── index.ts             # SearchResponse, ListingResult, ServiceType (created in 2.2)
```

**New files this story creates:**
- `src/components/search-bar.tsx` (NEW)

**Files modified:**
- `src/components/header.tsx` (MODIFIED — replace placeholder with real SearchBar)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3 (line 399)] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#SearchBar Component (line 907)] — Component definition, states, accessibility
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Search Interaction Patterns (line 1028)] — Submit behavior, pre-fill, persistence
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Hero Variant (line 1066)] — Homepage: logo only, search in hero
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Header Variant (line 1067)] — All other pages: logo + compact SearchBar
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Touch Targets (line 494)] — 44x44px minimum
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Semantic Structure (line 1285)] — form role="search"
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture (line 266)] — Client components: SearchBar
- [Source: _bmad-output/planning-artifacts/architecture.md#File Naming (line 373)] — search-bar.tsx kebab-case
- [Source: _bmad-output/planning-artifacts/architecture.md#Props Interfaces (line 380)] — SearchBarProps
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Boundary (line 669)] — Client components own interaction state
- [Source: src/components/header.tsx] — Current header with search placeholder to replace
- [Source: _bmad-output/implementation-artifacts/2-1-root-layout-header-footer.md] — Story 2.1 learnings
- [Source: _bmad-output/implementation-artifacts/2-2-search-api-route-with-radius-expansion.md] — Story 2.2 learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — no debug issues encountered.

### Completion Notes List

- SearchBar component created with hero and header variants using `"use client"` directive
- Progressive enhancement via native `<form action="/search">` — no `useRouter()` or `onSubmit` preventDefault
- Unique IDs per variant (`search-hero` / `search-header`) to avoid duplicate DOM IDs
- Header component updated to import real SearchBar, replacing placeholder div
- Header remains a server component — Next.js handles client/server boundary automatically
- All accessibility requirements met: `role="search"`, `type="search"`, `aria-label`, associated `<label>`, 44px touch targets
- Build verified: `tsc --noEmit` ✓, `lint` ✓, `build` ✓

### Change Log

- **Created** `src/components/search-bar.tsx` — Client component with hero/header variants, search icon, disabled-when-empty submit button
- **Modified** `src/components/header.tsx` — Replaced placeholder search div with `<SearchBar variant="header" />`, added SearchBar import
- **Code Review Fix H1** — Changed header variant from `h-9` (36px) to `h-11` (44px) on both input and button to meet 44px touch target requirement (AC #8)
- **Code Review Fix M1** — Removed `focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary` from input; global `:focus-visible` rule handles focus indication consistently
- **Code Review Fix M2** — Added `border-r-0` to input to eliminate visible border seam between input and button

### File List

- `src/components/search-bar.tsx` (NEW)
- `src/components/header.tsx` (MODIFIED)
