# Story 10.1: Content Strategy & Topic Planning

Status: done

## Story

As a **content strategist preparing the educational article pipeline**,
I want to define 48 article topics with complete metadata (title, slug, topicTag, excerpt concept, relatedCities) organized across target categories, plus writing templates and quality guidelines,
so that Stories 10.2-10.4 can execute article creation efficiently with consistent quality, proper internal linking, and real data enrichment across all 50 articles.

## Acceptance Criteria

1. **Given** the content plan output file
   **When** reviewed
   **Then** it contains exactly 48 article topic definitions (bringing total to 50 with the 2 existing articles)

2. **Given** each article topic definition
   **When** examined
   **Then** it includes: `title`, `slug`, `topicTag`, `excerpt` (1-2 sentence concept), and `relatedCities` (array of 2-3 valid city slugs from the 254 available cities)

3. **Given** all 48 slugs
   **When** validated
   **Then** every slug is unique, kebab-case, and does not conflict with the 2 existing slugs (`signs-attic-needs-cleaning`, `choosing-attic-cleaning-company`)

4. **Given** the topic distribution
   **When** counted by topicTag
   **Then** topics are distributed across at least 6 categories covering: service-specific guides, cost/pricing, hiring/choosing contractors, DIY vs professional, seasonal maintenance, and regional considerations

5. **Given** the `relatedCities` in each topic
   **When** validated
   **Then** every city slug references a real city in the database (from the 254 city pages), and cities are distributed across diverse metros (not all pointing to the same 2-3 cities)

6. **Given** the writing template and quality guidelines
   **When** reviewed
   **Then** they define: target word count, required MDX components (`<CityStats>`, `<FindPros>`), internal linking requirements (to city pages and related articles), SEO structure (h2 sections, frontmatter completeness), and tone/voice guidance

7. **Given** the article batch assignments
   **When** reviewed
   **Then** articles are grouped into 3 batches matching Stories 10.2 (15 core service guides), 10.3 (15 homeowner education), and 10.4 (18 regional/seasonal), with each batch's topicTag distribution balanced

## Tasks / Subtasks

- [x] Task 1: Inventory Existing Content & Define Topic Categories (AC: #4)
  - [x] 1.1 Document the 2 existing articles with their topicTags ("Maintenance", "Hiring Guide") to avoid duplication
  - [x] 1.2 Define 6+ topicTag categories that cover the sprint change proposal targets: service-specific guides (rodent, insulation, mold, decontamination, restoration, general), cost/pricing guides, hiring/choosing contractors, DIY vs professional, seasonal maintenance, regional considerations
  - [x] 1.3 Determine target distribution: approximately how many articles per category to ensure balanced coverage

- [x] Task 2: Inventory Available Cities for relatedCities Mapping (AC: #5)
  - [x] 2.1 Query the database or read existing city data to get a list of all 254 city slugs with their listing counts
  - [x] 2.2 Identify the top 25 metros by listing count (these are the most data-rich cities for `<CityStats>` enrichment)
  - [x] 2.3 Create a city distribution plan ensuring relatedCities are spread across diverse metros, not concentrated on a few

- [x] Task 3: Define 48 Article Topics (AC: #1, #2, #3, #4)
  - [x] 3.1 Create the content plan file at `_bmad-output/planning-artifacts/content-plan-epic-10.md`
  - [x] 3.2 For each of the 48 topics, define: `title`, `slug`, `topicTag`, `excerpt` (1-2 sentence concept), `relatedCities` (2-3 city slugs)
  - [x] 3.3 Validate all 48 slugs are unique, kebab-case, and don't conflict with existing slugs
  - [x] 3.4 Validate topicTag distribution covers 6+ categories with reasonable balance
  - [x] 3.5 Validate relatedCities reference real city slugs and are diversely distributed

- [x] Task 4: Create Writing Template & Quality Guidelines (AC: #6)
  - [x] 4.1 Create a writing guidelines section in the content plan file
  - [x] 4.2 Define: target word count (800-1200 words), required MDX components per article (`<CityStats>` in intro, `<FindPros>` as closing CTA), internal linking requirements (at least 2 inline city links, reference to related articles where natural)
  - [x] 4.3 Define SEO structure: frontmatter schema compliance, h2 section structure, keyword placement in title/h2s
  - [x] 4.4 Define tone/voice: authoritative but accessible, homeowner-focused, actionable advice
  - [x] 4.5 Include example article structure template showing the pattern from existing articles

- [x] Task 5: Assign Batch Groupings (AC: #7)
  - [x] 5.1 Group articles into Batch 1 (Story 10.2): 15 core service guides — service-type-specific articles + general service overviews
  - [x] 5.2 Group articles into Batch 2 (Story 10.3): 15 homeowner education — hiring, cost, DIY vs professional, inspection guides
  - [x] 5.3 Group articles into Batch 3 (Story 10.4): 18 regional & seasonal — region-specific content, seasonal timing, climate considerations
  - [x] 5.4 Verify batch sizes: 15 + 15 + 18 = 48 new articles + 2 existing = 50 total

- [x] Task 6: Validation & Final Review
  - [x] 6.1 Cross-check: 48 unique slugs, no conflicts with existing articles
  - [x] 6.2 Cross-check: every relatedCities slug exists in the 254 city pages
  - [x] 6.3 Cross-check: topicTag distribution across 6+ categories
  - [x] 6.4 Cross-check: batch assignments total 48 articles (15 + 15 + 18)
  - [x] 6.5 Verify the content plan file is complete and well-structured

## Dev Notes

### This is a Content Planning Story — Not a Code Story

Story 10.1 produces a **content plan document**, not code changes. The output is a planning artifact (`_bmad-output/planning-artifacts/content-plan-epic-10.md`) that will be consumed by Stories 10.2-10.4 during article creation. No source files in `src/` are modified.

### Existing Article Infrastructure (From Epic 5)

The MDX article system is fully operational:
- **Storage:** `src/content/articles/*.mdx` — drop files here, build picks them up automatically
- **Pipeline:** `src/lib/mdx.ts` — `getArticleSlugs()`, `getArticleBySlug()`, `getAllArticles()`
- **Custom components:** `<CityStats city="[slug]" />` (async RSC, queries Prisma), `<FindPros service="..." />` (link to search)
- **Rendering:** `src/app/articles/[slug]/page.tsx` with `generateStaticParams`, `dynamicParams = false`
- **Article cards:** `src/components/article-card.tsx` — homepage + related articles display
- **Sitemap:** Auto-includes all article pages
- **Homepage:** Shows up to 3 articles in "Learn About Attic Cleaning" section

### Existing Articles (2 of 50)

| # | Slug | Title | topicTag | relatedCities |
|---|------|-------|----------|---------------|
| 1 | `signs-attic-needs-cleaning` | Signs Your Attic Needs Professional Cleaning | Maintenance | phoenix-az, tucson-az |
| 2 | `choosing-attic-cleaning-company` | How to Choose the Right Attic Cleaning Company | Hiring Guide | scottsdale-az, mesa-az |

### Frontmatter Schema (Established)

```yaml
title: "Article Title Here"
slug: "article-slug-here"
excerpt: "1-2 sentence description for meta + ArticleCard display."
topicTag: "Category Name"
publishedAt: "2026-MM-DD"
relatedCities:
  - city-slug-1
  - city-slug-2
```

Required fields (enforced by `getAllArticles()`): `title`, `slug`, `publishedAt`. Also expected: `excerpt`, `topicTag`, `relatedCities`.

### MDX Content Patterns (From Existing Articles)

**Intro paragraph pattern:**
```mdx
Intro sentence with inline city link [Phoenix](/phoenix-az). More context.
<CityStats city="phoenix-az" />
```

**Section pattern:**
```mdx
## H2 Section Title

Body text with actionable advice. May include:
- Bullet lists for tips
- Numbered lists for steps
- Blockquotes for expert advice
- Inline links to other city pages: [Houston](/houston-tx)
```

**Closing CTA pattern:**
```mdx
<FindPros service="attic cleaning" />
```
or with custom query:
```mdx
<FindPros service="attic insulation removal" query="insulation removal" />
```

### Topic Category Guidance (From Sprint Change Proposal)

The sprint change proposal defines these target categories:
1. **Service-specific guides** — rodent cleanup, insulation removal, mold remediation, decontamination, attic restoration, general cleaning
2. **Cost/pricing guides** — cost expectations for each service type, factors affecting price
3. **Hiring/choosing contractors** — what to look for, questions to ask, red flags
4. **DIY vs professional** — when to DIY, when to hire, safety considerations
5. **Seasonal maintenance** — seasonal timing for different services, climate-based advice
6. **Regional considerations** — region-specific attic issues (desert heat, humid climates, cold weather, etc.)

### City Data for relatedCities Mapping

The project has **254 city pages** across **889 listings**. When assigning `relatedCities`, prefer cities with higher listing counts (more data for `<CityStats>` enrichment). The top metros from Epic 8 data imports include markets across the US: Phoenix, LA, Houston, Dallas, Atlanta, Chicago, Denver, Miami, Seattle, San Francisco, and many more.

Use `prisma.city.findMany({ orderBy: { listings: { _count: "desc" } }, take: 25 })` or similar to get the top 25 cities by listing count for the mapping exercise.

### SEO Strategy Context (From PRD)

- Educational content targets **long-tail keywords** — article titles should be phrased as search queries homeowners would type
- Internal linking between articles distributes page authority
- Each article should link to 2-3 city pages inline (via `relatedCities`)
- `<FindPros>` CTA creates the content-to-directory conversion path (PRD User Journey: David)
- Aim for topical authority — multiple articles per service type builds search engine trust

### Output File

The content plan should be saved to:
`_bmad-output/planning-artifacts/content-plan-epic-10.md`

### What NOT to Do

- Do NOT create any `.mdx` article files — that's Stories 10.2-10.4
- Do NOT modify any source code in `src/`
- Do NOT modify `globals.css`, `layout.tsx`, or any component files
- Do NOT change the MDX pipeline or frontmatter schema
- Do NOT add new dependencies
- Do NOT duplicate the 2 existing article topics

### Batch Size Reference

| Story | Batch | Count | Focus |
|-------|-------|-------|-------|
| 10.2 | Batch 1 | 15 | Core service guides (service-type-specific + general) |
| 10.3 | Batch 2 | 15 | Homeowner education (hiring, cost, DIY, inspection) |
| 10.4 | Batch 3 | 18 | Regional & seasonal (region-specific, seasonal timing) |
| — | Existing | 2 | signs-attic-needs-cleaning, choosing-attic-cleaning-company |
| — | **Total** | **50** | — |

### References

- [Source: _bmad-output/planning-artifacts/sprint-change-proposal-2026-02-14.md — Epic 10 definition]
- [Source: _bmad-output/planning-artifacts/prd.md — FR20-FR23, FR31, FR33, SEO Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md — MDX content system, INFRA-4, UX-16]
- [Source: src/lib/mdx.ts — MDX processing pipeline]
- [Source: src/content/articles/*.mdx — Existing article patterns]
- [Source: _bmad-output/implementation-artifacts/9-4-city-landing-listing-detail-enhancement.md — MDX component styling (FindPros, CityStats)]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6 (claude-opus-4-6)

### Debug Log References

- Database query via pg client (NODE_TLS_REJECT_UNAUTHORIZED=0): retrieved 254 cities, 889 listings, top 60 cities by listing count
- Validation agent cross-checked all 48 slugs, topicTag counts, batch sizes, and relatedCities — found 2 data issues (Regional count 9→10, city count 24→34), both corrected
- Existing articles verified: 2 MDX files read (signs-attic-needs-cleaning.mdx, choosing-attic-cleaning-company.mdx)

### Completion Notes List

- Defined 8 topicTag categories: Service Guide (15), Regional (10), Seasonal (8), Cost Guide (5), Hiring Guide (3+1 existing), DIY vs Professional (3), Homeowner Guide (3), Maintenance (1+1 existing)
- Queried production database for city data: 254 cities across 889 listings, top 25 cities by listing count identified (Denver: 45, Houston: 44, Nashville: 42, Dallas: 41, Phoenix: 39)
- Created 48 article topic definitions with complete metadata (title, slug, topicTag, excerpt, relatedCities)
- 34 unique city slugs used across relatedCities — all verified against database, distributed across diverse metros (no city appears >6 times)
- Writing template includes: 800-1200 word target, required MDX components (`<CityStats>`, `<FindPros>`), internal linking rules, SEO structure, tone/voice guidelines, example article structure
- Batch assignments: Batch 1 (15 service guides), Batch 2 (15 homeowner education), Batch 3 (18 regional/seasonal) = 48 + 2 existing = 50 total
- This is a content planning story — no source code changes, no `.mdx` files created
- **[Code Review M1]** Fixed Section 2 table: Homeowner Guide count was 4, corrected to 3 (Articles 30, 31, 32). Column total was 49, now correctly sums to 48.
- **[Code Review L1]** Two titles slightly exceed 60-char SERP guideline (Articles 10, 22 at 61 chars) — "when possible" guidance, no action needed
- **[Code Review L2]** No `<FindPros>` service/query mapping per topicTag — Stories 10.2-10.4 will determine appropriate values per article during creation
- **[Code Review L3]** Two pairs share identical relatedCities (Articles 3&40, 15&44) — acceptable since overall distribution is diverse, awareness for article authors
- **[Code Review L4]** City usage table includes mesa-az at 0 — retained with footnote since it appears in existing article 2

### File List

- `_bmad-output/planning-artifacts/content-plan-epic-10.md` — The content plan document (new)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status tracking
- `_bmad-output/implementation-artifacts/10-1-content-strategy-topic-planning.md` — This story file
