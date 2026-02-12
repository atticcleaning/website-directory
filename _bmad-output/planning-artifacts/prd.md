---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
  - step-e-01-discovery
  - step-e-02-review
  - step-e-03-edit
status: complete
inputDocuments:
  - product-brief-atticcleaning-website-2026-02-10.md
workflowType: 'prd'
workflow: 'edit'
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
lastEdited: '2026-02-11'
editHistory:
  - date: '2026-02-11'
    changes: 'Addressed 3 validation improvements: NFR restructuring (Security, Accessibility, Integration, Reliability tables), FR tightening (FR7, FR9, FR16, FR21, FR26, FR31), brief coverage gaps (FR4 distance sort, new FR33 homepage content)'
---

# Product Requirements Document - atticcleaning-website

**Author:** Jon
**Date:** 2026-02-11

## Executive Summary

AtticCleaning.com is a search-first national directory and content authority for the attic cleaning services industry — a fragmented niche of ~25,000–47,000 businesses with zero dedicated directory coverage. The platform combines curated contractor listings with structured service tags, Google ratings and review snippets, and educational content to replace the cluttered, miscategorized results homeowners face on Google and generic platforms.

**Core Differentiator:** The only national directory dedicated exclusively to attic cleaning services. Rich listings with star ratings, review snippets, structured service tags, and educational content ship at launch — not as future promises. SEO dominance across metro-level attic cleaning search terms creates a compounding moat.

**Target Users:**
- **Reactive Homeowners (primary):** Triggered by a problem (rodent infestation, failed inspection, insulation damage). Need to find and evaluate a specialist fast.
- **Research Homeowners (secondary):** Curious about attic issues, arrive via educational content, convert to directory users when ready.
- **Admin/Operator (MVP):** Solo developer managing data imports and content via CLI scripts.

**MVP Strategy:** Aggressive solo launch with 25 metros, 50 educational articles, and full data pipeline. Validate SEO traction, then expand coverage and content velocity.

**Tech Stack:** Next.js App Router, shadcn/ui + Tailwind CSS, Prisma, PostgreSQL (DO Managed), Digital Ocean App Platform, Cloudflare CDN.

## Success Criteria

### User Success

- **Search-to-contact time:** Homeowner finds and contacts a qualified contractor in under 5 minutes
- **Search relevance:** 80%+ of searches return at least 3 relevant local results across covered metros
- **Contact engagement:** 25%+ of listing page visits result in a contact action (phone, website, directions)
- **Content-to-directory conversion:** 10%+ of educational article readers use directory search within the same session
- **Trust & confidence:** Homeowners can distinguish attic specialists from general contractors at a glance through service tags and review snippets

### Business Success

- **MVP Launch (Months 1-3):** 5,000+ monthly organic visitors, 15,000-20,000 listings across 25 metros, 50 educational articles published
- **Growth (Months 4-12):** Expand to 50 metros, 25,000+ monthly visitors, #1 organic ranking for "attic cleaning [city]" in top metros, 200+ articles, 5%+ contractor claim rate
- **Monetization (Month 12+):** First paying contractors within 30 days of Phase 4 launch
- **North Star Metric:** #1 organic search ranking for "attic cleaning [city]" across top 50 US metros

### Technical Success

- **Performance:** LCP < 1.5s, CLS < 0.1, search response time < 500ms
- **SEO indexing:** 90%+ of generated pages indexed by Google within 60 days of launch
- **Data pipeline reliability:** Outscraper import pipeline runs successfully with deduplication, producing listings with ratings, reviews, and service tags
- **Geographic data completeness:** Every covered metro has 10+ listings with full data (ratings, reviews, service tags)

### Measurable Outcomes

| Metric | Target | Timeframe |
|---|---|---|
| Monthly organic visitors | 5,000+ | Month 3 |
| Monthly organic visitors | 25,000+ | Month 12 |
| Listings loaded | 15,000-20,000 | Launch |
| Metro coverage | Top 25 US metros | Launch |
| Metro coverage | Top 50 US metros | Month 6 |
| Search-to-contact time | < 5 minutes | Launch |
| LCP | < 1.5s | Launch |
| Pages indexed | 90%+ | 60 days post-launch |
| Organic #1 rankings | Top 50 metros | Month 12 |

## User Journeys

### Journey 1: Maria — Reactive Homeowner (Primary, Happy Path)

Maria, 47, Glendale, CA. She heard scratching in the ceiling last week. Her husband found rodent droppings scattered across the attic insulation. She's never hired this type of contractor and doesn't know where to start.

**Opening Scene:** Maria Googles "rodent cleanup attic Glendale" from her kitchen table after dinner. The first few results are pest control companies, Yelp pages mixing general contractors, and HomeAdvisor lead forms. She spots an organic result from AtticCleaning.com — "Top-Rated Attic Cleaning Companies in Glendale, CA" — and clicks.

**Rising Action:** She lands on a city landing page showing 12 local companies. The listing cards immediately make sense — star ratings, review counts, and colored service tag chips: "Rodent Cleanup," "Decontamination," "Insulation Replacement." She scans the review snippets and sees one mentioning rodent damage cleanup. She uses the search bar to narrow by her zip code and filters by "Rodent Cleanup" + "Decontamination."

**Climax:** Three companies surface with 4.5+ stars, all tagged for her exact services. She clicks into the top-rated listing and sees the full profile — phone number, website, hours, all Google reviews, and a map showing they're 4 miles away. She can actually tell this company specializes in exactly her problem.

**Resolution:** Maria calls the company directly. Total time from Google to phone call: under 4 minutes. She feels confident she picked a qualified specialist, not a random contractor from a cluttered search page.

### Journey 2: David — Research Homeowner (Primary, Alternate Path)

David, 52, Houston, TX. His energy bills have been climbing and a neighbor mentioned their 30-year-old attic insulation might need replacing. He's not in crisis — he's curious.

**Opening Scene:** David Googles "how to know if attic insulation needs replacing" from his home office on a Saturday morning. He clicks an educational article on AtticCleaning.com that ranks on page one.

**Rising Action:** The article walks him through warning signs — age of insulation, visible compression, pest damage, energy bill spikes. It links to related articles about insulation replacement costs and signs of rodent problems. He browses three articles over 15 minutes, bookmarks the site.

**Climax:** Two months later, David decides to get quotes. He remembers AtticCleaning.com and returns directly. He searches his Houston zip code and finds 8 companies with ratings and service tags. The site he bookmarked for education is now his trusted contractor resource.

**Resolution:** David contacts two top-rated companies for quotes. The educational content answered his questions before he even knew he needed a contractor, and the directory was waiting when he was ready.

### Journey 3: Lisa — Search Fallback (Primary, Edge Case)

Lisa, 42, lives in a smaller city in rural Oregon. She has a rodent problem in her attic and searches her zip code on AtticCleaning.com.

**Opening Scene:** Lisa searches her zip code and only 1 listing appears locally — not enough to compare.

**Rising Action:** The page automatically expands to show results within 20 miles, clearly displaying the distance for each company: "12 mi away," "18 mi away." She now sees 5 companies she can evaluate. Below the expanded results, the page surfaces relevant educational articles — "How to Evaluate an Attic Cleaning Company" and "What to Expect During Rodent Cleanup."

**Climax:** Lisa realizes that even though her town is small, there are qualified companies within driving distance. The distance labels set clear expectations, and the articles help her know what questions to ask.

**Resolution:** Lisa calls a company 12 miles away that has strong reviews for rodent cleanup. She didn't hit a dead end — the site adapted to her situation and still delivered value. Meanwhile, her search is logged on the backend, adding her zip code to the expansion priority list.

### Journey 4: Jon — Admin/Operator (CLI, MVP)

Jon is the site owner and operator. He manages all data, content, and site operations through CLI scripts during MVP.

**Opening Scene:** A new batch of Outscraper data is ready — 2,000 new business records across 5 metros that weren't previously covered.

**Rising Action:** Jon runs the import CLI script, which reads the CSV, transforms the data, deduplicates by Google Place ID, classifies service tags via keyword matching on business descriptions, and upserts to Postgres. The script outputs a summary: 1,847 new listings added, 153 duplicates skipped, service tags applied to 89% of records.

**Climax:** Jon triggers a site rebuild. Next.js static generation picks up the new data — new listing pages, updated city landing pages, and refreshed article data (local company counts, average ratings). The build completes and deploys via Digital Ocean App Platform.

**Resolution:** Within hours, Cloudflare CDN has the new pages cached at the edge. Google begins discovering and indexing the new pages via the updated sitemap. Coverage has expanded to 5 new metros with rich, searchable data.

### Journey Requirements Summary

| Journey | Key Capabilities Revealed |
|---|---|
| Maria (Happy Path) | Search by zip/city, listing cards with ratings/reviews/tags, filters by service type, detailed listing pages, contact CTAs |
| David (Research Path) | Educational content section, internal linking between articles, content-to-directory conversion path, SEO-optimized articles |
| Lisa (Search Fallback) | 20-mile radius auto-expansion, distance display on expanded results, low-result threshold (< 3), educational content fallback, backend search logging |
| Jon (Admin/CLI) | Outscraper CSV import script, deduplication by Place ID, service tag classification, static site rebuild + deploy pipeline, sitemap generation |

## Web App Specific Requirements

### Project-Type Overview

Multi-page, statically generated web application built on Next.js App Router. SEO-driven architecture — every listing, city page, and article is a pre-rendered static page served from Cloudflare CDN. No SPA behavior, no real-time features. Content-heavy, read-optimized directory where page load speed and search engine discoverability are the primary technical drivers.

### Browser Support

| Browser | Minimum Version | Priority |
|---|---|---|
| Chrome | Latest 2 versions | Primary |
| Safari (iOS + macOS) | Latest 2 versions | Primary (mobile-first) |
| Firefox | Latest 2 versions | Secondary |
| Edge | Latest 2 versions | Secondary |

No IE support. No legacy browser polyfills. Modern evergreen browsers only.

### Responsive Design

**Mobile-first architecture.** All layouts, components, and interactions designed for mobile viewport first, then progressively enhanced for tablet and desktop.

- **Mobile (< 768px):** Primary design target. Single-column layouts, touch-optimized tap targets, full-width listing cards, prominent search bar, thumb-reachable CTAs
- **Tablet (768px - 1024px):** Two-column listing grids, expanded listing cards with side-by-side review snippets
- **Desktop (> 1024px):** Three-column listing grids, sidebar filters, expanded map views, richer listing detail layouts

The mobile experience is complete — not a degraded version of desktop. Every feature available on desktop is available on mobile with equal usability. Desktop enhances with additional visual density and layout options but adds no exclusive functionality.

### SEO Strategy

- Static page generation at build time via `generateStaticParams`
- LocalBusiness JSON-LD schema markup on every listing page
- Programmatic city landing pages targeting "attic cleaning [city]" for 25 metros at launch
- Educational content targeting long-tail keywords (50 articles at launch)
- XML sitemap auto-generated, submitted to Google Search Console
- Canonical URLs on all pages to prevent duplicate content
- Open Graph + Twitter Card metadata for social sharing
- robots.txt optimized for crawl budget — block admin/API routes, allow all public pages
- Internal linking between articles, city pages, and listings to distribute page authority
- Semantic HTML — proper heading hierarchy, landmark regions, structured content

### Font System

Three-font typographic hierarchy via `next/font/google` — self-hosted, subsetted, zero-CLS:

| Role | Font | Weights | Usage |
|---|---|---|---|
| UI / Headings | Plus Jakarta Sans | 500, 600, 700 | Navigation, headings, buttons, search bar, service tags, listing card titles, CTAs |
| Body / Content | Source Serif 4 | 400, 400i, 700 | Article body text, listing descriptions, review text, long-form content |
| Accent / Editorial | Lora | 500, 700 | Hero tagline, pull quotes, testimonial highlights, city page intros, editorial moments |

- **Loading strategy:** Preload Jakarta + Source Serif as critical path; Lora loads with `font-display: swap`
- **Total weight:** ~140KB subsetted WOFF2, served via Cloudflare CDN
- **CSS variables:** `--font-jakarta`, `--font-source-serif`, `--font-lora` for Tailwind integration
- **Discipline rule:** If a text element doesn't clearly fall into UI or accent categories, it defaults to Source Serif 4

### Implementation Considerations

- No client-side routing beyond Next.js App Router defaults — full page loads for SEO crawlability
- Minimal JavaScript — JS only for search interactions, filter toggles, and map embeds
- Image optimization via Next.js Image component with responsive srcsets, WebP/AVIF formats, lazy loading
- CDN-first — Cloudflare handles caching, compression, and edge delivery; origin server rarely hit for public pages

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — deliver the smallest product that solves "homeowners can't find and evaluate attic cleaning specialists" through data-rich search + educational content + SEO dominance.

**Resource Requirements:** Solo developer. Aggressive timeline. Every scope decision optimizes for speed-to-launch while preserving core differentiation.

**Scope Philosophy:** Launch lean, validate SEO traction, then expand. The 25-metro launch is a beachhead — prove the model works, then scale coverage and content velocity.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Maria (Reactive Homeowner) — search, filter, compare, contact
- David (Research Homeowner) — educational content discovery, content-to-directory conversion
- Lisa (Search Fallback) — 20-mile radius expansion, educational content bridge
- Jon (Admin/CLI) — data import, service tag classification, site rebuild

**Must-Have Capabilities:**

| Capability | Rationale |
|---|---|
| Search-first homepage (zip/city/state/company) | Core product entry point |
| Listing cards with ratings, review snippets, service tags | Trust and differentiation — the "aha moment" |
| Service-type filters (insulation removal, rodent cleanup, decontamination, air sealing, radiant barrier, crawl space) | Core differentiation vs. generic directories |
| Sort by rating, most reviews, distance | Comparison capability |
| Individual listing pages with full profiles, reviews, map | Contact conversion point |
| City/metro landing pages (25 metros) | Programmatic SEO for "attic cleaning [city]" |
| Educational content section (50 articles) | Long-tail SEO + content authority |
| Outscraper data pipeline (import, dedup, service tag classification) | Data foundation |
| Search fallback (20-mile radius expansion, educational content bridge) | No dead ends |
| Backend search logging (zero/low-result queries) | Expansion prioritization data |
| SEO infrastructure (static gen, CDN, schema markup, sitemaps) | The entire business model |
| Mobile-first responsive UI with three-font system | Brand authority + primary device target |
| WCAG 2.1 AA accessibility | Standard compliance |

**Deliberately Cut from MVP:**
- State license enrichment and verification badges (Phase 2)
- User accounts, saved searches, favorites (Phase 2)
- User-submitted reviews (Phase 2)
- "Don't see your area?" feedback mechanism (Phase 2)
- Email alerts (Phase 2)
- Autocomplete/typeahead search (Phase 2)
- Contractor claiming and self-service (Phase 3)
- Monetization (Phase 4)

### Post-MVP Features

**Phase 2 — Growth & Enrichment (after launch success confirmed):**
- Expand to top 50 metros
- Scale to 200+ articles
- State license enrichment (CA CSLB, FL DBPR, TX TDA) and license verification badges
- User accounts with saved searches and favorite contractors
- User-submitted reviews layered on scraped Google reviews
- Email alerts for new contractors in saved locations
- Autocomplete/typeahead search
- "Don't see your area?" feedback capture

**Phase 3 — Contractor Platform (after 25K+ monthly visitors):**
- Contractor claiming and ownership verification
- Profile editing: services, hours, photos, description
- Contractor analytics dashboard: views, contact clicks, search appearances
- Expand to 100+ metros

**Phase 4 — Monetization (after contractor network established):**
- Pay-per-lead: contractors pay for qualified contact clicks
- Premium listings: boosted placement in search results
- Contractor subscriptions: monthly plans for enhanced profiles and lead flow
- Lead distribution: homeowner requests routed to multiple qualified contractors
- Full national coverage

### Risk Mitigation Strategy

**Technical Risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Outscraper data quality (messy names, missing fields, bad geocoding) | Listings are unusable or low-trust | Run a small pilot import (1-2 metros) early. Build data validation into the import script — reject records missing key fields. Manual spot-check before full import. |
| Service tag classification accuracy | Wrong tags erode trust | Conservative keyword matching. Better to show no tag than a wrong tag. Manual review against sample data. |
| Build time scaling with static generation | Slow deploys as page count grows | 25 metros + 50 articles keeps initial build fast. ISR is the escape hatch if builds exceed 10 minutes. |
| LCP < 1.5s on mobile | SEO ranking penalty | Three-font system is the main risk. Validate with Lighthouse early. Preload strategy + `next/font` should handle it. |

**Market Risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| SEO takes longer than expected | Low traffic, slow validation | 25-metro focus concentrates SEO effort. Monitor indexing rate and keyword positions weekly. Pivot content strategy if needed. |
| Homeowners don't trust a new directory | Low engagement, high bounce | Rich listings with real Google ratings and reviews provide instant credibility. Educational content builds authority. |

**Resource Risks:**

| Risk | Impact | Mitigation |
|---|---|---|
| Solo developer bandwidth | Delayed launch | Aggressive scope cuts already made (25 metros, 50 articles). Content and additional metros can ship incrementally post-launch. |
| Data pipeline takes longer than expected | Delays everything downstream | Build the pipeline first. It's the critical path. |

## Functional Requirements

### Search & Discovery

- **FR1:** Homeowners can search for attic cleaning companies by zip code, city, state, or company name
- **FR2:** Homeowners can view search results as listing cards displaying company name, star rating, review count, review snippets, and service tags
- **FR3:** Homeowners can filter search results by service type (insulation removal, rodent cleanup, decontamination, air sealing, radiant barrier, crawl space)
- **FR4:** Homeowners can sort search results by rating, number of reviews, or distance
- **FR5:** System automatically expands search radius to 20 miles when fewer than 3 results are found for a location
- **FR6:** System displays distance for each result when search radius has been expanded beyond the original location
- **FR7:** System surfaces educational articles matching the searched service type or location on search result pages returning fewer than 3 listings

### Listing Profiles

- **FR8:** Homeowners can view a detailed listing page for each company including name, address, phone number, website, hours, and map location
- **FR9:** Homeowners can view all imported Google reviews with star ratings on a listing page
- **FR10:** Homeowners can see structured service tags on a listing page indicating which attic services the company offers
- **FR11:** Homeowners can initiate contact with a company via phone number or website link from the listing page

### Programmatic SEO & Internal Linking

- **FR12:** System generates city/metro landing pages for each covered metro area displaying local directory listings
- **FR13:** City landing pages display aggregated local data including number of listed companies and average rating
- **FR14:** System generates LocalBusiness JSON-LD schema markup on all listing pages
- **FR15:** System generates XML sitemaps covering all listing pages, city pages, and articles
- **FR16:** System generates self-referencing canonical URLs, Open Graph tags, and Twitter Card metadata on all pages
- **FR17:** City landing pages link to individual listing pages for companies in that metro area
- **FR18:** Individual listing pages link back to their parent city landing page
- **FR19:** City landing pages link to nearby metro city pages to distribute page authority

### Educational Content

- **FR20:** Homeowners can browse educational articles about attic cleaning topics
- **FR21:** Articles include internal links to articles sharing the same topic tag and to city landing pages for metros mentioned in the content
- **FR22:** Articles are enriched with real directory data (local company counts, ratings, metro-specific information)
- **FR23:** Homeowners arriving via educational content can navigate to the directory search experience

### Data Pipeline

- **FR24:** Admin can import business listing data from Outscraper CSV/JSON files via CLI script
- **FR25:** Import pipeline deduplicates listings by Google Place ID during import
- **FR26:** Import pipeline classifies service tags based on business name and description fields
- **FR27:** Import pipeline validates records and rejects entries missing required fields (name, address, phone, rating)
- **FR28:** Import pipeline outputs a summary report (listings added, duplicates skipped, tag classification rate)
- **FR29:** Admin can trigger a full static site rebuild to generate updated pages from new data

### Search Analytics

- **FR30:** System logs search queries that return fewer than 3 results, capturing location data for expansion prioritization

### Content Management

- **FR31:** Admin can add and manage educational articles via the content management workflow
- **FR32:** Admin can manage metro/city coverage by importing data for new geographic areas

### Homepage Content

- **FR33:** Homepage displays featured city links and educational content highlights below the search bar

## Non-Functional Requirements

### Performance

| Requirement | Target | Context |
|---|---|---|
| Largest Contentful Paint (LCP) | < 1.5s | All page types, mobile 4G connection |
| Cumulative Layout Shift (CLS) | < 0.1 | All page types, including font swap |
| Interaction to Next Paint (INP) | < 200ms | Search, filter, and sort interactions |
| Search query response time | < 500ms | Full-text search including fallback radius expansion |
| Time to First Byte (TTFB) | < 200ms | CDN edge-served pages |
| Total page weight | < 500KB | Initial load, compressed, including fonts |
| Static site build time | < 10 minutes | Full rebuild with 25 metros + 50 articles + all listings |
| Font loading | Zero CLS | Critical fonts preloaded; accent font swapped asynchronously |

### Security

| Requirement | Target | Measurement Method |
|---|---|---|
| Transport encryption | HTTPS with TLS 1.2+ on all pages | SSL Labs scan grade A or higher |
| Security headers | Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy configured | securityheaders.com scan grade A or higher |
| Input sanitization | Search inputs sanitized against XSS and injection | OWASP ZAP passive scan returns 0 high/medium alerts |
| User data exposure | No user-submitted data stored in MVP (all data admin-imported) | Database schema review confirms no user input tables |
| Admin access surface | CLI-only admin — no remote admin interface exposed | Port scan confirms no admin endpoints accessible |
| Crawl access control | robots.txt blocks API routes and admin endpoints | Manual verification of robots.txt rules |
| Tracking footprint | No cookies or tracking beyond analytics in MVP | Browser DevTools audit confirms no unauthorized cookies |

### Scalability

| Dimension | MVP Target | Scaling Trigger |
|---|---|---|
| Listing volume | 15,000-20,000 listings across 25 metros | If build time exceeds 10 min, evaluate ISR |
| Article volume | 50 articles at launch | Scale to 200+ post-launch without architecture changes |
| Concurrent users | CDN-handled — no origin concurrency concern for static pages | Monitor origin load if search API gets > 100 req/s |
| Geographic expansion | 25 metros | Pipeline supports adding metros incrementally |
| Data refresh frequency | Monthly re-import via CLI | If more frequent refreshes needed, evaluate incremental import |

Static generation + CDN architecture scales horizontally by default. Primary scaling concern is build time as page count grows — ISR is the planned escape hatch.

### Accessibility

| Requirement | Target | Measurement Method |
|---|---|---|
| WCAG compliance level | WCAG 2.1 AA across all public pages | axe-core automated audit returns 0 violations |
| Color contrast (normal text) | Minimum 4.5:1 ratio | Lighthouse accessibility audit score 100 |
| Color contrast (large text) | Minimum 3:1 ratio | Lighthouse accessibility audit score 100 |
| Keyboard navigation | All interactive elements navigable with visible focus indicators | Manual tab-through audit of all page types |
| Screen reader compatibility | ARIA labels, landmark regions, heading hierarchy on all pages | VoiceOver/NVDA manual audit of all page types |
| Touch targets | Minimum 44x44px on mobile | Lighthouse tap target audit passes |
| Skip navigation | Skip-to-content link present on all pages | Automated check confirms skip link on every route |
| Image alt text | All images include descriptive alt text | axe-core image-alt rule returns 0 violations |
| Form labeling | All inputs (search, filters) have associated labels | axe-core label rule returns 0 violations |
| Color independence | No content conveyed by color alone | Manual review of all status indicators and tags |

### Integration

| System | Type | Requirements | Verification Method |
|---|---|---|---|
| Outscraper | Data import (CSV/JSON) | Pipeline handles schema variations. Validates field mapping before import. Import succeeds with 95%+ record acceptance rate. | Import summary report shows acceptance rate per batch |
| Google Maps | Embed (listing pages) | Map embed renders company location. Address text displayed as fallback within 2s if embed fails. | Manual spot-check of 10 listing pages + network-blocked embed test |
| Google Search Console | Sitemap submission | XML sitemap submitted post-deploy. 90%+ of submitted URLs indexed within 60 days. | Search Console coverage report reviewed weekly |
| Cloudflare CDN | Edge delivery | Cache invalidation completes within 5 minutes of deploy. Static assets cached with 30-day TTL; HTML pages revalidate on deploy. | Cache-status header verification post-deploy |

### Reliability

| Requirement | Target | Measurement Method |
|---|---|---|
| Uptime | 99.5% monthly | Uptime monitoring service (e.g., UptimeRobot) reports monthly availability |
| Deploy rollback | < 5 minutes to revert to previous deploy | Timed rollback drill during staging deploys |
| Data integrity | 0 records corrupted or lost during import | Pre/post import record count comparison + spot-check validation |
| CDN failover | < 30s failover, transparent to users | Multi-region synthetic monitoring confirms page availability |
| Search degradation | Static pages remain accessible when search API is down | Manual test: disable search API, verify city pages and articles load |
