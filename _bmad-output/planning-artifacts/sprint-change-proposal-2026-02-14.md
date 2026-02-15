# Sprint Change Proposal: MVP Data Population, Visual Design Enhancement & Content Creation

**Date:** 2026-02-14
**Triggered by:** Post-sprint stakeholder review (all 7 original epics complete)
**Proposed by:** Jon (Product Owner)
**Scope Classification:** Major

---

## Section 1: Issue Summary

### Problem Statement

All 7 original epics are complete — the **application infrastructure is fully built** — but the site is not yet a launchable MVP. Three critical gaps exist between the current state and the PRD's launch requirements:

1. **Data gap:** The database contains only 4 test listings from Arizona. The PRD specifies **15,000-20,000 listings across 25 metros** at launch. The import pipeline exists (Story 1.4) but has only been run with test data.

2. **Visual design gap:** The site follows the UX spec's "visual restraint" philosophy (muted palette, no gradients, no animations), but the result feels plain and generic. The stakeholder wants a more distinctive, polished visual identity that better communicates authority and trust.

3. **Content gap:** Only 2 of the PRD's target 50 educational articles exist. The MDX infrastructure works (Epic 5) but content hasn't been created.

### Context

This is **not** a technical failure or requirement misunderstanding. The original epics correctly focused on building infrastructure first (data pipeline, search, pages, SEO, CI/CD, accessibility). Now that infrastructure is complete and validated, the next phase is **populating it with real data, enriching the visual design, and creating content** to achieve the PRD's launch-ready state.

### Evidence

| Gap | PRD Target | Current State | Delta |
|-----|-----------|---------------|-------|
| Listings | 15,000-20,000 | 4 (test data) | ~15,000-20,000 |
| Metro coverage | 25 metros | 1 (Phoenix test) | 24 metros |
| Articles | 50 | 2 | 48 |
| Visual design | "Calm competence" + authority | Functional but plain | Needs enhancement |
| Service tag coverage | 80%+ of listings | Only test data classified | Needs full run |

---

## Section 2: Impact Analysis

### 2.1 Existing Epics (1-7): No Modifications Needed

All 7 original epics are **done** and remain valid. No rollback, modification, or invalidation is needed. The infrastructure they built is the foundation for the new work:

- **Epic 1** (Data Pipeline): Scripts work. Need to run them at scale.
- **Epic 2** (Search & Discovery): Components work. Need real data to populate them.
- **Epic 3** (Listing Profiles): Pages generate correctly. Need listings.
- **Epic 4** (City Landing Pages): City pages work. Need cities with data.
- **Epic 5** (Articles): MDX system works. Need content.
- **Epic 6** (SEO): Metadata, sitemaps, schema all work. Need pages to index.
- **Epic 7** (Launch Quality): CI/CD, a11y, performance all validated.

### 2.2 New Epics Required

Three new epics are needed to bridge the gap between "infrastructure complete" and "launchable MVP":

| New Epic | Purpose | Priority | Dependency |
|----------|---------|----------|------------|
| **Epic 8: Data Population & Multi-Market Expansion** | Import real listings across 25+ metros via Outscraper | CRITICAL PATH | None (pipeline exists) |
| **Epic 9: Visual Design Enhancement** | Elevate UI from functional to distinctive using `/frontend-design` | HIGH | Epic 8 (need real data to design against) |
| **Epic 10: Educational Content Creation** | Create 48 remaining articles with real data enrichment | HIGH | Epic 8 (articles reference real data) |

### 2.3 Epic Sequencing

**Epic 8 is the critical path.** Without real data, neither visual design (needs real listings to test against) nor content creation (articles reference real counts/ratings) can be properly done.

Recommended order: **Epic 8 → Epic 9 + Epic 10 (parallel)**

---

## Section 3: Artifact Conflict Analysis

### 3.1 PRD Impact: None (Fulfillment, Not Change)

The PRD already defines the 25-metro, 50-article, 15K+ listing MVP. No PRD modifications needed. We are **fulfilling** the PRD, not changing it.

One potential PRD update: If the visual design enhancement changes the aesthetic direction beyond "visual restraint," the PRD's design philosophy section should be updated to reflect the new direction.

### 3.2 Architecture Impact: Minimal

The architecture fully supports this expansion:
- Import pipeline supports API mode (real-time Outscraper queries)
- Schema handles unlimited metros, listings, reviews
- Static generation via `generateStaticParams` scales to 20K+ pages
- Build time may approach 10-minute limit at scale → ISR escape hatch documented

**One concern:** Build time with 20K+ listing pages + 25+ city pages + 50 articles. The architecture documents an ISR escape hatch if builds exceed 10 minutes. This may need activation.

### 3.3 UX Specification Impact: Moderate

The UX spec's core flows and component architecture remain valid. However, the visual design section may need updates:

**Current UX spec direction:** "Visual restraint. Muted palette, whitespace, no animation. Seriousness."

**Proposed direction:** Maintain information density and accessibility, but add visual polish — richer card treatments, more dynamic homepage, subtle hover states, improved typographic rhythm, distinctive brand identity.

The UX spec should be updated after Epic 9 design work to reflect the new visual standards.

### 3.4 CI/CD Impact: None

The pipeline handles any number of pages. Lighthouse CI and axe-core tests run on representative pages, not all pages. No changes needed.

---

## Section 4: Recommended Approach

### Selected Path: Direct Adjustment (Add New Epics)

**Rationale:**
1. **Zero rollback needed** — all existing work is solid infrastructure
2. **Pipeline exists** — Epic 8 is largely running existing scripts at scale
3. **Components exist** — Epic 9 enhances existing components, doesn't rebuild
4. **MDX system exists** — Epic 10 creates content, doesn't build infrastructure
5. **Low risk** — adding on top of validated foundation

**Effort:** Medium-High (3 epics, ~10-12 stories)
**Risk:** Low (infrastructure proven, this is data + design + content)
**Timeline impact:** Extends project by approximately 3 epics before launch

---

## Section 5: Detailed Change Proposals

### Epic 8: Data Population & Multi-Market Expansion

**Goal:** Populate the database with real business listings across 25+ US metros, classify service tags, and validate data quality.

**Story 8.1: Outscraper API Configuration & Metro Target List**
- Define the 25 target metros (PRD: top US metros by population/search volume)
- Configure Outscraper API key and rate limiting
- Create a metro configuration file mapping city names to Outscraper search queries
- Test API connection with a single metro query
- AC: Metro list documented, API verified working, query templates defined

**Story 8.2: Batch Import — Wave 1 (Top 10 Metros)**
- Run Outscraper import for top 10 metros (e.g., Phoenix, LA, Houston, Dallas, Atlanta, Chicago, Denver, Las Vegas, San Antonio, Miami)
- Import with reviews (`--with-reviews`)
- Run service tag classification after import
- Validate: 10+ listings per metro, 80%+ tag coverage
- AC: 5,000-8,000 listings imported, classification run, summary report clean

**Story 8.3: Batch Import — Wave 2 (Metros 11-25)**
- Import remaining 15 metros
- Run classification
- Validate data quality and coverage
- AC: 15,000-20,000 total listings, all 25 metros populated, classification complete

**Story 8.4: Data Quality Audit & Enrichment**
- Spot-check data across all metros: ratings distribution, tag coverage, review quality
- Identify and fix data issues: missing phones, bad addresses, duplicate companies
- Re-run classification if needed
- Verify static build completes successfully with full dataset
- AC: Build succeeds, data quality report shows 95%+ acceptance, no major gaps

**Story 8.5: Build Performance at Scale**
- Run `npm run build` with full 20K+ listing dataset
- Measure build time — if > 10 minutes, implement ISR for listing detail pages
- Verify all city pages, listing pages, and article pages generate correctly
- Verify Cloudflare CDN cache purge works with large site
- AC: Build completes within acceptable time, all pages accessible

### Epic 9: Visual Design Enhancement

**Goal:** Transform the site from functional-but-plain to a distinctive, professional directory that communicates authority and trust. Leverage the `/frontend-design` skill for production-grade UI.

**Story 9.1: Design Direction & Component Audit**
- Audit current visual state with real data (from Epic 8)
- Define enhanced design direction: what "not plain" means specifically
- Identify top-impact components: homepage hero, listing cards, city pages, search results
- Create a design brief for the `/frontend-design` skill
- AC: Design direction documented, priority component list established

**Story 9.2: Homepage Redesign**
- Redesign homepage hero section for more visual impact
- Enhance featured cities section with richer card treatments
- Improve educational content section layout
- Maintain LCP < 1.5s, page weight < 500KB, WCAG AA compliance
- AC: Homepage visually distinctive, all performance/a11y targets maintained

**Story 9.3: Listing Card & Search Results Enhancement**
- Redesign ListingCard for more visual richness while maintaining information density
- Enhance filter toolbar and sort controls
- Improve search results page layout and spacing
- AC: Cards are visually polished, still scannable in 2-3 seconds, a11y maintained

**Story 9.4: City Landing Pages & Listing Detail Enhancement**
- Enhance city page headers and aggregated data display
- Improve listing detail page layout (contact, reviews, hours, map sections)
- Ensure consistent design language across all page types
- AC: All page types share cohesive visual identity, a11y maintained

**Story 9.5: Global Polish & Design System Update**
- Refine global styles: color palette adjustments (if any), spacing, hover states, transitions
- Update header/footer if needed for consistency
- Verify full-site design coherence
- Update UX spec to reflect new visual direction
- AC: Design system consistent, UX spec updated, all CI quality gates pass

### Epic 10: Educational Content Creation

**Goal:** Create 48 remaining educational articles to reach the PRD's target of 50, enriched with real directory data.

**Story 10.1: Content Strategy & Topic Planning**
- Define 48 article topics across target categories: choosing companies, cost guides, service-specific (rodent, insulation, mold, etc.), DIY vs professional, seasonal maintenance, regional considerations
- Map articles to relatedCities for data enrichment
- Establish writing templates and quality guidelines
- AC: 48 topics defined with slugs, topicTags, and relatedCities

**Story 10.2: Article Batch 1 — Core Service Guides (15 articles)**
- Write articles covering each service type + general guides
- Include internal links to city pages and search queries
- Enrich with real data (company counts, average ratings per metro)
- AC: 15 articles created, frontmatter valid, build succeeds, data enrichment renders

**Story 10.3: Article Batch 2 — Homeowner Education (15 articles)**
- Write articles on choosing contractors, cost expectations, inspection guides, insurance
- Include contextual CTAs linking to directory
- AC: 15 articles created, internal linking verified, build succeeds

**Story 10.4: Article Batch 3 — Regional & Seasonal Content (18 articles)**
- Write region-specific and seasonal articles
- Heavy internal linking to city pages and related articles
- Final article count verification (50 total)
- AC: 18 articles created, 50 total verified, sitemap includes all, build succeeds

---

## Section 6: Implementation Handoff

### Scope Classification: Major

This requires new epics, new sprint planning, and new story creation — a full planning cycle.

### Handoff Plan

| Step | Workflow | Agent | Purpose |
|------|----------|-------|---------|
| 1 | Edit PRD | 📋 John (PM) | Add visual design enhancement requirements (if needed) |
| 2 | Create UX (optional) | 🎨 Sally (UX Designer) | Define new visual direction before implementation |
| 3 | Create Epics and Stories | 📋 John (PM) | Add Epics 8-10 to the epics document |
| 4 | Sprint Planning | 🏃 Bob (SM) | Generate sprint plan for new epics |
| 5 | Story Cycle | 🏃 Bob + 💻 Amelia | Create Story → Dev Story → Code Review for each story |

### Recommended Workflow

**Option A (Full Formal):** Edit PRD → Create UX → Update Architecture → Create Epics → Sprint Planning → Implementation. Most thorough, but longest.

**Option B (Lean, Recommended):** Create Epics and Stories → Sprint Planning → Implementation (using `/frontend-design` skill during dev stories for visual work). Skip PRD/UX edits since the PRD already covers the data and content goals, and the visual direction can be defined during implementation.

### Success Criteria

- [ ] 15,000+ real listings across 25+ metros in the database
- [ ] 80%+ service tag classification coverage
- [ ] 50 educational articles published
- [ ] Homepage, listing cards, city pages, and detail pages visually polished and distinctive
- [ ] All existing quality gates still pass (axe-core, LHCI, lint, type-check)
- [ ] Build completes in < 10 minutes (or ISR activated)
- [ ] Site ready for production launch
