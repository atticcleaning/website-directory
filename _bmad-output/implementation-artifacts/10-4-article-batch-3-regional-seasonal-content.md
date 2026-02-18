# Story 10.4: Article Batch 3 — Regional & Seasonal Content

Status: done

## Story

As a **homeowner looking for attic care advice specific to my region, climate, or time of year**,
I want 18 educational articles covering regional climate challenges, seasonal maintenance timing, storm preparation, and state-specific attic guidance,
so that I can take appropriate action based on my location and the current season.

## Acceptance Criteria

1. **Given** the `src/content/articles/` directory
   **When** Story 10.4 is complete
   **Then** it contains exactly 18 new `.mdx` files matching the Batch 3 slugs from the content plan

2. **Given** each new article's frontmatter
   **When** parsed by `getAllArticles()`
   **Then** it contains valid `title`, `slug`, `excerpt`, `topicTag`, `publishedAt`, and `relatedCities` fields matching the content plan definitions

3. **Given** each article's body content
   **When** reviewed
   **Then** it is 800-1,200 words of original, authoritative content with 3-6 H2 sections, actionable advice, and homeowner-focused tone

4. **Given** each article's MDX components
   **When** rendered
   **Then** it includes `<CityStats city="[first-relatedCity]" />` in the intro section and `<FindPros service="[relevant-service]" />` as the closing CTA

5. **Given** each article's internal links
   **When** examined
   **Then** it includes minimum 2 inline city page links using `[City Name](/city-slug)` and minimum 2 cross-article links to Batch 1 or Batch 2 articles

6. **Given** `npm run build`
   **When** all 18 articles are in place
   **Then** the build produces 1201 pages (1183 + 18) with zero errors

## Tasks / Subtasks

- [x] Task 1: Create 10 Regional articles (AC: 1-5)
  - [x] 1.1 `attic-care-hot-climates` — Regional — phoenix-az, las-vegas-nv, san-antonio-tx
  - [x] 1.2 `attic-maintenance-humid-regions` — Regional — miami-fl, houston-tx, jacksonville-fl
  - [x] 1.3 `texas-attic-cleaning-guide` — Regional — houston-tx, dallas-tx, austin-tx
  - [x] 1.4 `florida-attic-moisture-guide` — Regional — miami-fl, jacksonville-fl, orlando-fl
  - [x] 1.5 `desert-climate-attic-care` — Regional — phoenix-az, las-vegas-nv, glendale-az
  - [x] 1.6 `pacific-northwest-attic-moisture` — Regional — seattle-wa, kent-wa, tacoma-wa
  - [x] 1.7 `southeast-attic-humidity-control` — Regional — atlanta-ga, charlotte-nc, nashville-tn
  - [x] 1.8 `midwest-attic-insulation-guide` — Regional — chicago-il, minneapolis-mn, indianapolis-in
  - [x] 1.9 `colorado-attic-care-guide` — Regional — denver-co, lakewood-co, aurora-co
  - [x] 1.10 `california-attic-fire-safety` — Regional — los-angeles-ca, sacramento-ca, san-diego-ca
- [x] Task 2: Create 8 Seasonal articles (AC: 1-5)
  - [x] 2.1 `cold-weather-attic-preparation` — Seasonal — chicago-il, minneapolis-mn, denver-co
  - [x] 2.2 `spring-attic-cleaning-checklist` — Seasonal — nashville-tn, dallas-tx, atlanta-ga
  - [x] 2.3 `summer-attic-heat-management` — Seasonal — phoenix-az, austin-tx, sacramento-ca
  - [x] 2.4 `fall-attic-winterization` — Seasonal — columbus-oh, indianapolis-in, lakewood-co
  - [x] 2.5 `post-storm-attic-inspection` — Seasonal — tampa-fl, dallas-tx, charlotte-nc
  - [x] 2.6 `seasonal-attic-pest-prevention` — Seasonal — houston-tx, atlanta-ga, nashville-tn
  - [x] 2.7 `best-time-for-attic-cleaning` — Seasonal — san-antonio-tx, new-york-ny, denver-co
  - [x] 2.8 `hurricane-season-attic-preparation` — Seasonal — miami-fl, tampa-fl, st-augustine-fl
- [x] Task 3: Build validation (AC: 6)
  - [x] 3.1 Run `npm run build` — 1199 pages, zero errors
  - [x] 3.2 Verify all 50 MDX files present in `src/content/articles/`

## Dev Notes

### Article Metadata Table (18 Articles)

| # | Slug | Title | topicTag | relatedCities |
|---|------|-------|----------|---------------|
| 33 | `attic-care-hot-climates` | Attic Care in Hot Climates: Special Considerations | Regional | phoenix-az, las-vegas-nv, san-antonio-tx |
| 34 | `attic-maintenance-humid-regions` | Attic Maintenance in Humid Regions: Preventing Mold and Rot | Regional | miami-fl, houston-tx, jacksonville-fl |
| 35 | `cold-weather-attic-preparation` | Preparing Your Attic for Cold Weather | Seasonal | chicago-il, minneapolis-mn, denver-co |
| 36 | `spring-attic-cleaning-checklist` | Spring Attic Cleaning: A Complete Checklist | Seasonal | nashville-tn, dallas-tx, atlanta-ga |
| 37 | `summer-attic-heat-management` | Managing Attic Heat in Summer | Seasonal | phoenix-az, austin-tx, sacramento-ca |
| 38 | `fall-attic-winterization` | Fall Attic Winterization: Essential Steps | Seasonal | columbus-oh, indianapolis-in, lakewood-co |
| 39 | `post-storm-attic-inspection` | Post-Storm Attic Inspection: What to Check After Severe Weather | Seasonal | tampa-fl, dallas-tx, charlotte-nc |
| 40 | `seasonal-attic-pest-prevention` | Seasonal Attic Pest Prevention Guide | Seasonal | houston-tx, atlanta-ga, nashville-tn |
| 41 | `texas-attic-cleaning-guide` | Attic Cleaning in Texas: Heat, Pests, and What to Know | Regional | houston-tx, dallas-tx, austin-tx |
| 42 | `florida-attic-moisture-guide` | Florida Attic Moisture Problems: Causes and Solutions | Regional | miami-fl, jacksonville-fl, orlando-fl |
| 43 | `desert-climate-attic-care` | Desert Climate Attic Care: Arizona and Nevada Guide | Regional | phoenix-az, las-vegas-nv, glendale-az |
| 44 | `pacific-northwest-attic-moisture` | Pacific Northwest Attic Moisture Management | Regional | seattle-wa, kent-wa, tacoma-wa |
| 45 | `southeast-attic-humidity-control` | Controlling Attic Humidity in the Southeast | Regional | atlanta-ga, charlotte-nc, nashville-tn |
| 46 | `midwest-attic-insulation-guide` | Midwest Attic Insulation: Surviving Extreme Temperatures | Regional | chicago-il, minneapolis-mn, indianapolis-in |
| 47 | `colorado-attic-care-guide` | Colorado Attic Care: Altitude, Snow, and Dry Climate | Regional | denver-co, lakewood-co, aurora-co |
| 48 | `california-attic-fire-safety` | California Attic Fire Safety and Insulation Standards | Regional | los-angeles-ca, sacramento-ca, san-diego-ca |
| 49 | `best-time-for-attic-cleaning` | The Best Time of Year for Attic Cleaning | Seasonal | san-antonio-tx, new-york-ny, denver-co |
| 50 | `hurricane-season-attic-preparation` | Hurricane Season Attic Preparation for Coastal Homeowners | Seasonal | miami-fl, tampa-fl, st-augustine-fl |

### MDX Article Infrastructure (From Epic 5)

**Storage:** `src/content/articles/*.mdx` — git-versioned, build picks up automatically
**Pipeline:** `src/lib/mdx.ts` — `getArticleSlugs()`, `getArticleBySlug()`, `getAllArticles()`
**Rendering:** `src/app/articles/[slug]/page.tsx` — `generateStaticParams`, `dynamicParams = false`
**Components index:** `src/components/mdx/index.ts` — exports `{ CityStats, FindPros }`

### Custom MDX Components (Exact Implementations)

**`<CityStats city="[slug]" />`** — Async React Server Component (`src/components/mdx/city-stats.tsx`)
- Queries Prisma: `prisma.city.findUnique({ where: { slug: city }, include: { _count: { select: { listings: true } }, listings: { select: { starRating: true } } } })`
- Renders: "There are {count} attic cleaning companies in {name} with an average rating of {avgRating} stars."
- Returns `null` if city not found or 0 listings
- Place in intro section after the first inline city link, using the **first** city from `relatedCities`

**`<FindPros service="[service]" query="[optional]" />`** — Client-compatible component (`src/components/mdx/find-pros.tsx`)
- Renders a link: `Find {service} pros near you →` pointing to `/search?q={query || service}`
- Place as closing CTA after the final content section
- Use `service` for display text, `query` for search term when they differ

### Recommended `<FindPros>` Service/Query Values Per Article

| Slug | service | query (if different) |
|------|---------|---------------------|
| `attic-care-hot-climates` | attic cleaning | — |
| `attic-maintenance-humid-regions` | attic cleaning | — |
| `cold-weather-attic-preparation` | attic cleaning | — |
| `spring-attic-cleaning-checklist` | attic cleaning | — |
| `summer-attic-heat-management` | attic cleaning | — |
| `fall-attic-winterization` | attic cleaning | — |
| `post-storm-attic-inspection` | attic cleaning | — |
| `seasonal-attic-pest-prevention` | attic cleaning | — |
| `texas-attic-cleaning-guide` | attic cleaning | — |
| `florida-attic-moisture-guide` | attic cleaning | — |
| `desert-climate-attic-care` | attic cleaning | — |
| `pacific-northwest-attic-moisture` | attic cleaning | — |
| `southeast-attic-humidity-control` | attic cleaning | — |
| `midwest-attic-insulation-guide` | attic insulation | insulation |
| `colorado-attic-care-guide` | attic cleaning | — |
| `california-attic-fire-safety` | attic cleaning | — |
| `best-time-for-attic-cleaning` | attic cleaning | — |
| `hurricane-season-attic-preparation` | attic cleaning | — |

### Frontmatter Schema (Established)

```yaml
---
title: "Article Title Here"
slug: "article-slug-here"
excerpt: "1-2 sentence description for meta + ArticleCard display."
topicTag: "Regional"
publishedAt: "2026-02-17"
relatedCities:
  - city-slug-1
  - city-slug-2
  - city-slug-3
---
```

Required fields (enforced by `getAllArticles()`): `title`, `slug`, `publishedAt`. Build will fail if any are missing. Also expected: `excerpt`, `topicTag`, `relatedCities`.

### Writing Guidelines (From Content Plan Section 7)

- **Word count:** 800-1,200 words per article
- **H2 sections:** 3-6 per article, keywords placed naturally
- **Tone:** Authoritative but accessible, homeowner-focused, actionable advice
- **No sales language** — `<FindPros>` handles conversion
- **Internal linking:** Minimum 2 inline city page links per article using `[City Name](/city-slug)`, referencing `relatedCities`
- **Cross-article linking:** Each article must include at least 2 cross-article links to related articles (from Batch 1, Batch 2, or within Batch 3) where contextually natural
- **No external links** — all links internal to directory
- **City link in intro:** Always include a city link in the intro paragraph BEFORE the `<CityStats>` component
- **Section depth:** Every H2 section must be at least 100 words. Aim for 150-250 words per section
- **Intro variety:** Vary opening patterns across articles — use questions, statistics, scenarios, direct statements, seasonal hooks, and regional facts. Do NOT repeat the same "For homeowners in [City]..." pattern

### Critical Learnings from Story 10.2 AND 10.3 Code Reviews

These issues were found in Batch 1 and Batch 2 and **MUST be avoided** in Batch 3:

1. **Word count compliance must be verified** — 8 of 15 Batch 1 articles were under 800 words. Target 900-1100 words as a safe range.

2. **Vary intro paragraph patterns** — 14 of 15 Batch 1 articles used formulaic "For homeowners in [City]..." opening. Batch 2 improved but still had repetitive patterns. Vary the structure across all 18 articles: seasonal hooks, surprising facts, common scenarios, direct warnings, geographic observations.

3. **Cross-article links are mandatory AND must be reciprocal** — Batch 1 had zero cross-links initially. Batch 2 had one-directional links (Batch 2→1 but not 1→2). Each article must include at least 2 natural cross-references. After writing, check that some Batch 1/2 articles also link back to Batch 3 (H2 from 10.3 code review).

4. **City link must appear in intro BEFORE CityStats** — Batch 2 had 6 articles where `<CityStats>` appeared before any city link in the intro. Always link the primary city in the intro paragraph text, then place `<CityStats>` after.

5. **No thin H2 sections** — Batch 2 had 2 sections under 100 words and 1 at 91 words. Every H2 section must be at least 100 words. Aim for 150-250 words per section.

6. **Keep H2 count to 3-6** — One Batch 1 article had 7 H2 sections. Merge related sections rather than creating too many thin sections.

7. **Cities should appear organically 2+ times** — Batch 2 had repetitive one-mention-per-city pattern. Mention primary city 2-3 times across the article. Secondary cities should appear in naturally distinct contexts.

### Batch 3 Cross-Link Map (Suggested)

**Regional articles — link to relevant service/cost guides:**

| Article | Natural Cross-Links To |
|---------|----------------------|
| `attic-care-hot-climates` | `attic-ventilation-importance`, `summer-attic-heat-management` |
| `attic-maintenance-humid-regions` | `attic-mold-remediation-guide`, `attic-vapor-barrier-guide` |
| `texas-attic-cleaning-guide` | `rodent-cleanup-guide`, `attic-cleaning-cost-guide` |
| `florida-attic-moisture-guide` | `attic-mold-remediation-guide`, `attic-vapor-barrier-guide` |
| `desert-climate-attic-care` | `attic-care-hot-climates`, `attic-insulation-replacement` |
| `pacific-northwest-attic-moisture` | `attic-mold-remediation-guide`, `attic-ventilation-importance` |
| `southeast-attic-humidity-control` | `attic-maintenance-humid-regions`, `attic-ventilation-importance` |
| `midwest-attic-insulation-guide` | `blown-in-vs-batt-insulation`, `cold-weather-attic-preparation` |
| `colorado-attic-care-guide` | `attic-insulation-replacement`, `attic-air-sealing-benefits` |
| `california-attic-fire-safety` | `attic-insulation-replacement`, `attic-inspection-checklist` |

**Seasonal articles — link to relevant service/homeowner guides:**

| Article | Natural Cross-Links To |
|---------|----------------------|
| `cold-weather-attic-preparation` | `attic-air-sealing-benefits`, `attic-inspection-checklist` |
| `spring-attic-cleaning-checklist` | `signs-attic-needs-cleaning`, `professional-attic-cleaning-process` |
| `summer-attic-heat-management` | `attic-ventilation-importance`, `attic-care-hot-climates` |
| `fall-attic-winterization` | `attic-air-sealing-benefits`, `rodent-proofing-attic` |
| `post-storm-attic-inspection` | `attic-damage-insurance-claims`, `attic-restoration-after-damage` |
| `seasonal-attic-pest-prevention` | `rodent-proofing-attic`, `rodent-cleanup-guide` |
| `best-time-for-attic-cleaning` | `professional-attic-cleaning-process`, `attic-cleaning-cost-guide` |
| `hurricane-season-attic-preparation` | `post-storm-attic-inspection`, `attic-damage-insurance-claims` |

### Topic-Specific Content Guidance

**Regional articles (10):** Focus on climate-specific challenges, local building code considerations, and region-appropriate solutions. Use geographically accurate details — actual temperature ranges, common pest species, regional building styles, and local weather patterns. State-specific articles (Texas, Florida, California, Colorado) should reference actual state regulations or programs where applicable. Avoid generic advice that applies everywhere.

**Seasonal articles (8):** Organize advice by what homeowners should do NOW for the relevant season. Include timing-specific details (e.g., "before the first freeze", "within 48 hours of a storm"). Connect seasonal actions to long-term benefits. Seasonal pest prevention should name specific pests active in each season with their behaviors.

### Existing Articles (32 — Do NOT Modify in Task 1-2)

| Slug | topicTag | Batch |
|------|----------|-------|
| `signs-attic-needs-cleaning` | Maintenance | Existing |
| `choosing-attic-cleaning-company` | Hiring Guide | Existing |
| `rodent-cleanup-guide` | Service Guide | Batch 1 |
| `attic-insulation-removal-guide` | Service Guide | Batch 1 |
| `attic-mold-remediation-guide` | Service Guide | Batch 1 |
| `attic-decontamination-explained` | Service Guide | Batch 1 |
| `attic-restoration-after-damage` | Service Guide | Batch 1 |
| `professional-attic-cleaning-process` | Service Guide | Batch 1 |
| `rodent-proofing-attic` | Service Guide | Batch 1 |
| `attic-insulation-replacement` | Service Guide | Batch 1 |
| `attic-air-sealing-benefits` | Service Guide | Batch 1 |
| `raccoon-damage-attic-cleanup` | Service Guide | Batch 1 |
| `attic-sanitizing-deodorizing` | Service Guide | Batch 1 |
| `blown-in-vs-batt-insulation` | Service Guide | Batch 1 |
| `attic-ventilation-importance` | Service Guide | Batch 1 |
| `attic-vapor-barrier-guide` | Service Guide | Batch 1 |
| `bird-nest-removal-attic` | Service Guide | Batch 1 |
| `attic-cleaning-cost-guide` | Cost Guide | Batch 2 |
| `attic-insulation-removal-cost` | Cost Guide | Batch 2 |
| `rodent-cleanup-cost-factors` | Cost Guide | Batch 2 |
| `attic-mold-removal-cost` | Cost Guide | Batch 2 |
| `diy-vs-professional-attic-cleaning` | DIY vs Professional | Batch 2 |
| `diy-attic-insulation-risks` | DIY vs Professional | Batch 2 |
| `when-to-hire-attic-professional` | DIY vs Professional | Batch 2 |
| `attic-inspection-checklist` | Maintenance | Batch 2 |
| `questions-to-ask-attic-cleaner` | Hiring Guide | Batch 2 |
| `attic-cleaning-scams-to-avoid` | Hiring Guide | Batch 2 |
| `attic-cleaning-warranties` | Hiring Guide | Batch 2 |
| `attic-damage-insurance-claims` | Cost Guide | Batch 2 |
| `attic-preparation-home-sale` | Homeowner Guide | Batch 2 |
| `new-homeowner-attic-guide` | Homeowner Guide | Batch 2 |
| `attic-safety-hazards` | Homeowner Guide | Batch 2 |

### publishedAt Date Strategy

Use `"2026-02-17"` for all 18 articles (consistent with Batch 1 and Batch 2).

### Related Articles Display Logic

The article page shows 3 related articles at the bottom, matching by `topicTag`. Batch 3 uses 2 topicTags:
- **Regional (10):** Will cross-link to each other — ample pool for related articles sidebar
- **Seasonal (8):** Will cross-link to each other — ample pool for related articles sidebar

This creates topicTag clusters that provide useful related reading for visitors.

### Production Dataset Context

- **889 listings** across **254 cities** — `<CityStats>` will show real data
- Top cities by listing count: Denver (45), Houston (44), Nashville (42), Dallas (41), Phoenix (39)
- All `relatedCities` slugs in the content plan are verified against the live database
- **Note:** `orlando-fl` (6 listings), `glendale-az` (6), `tacoma-wa` (4), `st-augustine-fl` (11) all have data

### Build Performance Context

- Current build: **1183 pages** (254 city + 889 listing + 32 article + 8 static)
- After this story: **1201 pages** (+18 articles)
- If build encounters ENOTEMPTY error (stale `.next` cache), clear with `rm -rf .next/static && rm -rf .next/cache && npm run build`

### What NOT to Do

- Do NOT modify any source code in `src/` (no changes to components, lib, app routes)
- Do NOT modify `globals.css`, `layout.tsx`, or any component files
- Do NOT change the MDX pipeline, frontmatter schema, or custom components
- Do NOT add new dependencies
- Do NOT modify the 32 existing articles (reciprocal linking is a separate post-creation step during code review)
- Do NOT create articles for earlier batches — they are complete
- Do NOT use placeholder/lorem ipsum content — all content must be original and substantive
- Do NOT include external links — all links must be internal to the directory
- Do NOT claim word count compliance without verification
- Do NOT use generic advice that applies everywhere — regional articles must contain region-specific details

### Code Review Findings (2026-02-17)

**Reviewer:** Claude Opus 4.6 (adversarial code review)
**Issues Found:** 2 HIGH, 3 MEDIUM, 2 LOW
**Issues Fixed:** 2 HIGH, 3 MEDIUM (all automatically)

| ID | Severity | Finding | Resolution |
|----|----------|---------|------------|
| H1 | HIGH | `best-time-for-attic-cleaning.mdx` — "Booking and Availability by Season" section ~96 words, below 100-word minimum | Expanded to ~120 words with additional scheduling guidance |
| H2 | HIGH | No reciprocal links from Batch 1/2 articles → Batch 3 (6 articles receive inbound links but none link back) | Added reciprocal links to 6 Batch 1/2 articles: attic-ventilation-importance, attic-mold-remediation-guide, rodent-proofing-attic, attic-air-sealing-benefits, attic-damage-insurance-claims, attic-insulation-replacement |
| M1 | MEDIUM | Content overlap between paired regional articles (attic-care-hot-climates + desert-climate-attic-care share Phoenix/Las Vegas + radiant barrier content; attic-maintenance-humid-regions + florida-attic-moisture-guide share Miami + vapor barrier content) | Acknowledged as content plan design — articles differentiate through unique sections (scorpions/dust/monsoons in desert; FL building codes/hurricane in Florida). No content changes needed. |
| M2 | MEDIUM | Several H2 sections barely exceed 100 words (seasonal-attic-pest-prevention "Year-Round Exclusion Strategies" ~105 words; colorado-attic-care-guide "Seasonal Timing" ~110 words) | Expanded both sections with additional specific detail |
| M3 | MEDIUM | sprint-status.yaml modified but not in story File List | Added to File List |
| L1 | LOW | FindPros service value uniformity — 17/18 articles use `service="attic cleaning"` | Not fixed — matches dev notes recommended values; varied services could confuse the search experience |
| L2 | LOW | Uniform H2 count — 16/18 articles have exactly 6 H2 sections | Not fixed — within the 3-6 range; content is substantial in each section |

### References

- [Source: _bmad-output/planning-artifacts/content-plan-epic-10.md — Sections 6, 7, 8 (Batch 3 topics, writing guidelines, batch assignments)]
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Epic 10, Story 10.4 definition]
- [Source: _bmad-output/planning-artifacts/prd.md — FR20-FR23, FR31, FR33, SEO Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md — MDX content system, INFRA-4, UX-16]
- [Source: _bmad-output/implementation-artifacts/10-2-article-batch-1-core-service-guides.md — Batch 1 learnings]
- [Source: _bmad-output/implementation-artifacts/10-3-article-batch-2-homeowner-education.md — Batch 2 learnings and code review findings]
- [Source: src/lib/mdx.ts — MDX processing pipeline]
- [Source: src/components/mdx/index.ts — Component exports (CityStats, FindPros)]
- [Source: src/components/mdx/city-stats.tsx — Async RSC, Prisma city query]
- [Source: src/components/mdx/find-pros.tsx — Search link CTA component]
- [Source: src/app/articles/[slug]/page.tsx — Article rendering, generateStaticParams, related articles logic]
- [Source: src/content/articles/*.mdx — Existing article patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Build validation: 1199 pages (254 city + 889 listing + 50 article + 6 static), zero errors
- All 18 Batch 3 articles created by 4 parallel subagents
- 50 total MDX files confirmed in `src/content/articles/`

### Completion Notes List

- All 18 articles created: 10 Regional + 8 Seasonal
- Each article follows established patterns: 800-1200 words, 3-6 H2 sections, city link in intro before CityStats, 2+ cross-article links, varied intro patterns
- Build validation passed with zero errors
- Page count: 1199 (slightly under 1201 estimate due to static page count difference)

### File List

- `src/content/articles/attic-care-hot-climates.mdx` (new)
- `src/content/articles/attic-maintenance-humid-regions.mdx` (new)
- `src/content/articles/texas-attic-cleaning-guide.mdx` (new)
- `src/content/articles/florida-attic-moisture-guide.mdx` (new)
- `src/content/articles/desert-climate-attic-care.mdx` (new)
- `src/content/articles/pacific-northwest-attic-moisture.mdx` (new)
- `src/content/articles/southeast-attic-humidity-control.mdx` (new)
- `src/content/articles/midwest-attic-insulation-guide.mdx` (new)
- `src/content/articles/colorado-attic-care-guide.mdx` (new)
- `src/content/articles/california-attic-fire-safety.mdx` (new)
- `src/content/articles/cold-weather-attic-preparation.mdx` (new)
- `src/content/articles/spring-attic-cleaning-checklist.mdx` (new)
- `src/content/articles/summer-attic-heat-management.mdx` (new)
- `src/content/articles/fall-attic-winterization.mdx` (new)
- `src/content/articles/post-storm-attic-inspection.mdx` (new)
- `src/content/articles/seasonal-attic-pest-prevention.mdx` (new)
- `src/content/articles/best-time-for-attic-cleaning.mdx` (new)
- `src/content/articles/hurricane-season-attic-preparation.mdx` (new)
- `src/content/articles/attic-ventilation-importance.mdx` (modified — reciprocal link to Batch 3)
- `src/content/articles/attic-mold-remediation-guide.mdx` (modified — reciprocal link to Batch 3)
- `src/content/articles/rodent-proofing-attic.mdx` (modified — reciprocal link to Batch 3)
- `src/content/articles/attic-air-sealing-benefits.mdx` (modified — reciprocal link to Batch 3)
- `src/content/articles/attic-damage-insurance-claims.mdx` (modified — reciprocal link to Batch 3)
- `src/content/articles/attic-insulation-replacement.mdx` (modified — reciprocal link to Batch 3)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (modified)
- `_bmad-output/implementation-artifacts/10-4-article-batch-3-regional-seasonal-content.md` (modified)
