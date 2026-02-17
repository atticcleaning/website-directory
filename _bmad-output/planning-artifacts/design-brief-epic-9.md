# Design Brief — Epic 9: Visual Design Enhancement

**Author:** Dev Agent (Claude Opus 4.6)
**Date:** 2026-02-17
**Status:** Final
**Scope:** CSS-only visual polish for Stories 9.2-9.5

---

## 1. Visual State Audit — Current Components

### Component Ratings (1-5 Visual Polish Scale)

| Component | File | Rating | Key Deficiencies |
|-----------|------|--------|------------------|
| **Header** | `header.tsx` | 1/5 | Single `border-b border-border` — zero shadow, no brand presence, no visual weight. Logo is plain text with no differentiation. Feels like a wireframe placeholder. |
| **Homepage Hero** | `page.tsx` (root) | 1/5 | Plain `<h1>` + SearchBar on a flat white background. No depth, no background treatment, no visual interest. The most important page section has the least visual investment. |
| **ListingCard** | `listing-card.tsx` | 2/5 | Has `rounded-lg border border-border bg-card p-3` but zero hover states, zero shadow, zero transitions. Company name link has no hover styling. Contact section border-t is functional but flat. |
| **CityCard** | `city-card.tsx` | 2/5 | Only hover is `hover:border-primary` with `transition-colors`. No shadow, no lift, no scale. The card reads as a styled link, not a navigable destination. |
| **ArticleCard** | `article-card.tsx` | 2/5 | Identical pattern to CityCard — `hover:border-primary` only. Topic tag is uppercase muted text with no visual container. No depth or presence. |
| **StarRating** | `star-rating.tsx` | 2/5 | Stars are `h-4 w-4` (16px) — small for a primary trust signal. Partial stars use `opacity-50` which is crude and low-contrast. Empty stars use `text-muted-foreground/20` which nearly disappears. |
| **ServiceTagChip** | `service-tag-chip.tsx` | 3/5 | Best-styled component — uses OKLCH color system with per-service bg/text. But chips lack presence: no border, no shadow, `rounded-full` with thin padding. They blend into the card rather than standing out as scannable signals. |
| **SearchBar** | `search-bar.tsx` | 3/5 | Functional dual-variant (hero/header). But the submit button is completely flat (`bg-primary` with no hover state, no transition, no shadow). No focus ring enhancement on the input beyond default. |
| **FilterToolbar** | `filter-toolbar.tsx` | 3/5 | Filter chips have `transition-colors` and proper `aria-pressed` states. But active/inactive contrast is generic, no shadow differentiation. Sort select is default shadcn with no visual integration. |
| **Footer** | `footer.tsx` | 2/5 | Single `border-t border-border`. Links have `hover:text-foreground hover:underline` which is minimal. No section visual separation, text is small (`text-sm`, `text-xs`). Reads as an afterthought. |
| **City Landing Page** | `[citySlug]/page.tsx` | 2/5 | Plain heading + stats text. Nearby cities rendered as a `<ul>` with `hover:underline` links — no cards, no visual treatment, just text links. No hero or context-setting visual. |
| **Listing Detail Page** | `[citySlug]/[companySlug]/page.tsx` | 2/5 | Review cards have `rounded-lg border border-border bg-card` (same as ListingCard). Contact links are plain `text-primary` with no button treatment. Section headings have no visual rhythm or spacing hierarchy. Business hours `<dl>` is unstyled. |
| **Article Detail Page** | `articles/[slug]/page.tsx` | 2/5 | Topic tag is plain uppercase muted text (no container/pill). Published date has no visual distinction. Related articles section heading has no treatment beyond text. Prose content is well-styled via globals.css `.prose` rules. |
| **MDX FindPros CTA** | `mdx/find-pros.tsx` | 1/5 | Completely unstyled `<p><Link>` — a critical content-to-directory CTA rendered as a plain paragraph with a link. Zero visual emphasis, no button treatment, no arrow styling. |
| **MDX CityStats** | `mdx/city-stats.tsx` | 2/5 | Plain `<span>` with inline text. No visual container or emphasis for what should be a compelling data callout within article content. |
| **404 Not Found Page** | `not-found.tsx` | 3/5 | Has a styled CTA button (`bg-primary hover:bg-primary/90`) and SearchBar. Better than most components but the page itself has minimal visual treatment — plain centered text. |
| **RadiusInfo** | `radius-info.tsx` | 2/5 | Plain `text-sm text-muted-foreground` paragraph. No icon, no visual container, no differentiation from surrounding content. |
| **GoogleMap** | `google-map.tsx` | 3/5 | Has `rounded-lg border border-border` on the iframe. Fallback is clean. Loading state is handled. Adequate. |

### The Visual Personality Gap

**What the UX spec intended:** "Calm competence" — a site that feels authoritative, trustworthy, and polished. Visual restraint that communicates seriousness, not emptiness. Typographic hierarchy doing the heavy lifting. Data density as a trust signal.

**What currently renders:** "Functional prototype" — correct semantic structure, good responsive behavior, proper accessibility patterns, but visually indistinguishable from a Tailwind CSS tutorial output. The restraint was applied universally rather than strategically. Everything is equally flat, equally plain, equally quiet — which reads as unfinished rather than calm.

**The core issue:** The UX spec's "visual restraint" was interpreted as "no visual treatment." Restraint should mean *selective, intentional* visual emphasis — shadows on cards but not everywhere, hover interactions on interactive elements, typographic weight where the eye should go first. Currently, the entire site operates at one visual volume level (quiet), when it needs a dynamic range from quiet (footer, metadata) to confident (hero, card hover, star ratings).

---

## 2. Enhanced Design Direction

### Target Aesthetic: "Authority Through Refined Details"

The visual upgrade is not a redesign. It is the difference between a professionally typeset book and a manuscript printout — same content, dramatically different perceived quality. The site should feel like a **curated professional resource**, not a personal project.

**Concrete attributes:**
- Cards have subtle depth (shadow at rest, stronger shadow + micro-lift on hover)
- Interactive elements respond to interaction (hover, focus) with smooth transitions
- The hero section has visual weight and context (subtle background, more intentional spacing)
- Typography has stronger rhythm — headings feel anchored, body text has breathing room
- The header has enough visual weight to feel like a persistent landmark, not a divider line
- Color accents are used more intentionally — the primary blue appears on interaction states, not just text links

### Visual Reference Sites

1. **NerdWallet** (nerdwallet.com) — Data-dense cards with subtle shadows, clean typography, professional polish without being corporate. Their card hover states (shadow + border) are exactly the level we're targeting.
2. **Zillow listing results** — Consistent card format with clear visual hierarchy, smooth interactions, data density that feels organized rather than cluttered. Star ratings are prominent.
3. **Better Business Bureau** (bbb.org/search) — Directory-style results with trust signals (ratings, accreditation badges). Clean, authoritative, no-nonsense. Their blue + warm palette is similar to our primary + accent strategy.

### Design Guardrails — What NOT to Do

1. **No gradients** — flat backgrounds only (white, off-white, subtle tint)
2. **No heavy animations** — transitions only (200ms default, CSS `transition` property)
3. **No image-heavy treatments** — no hero images, no card thumbnails, no decorative graphics
4. **No dark mode** — single light theme
5. **No design system rebuild** — extend existing tokens, don't replace them
6. **No new font families or weights** — use existing Plus Jakarta Sans (500/600/700), Source Serif 4 (400), Lora (500)
7. **No `"use client"` on server components** — all visual changes are CSS/Tailwind classes only
8. **No animation libraries** (framer-motion, etc.)
9. **No layout restructuring** — same information architecture, same card content, same page structure
10. **No loading spinners or skeleton screens**

### Token Assessment

**Existing tokens are sufficient.** No custom CSS variable additions required.

**Shadow strategy: Use Tailwind v4 built-in classes exclusively.**
- `shadow-sm` — resting state for cards
- `shadow-md` — hover state for cards
- `shadow-lg` — reserved for dropdowns/popovers (shadcn Select already uses this)

Tailwind v4's built-in shadow utilities are well-calibrated and consistent. Custom shadow tokens would duplicate functionality without benefit. All stories (9.2-9.4) should use Tailwind shadow classes directly — no dependency on globals.css changes.

**Hero background:** Use `bg-secondary` (existing token, `oklch(0.965 0.003 100)`) for the hero tint. No custom `--hero-bg` token needed.

### Transition & Interaction Standards

| Property | Value | Usage |
|----------|-------|-------|
| Default transition | `transition-all duration-200 ease-in-out` | All interactive elements |
| Card hover shadow | `shadow-sm` → `shadow-md` | ListingCard, CityCard, ArticleCard |
| Card hover lift | `hover:-translate-y-0.5` | Cards only (subtle, ~2px) |
| Button hover | `hover:brightness-90` | Submit buttons (darkens on hover — increases contrast) |
| Link hover | `hover:text-primary` + existing underline patterns | Text links |
| Focus visible | Already defined in globals.css (2px primary outline) | All focusable elements |

---

## 3. Priority Impact Ranking

### Components Ranked by Visual Impact

| Rank | Component/Area | Impact Score | Rationale |
|------|---------------|--------------|-----------|
| 1 | **Homepage Hero** | 10/10 | First thing every visitor sees. Currently the worst-rated area (1/5). Background tint + spacing + search bar styling = massive perceived quality jump. |
| 2 | **ListingCard** | 9/10 | The core product element seen on every search/city page. Shadow + hover states transform perception from "list of data" to "curated directory." |
| 3 | **Header** | 9/10 | Visible on every single page. Currently rated 1/5. Adding shadow + visual weight immediately elevates the entire site's perceived quality. |
| 4 | **CityCard** | 7/10 | Featured prominently on homepage. Shadow + hover lift makes the homepage feel polished. |
| 5 | **SearchBar button** | 7/10 | Primary CTA on every page. Hover state + subtle styling makes interactions feel responsive. |
| 6 | **StarRating** | 6/10 | Primary trust signal. Slightly larger stars + better empty/partial rendering improves data readability. |
| 7 | **City Landing Page** | 6/10 | 254 programmatic pages. Heading treatment + nearby cities as cards (not text links) adds polish. |
| 8 | **Listing Detail Page** | 6/10 | Contact section and review cards benefit from shadow + section spacing refinement. |
| 9 | **ArticleCard** | 5/10 | Only 2-3 articles currently. Shadow + hover aligns with CityCard treatment. |
| 10 | **FilterToolbar** | 5/10 | Active chip states and sort control — functional but benefits from visual refinement. |
| 11 | **ServiceTagChip** | 4/10 | Already the best-styled element (3/5). Minor border addition for definition. |
| 12 | **Footer** | 4/10 | Background color + better section spacing. Low-traffic area but completes the "finished" feeling. |
| 13 | **MDX FindPros CTA** | 4/10 | Content-to-directory conversion CTA in articles. Currently invisible — needs button or link-card treatment. Assign to Story 9.4. |
| 14 | **Article Detail Page** | 3/10 | Topic tag and date treatment. Prose is already well-styled. Related articles section uses ArticleCard (covered). Assign to Story 9.4. |
| 15 | **RadiusInfo** | 3/10 | Minor — add info icon for visual anchor. Low frequency element. |
| 16 | **MDX CityStats** | 2/10 | Inline text component — minor visual container improvement. Assign to Story 9.4. |
| 17 | **404 Not Found Page** | 2/10 | Already has styled CTA button. Minor polish. Assign to Story 9.5. |
| 18 | **GoogleMap** | 2/10 | Already adequate (3/5). No changes needed. |

### Story Mapping

**Story 9.2 — Homepage Redesign** (Rank 1, 4, 9)
- Homepage hero section (background tint, spacing, typography refinement)
- Featured Cities grid (CityCard shadow + hover)
- Educational Content section (ArticleCard shadow + hover)
- Homepage-specific spacing and section transitions

**Story 9.3 — ListingCard + Search Results Enhancement** (Rank 2, 5, 6, 10)
- ListingCard shadow + hover states + contact section treatment
- SearchBar button hover + styling refinement
- StarRating size + empty star treatment
- FilterToolbar chip visual refinement + sort control styling
- Search results page heading treatment

**Story 9.4 — City Landing + Listing Detail + Article Detail Enhancement** (Rank 7, 8, 13, 14, 15, 16)
- City landing page heading/stats treatment
- Nearby cities as styled links or mini-cards (not plain `<ul>`)
- Listing detail contact section button treatment
- Review card shadow + spacing
- Business hours visual treatment
- Article detail page: topic tag pill, date styling, related articles section
- MDX FindPros CTA: button or link-card treatment for content-to-directory conversion
- MDX CityStats: subtle visual container for inline data callouts
- RadiusInfo icon + container

**Story 9.5 — Global Polish + Design System Update** (Rank 3, 11, 12, 17)
- Header shadow + brand presence
- Footer background + section styling
- ServiceTagChip border/definition
- 404 Not Found page minor polish (already has styled CTA)
- Transition standard application across remaining elements
- Any cross-cutting patterns identified during 9.2-9.4

### Cross-Cutting Items for Story 9.5

These global patterns are used across all stories:
1. Standard transition class pattern: `transition-all duration-200`
2. Card hover pattern: `shadow-sm` at rest → `hover:shadow-md hover:-translate-y-0.5` on hover
3. Header shadow as a global persistent element

> **No blocking dependencies:** All stories use Tailwind v4 built-in utilities (`shadow-sm`, `shadow-md`, `transition-all`, `duration-200`). Stories 9.2-9.4 can proceed in any order without waiting for globals.css changes.

---

## 4. Per-Story Enhancement Specifications

### Story 9.2 — Homepage Redesign

#### Hero Section (`src/app/page.tsx`)

**Current state:**
```html
<section className="flex flex-col items-center text-center">
  <h1 className="font-display text-[1.75rem] font-medium leading-[1.2] text-foreground md:text-[2.5rem]">
    Find trusted attic cleaning professionals near you
  </h1>
  <div className="mt-6 w-full max-w-2xl">
    <SearchBar variant="hero" />
  </div>
</section>
```

**Target state:**
- Subtle background tint on hero section (via `bg-secondary` or custom `bg-[oklch(0.965_0.008_264)]`)
- Rounded container or full-width band with generous vertical padding
- Subtle supporting text below h1 (optional — e.g., "889 companies across 25+ metros")
- SearchBar with enhanced button styling

**Specific changes:**
```
<section> wrapper:
  ADD: bg-secondary rounded-xl px-6 py-10 md:py-14
  KEEP: flex flex-col items-center text-center
  NOTE: Test at 1200-1400px viewport widths — the rounded corners should look
        intentional within the max-w-[1200px] container, not awkward at the edges.

<h1>:
  KEEP: font-display text-[1.75rem] font-medium leading-[1.2] text-foreground md:text-[2.5rem]
  (No changes — typography is correct per UX spec)

SearchBar wrapper <div>:
  KEEP: mt-6 w-full max-w-2xl
```

#### CityCard Enhancement (`src/components/city-card.tsx`)

**Current state:** `rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary`

**Target state:** Card with resting shadow, hover shadow + lift + border, smooth transition

**Specific changes:**
```
<Link> className:
  REMOVE: transition-colors
  ADD: shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary
```

#### ArticleCard Enhancement (`src/components/article-card.tsx`)

**Current state:** `rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary`

**Target state:** Same treatment as CityCard for consistency.

**Specific changes:**
```
<Link> className:
  REMOVE: transition-colors
  ADD: shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-primary
```

#### Section Headings

**Current state:** `mt-8` gap between hero and Featured Cities

**Target state:** Slightly more generous vertical rhythm between homepage sections

**Specific changes:**
```
Featured Cities <section>:
  CHANGE: mt-8 → mt-10 md:mt-12

Educational Content <section>:
  CHANGE: mt-8 → mt-10 md:mt-12
```

---

### Story 9.3 — ListingCard + Search Results Enhancement

#### ListingCard (`src/components/listing-card.tsx`)

**Current state:** `rounded-lg border border-border bg-card p-3 md:p-4` — flat, no hover, no transitions

**Target state:** Resting shadow, hover shadow + lift, company name link hover color, contact section refinement

**Specific changes:**
```
<article> className:
  ADD: shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5

Company name <Link>:
  ADD: hover:text-primary transition-colors duration-200

Contact <a> links (phone + website):
  ADD: hover:underline transition-colors duration-200
```

#### StarRating (`src/components/star-rating.tsx`)

**Current state:** Stars are `h-4 w-4` (16px). Partial star is `opacity-50`. Empty stars are `text-muted-foreground/20`.

**Target state:** Slightly larger stars on full variant, better partial/empty rendering.

**Specific changes:**
```
Full variant star size (listing detail page):
  CHANGE: h-4 w-4 → h-5 w-5 (when variant="full")

Compact variant:
  KEEP: h-4 w-4 (unchanged)

Partial star:
  CHANGE: opacity-50 → opacity-60 (slightly more visible)

Empty stars:
  CHANGE: text-muted-foreground/20 → text-muted-foreground/25 (slightly more visible)
```

#### SearchBar Button (`src/components/search-bar.tsx`)

> **Shared component note:** SearchBar is used in 3 contexts: hero (homepage, Story 9.2), header (global, Story 9.5), and 404 page (`not-found.tsx`, Story 9.5). Since it's a single component, changes here apply to ALL instances. Assigned to Story 9.3 as the primary search interaction story. No per-variant branching needed — both `hero` and `header` variants benefit equally from the button hover state.

**Current state:** `bg-primary font-sans font-semibold text-primary-foreground disabled:opacity-50` — no hover state, no transition

**Target state:** Hover darkening + transition for responsiveness. Darkening (not lightening) ensures contrast ratio stays above WCAG AA 4.5:1 for all text sizes.

**Specific changes:**
```
<button> className:
  ADD: transition-all duration-200 hover:brightness-90
  (darkens the button on hover — maintains/improves WCAG AA contrast for white text at any size)
```

> **WCAG note:** `hover:bg-primary/90` (alpha reduction) was considered but rejected — it lightens the background, reducing contrast with white text. The header variant uses `text-sm` (14px) + `font-semibold` (600), which is NOT guaranteed to qualify as WCAG "large text." Using `hover:brightness-90` (darkening) avoids this risk entirely.

#### FilterToolbar Chips (`src/components/filter-toolbar.tsx`)

**Current state:** Filter buttons have `transition-colors` but no shadow differentiation between active/inactive.

**Target state:** Active chips slightly elevated, inactive chips more distinct on hover.

**Specific changes:**
```
Active filter button:
  ADD: shadow-sm

Inactive filter button:
  ADD: hover:bg-muted transition-colors duration-200

"All Services" button follows same pattern.
```

---

### Story 9.4 — City Landing + Listing Detail Enhancement

#### City Landing Page (`src/app/[citySlug]/page.tsx`)

**Current: Nearby Cities section**
```html
<ul className="mt-3 space-y-2">
  <li><Link className="...hover:underline">City, State — N companies</Link></li>
</ul>
```

**Target state:** Nearby cities as a horizontal grid of styled link items, not a plain list.

**Specific changes:**
```
Nearby cities container:
  CHANGE: <ul className="mt-3 space-y-2"> → <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">

Each nearby city:
  CHANGE: plain <li><Link> → <Link> with rounded-lg border border-border bg-card px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary
```

#### City Landing — Stats Section

**Current state:** Plain text stats below h1

**Target state:** Subtle visual emphasis on key metrics

**Specific changes:**
```
Stats container <div>:
  ADD: bg-secondary rounded-lg px-3 py-2 inline-flex
  (wraps the "N companies · X.X avg" in a subtle pill)
```

#### Listing Detail Page (`src/app/[citySlug]/[companySlug]/page.tsx`)

**Contact links:**
```
Current: plain text-primary links
Target: Add hover underline + transition for consistency
  ADD: hover:underline transition-colors duration-200
```

**Review cards:**
```
Current: rounded-lg border border-border bg-card p-3 md:p-4
Target: Add subtle shadow for visual separation
  ADD: shadow-sm
```

**Business hours `<dl>`:**
```
Current: plain <dl> with space-y-1
Target: Add subtle container
  ADD (wrapper): rounded-lg bg-secondary p-4 (on a wrapping div)
```

**Section spacing:**
```
Current: mt-8 between all sections
Target: More intentional rhythm
  KEEP: mt-8 for most sections
  Contact section: Remains mt-8 (first content section after header)
```

#### City back-link at bottom:
```
Current: border-t border-border pt-6
Target: Slightly more emphasis
  ADD: hover:text-primary transition-colors duration-200 (on the Link)
```

#### Article Detail Page (`src/app/articles/[slug]/page.tsx`)

**Current state:** Topic tag is plain `text-xs font-medium uppercase text-muted-foreground`. Date is plain `text-sm text-muted-foreground`. Related articles section heading has standard treatment.

**Target state:** Topic tag in a subtle pill container (matching ArticleCard topic tag treatment). Date with slightly more presence.

**Specific changes:**
```
Topic tag <span>:
  ADD: bg-secondary rounded-full px-2.5 py-0.5 inline-flex items-center
  (creates a subtle pill matching the visual language of chips/tags elsewhere)

Published date <time>:
  KEEP: font-sans text-sm text-muted-foreground (adequate — date doesn't need emphasis)

Related articles section <section>:
  CHANGE: mt-8 → mt-10 md:mt-12 (consistent with homepage section spacing)
```

#### MDX FindPros CTA (`src/components/mdx/find-pros.tsx`)

**Current state:** Plain `<p><Link>Find {service} pros near you →</Link></p>` — completely unstyled, renders as inline article text with a link.

**Target state:** Visually distinct CTA that stands out from article body text as an action element.

**Specific changes:**
```
<p> wrapper:
  ADD: mt-4 mb-4 (vertical breathing room)

<Link>:
  ADD: inline-flex items-center gap-1 font-sans text-sm font-semibold text-primary hover:underline transition-colors duration-200
  (uses primary color + semibold to visually distinguish from serif body text)
```

#### MDX CityStats (`src/components/mdx/city-stats.tsx`)

**Current state:** Plain `<span>` with inline text — no visual distinction from surrounding prose.

**Target state:** Subtle emphasis to signal this is dynamic data, not static content.

**Specific changes:**
```
<span>:
  ADD: font-sans text-sm font-medium
  (switches from inherited serif to sans-serif, signaling "data" vs "prose")
```

---

### Story 9.5 — Global Polish + Design System Update

#### Header (`src/components/header.tsx`)

**Current state:** `border-b border-border` — single border, zero depth

**Target state:** Subtle shadow replaces or supplements border, creating visual weight

**Specific changes:**
```
<header> className:
  CHANGE: border-b border-border → bg-card shadow-sm
  (shadow-sm provides the bottom edge definition without needing a border)

  OR if border is preferred:
  CHANGE: border-b border-border → border-b border-border shadow-sm
```

#### Footer (`src/components/footer.tsx`)

**Current state:** `border-t border-border` with white background

**Target state:** Subtle background color + border for section distinction

**Specific changes:**
```
<footer> className:
  CHANGE: border-t border-border → border-t border-border bg-secondary
  (muted background separates footer from content)
```

#### ServiceTagChip (`src/components/service-tag-chip.tsx`)

**Current state:** `rounded-full px-2.5 py-0.5` with color bg/text — no border

**Target state:** Add subtle border for definition against card backgrounds

**Specific changes:**
```
<span> className:
  ADD: border border-current/10
  (uses the text color at 10% opacity as a subtle border — adds definition without a new token)

  Alternative: ring-1 ring-inset ring-current/10
```

#### globals.css — No Token Additions Required

All shadow, transition, and background utilities use Tailwind v4 built-in classes. No custom CSS variables are added to globals.css in Epic 9. If visual testing during 9.2-9.4 reveals that Tailwind's default shadow values need adjustment, Story 9.5 can introduce custom tokens at that point — but this is not expected.

---

## 5. Performance & Accessibility Validation

### Zero New JS Requirement — CONFIRMED

All proposed changes are Tailwind utility classes applied to existing `className` props:
- `shadow-sm`, `shadow-md` — CSS `box-shadow`
- `transition-all duration-200` — CSS `transition`
- `hover:-translate-y-0.5` — CSS `transform`
- `hover:shadow-md` — CSS `box-shadow` on `:hover`
- `bg-secondary` — CSS `background-color`
- `hover:brightness-90` — CSS `filter: brightness()` on `:hover`
- `hover:text-primary` — CSS `color` on `:hover`

**No new `"use client"` directives required.** All server components remain server components.

### CSS Weight Estimate

Estimated new CSS from additional Tailwind classes: **< 1KB gzipped**

Breakdown:
- Shadow utilities (`shadow-sm`, `shadow-md`): ~200 bytes
- Transition utilities (`transition-all`, `duration-200`): ~150 bytes
- Transform utilities (`hover:-translate-y-0.5`): ~100 bytes
- Background color additions: ~100 bytes
- Hover state variants of above: ~200 bytes

This is well within the < 2KB story constraint and negligible against the existing CSS bundle.

### CLS (Cumulative Layout Shift) Risk — NONE

All proposed changes are:
- `box-shadow`: Does not affect layout (composited)
- `transform: translateY()`: Does not affect layout (composited)
- `transition`: Does not cause layout shifts
- `background-color`: Does not affect layout
- `opacity` changes: Does not affect layout

**No layout-shifting properties are introduced.** CLS < 0.1 (NFR-P2) is maintained.

### WCAG AA Color Contrast — MAINTAINED

All proposed changes preserve existing text colors:
- `hover:text-primary` — primary is `oklch(0.546 0.215 264)` on white `oklch(1 0 0)` = contrast ratio ~5.2:1 (passes AA)
- `hover:brightness-90` on buttons — darkens the primary background, which *increases* contrast with white text. No regression possible.
- `bg-secondary` background — `oklch(0.965 0.003 100)` is nearly white, all text colors pass against it
- Shadow and border changes do not affect text contrast

**No contrast regressions introduced.**

### Page Weight Budget — MAINTAINED

- No new images
- No new fonts
- No new JS bundles
- CSS increase < 1KB
- **Page weight remains < 500KB (NFR-P6)**

### LCP Impact — NONE

- No changes to the critical rendering path
- No new blocking resources
- Hero section changes are CSS-only (background-color renders instantly)
- **LCP < 1.5s target (NFR-P1) unaffected**

---

## 6. Do Not Change

The following must remain as-is through all Epic 9 stories:

### Colors
- All values in `globals.css` `:root` — primary, foreground, background, accent, muted, border, etc.
- All chip color tokens (`--chip-rodent-bg`, etc.)

### Typography
- Font families: Plus Jakarta Sans, Source Serif 4, Lora — no additions
- Font weights: 500/600/700 (Jakarta Sans), 400 (Source Serif 4), 500 (Lora) — no additions
- Font loading strategy in `layout.tsx` — no changes

### Structure
- Semantic HTML elements (`<header>`, `<main>`, `<footer>`, `<article>`, `<section>`, `<nav>`)
- ARIA attributes (`role="banner"`, `role="search"`, `aria-label`, `aria-pressed`, etc.)
- Component props interfaces (no prop additions or removals)
- `"use client"` / server component boundaries
- Responsive breakpoints and grid layouts
- `cn()` utility usage pattern from `@/lib/utils`

### Data & Logic
- Prisma queries and data fetching patterns
- Search/filter/sort logic in FilterToolbar
- URL structure and routing
- SEO metadata generation
- JSON-LD structured data

---

## 7. Implementation Sequence Recommendation

```
9.2 → 9.3 → 9.4 → 9.5
```

**Rationale:** All stories use Tailwind v4 built-in utilities — no globals.css setup step needed. Proceed by user visibility: homepage (9.2), search results (9.3), city/detail/article pages (9.4), global elements (9.5). Header shadow (Story 9.5) is deferred despite being high-impact because it's a single-line change that doesn't block other work. Stories 9.2-9.4 are independent and could technically run in parallel, but sequential order is recommended to incorporate visual learnings from each story into the next.

---

*This brief is the single reference document for all Epic 9 visual enhancement work. Each story should reference the relevant section above for specific class changes. No visual changes should be made outside the scope defined here without updating this brief.*
