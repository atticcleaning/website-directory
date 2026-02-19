# Sprint Change Proposal — Epic 11: Advanced Visual Polish (Malewicz Design Principles)

**Date:** 2026-02-18
**Triggered by:** Strategic initiative — apply professional UI design principles from Michal Malewicz to elevate visual quality
**Mode:** Batch (all proposals presented together)
**Change Scope:** Moderate

---

## Section 1: Issue Summary

### Problem Statement
All 10 epics are complete and the attic cleaning directory website is functionally complete. Epic 9 addressed the initial visual design enhancement, upgrading components from a "functional prototype" look (rated 1-2/5) to a polished baseline. However, the site still relies on **generic Tailwind shadow tokens** (`shadow-sm`, `shadow-md`), **flat color backgrounds**, and **minimal depth hierarchy** — resulting in a visual experience that, while clean, does not yet leverage the psychological advantages of professional-grade UI design.

### Context
The Malewicz course transcript (11,077 lines) teaches the **Aesthetic Usability Effect**: users automatically assume better-looking products ARE better. For a directory website competing for trust, this is critical — first impressions determine whether a user stays to search or bounces to a competitor. The current design is functional but does not signal "premium, trustworthy resource" at first glance.

### Evidence
- **Shadows**: All cards use Tailwind's generic `shadow-sm` (0 1px 2px rgba(0,0,0,.05)) — a one-size-fits-all token that ignores background hue. Malewicz's core rule: "Shadow color must derive from the background color."
- **Gradients**: Zero gradient usage across the entire site. Every background is a flat solid color. Malewicz: "Gradients are like the new colors — everything in nature is a gradient."
- **Button hierarchy**: Search button (`h-11`) is identical height to the input — no visual progression from input to action. Malewicz: "Buttons must be visibly taller than form fields."
- **Depth**: Cards all have the same shadow weight — no focal hierarchy. Malewicz: "One large shadow per screen for the focal element. Reserve large, dramatic shadows for a single focal element."
- **Decoration**: Zero decorative elements on any page. While Malewicz warns against overdoing decoration on transactional pages, the homepage hero (the first thing visitors see) is a flat `bg-secondary rounded-xl` rectangle with no visual interest.

---

## Section 2: Impact Analysis

### Epic Impact
| Epic | Status | Impact |
|------|--------|--------|
| Epics 1-10 | Done | **No impact.** All existing work is preserved. |
| Epic 11 (NEW) | Proposed | New epic: CSS-only visual enhancements applying Malewicz principles. |

- No existing epic is modified, rolled back, or resequenced
- No dependencies on incomplete work
- Epic 11 builds directly on Epic 9's foundation

### Story Impact
- No existing stories are modified
- 5 new stories proposed for Epic 11 (see Section 4)

### Artifact Conflicts

**PRD:** No conflict. Enhances NFR-6 (UX quality) and supports the "calm competence" emotional design goal. The PRD's anti-pattern list (no popups, no lead-gen walls) is fully respected — all changes are visual polish only.

**Architecture:** No conflict. All changes are CSS-only:
- No new API routes
- No database schema changes
- No new dependencies or packages
- No infrastructure changes
- No build process changes (zero CLS risk)

**UX Design Specification:** Enhancement, not conflict. The spec's "calm competence" emotional goal is directly reinforced by Malewicz's subtlety-first philosophy. Specific updates needed to document new shadow values, gradient tokens, and decoration patterns. The three-font typographic system and service tag chip colors are preserved unchanged.

**Other Artifacts:** No impact on CI/CD, deployment scripts, testing strategies, or monitoring.

### Technical Impact
- **Risk level: Low** — CSS-only changes with no JavaScript logic changes
- **Performance impact: Negligible** — custom shadows may use slightly more complex CSS but no additional network requests
- **Accessibility impact: Positive** — Malewicz principles explicitly require AA contrast on all functional elements; decoration is permitted at lower contrast
- **Browser compatibility: Standard** — `box-shadow`, `linear-gradient`, `filter: blur()` have universal browser support

---

## Section 3: Recommended Approach

### Selected Path: Direct Adjustment (Option 1)

**Add new Epic 11** with 5 focused CSS-only stories that systematically apply Malewicz design principles adapted for the web directory context.

### Rationale
1. **Low risk**: CSS-only changes cannot break functionality. Every change is visually reversible.
2. **High value**: The Aesthetic Usability Effect directly increases user trust and engagement — critical for a directory that lives or dies on first impressions.
3. **Clear foundation**: Epic 9's existing work provides a solid base. We're not redesigning — we're elevating.
4. **No rollback needed**: Nothing from Epics 1-10 conflicts with this work.
5. **Maintainable scope**: 5 stories, each independently deployable, each CSS-focused.

### Effort Estimate: Medium
- Each story is a focused CSS enhancement pass (similar to Epic 9 stories)
- No new React components, no API changes, no database work
- Estimated implementation: 5 story sessions

### Risk Assessment: Low
- CSS-only changes with no functional side effects
- `motion-safe` and accessibility patterns already established
- Each story is independently testable and reversible

---

## Section 4: Detailed Change Proposals

### Epic 11: Advanced Visual Polish — Malewicz Design Principles

**Epic Description:** Apply professional UI design principles from Michal Malewicz to transform the site from "clean and functional" to "polished and trust-inspiring." All changes are CSS-only, building on Epic 9's foundation. Core philosophy: subtlety over spectacle — the best shadows barely look like shadows, the best gradients barely look like gradients.

**Guiding Principles (adapted from Malewicz for web directory context):**
- Shadow color must derive from the background hue, not generic gray
- Gradients should be diagonal, subtle (10-30 hue shift), with darker end at bottom
- Buttons must be visibly taller than form fields to show progression
- One focal shadow element per page section — not everything gets dramatic depth
- Decoration reserved for hero/marketing areas; transactional pages (search results, listings) stay clean
- AA contrast maintained on all functional elements; decoration can be subtle
- **Desktop adaptation required** — Malewicz principles are mobile-native; shadow/spacing values must be verified at 1440px+ viewport on standard LCD (not just retina/OLED)

**Party Mode Guardrails (from agent review 2026-02-18):**

1. **Shadow tokens in Tailwind theme** — Define shadow colors as CSS custom properties using `color-mix()` for browser fallback; extend Tailwind theme rather than using raw `shadow-[var(...)]` arbitrary values
2. **Desktop shadow scaling** — Test all shadow values at 1440px+ viewport on LCD; increase Y/blur values if imperceptible at desktop distance
3. **Decoration opacity floor** — Aurora/blurred shapes minimum 5-8% opacity, verified in-browser on standard LCD before committing values
4. **Hover interaction arc** — Push card hover from `-translate-y-0.5` to at least `-translate-y-1` on desktop with richer shadow transition
5. **Accessibility on every story** — AA contrast checks are acceptance criteria on Stories 11.1-11.4 (not deferred to 11.5); Story 11.5 becomes cross-page regression and polish pass
6. **Color-scheme-aware tokens** — Shadow custom properties structured so they can be overridden per color scheme (future dark mode)
7. **Before/after screenshots** — Use browser automation to capture visual state at each story checkpoint for review
8. **Measurable proxy metric** — Capture pages-per-session or search-to-listing CTR before Epic 11 begins; compare after completion
9. **Visual review gate** — Jon reviews before/after comparison at each story completion, not just at the end
10. **Use Justin Wetch's improved frontend design approach** — Replace the default `frontend-design` skill with the improved prompt methodology (clarity, imperative voice, NEVER/INSTEAD structure, expanded aesthetics, typography specificity, color with conviction) during implementation

---

### Story 11.1: Shadow System & Color-Matched Depth Foundation

**Objective:** Replace generic Tailwind shadow tokens with a professional color-matched shadow system following Malewicz's shadow formula.

**Changes:**

#### globals.css — Shadow color custom properties + Tailwind theme extension

```
OLD:
(No custom shadow properties — using Tailwind defaults shadow-sm, shadow-md)

NEW:
Define color-scheme-aware shadow base colors as CSS custom properties:
--shadow-color-base: oklch(0.75 0.01 100);
--shadow-color-medium: oklch(0.65 0.015 100);
--shadow-color-strong: oklch(0.55 0.02 100);

Then extend Tailwind theme with named shadow tokens that use color-mix() for fallback:
shadow-card: 0 2px 8px -2px color-mix(in oklch, var(--shadow-color-base), transparent 88%);
shadow-card-hover: 0 12px 20px -6px color-mix(in oklch, var(--shadow-color-medium), transparent 80%);
shadow-hero: 0 16px 32px -8px color-mix(in oklch, var(--shadow-color-strong), transparent 78%);
```

**Rationale:** Malewicz's #1 shadow rule: "Shadow color must derive from the background color." The current `shadow-sm` uses `rgba(0,0,0,0.05)` — a generic gray that ignores the warm off-white background (`oklch(0.982 0.003 100)`). By matching shadow hue to `100` (the warm tone), shadows will feel natural and cohesive. Using `color-mix()` provides graceful browser fallback vs raw OKLch in shadow values. Defining as Tailwind theme tokens (not arbitrary values) ensures proper composition with `hover:`, `dark:`, and `motion-safe:` variants.

#### ListingCard — Color-matched shadows + enhanced hover lift

```
OLD:
shadow-sm hover:shadow-md motion-safe:hover:-translate-y-0.5

NEW:
shadow-card hover:shadow-card-hover motion-safe:hover:-translate-y-1
```

#### CityCard, ArticleCard — Same shadow + hover update

```
OLD:
shadow-sm hover:shadow-md motion-safe:hover:-translate-y-0.5

NEW:
shadow-card hover:shadow-card-hover motion-safe:hover:-translate-y-1
```

#### Review cards on listing detail — Shadow update

```
OLD:
shadow-sm

NEW:
shadow-card
```

**Acceptance Criteria:**
- [ ] Shadow base colors defined as CSS custom properties (color-scheme-overridable)
- [ ] Shadow tokens extended in Tailwind theme (not raw arbitrary values)
- [ ] `color-mix()` used for browser fallback on shadow colors
- [ ] All card components use named shadow tokens (`shadow-card`, `shadow-card-hover`)
- [ ] Shadows have warm hue matching the off-white background
- [ ] Shadow opacity never exceeds 50% (Malewicz hard rule)
- [ ] Hover shadows are noticeably deeper but still subtle
- [ ] Card hover lift increased to `-translate-y-1` on desktop
- [ ] All shadows verified as perceptible at 1440px+ viewport on LCD display
- [ ] AA contrast maintained on all functional elements (checked this story, not deferred)
- [ ] Before/after browser screenshots captured for visual review

---

### Story 11.2: Gradient & Button Hierarchy Enhancement

**Objective:** Introduce subtle gradients and establish clear button visual hierarchy following Malewicz's gradient and button rules.

**Changes:**

#### Homepage Hero — Subtle diagonal gradient background

```
OLD:
bg-secondary rounded-xl

NEW:
rounded-xl bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)]
```

**Rationale:** Malewicz: "Gradients are like the new colors." A barely-visible diagonal gradient (from pure `secondary` to a slightly warmer/darker variant) adds depth without being visually distracting. The 135deg (to-br) direction is Malewicz's recommended "most natural" angle.

#### SearchBar — Button taller than input + subtle gradient

```
OLD (hero variant):
Button: h-11 px-5 bg-primary
Input: h-11 pl-11

NEW:
Button: h-12 px-6 bg-gradient-to-b from-primary to-[oklch(0.50_0.215_264)]
Input: h-11 pl-11 (unchanged)
```

**Rationale:** Malewicz: "Buttons must be visibly taller than form fields." Currently both are `h-11`. Making the button `h-12` with slightly more padding creates the visual progression from input → action. The top-to-bottom gradient uses the same hue with brightness reduced ~5 points at the bottom — so subtle it's "more of a feeling than an obvious gradation."

#### SearchBar — Input inner shadow (subtle receptacle effect)

```
OLD:
border border-r-0 border-border bg-background

NEW:
border border-r-0 border-border bg-background shadow-[inset_0_2px_4px_0_oklch(0.85_0.005_100_/_0.15)]
```

**Rationale:** Malewicz: "A reversed inner shadow from the bottom creates a subtle depth effect suggesting the field can receive input." A barely-visible inset shadow hints at a receptacle for user input.

#### Filter Chips — Active state depth

```
OLD (active state):
bg-primary text-primary-foreground border border-primary shadow-sm

NEW:
bg-primary text-primary-foreground border border-primary shadow-[var(--shadow-sm)]
```

*Note: Active filter chips get the color-matched shadow from Story 11.1. No additional changes needed beyond shadow system.*

**Acceptance Criteria:**
- [ ] Hero section has subtle diagonal gradient (barely noticeable)
- [ ] Search button is visibly taller than input field
- [ ] Search button has subtle vertical gradient
- [ ] Search input has faint inset shadow
- [ ] Button gradient darker at bottom (Malewicz rule)
- [ ] Gradient hue shift is ≤30 points
- [ ] All buttons maintain AA contrast (checked this story, not deferred)
- [ ] Gradients verified as perceptible at 1440px+ viewport on LCD display
- [ ] Before/after browser screenshots captured for visual review

---

### Story 11.3: Card Component Depth & Typography Refinement

**Objective:** Refine card internal spacing, implement depth-based hierarchy between card types, and apply Malewicz's typography micro-improvements.

**Changes:**

#### ListingCard — Padding and spacing refinement

```
OLD:
p-3 md:p-4

NEW:
p-4 md:p-5
```

**Rationale:** Malewicz: "16pt minimum internal padding. 24pt is the sweet spot." Current mobile padding is 12px (`p-3`), below Malewicz's minimum. Desktop at 16px (`p-4`) is the minimum. Moving to 16/20px gives more breathing room.

#### ListingCard — Company name line height

```
OLD:
text-lg font-semibold text-foreground

NEW:
text-lg font-semibold leading-snug text-foreground
```

**Rationale:** Malewicz's golden ratio line height: font × 1.618. For `text-lg` (18px), ideal is ~29px. Tailwind's `leading-snug` (1.375) gives 24.75px which is close while keeping multi-line names compact.

#### ListingCard — Review snippet weight differentiation

```
OLD:
font-serif text-sm italic text-muted-foreground

NEW:
font-serif text-sm italic text-muted-foreground/80
```

**Rationale:** Malewicz: "Different font weights communicate different importance levels." Review snippets are supporting content — slightly reducing their opacity (from full `text-muted-foreground` to 80%) creates better hierarchy without changing the font weight.

#### CityCard — Enhanced hover with border transition

```
OLD:
hover:shadow-md motion-safe:hover:-translate-y-0.5 hover:border-primary

NEW:
hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary/60
```

**Rationale:** The border hover currently jumps from `border-border` to full `border-primary`. A partial-opacity primary border (`primary/60`) is more subtle and cohesive with the shadow depth increase.

#### Stats bar on City Landing — Subtle enhancement

```
OLD:
bg-secondary rounded-lg px-3 py-2

NEW:
bg-secondary rounded-lg px-3 py-2 shadow-card
```

**Rationale:** Adding the lightest color-matched shadow gives this information bar a touch more visual weight, helping it register as a distinct data element rather than blending into the page.

**Acceptance Criteria:**
- [ ] Card internal padding increased to Malewicz minimum
- [ ] Company name has optimized line height
- [ ] Review snippets have subtle hierarchy differentiation
- [ ] CityCard hover uses partial-opacity border transition + `-translate-y-1` lift
- [ ] Stats bar has subtle shadow using named token
- [ ] All spacing values remain on 4px/8px grid
- [ ] No layout shifts from padding changes
- [ ] AA contrast maintained on all modified text elements (checked this story)
- [ ] Before/after browser screenshots captured for visual review

---

### Story 11.4: Homepage Hero & Section Decoration

**Objective:** Add subtle decorative depth to the homepage hero and section transitions, following Malewicz's decoration philosophy — reserved for marketing/hero areas only, never on transactional pages.

**Changes:**

#### Homepage Hero — Decorative blurred background shape

```
OLD:
<section className="bg-secondary rounded-xl px-6 py-10 md:py-14">

NEW:
<section className="relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)] rounded-xl px-6 py-10 md:py-14">
  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />
  <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/[0.07] blur-3xl" aria-hidden="true" />
  {/* existing content */}
</section>
```

**Rationale:** Malewicz's "Aurora background" technique — 2-3 large blurred circles creating organic color transitions. At 6-7% opacity (minimum 5% per guardrail), these add atmospheric depth to what was a flat rectangle — verified as perceptible on standard LCD at desktop distance. `pointer-events-none` and `aria-hidden` ensure no accessibility or interaction impact. `overflow-hidden` clips the shapes cleanly at the container edge.

#### Homepage — Section headings enhancement

```
OLD:
<h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">

NEW:
<h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
```

**Rationale:** Malewicz's weight hierarchy: section headings should be bold (700), not just semibold (600), to clearly separate them from card-level headings that use semibold.

#### Homepage — Featured Cities section subtle top treatment

```
OLD:
mt-10 md:mt-12

NEW:
mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50
```

**Rationale:** A barely-visible section divider (50% opacity border) creates page rhythm and visual breathing room between the hero and content sections. Combined with increased top padding, this follows Malewicz's principle of letting elements breathe.

#### Decoration constraints (explicit NON-changes)

The following pages receive **NO decoration** per Malewicz's rule: "Important transactional screens should be clean. We don't want to overwhelm users with visual — we want them to make decisions quickly without distractions."

- Search results page: No decoration (transactional)
- Listing detail page: No decoration (decision-making page)
- City landing page: No decoration (search context)
- Article pages: No decoration (reading context)

**Acceptance Criteria:**
- [ ] Homepage hero has subtle blurred decorative shapes
- [ ] Decorative elements use `pointer-events-none` and `aria-hidden`
- [ ] Decorative shapes at 5-8% opacity minimum (verified perceptible on LCD at desktop distance)
- [ ] Section headings use bold weight
- [ ] Section transitions have subtle divider
- [ ] No decoration added to search, listing, city, or article pages
- [ ] No Cumulative Layout Shift from decorative elements
- [ ] `overflow-hidden` clips decorative shapes cleanly
- [ ] AA contrast maintained — decoration does not obstruct readable content (checked this story)
- [ ] Before/after browser screenshots captured for visual review

---

### Story 11.5: Cross-Page Regression & Polish Pass

**Objective:** Final regression pass across all page templates to verify visual consistency, catch edge cases, and polish any rough transitions between the changes from Stories 11.1-11.4. (Note: AA contrast and accessibility are checked per-story, not deferred here — this story catches cross-page inconsistencies and edge cases.)

**Changes:**

#### Contrast verification pass
- Run contrast checker on all modified elements
- Verify all functional elements (buttons, text, form fields) pass AA
- Confirm decorative elements don't obstruct readable content

#### Shadow consistency audit
- Verify color-matched shadows render correctly on all background colors
- Check `bg-secondary` sections use appropriately derived shadow colors
- Ensure `bg-card` (white) cards on `bg-background` (off-white) have proper shadow contrast

#### Motion and reduced-motion verification
- Verify all hover transitions respect `motion-safe` prefix
- Test with `prefers-reduced-motion: reduce` enabled
- Ensure decorative blurred shapes are static (no animation)

#### Cross-browser shadow and gradient testing
- Test custom shadow CSS in Chrome, Firefox, Safari
- Verify `oklch()` shadow colors have appropriate fallbacks
- Test `blur-3xl` rendering across browsers

#### Typography consistency audit
- Verify line heights are consistent across all card types
- Confirm font weight hierarchy is uniform (bold > semibold > medium)
- Check text truncation (`line-clamp`) still works with updated line heights

**Acceptance Criteria:**
- [ ] All functional elements pass WCAG 2.1 AA contrast (4.5:1 text, 3:1 large text)
- [ ] Reduced motion preferences fully respected
- [ ] Cross-browser rendering verified (Chrome, Firefox, Safari)
- [ ] No visual regressions from Epic 9 work
- [ ] Shadow system is consistent across all page templates
- [ ] Typography hierarchy is uniform across components
- [ ] Lighthouse accessibility score ≥ 95
- [ ] Zero CLS impact from all changes

---

## Section 5: Implementation Handoff

### Change Scope Classification: Moderate

This is a **Moderate** change requiring:
- **Scrum Master / Product Owner**: Add Epic 11 to sprint-status.yaml, create 5 story files from these proposals
- **Developer**: Implement CSS-only changes across 5 story sessions
- **QA**: Accessibility and cross-browser verification (Story 11.5)

### Handoff Plan

| Role | Responsibility | Deliverable |
|------|---------------|-------------|
| SM / PO | Create Epic 11 entry in sprint-status.yaml | Updated sprint-status.yaml |
| SM / PO | Create 5 story files from proposals above | Story files in implementation-artifacts |
| Developer | Implement Stories 11.1-11.4 in sequence | CSS changes across components and pages |
| Developer/QA | Execute Story 11.5 audit | Accessibility and consistency verification |

### Implementation Sequence
1. **Story 11.1** first (shadow system foundation — other stories depend on these CSS properties)
2. **Story 11.2** second (gradients + button hierarchy — uses shadow properties from 11.1)
3. **Story 11.3** third (card refinements — builds on shadow and gradient work)
4. **Story 11.4** fourth (decoration — builds on all previous foundation)
5. **Story 11.5** last (audit — must follow all implementation)

### Success Criteria
- **Measurable proxy metric**: Capture pages-per-session and/or search-to-listing CTR before Epic 11 begins; compare after completion
- **Visual review gate**: Jon approves before/after browser screenshots at each story completion
- Zero functional regressions
- Zero accessibility regressions (Lighthouse ≥ 95)
- Zero CLS impact
- All shadow opacity ≤ 50% (Malewicz hard rule)
- All gradients with hue shift ≤ 30 points
- All decoration ≥ 5% opacity (perceptibility floor) and ≤ 8% (subtlety ceiling)
- No decoration on transactional pages
- All shadow values verified as perceptible at 1440px+ on standard LCD

### Frontend Design Approach (Justin Wetch Methodology)

Replace the default `frontend-design` skill prompting with the improved approach from justinwetch.com/blog/improvingclaudefrontend:

- **Clarity & Actionability**: Replace vague directives with concrete instructions — "commit to a distinct direction" not "pick an extreme"
- **NEVER/INSTEAD Structure**: Pair negative guidance with positive alternatives (e.g., NEVER generic fonts → INSTEAD distinctive fonts with bold, committed palettes)
- **Typography Specificity**: Default fonts signal default thinking; work the full typographic range (size, weight, case, spacing)
- **Color with Conviction**: Bold and saturated, OR moody and restrained, OR high-contrast and minimal — lead with dominant color, punctuate with sharp accents
- **Expanded Aesthetic Possibilities**: Include dark moody aesthetics, handcrafted/artisanal feels, lo-fi energy as options beyond generic clean
- **Consistent Imperative Voice**: Direct commands throughout; "the final design should feel singular, with every detail working in service of one cohesive direction"

This methodology showed a 75% win rate vs default prompting across all Claude model tiers (p=0.0063).

### Artifacts to Update After Approval
- `sprint-status.yaml`: Add Epic 11 entries
- `epics.md`: Add Epic 11 definition and 5 stories
- `ux-design-specification.md`: Update shadow values, gradient tokens, decoration patterns (optional — can be done post-implementation)

---

## Change Navigation Checklist Status

| # | Item | Status |
|---|------|--------|
| 1.1 | Identify triggering story | [x] Done — Strategic initiative post-MVP |
| 1.2 | Define core problem | [x] Done — Visual quality gap vs. professional standards |
| 1.3 | Assess impact with evidence | [x] Done — 5 specific evidence points documented |
| 2.1 | Evaluate current epic | [N/A] — All epics already done |
| 2.2 | Determine epic-level changes | [x] Done — Add new Epic 11 |
| 2.3 | Review remaining planned epics | [N/A] — No remaining epics |
| 2.4 | Check for invalidated/new epics | [x] Done — No invalidation, 1 new epic |
| 2.5 | Consider resequencing | [N/A] — No resequencing needed |
| 3.1 | Check PRD conflicts | [x] Done — No conflict |
| 3.2 | Review Architecture conflicts | [x] Done — No conflict (CSS-only) |
| 3.3 | Examine UI/UX conflicts | [x] Done — Enhancement, not conflict |
| 3.4 | Consider other artifacts | [x] Done — No impact |
| 4.1 | Evaluate Direct Adjustment | [x] Done — Viable (selected) |
| 4.2 | Evaluate Potential Rollback | [x] Done — Not viable (nothing to rollback) |
| 4.3 | Evaluate PRD MVP Review | [N/A] — MVP already complete |
| 4.4 | Select recommended path | [x] Done — Direct Adjustment |
| 5.1 | Create issue summary | [x] Done |
| 5.2 | Document impact | [x] Done |
| 5.3 | Present recommended path | [x] Done |
| 5.4 | Define action plan | [x] Done |
| 5.5 | Establish handoff plan | [x] Done |
| 6.1 | Review checklist completion | [x] Done |
| 6.2 | Verify proposal accuracy | [x] Done |
| 6.3 | Obtain user approval | [x] Done — Approved 2026-02-18 |
| 6.4 | Update sprint-status.yaml | [x] Done — Epic 11 added with 5 stories (backlog) |
| 6.5 | Confirm next steps | [x] Done — Route to SM for story creation |
