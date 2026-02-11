---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments:
  - compass_artifact_wf-950159ea-6414-41c1-bacc-5fd2d0b7c139_text_markdown.md
date: 2026-02-10
author: Jon
---

# Product Brief: atticcleaning-website

## Executive Summary

AtticCleaning.com is a national website directory and content authority purpose-built for the attic cleaning services industry — a fragmented niche of ~25,000–47,000 businesses with zero dedicated directory coverage today. The platform serves as the authoritative destination for homeowners seeking attic cleaning, insulation removal, rodent cleanup, decontamination, and related services. By combining curated contractor listings with structured service tags, verified licensing data, scraped Google ratings and review snippets, and educational content, AtticCleaning.com replaces the cluttered, miscategorized results homeowners currently face on Google and generic platforms. The primary competitive moat is SEO dominance — owning page-one rankings for attic cleaning terms across 100+ metros — supported by an enriched data layer that keeps bounce rates low and dwell time high, and eventually contractor network effects that create switching costs. The product launches in four phases: a fully functional, data-rich searchable directory with ratings, reviews, service tags, licensing data, and educational content (Phase 1), user accounts (Phase 2), contractor-claimed and managed listings (Phase 3), and blended monetization through pay-per-lead, premium listings, and contractor subscriptions (Phase 4). Built on modern infrastructure using shadcn components with a search-first UX, the platform follows the authoritative niche directory model proven by care.com, aplaceformom.com, and bestlawyers.com.

---

## Core Vision

### Problem Statement

Homeowners needing attic services — cleaning, insulation removal, rodent cleanup, decontamination, mold remediation, air sealing — have no dedicated resource to find and evaluate specialized contractors. Google Maps lacks an "Attic Cleaning" category entirely. Major platforms like Yelp, HomeAdvisor, and Angi bury attic services under broad categories like "Pest Control" or "Insulation Installation," forcing homeowners to sift through irrelevant results, unqualified providers, and ad-heavy interfaces to find the right contractor.

### Problem Impact

- Homeowners waste significant time filtering through mismatched search results and generic directories
- Qualified attic specialists are invisible alongside unrelated contractors, reducing their discoverability
- No structured way exists to compare contractors by specific attic services (insulation removal vs. rodent cleanup vs. mold remediation)
- Licensing verification, insurance status, and service-specific credentials are scattered across state databases that homeowners never check
- The lack of a centralized niche resource means homeowners often make uninformed hiring decisions for services that directly impact their home's health and safety
- No educational content ecosystem exists to help homeowners understand attic issues before they search for a contractor

### Why Existing Solutions Fall Short

- **Google Maps/Search:** No attic cleaning category; results are cluttered with ads, generic directories, and mismatched businesses. No structured service tags or licensing data. Raw results require homeowners to do their own filtering and research.
- **Yelp:** Folds attic cleaning into broad categories; no way to filter by specific attic services. Review quality varies widely.
- **HomeAdvisor/Angi:** Lead-gen focused with aggressive upselling to contractors; homeowner experience is secondary to monetization. Listings lack attic-specific service detail.
- **Thumbtack:** Has an "Attic Cleaning" category but limited national coverage and no structured licensing or service taxonomy.
- **No national attic directory exists.** Diamond Certified covers only Bay Area counties. Every other platform treats attic services as an afterthought within a larger category.

### Proposed Solution

AtticCleaning.com — a search-first national directory and content authority that curates every attic service provider across the top 100 US metros into a clean, structured, homeowner-friendly experience. The hero experience is immediate: a prominent search bar letting homeowners find contractors by zip code, city, state, or company name. Each listing card presents star ratings with review counts, curated review snippets highlighting attic-specific experiences, structured service tags as visual chips (insulation removal, rodent cleanup, decontamination, air sealing, radiant barrier, crawl space work), and verified state licensing badges — all sourced from Outscraper and enriched with state contractor databases (CA CSLB, FL DBPR, TX TDA).

Educational content is as central to the product as the directory itself. Articles like "How to tell if your attic insulation needs replacing" and "Top-rated attic cleaning companies in [city]" build organic SEO traffic, establish authority, and create the flywheel: reviews feed content, content feeds SEO, SEO feeds traffic, traffic feeds monetization. The platform evolves through four phases from a data-rich directory to a full marketplace with contractor self-management and blended monetization (pay-per-lead, premium listings, contractor subscriptions).

### Key Differentiators

- **Only national directory dedicated exclusively to attic cleaning services** — no competitor exists in this niche
- **SEO-first moat** — owning page-one rankings for attic cleaning terms across 100+ metros creates a compounding advantage that takes competitors years to displace
- **Rich listings from day one** — star ratings, review snippets, structured service tags, and license verification badges ship in Phase 1, not as future promises
- **Structured service taxonomy** — homeowners filter by specific attic services, not broad contractor categories
- **Verified licensing and trust signals** — state contractor license data, insurance status, and BBB ratings integrated into listings
- **Educational content authority** — content strategy drives the SEO flywheel and positions the site as the go-to resource for attic cleaning knowledge
- **Homeowner-first design** — search-first UX with shadcn components; clean, decluttered experience versus the ad-heavy incumbents
- **Enriched data moat** — combining scraped business data with state licensing databases, service classification, review content, and eventually user-generated reviews creates a dataset no generic platform can match
- **Content-SEO-traffic flywheel** — reviews feed content, content feeds SEO, SEO feeds traffic, traffic feeds monetization

---

## Target Users

### Primary Users

#### Persona 1: "Reactive Homeowner" — Maria, 47, Glendale, CA

**Context:** Maria is a middle-class homeowner with a 1970s ranch-style home. She and her husband both work full-time. Last week she heard scratching sounds in the ceiling at night. Her husband went into the attic and found rodent droppings scattered across the insulation. She needs someone to clean, decontaminate, and replace the insulation — but she's never hired this type of contractor before and doesn't know where to start.

**Trigger Event:** Something went wrong — rodent infestation, failed home inspection, visible insulation damage, water stains on the ceiling, musty odor, or an energy bill spike that points to attic issues.

**Current Behavior:** Googles "rodent cleanup attic Glendale" and gets a mix of pest control companies, Yelp listings for general contractors, HomeAdvisor lead forms, and paid ads. She has no way to tell which companies actually specialize in attic decontamination vs. general pest control. She calls 3-4 companies, gets wildly different quotes, and has no basis for comparison.

**Pain Points:**
- Urgency combined with zero knowledge of the attic cleaning industry
- Can't distinguish attic specialists from general contractors in search results
- No way to verify licensing or compare services at a glance
- Feels vulnerable to being overcharged because she can't assess what's reasonable

**Success Moment:** She searches her zip code on AtticCleaning.com, immediately sees 8 local companies with star ratings, review snippets mentioning rodent cleanup specifically, service tags confirming they do decontamination and insulation replacement, and a license verification badge. She compares three top-rated options and calls the one with the best reviews for her specific issue. Total time: under 5 minutes.

**Demographics:** 35–65 years old, middle-class and above, single-family homeowner. Concentrated in California (largest market), Texas, and East Coast metros. Suburban neighborhoods with older housing stock and accessible attics.

#### Persona 2: "Research-Mode Homeowner" — David, 52, Houston, TX

**Context:** David noticed his energy bills climbing and a neighbor mentioned their attic insulation was 30 years old and needed replacing. He's not in crisis — he's curious. He Googles "how to know if attic insulation needs replacing" and lands on an educational article on AtticCleaning.com.

**Current Behavior:** Reads the article, browses related content ("Signs your attic has a rodent problem," "What does attic decontamination cost?"), and bookmarks the site. Two months later when he decides to move forward, he returns to the directory and searches for companies in his area.

**Success Moment:** The educational content answered his questions before he even knew he needed a contractor. When he's ready, the directory is already his trusted resource.

**Demographics:** Same 35–65 range, slightly more proactive, but becomes a directory user once educated. This persona drives the SEO flywheel — they arrive via content, convert to directory users later.

### Secondary Users

#### Property Managers (Sparse Usage)

Property managers overseeing rental portfolios occasionally need attic services for tenant-reported issues (rodent complaints, insulation damage between tenants). They use the directory infrequently but value the ability to quickly find licensed, reviewed contractors in specific markets. They may manage properties across multiple cities, making a national directory useful.

#### Real Estate Agents (Sparse Usage)

Real estate agents refer clients to attic cleaning companies when home inspections flag attic issues that could delay a sale. They use the directory as a referral resource — searching by the property's location to recommend a reputable contractor to their client. Usage is occasional and transaction-driven.

#### Attic Cleaning Contractors (Phase 3–4)

Contractors become active users in Phase 3 when they can claim and manage their listings, and paying users in Phase 4 when monetization launches. Their needs include accurate listing information, prominence in search results, and lead flow. They are the revenue source but not the design priority — the platform is built homeowner-first.

### User Journey

#### Reactive Homeowner Journey (Primary)

1. **Trigger:** Problem event occurs — rodent sounds, inspection finding, visible damage, odor, energy bill spike
2. **Search:** Homeowner Googles attic-specific terms ("attic cleaning near me," "rodent cleanup attic [city]")
3. **Discovery:** Lands on AtticCleaning.com via organic search result — either a directory listing page or an educational article
4. **Evaluation:** Uses search bar to find local companies by zip code. Scans listing cards — star ratings, review snippets, service tags, license badges. Filters or sorts by rating, reviews, or services offered
5. **Decision:** Compares 2–4 top options. Clicks through to detailed listing pages for phone number, website, hours, full reviews, and service details
6. **Contact:** Calls or visits the contractor's website directly to request a quote
7. **Value Realized:** Found a qualified, reviewed, licensed specialist in under 5 minutes — without wading through ads, mismatched results, or lead-gen forms

#### Research Homeowner Journey (Secondary)

1. **Curiosity:** Homeowner has a vague concern or question about their attic
2. **Content Discovery:** Finds educational article via Google (long-tail SEO content)
3. **Education:** Reads article, browses related content, gains understanding of their situation
4. **Conversion:** When ready to hire, returns to the directory as a trusted resource
5. **Search & Contact:** Follows the same evaluation-to-contact flow as the reactive homeowner

---

## Success Metrics

### User Success Metrics

| Metric | Definition | Target | Measurement |
|---|---|---|---|
| Search-to-Contact Time | Time from landing on directory to clicking a contractor's phone number or website | < 5 minutes | Analytics event tracking (search → listing click → contact click) |
| Search Result Relevance | % of searches that return at least 3 relevant local results | > 80% across covered metros | Search query logs + result count monitoring |
| Listing Usefulness | % of listing page visits where user engages with contact info (phone, website, directions) | > 25% contact engagement rate | Click tracking on contact CTAs |
| Content-to-Directory Conversion | % of educational article readers who subsequently use the directory search | > 10% within same session | Analytics funnel tracking |

### Business Objectives

#### Phase 1 — Directory Launch (Months 1–3)

| Objective | Target | Rationale |
|---|---|---|
| Organic Traffic Volume | 5,000+ monthly visitors by month 3 | Validates SEO strategy is gaining traction on long-tail attic cleaning terms |
| Directory Listings | 15,000–20,000 businesses loaded via Outscraper | Covers the core addressable market with enriched data |
| Geographic Coverage | Top 50 US metros with complete listing data | Ensures national footprint across highest-demand markets |

#### Phase 2–3 — Growth & Engagement (Months 4–12)

| Objective | Target | Rationale |
|---|---|---|
| Organic Traffic Volume | 25,000+ monthly visitors by month 12 | Demonstrates compounding SEO flywheel is working |
| Search Ranking | #1 organic ranking for "attic cleaning [city]" in top 50 metros | Primary competitive moat — this is the north star metric |
| Contractor Claim Rate | 5%+ of listed businesses claim their profile | Validates Phase 3 value prop and signals readiness for monetization |
| Educational Content Library | 100+ published articles covering attic cleaning topics | Feeds long-tail SEO and builds content authority |

#### Phase 4 — Monetization (Month 12+)

| Objective | Target | Rationale |
|---|---|---|
| Revenue | First paying contractors within 30 days of Phase 4 launch | Validates willingness to pay for leads/premium listings |
| Blended ARPU | Define after Phase 3 contractor engagement data | Pay-per-lead + premium listings + subscriptions |
| Lead Volume | Measurable contractor contact clicks attributable to the platform | Proves value to contractors before asking them to pay |

### Key Performance Indicators

**North Star Metric:** #1 organic search ranking for "attic cleaning [city]" across the top 50 US metros

**Leading Indicators (predict future success):**
- Pages indexed by Google (growth rate)
- Domain authority score (monthly trend)
- Organic keyword rankings for attic cleaning terms (position tracking across 50 metros)
- New backlinks acquired per month
- Content publication velocity (articles per week)

**Lagging Indicators (confirm success):**
- Monthly organic traffic (unique visitors)
- Search-to-contact conversion rate
- Geographic coverage completeness (% of top 50 metros with 10+ listings)
- Contractor claim rate (Phase 3)
- Monthly revenue (Phase 4)

**Anti-Metrics (vanity metrics to avoid):**
- Total page views without context (inflated by bots or thin pages)
- Raw listing count without quality (listings missing ratings, reviews, or service tags)
- Social media followers (not aligned with SEO-first strategy)

---

## MVP Scope

### Core Features (Phase 1)

#### 1. Search-First Homepage
- Hero section with H1 title and prominent search bar
- Search by zip code, city, state, or company name
- Clean, decluttered design using shadcn/ui components
- Featured city links and educational content highlights below the fold

#### 2. Search Results Page
- Listing cards displaying: company name, star rating, review count, 1-2 review snippets, service tags as colored chips, license verification badge
- Sort by: rating, most reviews, distance
- Filter by: service type (insulation removal, rodent cleanup, decontamination, air sealing, radiant barrier, crawl space)
- Postgres full-text search with `tsvector` + `pg_trgm` for fuzzy matching

#### 3. Individual Listing Pages
- Full company profile: name, address, phone, website, hours, map location
- All scraped Google reviews with star ratings
- Structured service tags
- State license number, status, and verification badge (where available)
- SEO-optimized with LocalBusiness schema markup

#### 4. City/Metro Landing Pages (Programmatic SEO)
- Auto-generated from database: "Attic Cleaning in [City]"
- One page per metro (50+ at launch), generated via `generateStaticParams`
- Seeded with local data: number of listed companies, average rating, state licensing info
- High-intent SEO pages targeting "attic cleaning [city]" keywords

#### 5. Educational Content Section
- AI-generated articles stored as MDX or Postgres rows
- Content types: city guides, service explainers, cost guides, comparison/top-rated pages
- Each article enriched with real directory data (local company counts, ratings, state-specific licensing)
- 200–500 articles at launch targeting long-tail SEO keywords

#### 6. Data Pipeline
- CLI script: Outscraper CSV/JSON import → transform → deduplicate by Place ID → upsert to Postgres
- State licensing enrichment: CA CSLB (C-2), FL DBPR, TX TDA bulk data matched by business name + address
- Service tag classification: keyword matching on scraped business descriptions
- Designed for monthly re-import/refresh

#### 7. SEO Infrastructure
- Static page generation at build time for all listings, city pages, and articles
- Cloudflare CDN for edge caching and global delivery
- Proper metadata, Open Graph tags, canonical URLs
- LocalBusiness JSON-LD schema markup on all listing pages
- XML sitemap auto-generation
- robots.txt optimized for crawl budget

### Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| ORM | Prisma |
| Database | PostgreSQL (DO Managed) |
| Hosting | Digital Ocean App Platform |
| CDN | Cloudflare (free tier) |
| Content | AI-generated, stored as MDX or Postgres |
| Data Pipeline | CLI scripts (TypeScript — Outscraper import + state license enrichment) |
| Search | Postgres full-text search (`tsvector` + `pg_trgm`) |

### Out of Scope for MVP

- **User accounts and authentication** (Phase 2)
- **Contractor claiming/editing of listings** (Phase 3)
- **Monetization — pay-per-lead, premium listings, subscriptions** (Phase 4)
- **User-submitted reviews** (Phase 2+)
- **Request-a-quote forms** (Phase 3-4)
- **Autocomplete/typeahead on search bar** (post-MVP enhancement)
- **Elasticsearch or advanced faceted search** (not needed until 50K+ listings)
- **Mobile app** (web-first, responsive design only)
- **Headless CMS** (not needed — content is AI-generated, data is scripted imports)
- **Real-time features** (no need for WebSockets, Supabase, or similar)

### MVP Success Criteria

| Gate | Criteria | Threshold |
|---|---|---|
| Data Completeness | Listings loaded across top 50 metros with ratings, reviews, and service tags | 15,000+ businesses |
| Geographic Coverage | All top 50 US metros represented with 10+ listings each | 50 metros |
| SEO Indexing | All listing pages, city pages, and articles indexed by Google | 90%+ pages indexed within 60 days |
| Content Library | AI-generated educational articles published at launch | 200+ articles |
| Page Performance | Core Web Vitals passing on all page types | LCP < 2.5s, CLS < 0.1 |
| Search Functionality | Homeowner can search by zip, city, state, or company name and get relevant results | < 500ms response time |

### Future Vision

#### Phase 2 — User Accounts (Months 4–6)
- Homeowner accounts with saved searches and favorite contractors
- User-submitted reviews layered on top of scraped Google reviews
- Email alerts for new contractors in saved locations

#### Phase 3 — Contractor Self-Service (Months 7–9)
- Contractors claim and verify ownership of their listing
- Profile editing: update services, hours, photos, description
- Analytics dashboard: views, contact clicks, search appearances

#### Phase 4 — Monetization (Months 10–12+)
- Pay-per-lead: contractors pay for qualified contact clicks
- Premium listings: boosted placement in search results
- Contractor subscriptions: monthly plans for enhanced profiles and lead flow
- Lead distribution: homeowner requests routed to multiple qualified contractors
