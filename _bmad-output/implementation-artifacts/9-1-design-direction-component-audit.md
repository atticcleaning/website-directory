# Story 9.1: Design Direction & Component Audit

Status: done

## Story

As a **product owner**,
I want a documented design direction and prioritized component audit based on the live site with real data,
so that subsequent visual enhancement stories (9.2-9.5) have clear design targets, a priority list, and a `/frontend-design` brief to execute against.

## Acceptance Criteria

1. **Given** the live site with 889 listings across 25+ metros
   **When** the design audit is complete
   **Then** a design direction document exists that defines what "not plain" means specifically for this site — including visual references, target aesthetic, and the emotional shift from "functional" to "authoritative yet approachable"

2. **Given** the current component inventory
   **When** the component audit is complete
   **Then** every user-facing component is assessed on a 1-5 visual polish scale with specific deficiency notes

3. **Given** the audit results
   **When** the priority list is established
   **Then** components are ranked by visual impact (how much improvement moves the needle for the user) and the top-impact areas are identified for Stories 9.2-9.4

4. **Given** the design direction and audit
   **When** the `/frontend-design` brief is created
   **Then** the brief includes: target aesthetic, color/typography refinements (if any), hover/interaction patterns, shadow/depth strategy, and per-component enhancement specs

5. **Given** all design direction outputs
   **When** reviewing for constraint compliance
   **Then** all proposed enhancements maintain: LCP < 1.5s (NFR-P1), CLS < 0.1 (NFR-P2), page weight < 500KB (NFR-P6), WCAG 2.1 AA (NFR-A1), and zero new client-side JS requirements beyond existing client components

6. **Given** the completed audit
   **When** the design brief is finalized
   **Then** the brief is saved as a reusable reference for Stories 9.2-9.5 at `_bmad-output/planning-artifacts/design-brief-epic-9.md`

## Tasks / Subtasks

- [x] Task 1: Visual State Audit — Current Components (AC: #2)
  - [x] 1.1 Screenshot or describe current visual state of each component with real production data
  - [x] 1.2 Rate each component on 1-5 visual polish scale (1=bare minimum, 5=production-polished)
  - [x] 1.3 Document specific deficiencies per component: missing hover states, flat depth, weak typography contrast, spacing issues
  - [x] 1.4 Identify the "visual personality gap" — what the UX spec intended ("calm competence") vs. what currently renders ("functional but generic")

- [x] Task 2: Define Enhanced Design Direction (AC: #1)
  - [x] 2.1 Articulate the target aesthetic in concrete terms: "authority through refined details" — subtle shadows on cards, richer hover interactions, stronger typographic rhythm, more intentional use of the accent color
  - [x] 2.2 Identify 2-3 visual reference sites (real directory/service sites) that hit the target aesthetic
  - [x] 2.3 Define the "design guardrails" — what NOT to do: no gradients, no heavy animations, no image-heavy treatments, no dark mode, no design system rebuild
  - [x] 2.4 Confirm the existing color palette, typography, and spacing tokens are sufficient OR propose minimal token additions (e.g., shadow scale, transition timing)

- [x] Task 3: Priority Impact Ranking (AC: #3)
  - [x] 3.1 Rank all components by user-facing visual impact (how much polish moves the user experience needle)
  - [x] 3.2 Map priorities to Stories 9.2-9.5:
    - Story 9.2: Homepage hero + featured cities + article highlights
    - Story 9.3: ListingCard + search results + filter toolbar
    - Story 9.4: City landing pages + listing detail page
    - Story 9.5: Global polish (header, footer, design system tokens)
  - [x] 3.3 Identify any cross-cutting enhancements that should be in 9.5 (e.g., global hover pattern, shadow tokens, transition definitions)

- [x] Task 4: Create `/frontend-design` Brief (AC: #4, #6)
  - [x] 4.1 Write the design brief document at `_bmad-output/planning-artifacts/design-brief-epic-9.md`
  - [x] 4.2 Include per-story sections with specific enhancement specs:
    - For each component: current state description, target state, specific CSS/Tailwind changes proposed
    - Shadow strategy: when to use shadows, what levels (sm, md), hover behavior
    - Hover/interaction patterns: card lift, border emphasis, color transitions, timing (200ms default)
    - Typography refinements: any size/weight/spacing adjustments
  - [x] 4.3 Include a "Do Not Change" section listing things that must remain as-is: color palette values, font families, semantic HTML structure, ARIA patterns, component props interfaces

- [x] Task 5: Validate Against Performance & Accessibility Constraints (AC: #5)
  - [x] 5.1 Confirm proposed enhancements add zero new JS (CSS-only hover/shadow/transition)
  - [x] 5.2 Estimate CSS weight increase (should be < 2KB)
  - [x] 5.3 Verify no proposed changes introduce CLS risk (no layout-shifting animations)
  - [x] 5.4 Verify all proposed hover states maintain WCAG AA color contrast
  - [x] 5.5 Run `npm run build` to confirm no regressions after design brief is saved

## Dev Notes

### Current Visual State Summary (from codebase audit)

**Components rated by visual polish (1-5):**

| Component | Rating | Key Issues |
|-----------|--------|------------|
| listing-card.tsx | 2/5 | No hover states, flat depth, static contact section |
| city-card.tsx | 2/5 | Only hover is border-primary transition, no lift/shadow |
| article-card.tsx | 2/5 | Same as city-card — minimal hover, no visual personality |
| star-rating.tsx | 2/5 | Empty stars use opacity-50 (crude), small (h-4 w-4) |
| service-tag-chip.tsx | 3/5 | Good color system but chips lack presence — no shadow/border |
| search-bar.tsx | 3/5 | Functional, responsive variants work, but button is generic |
| header.tsx | 1/5 | Completely flat — border-b only, zero personality or shadow |
| footer.tsx | 2/5 | Minimal hover on links, small text, no section distinction |
| Homepage hero | 1/5 | Text-only, zero visual interest, no background or depth |
| City landing page | 2/5 | Plain heading + stats, nearby cities are plain text links |
| Listing detail page | 2/5 | Review cards have borders but contact/hours/map lack treatment |

**What makes it "functional but plain":**
1. No hover states on ~80% of interactive elements
2. No depth or shadows anywhere — all cards flat
3. No transitions or micro-interactions
4. Hero section is plain text on a flat background
5. Color palette used conservatively — service chips are the only colorful elements
6. Header has zero visual weight or personality

**What the UX spec intended ("calm competence"):**
The UX spec's "visual restraint" was correctly implemented but over-applied. "Calm" was achieved; "competence" (authority, trust, polish) was not. The site reads as a prototype, not a finished product.

### Architecture Constraints for Design Work

**MUST maintain:**
- All components are React Server Components except SearchBar and FilterToolbar (client)
- Tailwind utility classes only — no CSS modules, no styled-components
- shadcn/ui design tokens via CSS variables in globals.css
- Semantic HTML structure and ARIA patterns unchanged
- Component props interfaces unchanged
- Zero new client-side JS — all visual enhancements must be CSS-only
- `cn()` from `@/lib/utils` for conditional className merging

**MUST NOT do:**
- Add animation libraries (framer-motion, etc.)
- Add image assets to cards (photos, icons beyond existing SVGs)
- Change color palette values in globals.css (only add new tokens if needed)
- Add new font families or weights
- Add loading spinners or skeleton screens
- Break existing responsive breakpoints
- Add `"use client"` to any currently server-side component

### Enhancement Approach: CSS-Only Polish

All visual enhancements for Epic 9 should be achievable through Tailwind classes only:
- **Shadows:** `shadow-sm` default, `shadow-md` on hover — adds card depth
- **Transitions:** `transition-all duration-200` — smooth hover interactions
- **Scale:** `hover:scale-[1.01]` or `hover:scale-[1.02]` — subtle card lift
- **Border:** `hover:border-primary` already exists — can be combined with shadow
- **Background:** Subtle gradient or tint on hero section via Tailwind gradient classes
- **Typography:** Adjust font sizes or weights via Tailwind — no new CSS needed

### Recent Git Intelligence

```
076c097 Fix LCP: preload fonts, cache homepage, stream below-fold content
9c3df3f Expand business type filter to 50+ excluded subtypes and add restoration services
3d77402 Implement Story 8.4: Data Quality Audit, Business Type Filter & Remediation Imports
```

Key insight from latest commit (076c097): Header was just converted from client to server component — SearchBar now always renders in header. This means the header is simpler and easier to enhance visually without touching client code.

### Production Dataset Context

The design audit and brief should reference real production data:
- **889 listings** across 25+ metros
- **254 city pages** with varying listing counts (Phoenix: 47, Houston: 54, etc.)
- **2 article pages** (more coming in Epic 10)
- **Homepage:** Features top 8 cities by listing count + 2-3 articles
- **Largest city page (Houston):** ~54 listings to test card grid density

### Technical Stack Reference

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| Tailwind CSS | v4 |
| shadcn/ui | 3.x |
| Radix UI | 1.4.3 |

### Project Structure Notes

- Components: `src/components/` (flat, no feature folders)
- Design tokens: `src/app/globals.css` (OKLCH-based CSS variables)
- Tailwind config: Tailwind v4 uses CSS-based config in globals.css, not tailwind.config.ts
- Font config: `src/app/layout.tsx` (Plus Jakarta Sans, Source Serif 4, Lora)

### What NOT to Do

- **Do NOT implement any visual changes in this story** — this is audit + brief only
- **Do NOT modify component code** — output is a design brief document
- **Do NOT redesign the information architecture** — layout patterns stay the same
- **Do NOT propose features** — only visual polish on existing components
- **Do NOT change the UX spec** — that happens in Story 9.5 after implementation

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Epic 9 definition]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Visual Design Foundation" section]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md — "Emotional Design Principles" section]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Implementation Patterns & Consistency Rules"]
- [Source: _bmad-output/planning-artifacts/architecture.md — "Anti-Patterns (explicitly forbidden)"]
- [Source: src/app/globals.css — Current OKLCH color token definitions]
- [Source: src/app/layout.tsx — Font configuration (Lora preloaded, italic variants removed)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- Browser extension unavailable for visual screenshots — proceeded with codebase-based analysis
- Build verified: 1153 pages, no regressions

### Completion Notes List

- Audited 14 user-facing components with 1-5 visual polish ratings
- Identified "Visual Personality Gap": UX spec's "calm competence" over-applied as "no visual treatment"
- Target aesthetic defined: "Authority Through Refined Details" with 3 reference sites (NerdWallet, Zillow, BBB)
- 10 design guardrails documented (no gradients, no animations, no images, etc.)
- Existing tokens confirmed sufficient; proposed minimal shadow token additions
- All 14 components ranked by visual impact (1-14) and mapped to Stories 9.2-9.5
- Cross-cutting patterns identified for Story 9.5 (shadow tokens, transition standards, header shadow)
- Per-story enhancement specs include current state, target state, and specific Tailwind class changes
- Validated: zero new JS, < 1KB CSS increase, no CLS risk, WCAG AA maintained, build passes
- Design brief saved to `_bmad-output/planning-artifacts/design-brief-epic-9.md`

### File List

- `_bmad-output/planning-artifacts/design-brief-epic-9.md` — Primary deliverable (new file)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Updated: 9-1 status to review
