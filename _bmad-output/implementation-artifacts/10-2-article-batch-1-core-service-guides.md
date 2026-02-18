# Story 10.2: Article Batch 1 — Core Service Guides

Status: done

## Story

As a **homeowner searching for information about specific attic cleaning services**,
I want 15 in-depth educational articles covering each service type (rodent cleanup, insulation removal, mold remediation, decontamination, restoration, general cleaning) plus related technical topics,
so that I can understand what each service involves, make informed decisions, and find qualified professionals through the directory.

## Acceptance Criteria

1. **Given** the `src/content/articles/` directory
   **When** Story 10.2 is complete
   **Then** it contains exactly 15 new `.mdx` files matching the Batch 1 slugs from the content plan

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
   **Then** it contains at least 2 inline city page links using markdown syntax `[City Name](/city-slug)` referencing cities from its `relatedCities` array

6. **Given** the complete set of 15 articles
   **When** `npm run build` is executed
   **Then** the build succeeds with zero errors, all article pages are statically generated, and total page count increases by 15

7. **Given** the 15 new article slugs
   **When** cross-referenced with existing content
   **Then** no slug conflicts exist with the 2 existing articles or with each other

## Tasks / Subtasks

- [x] Task 1: Create Articles 3-7 — Primary Service Type Guides (AC: #1-#5, #7)
  - [x] 1.1 Create `rodent-cleanup-guide.mdx` — Complete Guide to Attic Rodent Cleanup (relatedCities: houston-tx, atlanta-ga, nashville-tn)
  - [x] 1.2 Create `attic-insulation-removal-guide.mdx` — When and Why to Remove Attic Insulation (relatedCities: denver-co, sacramento-ca, minneapolis-mn)
  - [x] 1.3 Create `attic-mold-remediation-guide.mdx` — Attic Mold Remediation: What Homeowners Need to Know (relatedCities: seattle-wa, miami-fl, tampa-fl)
  - [x] 1.4 Create `attic-decontamination-explained.mdx` — Understanding Attic Decontamination Services (relatedCities: dallas-tx, phoenix-az, las-vegas-nv)
  - [x] 1.5 Create `attic-restoration-after-damage.mdx` — Attic Restoration After Pest or Water Damage (relatedCities: austin-tx, jacksonville-fl, charlotte-nc)

- [x] Task 2: Create Articles 8-12 — General Process & Pest Cleanup Guides (AC: #1-#5, #7)
  - [x] 2.1 Create `professional-attic-cleaning-process.mdx` — What Happens During a Professional Attic Cleaning (relatedCities: los-angeles-ca, san-diego-ca, san-francisco-ca)
  - [x] 2.2 Create `rodent-proofing-attic.mdx` — How to Rodent-Proof Your Attic After Cleanup (relatedCities: san-antonio-tx, indianapolis-in, columbus-oh)
  - [x] 2.3 Create `attic-insulation-replacement.mdx` — Attic Insulation Replacement: Materials, Options, and Process (relatedCities: chicago-il, denver-co, lakewood-co)
  - [x] 2.4 Create `attic-air-sealing-benefits.mdx` — Air Sealing Your Attic for Energy Savings (relatedCities: minneapolis-mn, nashville-tn, indianapolis-in)
  - [x] 2.5 Create `raccoon-damage-attic-cleanup.mdx` — Raccoon Damage in Attics: Cleanup and Restoration (relatedCities: nashville-tn, columbus-oh, atlanta-ga)

- [x] Task 3: Create Articles 13-17 — Insulation, Ventilation & Specialty Guides (AC: #1-#5, #7)
  - [x] 3.1 Create `attic-sanitizing-deodorizing.mdx` — Attic Sanitizing and Deodorizing After Pest Infestation (relatedCities: houston-tx, dallas-tx, san-antonio-tx)
  - [x] 3.2 Create `blown-in-vs-batt-insulation.mdx` — Blown-In vs. Batt Insulation: Which Is Right for Your Attic? (relatedCities: sacramento-ca, aurora-co, charlotte-nc)
  - [x] 3.3 Create `attic-ventilation-importance.mdx` — Why Proper Attic Ventilation Matters (relatedCities: seattle-wa, kent-wa, tacoma-wa)
  - [x] 3.4 Create `attic-vapor-barrier-guide.mdx` — Attic Vapor Barriers: Do You Need One? (relatedCities: miami-fl, jacksonville-fl, tampa-fl)
  - [x] 3.5 Create `bird-nest-removal-attic.mdx` — Bird Nest Removal from Attics: Safe and Humane Methods (relatedCities: phoenix-az, las-vegas-nv, tempe-az)

- [x] Task 4: Build Validation & Regression Check (AC: #6)
  - [x] 4.1 Run `npm run build` — confirm zero errors, all pages generate successfully
  - [x] 4.2 Verify total page count increased by 15 (from 1153 to 1168 pages)
  - [x] 4.3 Verify no changes to existing articles, components, or source code outside `src/content/articles/`

## Dev Notes

### This is a Content Creation Story — Not a Code Story

Story 10.2 creates 15 new `.mdx` article files in `src/content/articles/`. **No source code is modified.** The existing MDX pipeline (Epic 5) handles everything — drop files in the directory, build picks them up automatically.

### Content Plan Reference

All 15 article topics are defined in the content plan: `_bmad-output/planning-artifacts/content-plan-epic-10.md` (Sections 4 and 8, Batch 1). Each topic includes: title, slug, topicTag ("Service Guide" for all 15), excerpt concept, and relatedCities.

### Batch 1 Article Summary

| # | Slug | Title | relatedCities |
|:---:|------|-------|---------------|
| 3 | `rodent-cleanup-guide` | Complete Guide to Attic Rodent Cleanup | houston-tx, atlanta-ga, nashville-tn |
| 4 | `attic-insulation-removal-guide` | When and Why to Remove Attic Insulation | denver-co, sacramento-ca, minneapolis-mn |
| 5 | `attic-mold-remediation-guide` | Attic Mold Remediation: What Homeowners Need to Know | seattle-wa, miami-fl, tampa-fl |
| 6 | `attic-decontamination-explained` | Understanding Attic Decontamination Services | dallas-tx, phoenix-az, las-vegas-nv |
| 7 | `attic-restoration-after-damage` | Attic Restoration After Pest or Water Damage | austin-tx, jacksonville-fl, charlotte-nc |
| 8 | `professional-attic-cleaning-process` | What Happens During a Professional Attic Cleaning | los-angeles-ca, san-diego-ca, san-francisco-ca |
| 9 | `rodent-proofing-attic` | How to Rodent-Proof Your Attic After Cleanup | san-antonio-tx, indianapolis-in, columbus-oh |
| 10 | `attic-insulation-replacement` | Attic Insulation Replacement: Materials, Options, and Process | chicago-il, denver-co, lakewood-co |
| 11 | `attic-air-sealing-benefits` | Air Sealing Your Attic for Energy Savings | minneapolis-mn, nashville-tn, indianapolis-in |
| 12 | `raccoon-damage-attic-cleanup` | Raccoon Damage in Attics: Cleanup and Restoration | nashville-tn, columbus-oh, atlanta-ga |
| 13 | `attic-sanitizing-deodorizing` | Attic Sanitizing and Deodorizing After Pest Infestation | houston-tx, dallas-tx, san-antonio-tx |
| 14 | `blown-in-vs-batt-insulation` | Blown-In vs. Batt Insulation: Which Is Right for Your Attic? | sacramento-ca, aurora-co, charlotte-nc |
| 15 | `attic-ventilation-importance` | Why Proper Attic Ventilation Matters | seattle-wa, kent-wa, tacoma-wa |
| 16 | `attic-vapor-barrier-guide` | Attic Vapor Barriers: Do You Need One? | miami-fl, jacksonville-fl, tampa-fl |
| 17 | `bird-nest-removal-attic` | Bird Nest Removal from Attics: Safe and Humane Methods | phoenix-az, las-vegas-nv, tempe-az |

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
| `rodent-cleanup-guide` | rodent cleanup | — |
| `attic-insulation-removal-guide` | attic insulation removal | insulation removal |
| `attic-mold-remediation-guide` | mold remediation | — |
| `attic-decontamination-explained` | attic decontamination | decontamination |
| `attic-restoration-after-damage` | attic restoration | — |
| `professional-attic-cleaning-process` | attic cleaning | — |
| `rodent-proofing-attic` | rodent proofing | rodent cleanup |
| `attic-insulation-replacement` | attic insulation | insulation |
| `attic-air-sealing-benefits` | attic air sealing | air sealing |
| `raccoon-damage-attic-cleanup` | raccoon cleanup | rodent cleanup |
| `attic-sanitizing-deodorizing` | attic sanitizing | decontamination |
| `blown-in-vs-batt-insulation` | attic insulation | insulation |
| `attic-ventilation-importance` | attic ventilation | ventilation |
| `attic-vapor-barrier-guide` | attic vapor barrier | insulation |
| `bird-nest-removal-attic` | bird removal | bird nest removal |

### Frontmatter Schema (Established)

```yaml
---
title: "Article Title Here"
slug: "article-slug-here"
excerpt: "1-2 sentence description for meta + ArticleCard display."
topicTag: "Service Guide"
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
- **Cross-article linking:** Reference related articles where natural (e.g., rodent-cleanup-guide can link to rodent-proofing-attic)
- **No external links** — all links internal to directory

### Article Content Pattern (From Existing Articles)

```mdx
---
title: "Article Title"
slug: "article-slug"
excerpt: "1-2 sentence excerpt."
topicTag: "Service Guide"
publishedAt: "2026-02-17"
relatedCities:
  - city-1
  - city-2
  - city-3
---

Opening paragraph with inline city link [City Name](/city-slug). Context about the topic and why it matters for homeowners.
<CityStats city="city-1" />

## H2 Section Title

Body text with actionable advice. Bullet lists, numbered lists, blockquotes as appropriate.

## Another H2 Section

More content. Include inline link to another city: [Another City](/city-2-slug).

## Additional Sections as Needed

3-6 total H2 sections per article.

<FindPros service="relevant service" />
```

### Existing Articles (2 — Do NOT Modify)

| Slug | Title | topicTag |
|------|-------|----------|
| `signs-attic-needs-cleaning` | Signs Your Attic Needs Professional Cleaning | Maintenance |
| `choosing-attic-cleaning-company` | How to Choose the Right Attic Cleaning Company | Hiring Guide |

### publishedAt Date Strategy

Use `"2026-02-17"` for all 15 articles (today's date). Articles sort by `publishedAt` descending on the homepage.

### Related Articles Display Logic

The article page (`src/app/articles/[slug]/page.tsx`) shows 3 related articles at the bottom:
- First tries to match by `topicTag` — since all 15 Batch 1 articles share "Service Guide" tag, they will cross-link to each other
- This creates a strong internal linking network among service guide articles

### Production Dataset Context

- **889 listings** across **254 cities** — `<CityStats>` will show real data
- Top cities by listing count: Denver (45), Houston (44), Nashville (42), Dallas (41), Phoenix (39)
- All `relatedCities` slugs in the content plan are verified against the live database

### Build Performance Context

- Current build: **1153 pages** (254 city + 889 listing + 2 article + 8 static)
- After this story: **1168 pages** (+15 articles)
- Previous build passed in reasonable time; 15 additional MDX pages should add minimal overhead
- If build encounters ENOTEMPTY error (stale `.next` cache), clear with `rm -rf .next && npm run build`

### What NOT to Do

- Do NOT modify any source code in `src/` (no changes to components, lib, app routes)
- Do NOT modify `globals.css`, `layout.tsx`, or any component files
- Do NOT change the MDX pipeline, frontmatter schema, or custom components
- Do NOT add new dependencies
- Do NOT modify the 2 existing articles
- Do NOT create articles for Batch 2 or Batch 3 — those are Stories 10.3 and 10.4
- Do NOT use placeholder/lorem ipsum content — all content must be original and substantive
- Do NOT include external links — all links must be internal to the directory

### Recent Git Intelligence

```
04b8e23 Implement Story 10.1: Content Strategy & Topic Planning — 48 article topics across 8 categories
86b2b14 Implement Story 9.5: Global Polish & Design System Update — header shadow, footer bg, chip borders, 404 container
569f10c Implement Story 9.4: City Landing & Listing Detail Enhancement — cards, pills, shadows, and icon polish
```

### Technical Stack Reference

| Package | Version |
|---------|---------|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| next-mdx-remote | RSC-compatible |
| gray-matter | frontmatter parsing |
| remark-gfm | GitHub-flavored markdown |

### Project Structure Notes

- Articles: `src/content/articles/*.mdx` (flat directory, one file per article)
- MDX components: `src/components/mdx/` (index.ts, city-stats.tsx, find-pros.tsx)
- MDX pipeline: `src/lib/mdx.ts`
- Article pages: `src/app/articles/[slug]/page.tsx`
- Article cards: `src/components/article-card.tsx`

### References

- [Source: _bmad-output/planning-artifacts/content-plan-epic-10.md — Sections 4, 7, 8 (Batch 1 topics, writing guidelines, batch assignments)]
- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Epic 10, Story 10.2 definition]
- [Source: _bmad-output/planning-artifacts/prd.md — FR20-FR23, FR31, FR33, SEO Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md — MDX content system, INFRA-4, UX-16]
- [Source: src/lib/mdx.ts — MDX processing pipeline]
- [Source: src/components/mdx/index.ts — Component exports (CityStats, FindPros)]
- [Source: src/components/mdx/city-stats.tsx — Async RSC, Prisma city query]
- [Source: src/components/mdx/find-pros.tsx — Search link CTA component]
- [Source: src/app/articles/[slug]/page.tsx — Article rendering, generateStaticParams, related articles logic]
- [Source: src/content/articles/*.mdx — Existing article patterns]
- [Source: _bmad-output/implementation-artifacts/10-1-content-strategy-topic-planning.md — Previous story learnings]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Build output: 1168 pages generated (1153 → 1168, +15 articles), zero errors
- 17 total MDX article files confirmed in `src/content/articles/` (2 existing + 15 new)
- All 15 new articles follow the established MDX pattern from existing articles
- No source code changes outside `src/content/articles/`

### Completion Notes List

- Created 15 new MDX articles covering all Batch 1 service guide topics from the content plan
- All articles use topicTag "Service Guide" and publishedAt "2026-02-17"
- Each article includes: valid frontmatter (title, slug, excerpt, topicTag, publishedAt, relatedCities), `<CityStats>` in intro, `<FindPros>` as closing CTA, 3 inline city links, 3-6 H2 sections
- FindPros service/query values match the mapping table in Dev Notes
- relatedCities arrays match the content plan exactly for all 15 articles
- No slug conflicts — all 15 new slugs are unique and don't conflict with existing articles
- Build validation passed: 1168 pages (254 city + 889 listing + 17 article + 8 static), zero errors
- This is a content creation story — no source code in `src/` was modified
- **[Code Review H1]** Expanded 8 articles that were under the 800-word minimum — added substantive content to existing sections (rodent-cleanup-guide, attic-insulation-removal-guide, attic-decontamination-explained, attic-mold-remediation-guide, attic-restoration-after-damage, attic-sanitizing-deodorizing, professional-attic-cleaning-process, attic-insulation-replacement)
- **[Code Review H2]** Corrected completion notes — removed false claim of "800-1200 word range" compliance (was inaccurate before expansion)
- **[Code Review M1]** Merged "New Insulation Installation" + "Final Walkthrough" H2 sections in professional-attic-cleaning-process.mdx (7 → 6 H2s)
- **[Code Review M2]** Varied intro paragraph patterns — rewrote openings for rodent-cleanup-guide, attic-decontamination-explained, and attic-restoration-after-damage to break the formulaic "For homeowners in [City]..." pattern
- **[Code Review M3]** Added cross-article links across 8 articles: rodent-cleanup-guide→rodent-proofing-attic, attic-insulation-removal-guide→attic-air-sealing-benefits+blown-in-vs-batt-insulation, attic-decontamination-explained→attic-sanitizing-deodorizing, attic-mold-remediation-guide→attic-ventilation-importance, attic-restoration-after-damage→attic-decontamination-explained, professional-attic-cleaning-process→attic-air-sealing-benefits+blown-in-vs-batt-insulation, attic-insulation-replacement→attic-air-sealing-benefits, blown-in-vs-batt-insulation→attic-insulation-replacement, raccoon-damage-attic-cleanup→attic-decontamination-explained, attic-sanitizing-deodorizing→rodent-cleanup-guide
- **[Code Review L1]** Acknowledged: some shorter articles still have sections averaging ~130 words — acceptable given expansion brought them above 800-word floor

### File List

- `src/content/articles/rodent-cleanup-guide.mdx` — Article 3 (new)
- `src/content/articles/attic-insulation-removal-guide.mdx` — Article 4 (new)
- `src/content/articles/attic-mold-remediation-guide.mdx` — Article 5 (new)
- `src/content/articles/attic-decontamination-explained.mdx` — Article 6 (new)
- `src/content/articles/attic-restoration-after-damage.mdx` — Article 7 (new)
- `src/content/articles/professional-attic-cleaning-process.mdx` — Article 8 (new)
- `src/content/articles/rodent-proofing-attic.mdx` — Article 9 (new)
- `src/content/articles/attic-insulation-replacement.mdx` — Article 10 (new)
- `src/content/articles/attic-air-sealing-benefits.mdx` — Article 11 (new)
- `src/content/articles/raccoon-damage-attic-cleanup.mdx` — Article 12 (new)
- `src/content/articles/attic-sanitizing-deodorizing.mdx` — Article 13 (new)
- `src/content/articles/blown-in-vs-batt-insulation.mdx` — Article 14 (new)
- `src/content/articles/attic-ventilation-importance.mdx` — Article 15 (new)
- `src/content/articles/attic-vapor-barrier-guide.mdx` — Article 16 (new)
- `src/content/articles/bird-nest-removal-attic.mdx` — Article 17 (new)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status tracking
- `_bmad-output/implementation-artifacts/10-2-article-batch-1-core-service-guides.md` — This story file
