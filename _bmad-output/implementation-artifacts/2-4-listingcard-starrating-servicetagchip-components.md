# Story 2.4: ListingCard, StarRating & ServiceTagChip Components

Status: done

## Story

As a **homeowner**,
I want to see listing cards that display company name, star rating, review count, service tags, and a review snippet,
So that I can quickly assess if a company handles my specific problem and is well-reviewed.

## Acceptance Criteria

1. **ListingCard Layout:** The card displays (top to bottom): company name (Jakarta Sans, 18px, semibold), star rating with review count, service tag chips, review snippet (Source Serif 4, italic), and contact links (phone/website)
2. **ListingCard Semantics:** The card is an `<article>` element with company name as a link (`<a>`) to the detail page at `/{citySlug}/{companySlug}`
3. **Phone Link:** Phone number renders as `<a href="tel:...">` with `aria-label="Call [company name]"`
4. **Website Link:** Website link opens in a new tab with `target="_blank" rel="noopener"` and `aria-label="Visit [company name] website"`
5. **Review Snippet:** Review snippet truncates at 2 lines with ellipsis (`line-clamp-2`); Source Serif 4, italic
6. **Missing Data Handling:** Card adapts when data is missing: no phone hides phone link, no website hides website link, no snippet collapses that area
7. **Distance Label:** When `distanceMiles` is provided, a distance label appears (e.g., "12 miles away") in Jakarta Sans, 13px
8. **StarRating Display:** Gold star SVGs (`--accent` / `#D4A017`) display the rating visually; compact variant shows "(187)", full variant shows "(187 reviews)"
9. **StarRating Accessibility:** `aria-label="Rated [rating] out of 5 based on [count] reviews"`
10. **ServiceTagChip Card Variant:** Displays as a static `<span>` with the correct muted tint background and dark text per service type using CSS custom properties from globals.css
11. **ServiceTagChip Sizing:** Chip font is Jakarta Sans, 12px/13px, weight 500; chips are horizontally scrollable if > 3 on mobile
12. **Card Styling:** Card padding 12px mobile / 16px desktop, border 1px solid `--border`, border-radius 8px, `--card` background, no shadows
13. **Touch Targets:** All interactive elements (phone link, website link, company name link) meet 44x44px minimum touch target
14. **Server Components:** All three components are React Server Components — NO `"use client"` directive (only the filter variant of ServiceTagChip needs client, which is Story 2.5)
15. **Build Integrity:** `npx tsc --noEmit` passes, `npm run lint` passes, `npm run build` compiles successfully

## Tasks / Subtasks

- [x] Task 1: Create StarRating component (AC: #8, #9)
  - [x] 1.1 Create `src/components/star-rating.tsx` as a server component (NO `"use client"`)
  - [x] 1.2 Define `StarRatingProps` interface: `rating: number`, `reviewCount: number`, `variant: "compact" | "full"`
  - [x] 1.3 Render 5 star SVGs: full stars gold (`text-accent`), partial stars at reduced opacity, empty stars gray
  - [x] 1.4 Implement star fill logic: `Math.floor(rating)` full stars, fractional star if `rating % 1 >= 0.5`, empty stars for remainder
  - [x] 1.5 Display review count: compact "(187)", full "(187 reviews)"
  - [x] 1.6 Add `aria-label="Rated {rating} out of 5 based on {count} reviews"` on the wrapper
  - [x] 1.7 Mark star SVGs as decorative with `aria-hidden="true"`

- [x] Task 2: Create ServiceTagChip component — card variant only (AC: #10, #11)
  - [x] 2.1 Create `src/components/service-tag-chip.tsx` as a server component (NO `"use client"`)
  - [x] 2.2 Define `ServiceTagChipProps` interface: `serviceType: ServiceType`, `variant: "card" | "filter"` (only implement "card" in this story)
  - [x] 2.3 Create `SERVICE_TAG_CONFIG` map: ServiceType → `{ label: string, bgVar: string, textVar: string }` using CSS custom property names from globals.css
  - [x] 2.4 Render as `<span>` with `font-sans text-xs font-medium` and dynamic background/text colors via inline `style` attribute referencing CSS variables
  - [x] 2.5 Add rounded corners (`rounded-full`), horizontal padding (`px-2.5`), vertical padding (`py-0.5`)

- [x] Task 3: Create ListingCard component (AC: #1, #2, #3, #4, #5, #6, #7, #12, #13)
  - [x] 3.1 Create `src/components/listing-card.tsx` as a server component (NO `"use client"`)
  - [x] 3.2 Define `ListingCardProps` interface using the existing `ListingResult` type from `@/types`
  - [x] 3.3 Render `<article>` wrapper with card styling: `bg-card border border-border rounded-lg p-3 md:p-4`
  - [x] 3.4 Company name as `<a href="/{citySlug}/{companySlug}">` — Jakarta Sans, 18px (`text-lg`), semibold, `text-foreground`
  - [x] 3.5 StarRating component with `variant="compact"` below company name
  - [x] 3.6 ServiceTagChip list: `flex flex-wrap gap-1.5` for chips; wrap in horizontally scrollable container on mobile if needed
  - [x] 3.7 Review snippet: `font-serif italic text-sm text-muted-foreground line-clamp-2`; conditionally rendered only when `reviewSnippet` is non-null
  - [x] 3.8 Distance label: conditionally rendered when `distanceMiles` is non-null — `font-sans text-[13px] font-medium text-muted-foreground`; format as "X miles away" (round to nearest integer)
  - [x] 3.9 Contact links row: phone as `<a href="tel:{phone}">` with phone icon, website as `<a href="{website}" target="_blank" rel="noopener">` with external link icon
  - [x] 3.10 Add `aria-label` on phone link: "Call {name}", on website link: "Visit {name} website"
  - [x] 3.11 Ensure 44px minimum touch target on all links via `min-h-[44px] inline-flex items-center`
  - [x] 3.12 Handle missing data: hide phone link if `phone` is null, hide website link if `website` is null, collapse snippet area if `reviewSnippet` is null

- [x] Task 4: Validate build (AC: #15)
  - [x] 4.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 4.2 Run `npm run lint` — zero violations
  - [x] 4.3 Run `npm run build` — compiles successfully

## Dev Notes

### Architecture Compliance

**Component Structure (architecture.md):**
- Files: `src/components/listing-card.tsx`, `src/components/star-rating.tsx`, `src/components/service-tag-chip.tsx` — kebab-case files, PascalCase exports
- Props interfaces: `ListingCardProps`, `StarRatingProps`, `ServiceTagChipProps` — named `{ComponentName}Props`
- ALL three are React Server Components — NO `"use client"` directive
- Only ServiceTagChip's "filter" variant (Story 2.5) needs client interaction — the "card" variant is pure display
- Components receive data via props only — they NEVER fetch data internally

**Server/Client Boundary:**
- ListingCard, StarRating, ServiceTagChip (card variant) are server components → zero client JS
- They will be rendered inside server-component pages (search results, city pages, listing detail)
- No hooks (`useState`, `useEffect`, etc.) allowed — pure render functions only

**Import Order Convention:**
1. React/Next.js imports (e.g., `Link` from `next/link`)
2. Third-party library imports (`lucide-react`)
3. `@/components/` imports (e.g., StarRating, ServiceTagChip)
4. `@/lib/` imports (e.g., `cn()`)
5. `@/types/` imports (e.g., `ListingResult`, `ServiceType`)

### StarRating Component Spec

**Props:**
```typescript
interface StarRatingProps {
  rating: number       // 1.0 - 5.0
  reviewCount: number
  variant: "compact" | "full"
}
```

**HTML Structure:**
```html
<div class="flex items-center gap-1" aria-label="Rated 4.8 out of 5 based on 187 reviews">
  <!-- 5 star SVGs, decorative -->
  <svg aria-hidden="true" class="h-4 w-4 text-accent">...</svg>  <!-- full star -->
  <svg aria-hidden="true" class="h-4 w-4 text-accent">...</svg>  <!-- full star -->
  <svg aria-hidden="true" class="h-4 w-4 text-accent">...</svg>  <!-- full star -->
  <svg aria-hidden="true" class="h-4 w-4 text-accent">...</svg>  <!-- full star -->
  <svg aria-hidden="true" class="h-4 w-4 text-accent/50">...</svg> <!-- partial/empty -->
  <span class="font-sans text-sm font-medium text-foreground">4.8</span>
  <span class="font-sans text-sm text-muted-foreground">(187)</span>  <!-- compact -->
  <!-- OR for full variant: -->
  <span class="font-sans text-sm text-muted-foreground">(187 reviews)</span>
</div>
```

**Star SVG Implementation:**
- Use a simple inline SVG star path (do NOT use lucide-react for stars — custom SVGs for precise half-star control)
- Full star: `text-accent` (gold, `#D4A017`)
- Half star: use a `clipPath` or reduced opacity approach — simplest is `opacity-50` on the last partial star
- Empty star: `text-muted-foreground/20` (very faint gray)
- Star size: `h-4 w-4` (16px) — consistent across variants
- The star path: `M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z` (standard 5-point star)

**Key Details:**
- `rating` is a float like 4.8 — display as "4.8" text alongside stars
- Full stars = `Math.floor(rating)`, show half star if remainder ≥ 0.25, empty for rest
- Review count formatted with no thousands separator (they'll all be under 1000)
- The numerical rating value IS shown as visible text alongside stars (e.g., "4.8")

### ServiceTagChip Component Spec

**Props:**
```typescript
import type { ServiceType } from "@/types"

interface ServiceTagChipProps {
  serviceType: ServiceType
  variant: "card" | "filter"  // Only implement "card" in this story
}
```

**Service Tag Configuration Map:**
```typescript
const SERVICE_TAG_CONFIG: Record<ServiceType, { label: string; bgVar: string; textVar: string }> = {
  RODENT_CLEANUP:      { label: "Rodent Cleanup",      bgVar: "--chip-rodent-bg",         textVar: "--chip-rodent-text" },
  INSULATION_REMOVAL:  { label: "Insulation Removal",  bgVar: "--chip-insulation-bg",     textVar: "--chip-insulation-text" },
  DECONTAMINATION:     { label: "Decontamination",     bgVar: "--chip-decontamination-bg", textVar: "--chip-decontamination-text" },
  MOLD_REMEDIATION:    { label: "Mold Remediation",    bgVar: "--chip-mold-bg",           textVar: "--chip-mold-text" },
  GENERAL_CLEANING:    { label: "General Cleaning",    bgVar: "--chip-general-bg",        textVar: "--chip-general-text" },
  ATTIC_RESTORATION:   { label: "Attic Restoration",   bgVar: "--chip-restoration-bg",    textVar: "--chip-restoration-text" },
}
```

**CSS Variable Usage:**
The chip colors are already defined in `globals.css` (lines 59-71) as CSS custom properties. Use inline `style` attribute to reference them since Tailwind cannot resolve dynamic CSS variable names at build time:
```tsx
<span
  style={{
    backgroundColor: `var(${config.bgVar})`,
    color: `var(${config.textVar})`,
  }}
  className="inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-xs font-medium"
>
  {config.label}
</span>
```

**Why inline style and NOT Tailwind classes:**
- Tailwind needs to see class names at build time for tree-shaking — `bg-[var(--chip-rodent-bg)]` works but creates 12 class name strings that are harder to maintain
- Inline `style` with CSS variables is the clean approach for a config-driven color map
- This pattern is explicitly used by shadcn/ui for dynamic theming

### ListingCard Component Spec

**Props:**
```typescript
import type { ListingResult } from "@/types"

interface ListingCardProps {
  listing: ListingResult
}
```

**HTML Structure:**
```html
<article class="rounded-lg border border-border bg-card p-3 md:p-4">
  <!-- Company name as link to detail page -->
  <a href="/{citySlug}/{companySlug}" class="font-sans text-lg font-semibold text-foreground hover:text-primary">
    Company Name
  </a>

  <!-- Star rating -->
  <StarRating rating={4.8} reviewCount={187} variant="compact" />

  <!-- Service tag chips -->
  <div class="flex flex-wrap gap-1.5 mt-2">
    <ServiceTagChip serviceType="RODENT_CLEANUP" variant="card" />
    <ServiceTagChip serviceType="INSULATION_REMOVAL" variant="card" />
  </div>

  <!-- Review snippet (conditional) -->
  <p class="mt-2 font-serif text-sm italic text-muted-foreground line-clamp-2">
    "They found evidence of rats in our attic and had everything cleaned..."
  </p>

  <!-- Distance label (conditional) -->
  <p class="mt-1 font-sans text-[13px] font-medium text-muted-foreground">
    12 miles away
  </p>

  <!-- Contact links -->
  <div class="mt-3 flex items-center gap-4 border-t border-border pt-3">
    <a href="tel:6025550142" aria-label="Call Company Name" class="...">
      <Phone class="h-4 w-4" /> (602) 555-0142
    </a>
    <a href="https://..." target="_blank" rel="noopener" aria-label="Visit Company Name website" class="...">
      <ExternalLink class="h-4 w-4" /> Visit Website
    </a>
  </div>
</article>
```

**Contact Links Styling:**
- Both links: `inline-flex items-center gap-1.5 min-h-[44px] font-sans text-sm font-medium text-primary`
- Icons from lucide-react: `Phone` and `ExternalLink`
- Phone link: format phone number for display (already formatted in data)
- Website link text: "Visit Website" (not the URL itself)
- If both phone and website are null, hide the entire contact row + divider

**Review Snippet:**
- `font-serif italic` — Source Serif 4, italic style
- `text-sm` — 14px
- `text-muted-foreground` — secondary text color
- `line-clamp-2` — Tailwind's built-in line-clamp utility, truncates at 2 lines with ellipsis
- Only render the `<p>` element when `reviewSnippet` is non-null

**Distance Label:**
- `font-sans text-[13px] font-medium text-muted-foreground`
- Format: `{Math.round(distanceMiles)} miles away`
- Handle singular: "1 mile away" vs "12 miles away"
- Only render when `distanceMiles` is non-null

### Card Responsive Behavior

- **Mobile (< 768px):** Full-width card, `p-3` (12px padding), single-column layout
- **Desktop (≥ 768px):** Same card in 2-column grid (grid handled by parent page, not this component), `md:p-4` (16px padding)
- Cards do NOT manage their own grid layout — the parent page renders them in a grid
- No hover effects, no transitions, no animations (UX-13 — no animations in MVP)

### Existing CSS Variables for Chip Colors

Already defined in `globals.css` (lines 59-71):
```css
--chip-rodent-bg, --chip-rodent-text
--chip-insulation-bg, --chip-insulation-text
--chip-decontamination-bg, --chip-decontamination-text
--chip-mold-bg, --chip-mold-text
--chip-general-bg, --chip-general-text
--chip-restoration-bg, --chip-restoration-text
```

These are defined in `:root` and ready to use. Do NOT modify globals.css. Do NOT add these to the `@theme inline` section — use inline `style` with `var()` references instead.

### What This Story Does NOT Do

- Does NOT create the search results page `/search` (Story 2.5)
- Does NOT implement ServiceTagChip "filter" variant with toggle behavior (Story 2.5)
- Does NOT create CityCard or ArticleCard components (Story 2.6)
- Does NOT add the 2-column card grid layout (that's the parent page's responsibility in Story 2.5)
- Does NOT add hover effects or animations (UX-13 — none in MVP)
- Does NOT add loading states or skeleton screens (architecture anti-pattern)
- Does NOT modify any existing files (header, footer, globals.css, types)
- Does NOT install any new dependencies — lucide-react is already installed
- Does NOT create tests (testing framework not yet set up per architecture.md line 169)
- Does NOT create `src/lib/constants.ts` — the service config map lives inside the component file

### Anti-Patterns to Avoid

- **Do NOT add `"use client"` to any of these components** — they are all server components; only the filter variant of ServiceTagChip (Story 2.5) needs client
- **Do NOT use `useEffect`, `useState`, or any React hooks** — server components can't use hooks
- **Do NOT fetch data inside components** — receive everything via props
- **Do NOT create `loading.tsx` files** — anti-pattern per architecture
- **Do NOT add animations or transitions** — none in MVP (UX-13)
- **Do NOT use lucide-react for star icons** — use custom inline SVG for precise half-star control
- **Do NOT use Tailwind classes for dynamic chip colors** — use inline `style` with CSS variable references
- **Do NOT create barrel files or index re-exports** — anti-pattern per architecture
- **Do NOT wrap the full card in a link** — only the company NAME is a link, per UX spec
- **Do NOT add shadows to cards** — "No card shadows. Border-only separation from background" (UX spec)
- **Do NOT use `<Image>` or any images** — these cards are data-dense text, no visual decoration

### Previous Story Learnings (from Stories 2.1, 2.2, 2.3)

- **Build verification is critical:** Always run `tsc --noEmit`, `lint`, and `build` before marking done
- **Code review catches real issues:** Story 2.2 had 1 HIGH (text filter bug), Story 2.3 had 1 HIGH (touch target), 2 MEDIUM (focus styles, border seam)
- **Touch targets matter:** Story 2.3 code review caught header variant at 36px instead of 44px — ensure all interactive elements in cards meet 44px
- **Global focus styles:** `:focus-visible` rule already in globals.css — do NOT add per-component focus styles on links
- **Server/Client boundary:** Server components can import other server components freely; only client components need `"use client"`
- **Use `cn()` from `@/lib/utils`** for conditional className merging
- **Responsive container pattern:** `mx-auto w-full max-w-[1200px] px-4 md:px-6` — but cards DON'T set this, their parent does
- **Import type convention:** Use `import type` for type-only imports (e.g., `import type { ListingResult } from "@/types"`)

### Project Structure Notes

Current state after Story 2.3:
```
src/
├── app/
│   ├── globals.css          # Tailwind + custom tokens + chip colors
│   ├── layout.tsx           # Root layout with Header + Footer
│   ├── page.tsx             # Default Next.js page (unmodified — Story 2.6)
│   ├── api/search/route.ts  # Search API endpoint (created in 2.2)
│   └── generated/prisma/    # Prisma generated client
├── components/
│   ├── header.tsx           # Header with logo + SearchBar
│   ├── footer.tsx           # Footer with cities, resources, legal
│   ├── search-bar.tsx       # SearchBar client component (created in 2.3)
│   └── ui/                  # shadcn/ui primitives (empty — no components installed yet)
├── lib/
│   ├── utils.ts             # cn() helper (shadcn default)
│   ├── prisma.ts            # Prisma client singleton
│   └── search.ts            # Search query logic (created in 2.2)
└── types/
    └── index.ts             # SearchResponse, ListingResult, ServiceType (created in 2.2)
```

**New files this story creates:**
- `src/components/star-rating.tsx` (NEW)
- `src/components/service-tag-chip.tsx` (NEW)
- `src/components/listing-card.tsx` (NEW)

**Files modified:**
- None — all new files, no modifications to existing code

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4] — Acceptance criteria, user story
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ListingCard (line 822)] — Card anatomy, props, states, accessibility
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#StarRating (line 885)] — Rating display, variants, accessibility
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ServiceTagChip (line 863)] — Chip variants, colors, accessibility
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Service Tag Chip Colors (line 410)] — Color definitions per service type
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Card Layout Specs (line 485)] — Padding, border, radius, gap
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Type Scale (line 440)] — Typography for card elements
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Touch Targets (line 492)] — 44x44px minimum
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ARIA Patterns (line 1281)] — StarRating, ListingCard, ServiceTagChip ARIA
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Strategy (line 1151)] — Mobile single-col, desktop 2-col grid
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Naming (line 378)] — PascalCase exports, kebab-case files
- [Source: _bmad-output/planning-artifacts/architecture.md#Server Components (line 268)] — ListingCard, StarRating, ServiceTagChip are server components
- [Source: _bmad-output/planning-artifacts/architecture.md#Component Boundary (line 669)] — Components receive data via props only
- [Source: _bmad-output/planning-artifacts/architecture.md#Anti-Patterns (line 566)] — No loading.tsx, no barrel files, no hooks in server components
- [Source: src/types/index.ts] — ListingResult interface, ServiceType re-export
- [Source: src/app/globals.css#Chip Colors (line 59)] — CSS custom properties for chip bg/text colors
- [Source: _bmad-output/implementation-artifacts/2-3-searchbar-component.md] — Story 2.3 learnings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — no debug issues encountered.

### Completion Notes List

- StarRating component: server component with custom inline SVG stars, full/partial/empty star logic, compact and full review count variants, aria-label for accessibility
- ServiceTagChip component: server component with SERVICE_TAG_CONFIG map, inline style with CSS variable references for chip colors, card variant only (filter variant returns null — Story 2.5)
- ListingCard component: server component using `<article>` semantic element, company name as Next.js Link, StarRating compact, ServiceTagChip list, conditional review snippet with line-clamp-2, conditional distance label with singular/plural handling, contact links with 44px touch targets, graceful missing data handling
- All three components are server components — zero client JS
- Phone link strips non-digit characters for tel: href while displaying formatted number
- Build verified: `tsc --noEmit` ✓, `lint` ✓, `build` ✓

### Change Log

- **Created** `src/components/star-rating.tsx` — StarRating server component with gold star SVGs, compact/full variants, aria-label
- **Created** `src/components/service-tag-chip.tsx` — ServiceTagChip server component with card variant, CSS variable-driven colors per service type
- **Created** `src/components/listing-card.tsx` — ListingCard server component with full card anatomy, conditional rendering, touch-target-compliant contact links
- **Code Review Fix M1** — Added `inline-flex min-h-[44px] items-center` to company name Link to meet 44px touch target requirement (AC #13)
- **Code Review Fix M2** — Changed chip container from `flex flex-wrap` to `flex overflow-x-auto md:flex-wrap` for horizontal scrolling on mobile (AC #11)

### File List

- `src/components/star-rating.tsx` (NEW)
- `src/components/service-tag-chip.tsx` (NEW)
- `src/components/listing-card.tsx` (NEW)
