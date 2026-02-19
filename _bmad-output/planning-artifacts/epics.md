---
stepsCompleted: [1, 2, 3, 4]
status: complete
completedAt: '2026-02-11'
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# atticcleaning-website - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for atticcleaning-website, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Search & Discovery**
- FR1: Homeowners can search for attic cleaning companies by zip code, city, state, or company name
- FR2: Homeowners can view search results as listing cards displaying company name, star rating, review count, review snippets, and service tags
- FR3: Homeowners can filter search results by service type (insulation removal, rodent cleanup, decontamination, air sealing, radiant barrier, crawl space)
- FR4: Homeowners can sort search results by rating, number of reviews, or distance
- FR5: System automatically expands search radius to 20 miles when fewer than 3 results are found for a location
- FR6: System displays distance for each result when search radius has been expanded beyond the original location
- FR7: System surfaces educational articles matching the searched service type or location on search result pages returning fewer than 3 listings

**Listing Profiles**
- FR8: Homeowners can view a detailed listing page for each company including name, address, phone number, website, hours, and map location
- FR9: Homeowners can view all imported Google reviews with star ratings on a listing page
- FR10: Homeowners can see structured service tags on a listing page indicating which attic services the company offers
- FR11: Homeowners can initiate contact with a company via phone number or website link from the listing page

**Programmatic SEO & Internal Linking**
- FR12: System generates city/metro landing pages for each covered metro area displaying local directory listings
- FR13: City landing pages display aggregated local data including number of listed companies and average rating
- FR14: System generates LocalBusiness JSON-LD schema markup on all listing pages
- FR15: System generates XML sitemaps covering all listing pages, city pages, and articles
- FR16: System generates self-referencing canonical URLs, Open Graph tags, and Twitter Card metadata on all pages
- FR17: City landing pages link to individual listing pages for companies in that metro area
- FR18: Individual listing pages link back to their parent city landing page
- FR19: City landing pages link to nearby metro city pages to distribute page authority

**Educational Content**
- FR20: Homeowners can browse educational articles about attic cleaning topics
- FR21: Articles include internal links to articles sharing the same topic tag and to city landing pages for metros mentioned in the content
- FR22: Articles are enriched with real directory data (local company counts, ratings, metro-specific information)
- FR23: Homeowners arriving via educational content can navigate to the directory search experience

**Data Pipeline**
- FR24: Admin can import business listing data from Outscraper CSV/JSON files via CLI script
- FR25: Import pipeline deduplicates listings by Google Place ID during import
- FR26: Import pipeline classifies service tags based on business name and description fields
- FR27: Import pipeline validates records and rejects entries missing required fields (name, address, phone, rating)
- FR28: Import pipeline outputs a summary report (listings added, duplicates skipped, tag classification rate)
- FR29: Admin can trigger a full static site rebuild to generate updated pages from new data

**Search Analytics**
- FR30: System logs search queries that return fewer than 3 results, capturing location data for expansion prioritization

**Content Management**
- FR31: Admin can add and manage educational articles via the content management workflow
- FR32: Admin can manage metro/city coverage by importing data for new geographic areas

**Homepage Content**
- FR33: Homepage displays featured city links and educational content highlights below the search bar

### NonFunctional Requirements

**Performance**
- NFR-P1: Largest Contentful Paint (LCP) < 1.5s on all page types, mobile 4G connection
- NFR-P2: Cumulative Layout Shift (CLS) < 0.1 on all page types, including font swap
- NFR-P3: Interaction to Next Paint (INP) < 200ms for search, filter, and sort interactions
- NFR-P4: Search query response time < 500ms including fallback radius expansion
- NFR-P5: Time to First Byte (TTFB) < 200ms for CDN edge-served pages
- NFR-P6: Total page weight < 500KB initial load, compressed, including fonts
- NFR-P7: Static site build time < 10 minutes for full rebuild with 25 metros + 50 articles + all listings
- NFR-P8: Font loading with zero CLS — critical fonts preloaded, accent font swapped asynchronously

**Security**
- NFR-S1: HTTPS with TLS 1.2+ on all pages (SSL Labs grade A+)
- NFR-S2: Security headers configured — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy (securityheaders.com grade A+)
- NFR-S3: Search inputs sanitized against XSS and injection (OWASP ZAP 0 high/medium alerts)
- NFR-S4: No user-submitted data stored in MVP — all data admin-imported
- NFR-S5: CLI-only admin — no remote admin interface exposed
- NFR-S6: robots.txt blocks API routes and admin endpoints
- NFR-S7: No cookies or tracking beyond analytics in MVP

**Scalability**
- NFR-SC1: Support 15,000-20,000 listings across 25 metros at launch
- NFR-SC2: Support 50 articles at launch, scaling to 200+ without architecture changes
- NFR-SC3: CDN-handled concurrent users for static pages
- NFR-SC4: Pipeline supports adding metros incrementally
- NFR-SC5: Monthly data re-import via CLI; evaluate ISR if build time exceeds 10 min

**Accessibility**
- NFR-A1: WCAG 2.1 AA compliance across all public pages (axe-core 0 violations)
- NFR-A2: Color contrast minimum 4.5:1 for normal text, 3:1 for large text (Lighthouse accessibility 100)
- NFR-A3: All interactive elements keyboard navigable with visible focus indicators
- NFR-A4: Screen reader compatible — ARIA labels, landmark regions, heading hierarchy on all pages
- NFR-A5: Touch targets minimum 44x44px on mobile
- NFR-A6: Skip-to-content link present on all pages
- NFR-A7: All images include descriptive alt text
- NFR-A8: All inputs have associated labels
- NFR-A9: No content conveyed by color alone
- NFR-A10: Semantic HTML — proper heading hierarchy, landmark regions, structured content

**Integration**
- NFR-I1: Outscraper data import pipeline handles schema variations with 95%+ record acceptance rate
- NFR-I2: Google Maps embed renders company location with address text fallback within 2s
- NFR-I3: XML sitemap submitted to Google Search Console post-deploy; 90%+ URLs indexed within 60 days
- NFR-I4: Cloudflare CDN cache invalidation completes within 5 minutes of deploy; static assets cached 30 days

**Reliability**
- NFR-R1: 99.5% monthly uptime
- NFR-R2: Deploy rollback < 5 minutes
- NFR-R3: 0 records corrupted or lost during import
- NFR-R4: CDN failover < 30s, transparent to users
- NFR-R5: Static pages remain accessible when search API is down

### Additional Requirements

**From Architecture — Starter Template & Infrastructure:**
- STARTER: Project initialized with create-next-app + shadcn init (already executed, commit fdef112). Includes Next.js 16.1.6, React 19.2.3, TypeScript 5, Tailwind CSS v4, shadcn/ui 3.x, Radix UI 1.4.3.
- INFRA-1: Prisma 7.2.0 ORM setup with PostgreSQL on Digital Ocean Managed Database — schema, migrations, client singleton
- INFRA-2: Custom three-font system — replace Geist fonts with Plus Jakarta Sans (500/600/700), Source Serif 4 (400/400i), Lora (500/500i) via next/font/google
- INFRA-3: Custom color tokens — replace shadcn defaults with UX spec palette (#FAFAF8 background, #1A1A1A foreground, #2563EB primary, #D4A017 accent, etc.)
- INFRA-4: MDX content system using next-mdx-remote for educational articles stored in src/content/articles/
- INFRA-5: Build-time geocoding lookup table using GeoNames.org US postal code data (~43K records) seeded to ZipCode table
- INFRA-6: Cloudflare DNS + Proxy setup (free tier) — CDN, DDoS protection, SSL termination, basic rate limiting
- INFRA-7: GitHub Actions CI/CD pipeline — lint, type-check, axe-core, Lighthouse CI; DO App Platform auto-deploys on push to main
- INFRA-8: Security headers configured in next.config.ts — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- INFRA-9: Rate limiting on /api/search endpoint via Cloudflare free tier rules
- INFRA-10: Environment configuration — .env for local, DO App Platform env vars for production
- INFRA-11: Outscraper API token available for data pipeline (confirmed in .env)

**From Architecture — Implementation Patterns:**
- PATTERN-1: PascalCase Prisma models, camelCase fields, SCREAMING_SNAKE enums
- PATTERN-2: Flat component structure in src/components/ (no feature folders)
- PATTERN-3: Co-located tests with .test.ts suffix
- PATTERN-4: Page-level data fetching via Prisma in async server components — components receive data as props only
- PATTERN-5: URL search params as state for search/filter/sort — no global state management
- PATTERN-6: Single API route at GET /api/search with SearchResponse interface
- PATTERN-7: No loading states by design — static generation eliminates the need
- PATTERN-8: Anti-patterns explicitly forbidden: no services/repositories layers, no hooks dir, no store, no barrel files, no CSS modules

**From UX — Design Requirements:**
- UX-1: Responsive layout strategy — Direction A (single-column) for mobile, Direction B (2-column grid) for desktop, Direction F (hero+cities+articles) for homepage
- UX-2: ListingCard component — data-dense card with company name, star rating, review count, service tags, review snippet, contact links, optional distance label
- UX-3: ServiceTagChip component — card variant (static display) and filter variant (toggle button with aria-pressed)
- UX-4: StarRating component — gold star SVGs with compact and full variants, aria-label
- UX-5: SearchBar component — hero variant (large, homepage) and header variant (compact, persistent nav), form with action="/search"
- UX-6: CityCard component — featured city link with name, state, and company count
- UX-7: ArticleCard component — educational content highlight with title, excerpt, topic tag
- UX-8: Service tag chip color system — 6 muted tint backgrounds with dark text per service type
- UX-9: Filter toolbar — horizontal chip row above results with multi-select toggle behavior, client-side filtering
- UX-10: Sort control — single Select with 3 options (rating, reviews, distance), client-side reordering
- UX-11: Header navigation — logo + persistent search bar on all non-homepage pages
- UX-12: Footer — city links, content links, legal
- UX-13: No animations, no modals, no toasts, no loading spinners in MVP
- UX-14: Semantic HTML on every page — skip-to-content link, header/main/footer landmarks, proper heading hierarchy
- UX-15: Visible focus indicators on all interactive elements — 2px solid primary outline, 2px offset
- UX-16: Article page patterns — Source Serif 4 body text, max-width 680px reading column, contextual CTAs as inline text links, related articles at bottom
- UX-17: Silent radius expansion UX — info line "Showing results within X miles of [location]", distance labels on cards, educational articles below sparse results
- UX-18: No empty states or error states by design — system always provides useful content

### FR Coverage Map

| FR | Epic | Description |
|---|---|---|
| FR1 | Epic 2 | Search by zip/city/state/company |
| FR2 | Epic 2 | Listing cards with ratings/reviews/tags |
| FR3 | Epic 2 | Filter by service type |
| FR4 | Epic 2 | Sort by rating/reviews/distance |
| FR5 | Epic 2 | Auto radius expansion to 20mi |
| FR6 | Epic 2 | Distance display on expansion |
| FR7 | Epic 2 | Articles on low-result searches |
| FR8 | Epic 3 | Detailed listing page |
| FR9 | Epic 3 | All Google reviews on listing |
| FR10 | Epic 3 | Service tags on listing page |
| FR11 | Epic 3 | Contact via phone/website |
| FR12 | Epic 4 | City/metro landing pages |
| FR13 | Epic 4 | Aggregated city data |
| FR14 | Epic 6 | LocalBusiness JSON-LD |
| FR15 | Epic 6 | XML sitemaps |
| FR16 | Epic 6 | Canonical URLs, OG, Twitter Cards |
| FR17 | Epic 4 | City → listing links |
| FR18 | Epic 4 | Listing → city links |
| FR19 | Epic 4 | City → nearby city links |
| FR20 | Epic 5 | Browse educational articles |
| FR21 | Epic 5 | Internal links in articles |
| FR22 | Epic 5 | Articles enriched with directory data |
| FR23 | Epic 5 | Content → directory navigation |
| FR24 | Epic 1 | Import from Outscraper |
| FR25 | Epic 1 | Deduplicate by Place ID |
| FR26 | Epic 1 | Classify service tags |
| FR27 | Epic 1 | Validate required fields |
| FR28 | Epic 1 | Import summary report |
| FR29 | Epic 1 | Trigger static rebuild |
| FR30 | Epic 6 | Log low-result searches |
| FR31 | Epic 5 | Manage articles via content workflow |
| FR32 | Epic 1 | Manage metro/city coverage |
| FR33 | Epic 2 | Homepage featured cities + articles |

## Epic List

### Epic 1: Project Foundation & Data Pipeline
Admin (Jon) can import Outscraper data, classify service tags, seed geocoding data, and have a fully populated database ready for the directory. Design system (fonts, colors, tokens) is established.
**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29, FR32
**Additional:** STARTER, INFRA-1 through INFRA-5, INFRA-10-11, PATTERN-1 through PATTERN-8

### Epic 2: Search & Discovery Experience
Homeowners can search for attic cleaning companies by location, view listing cards with ratings/reviews/service tags, filter by service type, sort results, and see radius-expanded results with distance labels when coverage is thin. Homepage provides search entry, featured city links, and article highlights.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR33
**Additional:** UX-1 through UX-15, UX-17, UX-18

### Epic 3: Listing Profiles & Contact Conversion
Homeowners can view a detailed company profile with all Google reviews, a map showing location, full service tag list, business hours, and direct contact links. Listing pages link back to their parent city.
**FRs covered:** FR8, FR9, FR10, FR11
**Additional:** NFR-I2, UX-2

### Epic 4: City Landing Pages & Internal Linking
Homeowners arriving from Google for "attic cleaning [city]" land on a dedicated city page showing all local companies with aggregated stats. City pages link to listings, back to nearby cities, and serve as SEO-optimized entry points.
**FRs covered:** FR12, FR13, FR17, FR18, FR19
**Additional:** UX-1

### Epic 5: Educational Content & Article System
Homeowners can browse educational articles enriched with real directory data and threaded with internal links. Readers can transition to directory search via persistent header search bar and contextual CTAs. Admin can manage articles via MDX content workflow.
**FRs covered:** FR20, FR21, FR22, FR23, FR31
**Additional:** INFRA-4, UX-16

### Epic 6: SEO Infrastructure & Search Analytics
Every listing page has LocalBusiness JSON-LD, all pages have canonical URLs and OG/Twitter metadata, an XML sitemap covers all public pages, robots.txt controls crawl access, and low-result searches are logged for expansion prioritization.
**FRs covered:** FR14, FR15, FR16, FR30
**Additional:** NFR-S6, NFR-I3, UX-14

### Epic 7: Launch Readiness & Production Quality
The site meets production quality standards — WCAG 2.1 AA accessibility, performance targets (LCP < 1.5s, < 500KB pages), security headers, CDN edge delivery via Cloudflare, CI/CD pipeline with automated quality gates, and reliable deploy/rollback capability.
**FRs covered:** (NFR-focused)
**Additional:** INFRA-6 through INFRA-9, NFR-P1 through NFR-P8, NFR-S1 through NFR-S7, NFR-A1 through NFR-A10, NFR-R1 through NFR-R5, NFR-I4

### Epic 8: Data Population & Multi-Market Expansion
Import real Outscraper listing data across 25 metros, validate data quality, and ensure build performance at scale.
**FRs covered:** FR24, FR25, FR26, FR27, FR28, FR29, FR32
**Additional:** NFR-SC1, NFR-SC4, NFR-P7

### Epic 9: Visual Design Enhancement
Elevate the site from functional prototype to polished visual identity — CSS-only changes applying "Authority Through Refined Details" aesthetic across all components and page templates.
**FRs covered:** (Visual quality enhancement)
**Additional:** NFR-A2, UX-1 through UX-18

### Epic 10: Educational Content Creation
Create 48 educational articles across 8 categories with real directory data enrichment and internal linking, following the content strategy and topic plan.
**FRs covered:** FR20, FR21, FR22, FR31
**Additional:** INFRA-4

### Epic 11: Advanced Visual Polish — Malewicz Design Principles
Apply professional UI design principles from Michal Malewicz to transform the site from "clean and functional" to "polished and trust-inspiring." All changes are CSS-only, building on Epic 9's foundation. Focuses on color-matched shadows, subtle gradients, button hierarchy, card depth, homepage decoration, and cross-page consistency. Uses `frontend-design` skill and browser automation for live visual verification.
**FRs covered:** (Visual quality enhancement — Aesthetic Usability Effect)
**Additional:** NFR-A1, NFR-A2, NFR-P2 (zero CLS)

---

## Epic 1: Project Foundation & Data Pipeline

Admin (Jon) can import Outscraper data, classify service tags, seed geocoding data, and have a fully populated database ready for the directory. Design system (fonts, colors, tokens) is established.

### Story 1.1: Project Configuration & Design System Setup

As a **developer**,
I want the project configured with the correct font system, color tokens, and environment setup,
So that all subsequent development uses the established brand identity and design system.

**Acceptance Criteria:**

**Given** the initialized Next.js project with shadcn/ui defaults
**When** the design system setup is complete
**Then** Geist fonts are replaced with Plus Jakarta Sans (500/600/700), Source Serif 4 (400/400i), and Lora (500/500i) via next/font/google
**And** CSS variables are configured: `--font-jakarta`, `--font-source-serif`, `--font-lora` mapped to Tailwind `font-sans`, `font-serif`, `font-display`
**And** Plus Jakarta Sans and Source Serif 4 are preloaded as critical path; Lora uses `font-display: swap`
**And** shadcn/ui default color tokens are replaced with UX spec palette (#FAFAF8 background, #1A1A1A foreground, #2563EB primary, #D4A017 accent, #FFFFFF card, #E5E5E0 border, #6B6B6B muted)
**And** service tag chip colors are defined for all 6 service types (rodent cleanup, insulation removal, decontamination, mold remediation, general cleaning, attic restoration)
**And** `.env.example` documents required environment variables (DATABASE_URL, GOOGLE_MAPS_API_KEY)
**And** `npm run dev` starts successfully with the new configuration
**And** zero CLS from font loading is verified in browser DevTools

### Story 1.2: Database Schema & Prisma Setup

As a **developer**,
I want the complete database schema defined in Prisma with all models needed for the directory,
So that data can be imported and queried by the application.

**Acceptance Criteria:**

**Given** a fresh project without Prisma installed
**When** the database setup is complete
**Then** Prisma 7 is installed and configured with PostgreSQL connection via DATABASE_URL
**And** the schema defines models: Listing, City, Review, ServiceTag, SearchLog, ZipCode following PascalCase model names and camelCase field names
**And** the Listing model includes: id (cuid), googlePlaceId (unique), name, slug, starRating (Float), reviewCount (Int), phone?, website?, address, latitude, longitude, city relation, reviews relation, serviceTags relation, createdAt, updatedAt
**And** the City model includes: id (cuid), name, state, slug (unique), latitude, longitude, listings relation, createdAt
**And** the Review model includes: id (cuid), listing relation, authorName, rating (Float), text, publishedAt, createdAt
**And** the ServiceTag model includes: id (cuid), listing relation, serviceType (enum: RODENT_CLEANUP, INSULATION_REMOVAL, DECONTAMINATION, MOLD_REMEDIATION, GENERAL_CLEANING, ATTIC_RESTORATION)
**And** the ZipCode model includes: id (cuid), code (unique), city, state, latitude, longitude
**And** the SearchLog model includes: id (cuid), query, resultCount (Int), radiusMiles (Float), latitude?, longitude?, createdAt
**And** GIN indexes are defined for full-text search on Listing (name, address)
**And** `npx prisma migrate dev` runs successfully creating all tables
**And** `src/lib/prisma.ts` exports a singleton Prisma client instance
**And** `npx prisma generate` produces TypeScript types for all models

### Story 1.3: Geocoding Lookup Table Seed

As an **admin**,
I want to seed the zip code geocoding lookup table with US postal code data,
So that the search API can resolve zip codes to coordinates for radius-based queries without runtime API calls.

**Acceptance Criteria:**

**Given** the ZipCode table exists in the database (from Story 1.2)
**When** the admin runs `npx tsx src/scripts/seed-zip-codes.ts`
**Then** the script reads GeoNames.org US postal code data (included as `data/us-zip-codes.csv` in the repo)
**And** approximately 43,000 US zip code records are inserted with code, city, state, latitude, and longitude
**And** duplicate zip codes are handled via upsert (no errors on re-run)
**And** the script outputs a summary: total records processed, records inserted, records skipped
**And** the script completes in under 30 seconds
**And** a zip code like "85001" resolves to Phoenix, AZ with valid coordinates

### Story 1.4: Outscraper Data Import Pipeline

As an **admin**,
I want to import business listing data from Outscraper CSV/JSON export files,
So that the directory is populated with real contractor data including ratings, reviews, and contact information.

**Acceptance Criteria:**

**Given** an Outscraper CSV/JSON export file containing business listing data
**When** the admin runs `npx tsx src/scripts/import-listings.ts <filepath>`
**Then** the script parses the file and maps Outscraper fields to the Prisma schema
**And** records missing required fields (name, address, phone, rating) are rejected with a logged warning (FR27)
**And** records are deduplicated by Google Place ID — existing listings are updated, new listings are inserted (FR25)
**And** City records are created or matched for each listing's location
**And** Review records are imported for each listing with author name, rating, text, and date
**And** the script generates URL-safe slugs for cities (e.g., "phoenix-az") and companies (e.g., "abc-attic-cleaning")
**And** the script outputs a summary report to stdout: listings added, listings updated, duplicates skipped, records rejected, total processed (FR28)
**And** the script handles schema variations in Outscraper exports gracefully (NFR-I1)
**And** 0 records are corrupted or lost during import (NFR-R3)
**And** running the import a second time with the same file produces 0 new records (idempotent)
**And** the admin can import data for new geographic areas to expand metro coverage (FR32)

### Story 1.5: Service Tag Classification

As an **admin**,
I want service tags automatically classified for imported listings based on business name and description,
So that homeowners can filter and identify specialists by specific attic cleaning services.

**Acceptance Criteria:**

**Given** listings exist in the database from Story 1.4
**When** the admin runs `npx tsx src/scripts/classify-service-tags.ts`
**Then** the script reads all listings and applies keyword matching against business name and description fields
**And** keywords map to the 6 service types: RODENT_CLEANUP, INSULATION_REMOVAL, DECONTAMINATION, MOLD_REMEDIATION, GENERAL_CLEANING, ATTIC_RESTORATION
**And** a listing can have multiple service tags (e.g., both RODENT_CLEANUP and DECONTAMINATION)
**And** conservative matching is used — better to show no tag than a wrong tag
**And** existing service tags are cleared and re-classified on each run (idempotent)
**And** the script outputs a summary: total listings processed, listings with tags, listings without tags, tag distribution by type
**And** the classification rate is logged (target: tags applied to 80%+ of listings)
**And** after classification, the admin can trigger a full static site rebuild by running `npm run build` to generate updated pages (FR29)

---

## Epic 2: Search & Discovery Experience

Homeowners can search for attic cleaning companies by location, view listing cards with ratings/reviews/service tags, filter by service type, sort results, and see radius-expanded results with distance labels when coverage is thin. Homepage provides search entry, featured city links, and article highlights.

### Story 2.1: Root Layout, Header & Footer

As a **homeowner**,
I want a consistent site layout with navigation and a persistent search bar,
So that I can search for contractors from any page and navigate the site easily.

**Acceptance Criteria:**

**Given** any page on the site
**When** the page renders
**Then** the root layout includes a skip-to-content link as the first focusable element
**And** the `<html>` element has `lang="en"`
**And** the page uses semantic HTML: `<header role="banner">`, `<main id="main" role="main">`, `<footer role="contentinfo">`
**And** the header displays a site logo/wordmark and a SearchBar (header variant, compact) on all non-homepage pages
**And** the footer displays featured city links, content links, and legal text
**And** the header search bar is visible without scrolling on all page types
**And** all interactive elements have visible focus indicators (2px solid primary outline, 2px offset)
**And** the layout is responsive: single-column on mobile (< 768px), max-width 1200px centered on desktop (> 1024px)
**And** fonts load correctly: Plus Jakarta Sans for UI elements, Source Serif 4 for body content

### Story 2.2: Search API Route with Radius Expansion

As a **homeowner**,
I want to search for attic cleaning companies by zip code, city, state, or company name,
So that I find relevant local contractors quickly.

**Acceptance Criteria:**

**Given** the search API endpoint at `GET /api/search`
**When** a user submits a search query via `?q=<location>`
**Then** the API accepts query parameters: `q` (search query), `service` (filter), `sort` (rating|reviews|distance)
**And** the API resolves zip codes to coordinates using the ZipCode lookup table
**And** the API resolves city names to coordinates using the City table
**And** the API performs Postgres full-text search (tsvector + pg_trgm) on listing name and address
**And** the API returns results within a default radius of the resolved location
**And** when fewer than 3 results are found, the system automatically expands the radius to 20 miles (FR5)
**And** when still fewer than 3 results, the system expands to 50 miles
**And** the response follows the SearchResponse interface: `{ results: ListingResult[], meta: { query, totalCount, expanded, radiusMiles, location } }`
**And** the response is always 200 OK — never returns error responses to users
**And** empty results return: `{ results: [], meta: { totalCount: 0, expanded: true, radiusMiles: 50 } }`
**And** search response time is < 500ms including radius expansion (NFR-P4)
**And** search inputs are sanitized against XSS and injection via Prisma parameterized queries (NFR-S3)

### Story 2.3: SearchBar Component

As a **homeowner**,
I want a prominent search bar where I can type a location to find attic cleaning companies,
So that I can quickly start my search from any page.

**Acceptance Criteria:**

**Given** the SearchBar component
**When** rendered in "hero" variant (homepage)
**Then** the search bar is full-width with 44px height, Jakarta Sans font, and a search icon
**And** placeholder text reads "Search by city, zip code, or company name"
**And** a "Search" submit button is visible with `--primary` background and white text

**Given** the SearchBar component
**When** rendered in "header" variant (all other pages)
**Then** the search bar is compact, integrated into the header navigation

**Given** the SearchBar component
**When** the user types a location and presses Enter or taps the Search button
**Then** the form submits via full page navigation to `/search?q=<query>` (not SPA)
**And** the submit button is disabled when the input is empty

**Given** the SearchBar component
**When** navigating via keyboard
**Then** the input has `type="search"` with `aria-label="Search for attic cleaning companies by city or zip code"`
**And** the form is wrapped in `<form role="search">`
**And** the input has an associated label (NFR-A8)
**And** touch target meets 44x44px minimum (NFR-A5)
**And** the component is a client component (`"use client"`)

### Story 2.4: ListingCard, StarRating & ServiceTagChip Components

As a **homeowner**,
I want to see listing cards that display company name, star rating, review count, service tags, and a review snippet,
So that I can quickly assess if a company handles my specific problem and is well-reviewed.

**Acceptance Criteria:**

**Given** the ListingCard component with listing data
**When** rendered on search results or city pages
**Then** the card displays (top to bottom): company name (Jakarta Sans, 18px, semibold), star rating with review count, service tag chips, review snippet (Source Serif 4, italic), and contact links (phone/website)
**And** the card is an `<article>` element with company name as a link to the detail page
**And** phone number renders as `<a href="tel:...">` with `aria-label="Call [company name]"`
**And** website link opens in a new tab with `target="_blank" rel="noopener"` and `aria-label="Visit [company name] website"`
**And** review snippet truncates at 2 lines with ellipsis
**And** the card adapts when data is missing: no phone hides phone link, no snippet collapses that area

**Given** the ListingCard component with `distance` prop
**When** the search radius was expanded
**Then** a distance label appears (e.g., "12 miles away") in Jakarta Sans, 13px

**Given** the StarRating component
**When** rendered with a rating (1.0-5.0) and review count
**Then** gold star SVGs (`#D4A017`) display the rating visually
**And** compact variant shows "(187)", full variant shows "(187 reviews)"
**And** `aria-label="Rated [rating] out of 5 based on [count] reviews"`

**Given** the ServiceTagChip component in "card" variant
**When** rendered on a ListingCard
**Then** it displays as a static `<span>` with the correct muted tint background and dark text per service type
**And** chip font is Jakarta Sans, 12px/13px, weight 500
**And** chips are horizontally scrollable if > 3 on mobile

**Given** all card components
**When** rendered on mobile (< 768px)
**Then** cards are full-width (Direction A: Clean Stack)
**And** all touch targets meet 44x44px minimum
**And** card padding is 12px, border is 1px solid `--border`, border-radius is 8px

### Story 2.5: Search Results Page with Filters & Sort

As a **homeowner**,
I want to view search results with filter and sort controls,
So that I can narrow results to my specific service need and compare contractors efficiently.

**Acceptance Criteria:**

**Given** the search results page at `/search?q=<query>`
**When** the page loads
**Then** the page is server-rendered dynamically (not static) using the search API
**And** a result count line displays: "X attic cleaning companies in [location]"
**And** listing cards render in a vertical stack on mobile, 2-column grid on desktop (> 1024px)
**And** the page title and meta description reflect the search query

**Given** the filter toolbar
**When** rendered above search results
**Then** service-type filter chips display horizontally: All Services, Rodent Cleanup, Insulation Removal, Decontamination, Mold Remediation, General Cleaning, Attic Restoration
**And** chips use the ServiceTagChip "filter" variant with `<button aria-pressed="true/false">`
**And** inactive chips are outlined, active chips are filled with `--primary` and white text
**And** multiple chips can be active simultaneously (multi-select)
**And** filtering is client-side JS on the pre-rendered list — instant, no page reload (FR3)

**Given** the sort control
**When** rendered alongside filter chips
**Then** a Select component offers 3 options: "Highest Rated" (default), "Most Reviews", "Distance" (FR4)
**And** changing sort reorders results instantly via client-side JS — no page reload

**Given** a search with fewer than 3 results
**When** radius expansion occurs
**Then** a subtle info line displays: "Showing results within [X] miles of [location]" (UX-17)
**And** each card shows a distance label (FR6)
**And** educational articles matching the service type or location surface below results (FR7)

**Given** a search with no results at maximum radius
**When** the page renders
**Then** the page still displays without error — shows whatever results exist plus an educational content section (UX-18)
**And** no "No results found" message, no "sorry" language, no error states

### Story 2.6: Homepage

As a **homeowner**,
I want a homepage with a prominent search bar, featured cities, and educational content highlights,
So that I can quickly search, browse popular metros, or discover helpful articles.

**Acceptance Criteria:**

**Given** the homepage at `/`
**When** the page loads
**Then** the page is statically generated (SSG)
**And** the hero section displays a Lora tagline (28px mobile / 40px desktop, weight 500) and a SearchBar in "hero" variant
**And** the search bar is above the fold on mobile
**And** below the hero, a featured cities grid displays CityCard components for top metros by listing count
**And** CityCards show city name, state, and company count (e.g., "Phoenix, AZ — 47 companies")
**And** CityCards are `<a>` links to city landing pages with `aria-label="View [count] attic cleaning companies in [city], [state]"`
**And** CityCards display in 2 columns on mobile, 3 on tablet, 4 on desktop
**And** below cities, an educational content highlights section displays ArticleCard components
**And** ArticleCards show title, excerpt, and topic tag as `<a>` links to article pages
**And** ArticleCards display in 1 column mobile, 2 tablet, 3 desktop
**And** the homepage header shows logo only (no search bar in header — it's in the hero)
**And** the footer displays city links, content links, and legal text
**And** LCP < 1.5s on mobile 4G (NFR-P1)
**And** total page weight < 500KB (NFR-P6)

---

## Epic 3: Listing Profiles & Contact Conversion

Homeowners can view a detailed company profile with all Google reviews, a map showing location, full service tag list, business hours, and direct contact links. Listing pages link back to their parent city.

### Story 3.1: Listing Detail Page

As a **homeowner**,
I want to view a detailed profile page for a company with all their information, reviews, and a map,
So that I can fully evaluate a contractor before contacting them.

**Acceptance Criteria:**

**Given** the listing detail page at `/[citySlug]/[companySlug]`
**When** the page loads
**Then** the page is statically generated via `generateStaticParams` querying all listings from Prisma
**And** the page displays: company name (h1, Jakarta Sans, 24px mobile / 32px desktop), full address, phone number, website link, and business hours (FR8)
**And** the phone number renders as `<a href="tel:...">` with `aria-label="Call [company name]"` (FR11)
**And** the website link opens in a new tab with `target="_blank" rel="noopener"` (FR11)
**And** all imported Google reviews display with individual star ratings, author name, review text, and date (FR9)
**And** reviews are rendered in Source Serif 4 for the review text body
**And** the StarRating component displays in "full" variant showing "(X reviews)"
**And** all service tags display as ServiceTagChip "card" variant chips (FR10)
**And** a Google Maps embed shows the company location via lazy-loaded iframe with `loading="lazy"` (NFR-I2)
**And** if the Maps embed fails to load, the full address text displays as fallback within 2 seconds (NFR-I2)
**And** the page links back to the parent city landing page (FR18) — e.g., "More attic cleaning companies in Phoenix, AZ"
**And** the page layout is single column, max-width 800px on desktop
**And** the page uses semantic HTML with proper heading hierarchy (h1 company name, h2 sections)

**Given** the listing detail page metadata
**When** search engines crawl the page
**Then** the page has a unique `<title>` tag: "[Company Name] - Attic Cleaning in [City], [State]"
**And** a meta description summarizes the company's rating, review count, and services

**Given** the listing detail page
**When** navigating via keyboard
**Then** all contact links and navigation links are keyboard accessible
**And** focus indicators are visible on all interactive elements
**And** the page follows the established skip-to-content and landmark structure from the root layout

---

## Epic 4: City Landing Pages & Internal Linking

Homeowners arriving from Google for "attic cleaning [city]" land on a dedicated city page showing all local companies with aggregated stats. City pages link to listings, back to nearby cities, and serve as SEO-optimized entry points.

### Story 4.1: City Landing Pages with Aggregated Data

As a **homeowner**,
I want to browse a city-specific landing page showing all local attic cleaning companies with aggregated stats,
So that I can find and compare contractors in my metro area from a Google search result.

**Acceptance Criteria:**

**Given** the city landing page at `/[citySlug]/` (e.g., `/phoenix-az/`)
**When** the page loads
**Then** the page is statically generated via `generateStaticParams` querying all cities from Prisma
**And** the page displays a city-specific heading: "Attic Cleaning Companies in [City], [State]" (h1, Jakarta Sans)
**And** aggregated local data displays: total number of listed companies and average star rating (FR13)
**And** all listings for the city render as ListingCard components (reused from Epic 2)
**And** listing cards are displayed in single column on mobile, 2-column grid on desktop
**And** the SearchBar component (header variant) is pre-filled with the city name
**And** filter chips and sort control are available above results (reused from Epic 2)
**And** filtering and sorting work identically to the search results page (client-side JS)

**Given** the city landing page internal linking
**When** the page renders
**Then** each listing card links to its detail page at `/[citySlug]/[companySlug]` (FR17)
**And** a "Nearby Cities" section displays links to geographically adjacent metro city pages (FR19)
**And** nearby cities are determined by geographic proximity from the City table coordinates
**And** nearby city links display as city name with company count (e.g., "Tucson, AZ — 23 companies")

**Given** the city landing page metadata
**When** search engines crawl the page
**Then** the page has a unique `<title>`: "Top Attic Cleaning Companies in [City], [State] | AtticCleaning.com"
**And** a meta description includes company count and average rating
**And** the page uses semantic HTML with proper heading hierarchy

**Given** any listing detail page (from Epic 3)
**When** the page renders
**Then** the listing detail page links back to its parent city landing page (FR18) — this link was established in Story 3.1

---

## Epic 5: Educational Content & Article System

Homeowners can browse educational articles enriched with real directory data and threaded with internal links. Readers can transition to directory search via persistent header search bar and contextual CTAs. Admin can manage articles via MDX content workflow.

### Story 5.1: MDX Content Infrastructure & Article Rendering

As a **homeowner**,
I want to read educational articles about attic cleaning topics,
So that I can make informed decisions about my attic problem before hiring a contractor.

**Acceptance Criteria:**

**Given** MDX article files stored in `src/content/articles/`
**When** the article page at `/articles/[slug]` loads
**Then** the page is statically generated via `generateStaticParams` enumerating all MDX files
**And** `src/lib/mdx.ts` reads and parses MDX files using next-mdx-remote (INFRA-4)
**And** article body text renders in Source Serif 4, 16px mobile / 18px desktop, max-width 680px reading column (UX-16)
**And** article headings render in Jakarta Sans (h2 at 20px/24px, h3 at 18px)
**And** the persistent header with SearchBar (header variant) is visible — homeowners can switch to search at any time (FR23)
**And** the page uses semantic HTML with proper heading hierarchy
**And** LCP < 1.5s on mobile 4G

**Given** the MDX frontmatter for an article
**When** the article is processed
**Then** frontmatter supports: title, slug, excerpt, topicTag, publishedAt, and relatedCities (array of city slugs)

**Given** the article page metadata
**When** search engines crawl the page
**Then** the page has a unique `<title>`: "[Article Title] | AtticCleaning.com"
**And** meta description uses the article excerpt

### Story 5.2: Article Internal Linking & Data Enrichment

As a **homeowner**,
I want articles that link to related content and show real local data,
So that I can explore topics in depth and see how the information applies to my area.

**Acceptance Criteria:**

**Given** an article page
**When** the page renders
**Then** related articles (matching the same topicTag) display as ArticleCard components at the bottom of the article (FR21)
**And** 2-3 related article cards display with title, excerpt, and topic tag
**And** city names mentioned in the article content link to their city landing pages (FR21) — e.g., "Phoenix" links to `/phoenix-az/`
**And** articles are enriched at build time with real directory data via Prisma queries: local company counts, average ratings, and metro-specific information (FR22)
**And** enriched data renders naturally within the article content (e.g., "There are 47 attic cleaning companies in Phoenix with an average rating of 4.3 stars")

**Given** an article page
**When** the homeowner wants to find a contractor
**Then** contextual in-article CTAs appear as inline text links: "Find [service type] pros near you →" (UX-16)
**And** CTAs are styled as blue text links, not buttons or banners
**And** maximum 1 CTA per article section
**And** CTAs link to the search page with a relevant query pre-filled
**And** CTAs appear after substantive content paragraphs, never as the first thing visible

### Story 5.3: Article Content Management Workflow

As an **admin**,
I want to add and manage educational articles by creating MDX files,
So that I can grow the content library to drive organic traffic and authority.

**Acceptance Criteria:**

**Given** the admin wants to publish a new article
**When** the admin creates a new `.mdx` file in `src/content/articles/`
**Then** the file follows the established frontmatter schema (title, slug, excerpt, topicTag, publishedAt, relatedCities)
**And** the article is picked up by `generateStaticParams` on the next build
**And** the article appears in homepage educational content highlights (ArticleCard)
**And** the article appears in related article sections of articles with matching topicTags
**And** the XML sitemap (Epic 6) will include the new article URL on next build

**Given** the admin wants to manage articles
**When** reviewing the content directory
**Then** all articles are git-versioned in `src/content/articles/`
**And** articles can be edited, updated, or removed by modifying the MDX files
**And** a full site rebuild (`npm run build`) regenerates all article pages with current data (FR31)

---

## Epic 6: SEO Infrastructure & Search Analytics

Every listing page has LocalBusiness JSON-LD, all pages have canonical URLs and OG/Twitter metadata, an XML sitemap covers all public pages, robots.txt controls crawl access, and low-result searches are logged for expansion prioritization.

### Story 6.1: SEO Metadata & Schema Markup

As the **site owner**,
I want every page to have proper SEO metadata and structured data markup,
So that search engines can understand, index, and display rich results for all directory pages.

**Acceptance Criteria:**

**Given** `src/lib/seo.ts` with metadata generation helpers
**When** any page renders
**Then** every page has a self-referencing canonical URL via `<link rel="canonical">` (FR16)
**And** every page has Open Graph tags: og:title, og:description, og:url, og:type, og:site_name (FR16)
**And** every page has Twitter Card tags: twitter:card, twitter:title, twitter:description (FR16)
**And** metadata is generated via Next.js `generateMetadata` function on each page route

**Given** a listing detail page
**When** search engines crawl the page
**Then** LocalBusiness JSON-LD schema markup is embedded in a `<script type="application/ld+json">` tag (FR14)
**And** the JSON-LD includes: @type, name, address (streetAddress, addressLocality, addressRegion), telephone, url, aggregateRating (ratingValue, reviewCount), geo (latitude, longitude)
**And** the JSON-LD validates against Google's Rich Results Test

**Given** any page on the site
**When** the page renders
**Then** the page uses semantic HTML: proper heading hierarchy (single h1), landmark regions, structured content (NFR-A10)

### Story 6.2: XML Sitemap & Crawl Control

As the **site owner**,
I want an auto-generated XML sitemap and robots.txt to control search engine crawling,
So that all public pages are discoverable and API/admin routes are excluded from indexing.

**Acceptance Criteria:**

**Given** the sitemap route at `src/app/sitemap.ts`
**When** the sitemap is generated at build time
**Then** the XML sitemap includes all listing detail page URLs (FR15)
**And** the sitemap includes all city landing page URLs (FR15)
**And** the sitemap includes all article page URLs (FR15)
**And** the sitemap includes the homepage URL
**And** each URL entry includes `lastmod`, `changefreq`, and `priority` attributes
**And** the sitemap is accessible at `/sitemap.xml`
**And** the sitemap can be submitted to Google Search Console (NFR-I3)

**Given** the robots.txt at `public/robots.txt`
**When** search engine crawlers request it
**Then** robots.txt allows all public pages (/, /[citySlug]/, /articles/)
**And** robots.txt blocks `/api/` routes (NFR-S6)
**And** robots.txt references the sitemap URL
**And** no admin endpoints are exposed to crawlers (NFR-S5)

### Story 6.3: Search Analytics Logging

As the **site owner**,
I want low-result search queries logged to the database,
So that I can prioritize geographic expansion based on real user demand.

**Acceptance Criteria:**

**Given** a search query processed by the search API route (from Story 2.2)
**When** the query returns fewer than 3 results
**Then** the system inserts a record into the SearchLog table (FR30)
**And** the log captures: query text, result count, radius used (in miles), resolved latitude/longitude, and timestamp
**And** the logging is asynchronous — it does not delay the search response
**And** searches returning 3 or more results are not logged (to minimize storage)
**And** the admin can query the SearchLog table via Prisma Studio or CLI to identify expansion priorities

---

**Epic 6 Summary:** 3 stories covering all 4 FRs (FR14-FR16, FR30). Story 6.1 adds metadata and schema markup across all pages, 6.2 handles sitemap and crawl control, 6.3 implements search logging. Each is independently completable.

Now **Epic 7: Launch Readiness & Production Quality**.

---

## Epic 7: Launch Readiness & Production Quality

**Goal:** Site meets production quality standards — accessibility, performance, security, CDN, CI/CD, and reliability.

**Additional:** INFRA-6 through INFRA-9, NFR-P1-P8, NFR-S1-S7, NFR-A1-A10, NFR-R1-R5, NFR-I4

---

### Story 7.1: Security Headers & Application Hardening

As a **homeowner**,
I want the site to be secure and trustworthy,
So that my browsing is protected and the site operates safely.

**Acceptance Criteria:**

**Given** the Next.js configuration in `next.config.ts`
**When** any page is served
**Then** security headers are present: Content-Security-Policy, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy (strict-origin-when-cross-origin) (INFRA-8, NFR-S2)
**And** all pages are served over HTTPS with TLS 1.2+ (NFR-S1)
**And** no cookies are set beyond analytics in MVP (NFR-S7)
**And** no user-submitted data is stored — all data is admin-imported (NFR-S4)
**And** no admin interface is exposed remotely — CLI-only access (NFR-S5)
**And** robots.txt blocks API routes and admin endpoints (confirmed from Story 6.2)
**And** search inputs are sanitized via Prisma parameterized queries (confirmed from Story 2.2)

### Story 7.2: Cloudflare CDN & Domain Setup

As a **homeowner**,
I want the site to load instantly from a nearby edge server,
So that I get a fast, reliable experience regardless of my location.

**Acceptance Criteria:**

**Given** Cloudflare configured as DNS provider with proxy enabled (orange cloud)
**When** a user requests any page
**Then** static assets (CSS, JS, fonts, images) are cached at Cloudflare edge with 30-day TTL (INFRA-6, NFR-I4)
**And** HTML pages are cached and revalidate on deploy
**And** cache invalidation completes within 5 minutes of a new deploy (NFR-I4)
**And** Cloudflare provides SSL termination (HTTPS) for all traffic (NFR-S1)
**And** Cloudflare provides DDoS protection at the free tier level
**And** rate limiting rules are configured on the `/api/search` endpoint (INFRA-9)
**And** TTFB < 200ms for CDN edge-served static pages (NFR-P5)
**And** CDN failover is < 30s and transparent to users (NFR-R4)
**And** static pages remain accessible even when the search API or origin is down (NFR-R5)

### Story 7.3: CI/CD Pipeline & Automated Quality Gates

As a **developer**,
I want an automated CI/CD pipeline that validates code quality, accessibility, and performance on every push,
So that regressions are caught before reaching production.

**Acceptance Criteria:**

**Given** a GitHub Actions workflow at `.github/workflows/ci.yml`
**When** code is pushed to any branch
**Then** the pipeline runs: ESLint (`npm run lint`), TypeScript type-check (`npx tsc --noEmit`), axe-core accessibility audit, and Lighthouse CI
**And** axe-core returns 0 WCAG 2.1 AA violations (NFR-A1)
**And** Lighthouse accessibility score is ≥ 95
**And** Lighthouse performance score validates LCP, CLS, and page weight targets
**And** the build fails if any quality gate is not met

**Given** a push to the `main` branch
**When** CI passes
**Then** Digital Ocean App Platform auto-deploys the new build
**And** the build command runs: `npx prisma generate && next build`
**And** static site build completes in < 10 minutes (NFR-P7)
**And** deploy rollback is possible in < 5 minutes via DO App Platform (NFR-R2)
**And** uptime is maintained at 99.5% monthly (NFR-R1)

### Story 7.4: Accessibility Compliance & Performance Validation

As a **homeowner**,
I want the site to be fully accessible and performant,
So that I can use it regardless of ability, device, or connection speed.

**Acceptance Criteria:**

**Given** all public pages on the site
**When** tested for accessibility compliance
**Then** all pages pass WCAG 2.1 AA (axe-core 0 violations) (NFR-A1)
**And** color contrast meets minimum 4.5:1 for normal text, 3:1 for large text (NFR-A2)
**And** all interactive elements are keyboard navigable with visible focus indicators (NFR-A3)
**And** screen readers (VoiceOver/NVDA) can navigate the full search-to-contact flow (NFR-A4)
**And** all touch targets are minimum 44x44px on mobile (NFR-A5)
**And** skip-to-content link is present and functional on all pages (NFR-A6)
**And** all images have descriptive alt text (NFR-A7)
**And** all form inputs have associated labels (NFR-A8)
**And** no content is conveyed by color alone (NFR-A9)

**Given** all public pages on the site
**When** tested for performance
**Then** LCP < 1.5s on mobile 4G for all page types (NFR-P1)
**And** CLS < 0.1 on all page types including font swap (NFR-P2)
**And** INP < 200ms for search, filter, and sort interactions (NFR-P3)
**And** total page weight < 500KB initial load, compressed, including fonts (NFR-P6)
**And** font loading produces zero CLS (NFR-P8)
**And** the `error.tsx` boundary file provides a simple "Something went wrong" page with a search bar

---

**Epic 7 Summary:** 4 stories covering all NFR categories (performance, security, accessibility, reliability, integration). Story 7.1 hardens the app, 7.2 sets up CDN, 7.3 builds CI/CD, 7.4 validates compliance. Each is independently completable.

---

**All 7 Epics Complete — 22 Stories Total:**

| Epic | Title | Stories | FRs |
|---|---|---|---|
| 1 | Project Foundation & Data Pipeline | 5 | FR24-29, FR32 |
| 2 | Search & Discovery Experience | 6 | FR1-7, FR33 |
| 3 | Listing Profiles & Contact Conversion | 1 | FR8-11 |
| 4 | City Landing Pages & Internal Linking | 1 | FR12-13, FR17-19 |
| 5 | Educational Content & Article System | 3 | FR20-23, FR31 |
| 6 | SEO Infrastructure & Search Analytics | 3 | FR14-16, FR30 |
| 7 | Launch Readiness & Production Quality | 4 | NFR-focused |

**All 33 FRs covered. All NFR categories addressed.**

**Select an Option:** [A] Advanced Elicitation [P] Party Mode [C] Continue
