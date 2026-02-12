---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
status: 'complete'
completedAt: '2026-02-11'
lastStep: 8
inputDocuments:
  - prd.md
  - product-brief-atticcleaning-website-2026-02-10.md
  - ux-design-specification.md
workflowType: 'architecture'
project_name: 'atticcleaning-website'
user_name: 'Jon'
date: '2026-02-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
33 FRs across 8 capability areas. The requirements describe a read-heavy, search-driven directory with static page generation. The core user-facing capabilities are search/discovery (7 FRs), listing display (4 FRs), and programmatic SEO infrastructure (8 FRs) — together these 19 FRs form the primary architectural surface. Data pipeline (6 FRs) and content management (2 FRs) are admin-only CLI operations. Search analytics (1 FR) is a lightweight backend logging concern.

Architecturally, the FRs reveal a system with two distinct runtime modes:
1. **Build time (dominant):** Static page generation for listings, city pages, and articles. SEO metadata, schema markup, sitemaps, internal links — all generated at build time. This is where most complexity lives.
2. **Request time (minimal):** Search queries hitting Postgres with radius expansion logic, filter/sort on pre-rendered result sets (client-side JS), and Google Maps embed (lazy-loaded iframe). Very thin runtime layer.

**Non-Functional Requirements:**
6 NFR sections drive architectural decisions:
- **Performance** (8 requirements): LCP < 1.5s, CLS < 0.1, INP < 200ms, search < 500ms, TTFB < 200ms, < 500KB page weight, < 10min build, zero-CLS fonts. These are aggressive targets that constrain the architecture toward static generation + CDN edge delivery.
- **Security** (7 requirements): Standard web security (HTTPS, headers, input sanitization). Simplified by having no user accounts, no user-submitted data, and CLI-only admin access. Minimal attack surface.
- **Scalability** (5 dimensions): 15-20K listings across 25 metros at launch. Build time is the primary scaling constraint — ISR is the documented escape hatch. CDN handles traffic scaling by default.
- **Accessibility** (10 requirements): WCAG 2.1 AA. Automated testing (axe-core, Lighthouse CI) in CI pipeline with zero-violation threshold. Manual screen reader testing pre-release.
- **Integration** (4 systems): Outscraper (batch import), Google Maps (embed), Google Search Console (sitemap), Cloudflare CDN (edge delivery). All are standard, well-documented integrations.
- **Reliability** (5 requirements): 99.5% uptime, < 5min rollback, CDN failover. Simplified by static architecture — CDN serves cached pages even if origin is down.

**Scale & Complexity:**

- Primary domain: Web — statically generated directory with search API
- Complexity level: Low-medium
- Estimated architectural components: ~8 (Next.js app, Postgres database, Prisma ORM layer, search API route, data import CLI, static generation pipeline, CDN layer, font loading system)

### Technical Constraints & Dependencies

**Hard constraints from PRD and product brief:**
- Next.js App Router (framework locked)
- shadcn/ui + Tailwind CSS v4 (UI framework locked)
- Prisma ORM (data access locked)
- PostgreSQL on Digital Ocean Managed (database locked)
- Digital Ocean App Platform (hosting locked)
- Cloudflare CDN free tier (CDN locked)
- Solo developer (resource constraint)

**Performance constraints:**
- Total page weight < 500KB including ~140KB font budget (3 fonts, 7 weight files)
- LCP < 1.5s on mobile 4G — requires preloaded critical fonts, CDN edge delivery, minimal JS
- Build time < 10 minutes — constrains static generation strategy at scale
- Zero CLS from font loading — requires `next/font` with preload strategy

**Architectural constraints:**
- No SPA behavior — full page loads for SEO crawlability
- Minimal client-side JS — only search, filter, sort interactions
- No user accounts in MVP — no auth system needed
- No real-time features — no WebSockets, no SSE, no polling
- No headless CMS — content is AI-generated, stored as MDX or Postgres rows
- CLI-only admin — no admin dashboard, no remote admin interface

### Cross-Cutting Concerns Identified

**1. SEO Optimization (affects every page type)**
- Static generation via `generateStaticParams` for all public pages
- LocalBusiness JSON-LD schema markup on listing pages
- Canonical URLs, Open Graph, Twitter Cards on all pages
- XML sitemap auto-generation covering all page types
- Internal linking strategy (city ↔ listing ↔ article cross-links)
- Semantic HTML with proper heading hierarchy
- robots.txt blocking admin/API routes

**2. Performance Budget (affects frontend architecture)**
- Three-font loading strategy with preload/swap decisions
- Image optimization via Next.js Image component
- CDN caching strategy (static assets 30-day TTL, HTML revalidates on deploy)
- Minimal JS bundle — only interactive components are client components
- Page weight budget allocation across fonts, HTML, CSS, JS

**3. Accessibility (affects all components)**
- WCAG 2.1 AA compliance as build-time gate (axe-core 0 violations)
- Keyboard navigation with visible focus indicators on all interactive elements
- Screen reader compatibility with ARIA patterns on custom components
- Touch targets ≥ 44x44px on all interactive elements
- Skip-to-content link on every page

**4. Data Quality Pipeline (affects search and display)**
- Outscraper import with field validation and deduplication
- Service tag classification accuracy (keyword matching on business descriptions)
- Geocoding quality for radius expansion logic
- Review snippet selection and truncation
- Missing data handling (no phone, no reviews, no snippet — cards adapt)

## Starter Template Evaluation

### Primary Technology Domain

Web application — statically generated directory with search API, based on Next.js App Router. Identified from project requirements: SEO-first architecture, minimal client-side interactivity, static page generation at build time, CDN edge delivery.

### Starter Options Considered

**1. create-next-app (Official Next.js Starter)**
The standard Next.js project scaffolding tool. Provides App Router setup, TypeScript configuration, Tailwind CSS integration, and ESLint. Minimal and unopinionated — sets up the framework without imposing architectural patterns.

**2. T3 Stack (create-t3-app)**
Full-stack starter with Next.js, TypeScript, Tailwind, tRPC, Prisma, and NextAuth. Opinionated about data fetching (tRPC) and authentication (NextAuth). Overkill for this project — we don't need tRPC (we have 1 API route for search), and we don't need NextAuth (no user accounts in MVP).

**3. create-next-app + shadcn init (Combined)**
The official Next.js starter extended with shadcn/ui's initialization. Adds the component infrastructure (Radix UI primitives, CSS variable theming, component aliases) on top of the clean Next.js base. This is what was selected.

### Selected Starter: create-next-app + shadcn init

**Rationale for Selection:**
- Next.js App Router is the locked framework choice — create-next-app is the canonical starter
- shadcn/ui is the locked UI system — shadcn init is required to set up component infrastructure
- T3 Stack rejected: adds tRPC, NextAuth, and Prisma in an opinionated configuration that conflicts with our minimal-JS, static-first architecture
- The combined starter provides the exact foundation needed without imposing patterns we'd need to remove

**Initialization Commands (already executed):**

```bash
npx create-next-app@latest atticcleaning-nextjs --typescript --tailwind --eslint --app --src-dir --no-turbopack
npx shadcn@latest init -d  # new-york style, RSC mode, neutral base color
```

### Architectural Decisions Provided by Starter

**Language & Runtime:**
- TypeScript with strict mode enabled
- ES2017 target, ESNext module system
- Bundler module resolution (Next.js optimized)
- Path aliases: `@/*` → `./src/*`

**Styling Solution:**
- Tailwind CSS v4 via PostCSS
- CSS custom properties for theming (shadcn pattern)
- tw-animate-css for animation utilities (included by shadcn)
- Utility-first approach with CSS variable design tokens

**Build Tooling:**
- Next.js built-in bundler (Turbopack for dev, Webpack for production)
- PostCSS pipeline for Tailwind processing
- ESLint 9 with next/core-web-vitals config

**Component Infrastructure:**
- shadcn/ui new-york style with RSC mode enabled
- Unified radix-ui package (v1.4.3) — not individual @radix-ui/* packages
- Component aliases: `@/components/ui` for shadcn components
- Utility functions: cn() helper via clsx + tailwind-merge
- lucide-react for icons

**Code Organization:**
- `src/app/` — App Router pages and layouts
- `src/lib/` — Utility functions
- `src/components/` — Component directory (shadcn convention)
- `src/components/ui/` — shadcn/ui primitives
- `public/` — Static assets

**Testing Framework:**
- NOT included — needs separate setup. Required: axe-core (accessibility), Playwright (e2e), Lighthouse CI (performance).

**What the Starter Does NOT Provide (needs setup in implementation):**

1. **Prisma 7 ORM** — Database access layer, schema, migrations
2. **Custom font system** — Replace default Geist fonts with Plus Jakarta Sans, Source Serif 4, Lora via next/font/google
3. **Custom color tokens** — Replace default shadcn neutral palette with UX spec colors (#FAFAF8, #1A1A1A, #2563EB, #D4A017, etc.)
4. **Testing infrastructure** — axe-core, Playwright, Lighthouse CI in CI/CD pipeline
5. **SEO infrastructure** — Sitemap generation, schema markup, robots.txt, canonical URLs
6. **CLI data pipeline scripts** — Outscraper import, deduplication, service tag classification
7. **Search API route** — Postgres full-text search with radius expansion

**Note:** Project initialization using this starter has already been completed as the first implementation step (commit fdef112).

### Current Version Verification (February 2026)

| Package | Installed | Latest Stable | Status |
|---|---|---|---|
| Next.js | 16.1.6 | 16.1.6 | Current |
| React | 19.2.3 | 19.x | Current |
| Tailwind CSS | v4 | v4 | Current |
| shadcn CLI | 3.8.4 | 3.x | Current |
| Radix UI (unified) | 1.4.3 | 1.x | Current |
| TypeScript | ^5 | 5.x | Current |
| Prisma | Not installed | 7.2.0 | Needs setup |

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
1. Content storage format (MDX files vs Postgres) — affects build pipeline and content workflow
2. Search results page rendering strategy — affects routing and performance architecture
3. Geocoding approach for radius expansion — affects search API design and external dependencies

**Important Decisions (Shape Architecture):**
4. Cloudflare integration approach — affects deployment and caching
5. Search logging implementation — affects database schema
6. CI/CD pipeline design — affects development workflow

**Deferred Decisions (Post-MVP):**
- ISR migration (only if build times exceed 10 minutes)
- Elasticsearch (only if Postgres full-text search becomes insufficient at 50K+ listings)
- CDN cache invalidation automation (manual is fine for MVP deploy frequency)

### Data Architecture

**Content Storage: MDX Files**
- Decision: Educational articles stored as `.mdx` files in the repository
- Version: @next/mdx or next-mdx-remote (latest stable)
- Rationale: 50 articles at launch is manageable in-repo. Git-versioned, easy to review, simple for AI generation. Build-time enrichment with Prisma data (local company counts, ratings) via static generation. Migration to Postgres straightforward if content velocity demands it post-MVP.
- Affects: Build pipeline, content management workflow, article page generation

**Database Schema: Prisma 7 + PostgreSQL**
- Decision: Prisma 7 ORM with PostgreSQL on Digital Ocean Managed
- Version: Prisma 7.2.0
- Rationale: Locked by PRD. Prisma 7's TypeScript-native runtime (no Rust engine) reduces bundle size. Generated types provide type-safe data access for listings, cities, reviews, service tags, search logs.
- Key tables: `listings`, `cities`, `reviews`, `service_tags`, `search_logs`, `zip_codes` (geocoding lookup)

**Geocoding: Build-Time Lookup Table**
- Decision: Pre-compute lat/lng for all covered zip codes and cities during data import. Store in `zip_codes` table. Search route does table lookup, not runtime API call.
- Rationale: Zero runtime external dependency, faster search response (eliminates geocoding latency), no API costs, works offline. Coverage limited to imported zip codes — acceptable for 25-metro launch where we control the coverage map.
- Affects: Data import pipeline (must include geocoding step), search API route design

**Full-Text Search: Postgres tsvector + pg_trgm**
- Decision: Postgres-native full-text search with trigram fuzzy matching
- Rationale: Locked by PRD. Single search API route (`/api/search`). Parameterized queries via Prisma raw SQL for search-specific queries. Client-side filtering/sorting on result sets for service type and sort order.
- Affects: Database schema (tsvector columns, GIN indexes), search API route, Prisma raw query usage

### Authentication & Security

**No Authentication (MVP)**
- Decision: No user accounts, no auth system. CLI-only admin access.
- Rationale: PRD explicitly defers user accounts to Phase 2. Eliminates entire authentication architecture. Admin operations via CLI scripts with direct database access.
- Affects: Simplifies entire architecture — no session management, no middleware, no protected routes.

**Security Posture:**
- Input sanitization: Prisma parameterized queries (SQL injection prevention by default) + server-side XSS sanitization on search input
- Security headers: Configured via `next.config.ts` — CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- Rate limiting: Cloudflare rate limiting rules on `/api/search` endpoint (free tier includes basic rate limiting)
- Transport: HTTPS enforced via Cloudflare SSL termination
- Admin access: CLI scripts only, no exposed admin endpoints

### API & Communication Patterns

**Single API Route: Search**
- Decision: One API route handler at `GET /api/search`
- Parameters: `q` (location query), `service` (filter), `sort` (rating|reviews|distance)
- Response: `{ results: Listing[], meta: { query, expanded, radius, totalCount } }`
- Error handling: Never returns errors to users. Empty results trigger radius expansion. Always returns a valid response with metadata.
- Rationale: The only dynamic endpoint in the application. All other pages are statically generated.

**Search Logging:**
- Decision: Insert to `search_logs` table within the search route handler
- Fields: query, location, result_count, radius_used, timestamp
- Rationale: FR30 requires logging low-result queries for expansion prioritization. Simple database insert, no external service.

### Frontend Architecture

**Server Components Default**
- Decision: All components are React Server Components unless they require client-side interactivity
- Client components: `SearchBar`, `ServiceTagChip` (filter variant only), sort control
- Rationale: Minimal JS bundle. Only 3 interactive elements in the entire application. RSC renders everything else server-side with zero client JS.

**No State Management Library**
- Decision: No Redux, Zustand, Context, or other state management
- Rationale: Filter state lives in URL search params. Sort state is local component state. No global state needed. The application is too simple for state management overhead.

**Rendering Strategy: Static + Dynamic Split**
- Decision: City landing pages and listing detail pages are statically generated via `generateStaticParams`. Search results page (`/search`) is server-rendered dynamically per request.
- Rationale: City pages serve high-intent SEO traffic from CDN (LCP < 1.5s). Custom searches are less frequent and can tolerate origin round-trip (< 500ms target). This split provides the optimal performance/freshness balance.
- Static pages: Homepage, city landing pages, listing detail pages, article pages
- Dynamic pages: Search results page (`/search?q=...`)

**URL Structure:**
- `/` — Homepage (static)
- `/search?q=phoenix&service=rodent_cleanup&sort=rating` — Search results (dynamic)
- `/[city-state]/` — City landing page, e.g., `/phoenix-az/` (static)
- `/[city-state]/[company-slug]` — Listing detail, e.g., `/phoenix-az/abc-attic-cleaning` (static)
- `/articles/[slug]` — Educational article (static)
- `/api/search` — Search API (dynamic)

### Infrastructure & Deployment

**Hosting: Digital Ocean App Platform**
- Decision: DO App Platform with auto-deploy from GitHub main branch
- Build command: `npx prisma generate && next build`
- Rationale: Locked by PRD. Managed platform, auto-scaling, built-in SSL, simple deploy pipeline.

**CDN: Cloudflare DNS + Proxy**
- Decision: Cloudflare as DNS provider with proxy enabled (orange cloud). Standard CDN setup, not Workers.
- Caching: Static assets (CSS, JS, fonts, images) cached 30 days. HTML pages use standard Cloudflare caching with purge on deploy.
- Rationale: Free tier provides CDN, DDoS protection, SSL termination, basic rate limiting. No Workers needed for this architecture.

**CI/CD: GitHub Actions + DO Auto-Deploy**
- Decision: GitHub Actions for testing (lint, type-check, axe-core, Lighthouse CI). DO App Platform auto-deploys on push to main.
- Pipeline: Push → GitHub Actions (lint + type-check + accessibility tests) → If pass → DO auto-deploy → Prisma generate → Next.js build → Deploy → Cloudflare cache purge
- Rationale: Simple pipeline for solo developer. Automated quality gates (accessibility, performance) prevent regressions.

**Environment Configuration:**
- Local: `.env` file (DATABASE_URL, GOOGLE_MAPS_API_KEY)
- Production: DO App Platform environment variables
- No secrets in code, no `.env` committed to git

### Decision Impact Analysis

**Implementation Sequence:**
1. Prisma 7 setup + database schema + migrations
2. Custom font system (replace Geist with 3-font system)
3. Custom color tokens (replace shadcn defaults with UX spec palette)
4. Data import CLI script (Outscraper → Postgres with geocoding)
5. Core components (SearchBar, ListingCard, ServiceTagChip, StarRating)
6. Static page generation (city pages, listing pages)
7. Search API route + search results page
8. Article system (MDX + static generation)
9. SEO infrastructure (sitemap, schema markup, robots.txt, metadata)
10. Testing infrastructure (axe-core, Lighthouse CI, GitHub Actions)
11. Cloudflare setup + deploy pipeline

**Cross-Component Dependencies:**
- Prisma schema must be complete before any page generation or search API work
- Font system and color tokens must be set before component development
- Data import must run before static generation can produce real pages
- Search API depends on geocoding lookup table (populated by data import)
- Lighthouse CI depends on deployed pages with real content

## Implementation Patterns & Consistency Rules

### Critical Conflict Points Identified

12 areas where AI agents could make different choices, grouped into 5 categories. Each pattern below specifies the ONE correct approach — agents must not deviate.

### Naming Patterns

**Database Naming (Prisma Schema):**
- Tables: PascalCase singular (`Listing`, `City`, `Review`, `ServiceTag`, `SearchLog`, `ZipCode`)
- Columns: camelCase (`googlePlaceId`, `reviewCount`, `starRating`, `createdAt`)
- Relations: camelCase matching the related model (`listing`, `reviews`, `city`, `serviceTags`)
- Indexes: auto-named by Prisma (no manual index names)
- Enums: SCREAMING_SNAKE_CASE values (`RODENT_CLEANUP`, `INSULATION_REMOVAL`, `DECONTAMINATION`, `MOLD_REMEDIATION`, `GENERAL_CLEANING`, `ATTIC_RESTORATION`)

```prisma
model Listing {
  id            String       @id @default(cuid())
  googlePlaceId String       @unique
  name          String
  starRating    Float
  reviewCount   Int
  phone         String?
  website       String?
  address       String
  latitude      Float
  longitude     Float
  city          City         @relation(fields: [cityId], references: [id])
  cityId        String
  reviews       Review[]
  serviceTags   ServiceTag[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}
```

**File & Directory Naming:**
- Directories: kebab-case (`src/components/`)
- React components: kebab-case files (`listing-card.tsx`, `search-bar.tsx`)
- Non-component files: kebab-case (`search-utils.ts`, `import-listings.ts`)
- Route directories: kebab-case matching URL segments (`src/app/articles/[slug]/`)
- Test files: co-located with source, `.test.ts` suffix (`search.test.ts`)

**Component Naming:**
- Components: PascalCase (`ListingCard`, `ServiceTagChip`, `StarRating`)
- Props interfaces: `{ComponentName}Props` (`ListingCardProps`, `SearchBarProps`)
- Component files export the component as default export
- One component per file (sub-components like StarRating can be in their own file)

**API Naming:**
- Route handler files: `route.ts` in the App Router convention (`src/app/api/search/route.ts`)
- Query parameters: camelCase (`?q=phoenix&serviceType=rodent_cleanup&sortBy=rating`)
- Response fields: camelCase (matching TypeScript conventions)

### Structure Patterns

**Project Organization (flat components, feature-adjacent pages):**

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, metadata)
│   ├── page.tsx                  # Homepage
│   ├── search/
│   │   └── page.tsx              # Search results (dynamic)
│   ├── [citySlug]/
│   │   ├── page.tsx              # City landing page (static)
│   │   └── [companySlug]/
│   │       └── page.tsx          # Listing detail (static)
│   ├── articles/
│   │   └── [slug]/
│   │       └── page.tsx          # Article page (static)
│   └── api/
│       └── search/
│           └── route.ts          # Search API endpoint
├── components/
│   ├── ui/                       # shadcn/ui primitives (auto-generated)
│   ├── listing-card.tsx          # ListingCard component
│   ├── service-tag-chip.tsx      # ServiceTagChip component
│   ├── star-rating.tsx           # StarRating component
│   ├── search-bar.tsx            # SearchBar component
│   ├── city-card.tsx             # CityCard component
│   ├── article-card.tsx          # ArticleCard component
│   ├── header.tsx                # Navigation header
│   └── footer.tsx                # Footer
├── lib/
│   ├── utils.ts                  # cn() helper (shadcn default)
│   ├── prisma.ts                 # Prisma client singleton
│   ├── search.ts                 # Search query logic
│   ├── seo.ts                    # Metadata generation helpers
│   └── constants.ts              # Service types enum, color maps
├── content/
│   └── articles/                 # MDX article files
│       ├── signs-attic-needs-cleaning.mdx
│       └── ...
├── scripts/
│   ├── import-listings.ts        # Outscraper CSV import
│   ├── classify-service-tags.ts  # Service tag classification
│   └── seed-zip-codes.ts         # Geocoding lookup table seed
└── types/
    └── index.ts                  # Shared TypeScript types
```

**Rules:**
- Components in `src/components/` — flat structure, no nesting by feature
- Shared logic in `src/lib/` — pure functions, database queries, helpers
- CLI scripts in `src/scripts/` — standalone, runnable with `npx tsx src/scripts/import-listings.ts`
- Types in `src/types/` — shared TypeScript interfaces and type definitions
- No `src/utils/`, `src/helpers/`, or `src/services/` — keep it to `lib/` for everything
- Content in `src/content/articles/` — MDX files only

**Test Placement:**
- Co-located: `src/lib/search.test.ts` next to `src/lib/search.ts`
- E2E tests: `e2e/` directory at project root
- No `__tests__/` directories — co-location only

### Format Patterns

**API Response Format (Search Route):**

```typescript
// Success response — always returned, never errors
interface SearchResponse {
  results: ListingResult[]
  meta: {
    query: string
    totalCount: number
    expanded: boolean
    radiusMiles: number
    location: {
      city: string
      state: string
      latitude: number
      longitude: number
    } | null
  }
}

interface ListingResult {
  id: string
  name: string
  starRating: number
  reviewCount: number
  phone: string | null
  website: string | null
  address: string
  distanceMiles: number | null
  serviceTags: ServiceType[]
  reviewSnippet: string | null
  citySlug: string
  companySlug: string
}
```

**Rules:**
- API response is always 200 OK with the above structure. No error responses to users.
- Empty results: `{ results: [], meta: { totalCount: 0, expanded: true, radiusMiles: 50 } }`
- No wrapper objects (`{ data: ..., error: ... }` pattern NOT used)
- Dates in JSON: ISO 8601 strings (`"2026-02-11T00:00:00.000Z"`)
- Null for missing optional values, never undefined in JSON

**TypeScript Conventions:**
- Strict mode (already configured)
- Prefer `interface` over `type` for object shapes
- Use `enum` for fixed sets (service types)
- No `any` — use `unknown` if truly unknown
- Props interfaces always named `{ComponentName}Props`

### Communication Patterns

**No Event System**
- No pub/sub, no event bus, no custom events. Data flows server → component via props.

**State Patterns:**
- URL search params as state for search/filter/sort (sharable, bookmarkable)
- `useSearchParams()` for reading, router navigation for writing
- No global state. No context providers (except layout-level font providers from `next/font`)
- Filter chip active/inactive is derived from URL params, not component state

### Process Patterns

**Error Handling:**
- Search API: Never throws. Catches all errors, returns empty results with metadata. Logs errors server-side with `console.error`.
- Page components: Next.js `error.tsx` boundary files at route segment level. Shows a simple "Something went wrong" with a search bar to restart.
- Data import scripts: Throw on fatal errors (missing file, database connection failure). Log warnings for skipped records. Always output summary report at end.
- No `try/catch` wrapping in components — let React error boundaries handle unexpected errors.

**No Loading States (by design):**
- Static pages: No loading state — HTML renders immediately from CDN
- Search results: Full page navigation, browser handles loading indicator
- Filter/sort: Client-side instant update, no loading state needed
- Only loading-adjacent pattern: Google Maps embed uses `loading="lazy"` attribute

**Data Fetching Pattern:**
- Page-level server components fetch data via Prisma
- Components receive data as props — never fetch internally
- No `use()`, no `useSWR`, no `React.cache` — direct Prisma queries in async server components
- Search results page: uses `searchParams` prop to read query, calls search function server-side

```typescript
// Page-level data fetching pattern
export default async function CityPage({ params }: { params: { citySlug: string } }) {
  const city = await prisma.city.findUnique({
    where: { slug: params.citySlug },
    include: { listings: { include: { serviceTags: true, reviews: true } } }
  })
  return <CityLandingLayout city={city} />
}
```

**Import Order Convention:**
1. React/Next.js imports
2. Third-party library imports
3. `@/components/` imports
4. `@/lib/` imports
5. `@/types/` imports
6. Relative imports
7. Type-only imports last

### Enforcement Guidelines

**All AI Agents MUST:**
- Follow Prisma schema naming exactly (PascalCase models, camelCase fields, SCREAMING_SNAKE enums)
- Place components in `src/components/` as flat files (not feature folders)
- Use the exact API response format defined above — no variations
- Never add state management libraries — URL params and props only
- Never add loading spinners or skeleton screens — static rendering eliminates the need
- Never create wrapper/service layers between Prisma and page components — direct queries in server components
- Use `cn()` from `@/lib/utils` for conditional className merging
- Co-locate tests with source files using `.test.ts` suffix

**Anti-Patterns (explicitly forbidden):**
- `src/services/` or `src/repositories/` abstraction layers
- `src/hooks/` custom hooks (no client-side state to hook into)
- `src/store/` or state management setup
- `src/api/` client-side API wrapper functions
- `loading.tsx` files (no loading states needed)
- `React.use()` or `useSWR()` for data fetching
- Barrel files (`index.ts` re-exporting from directories)
- CSS modules or styled-components (Tailwind only)

## Project Structure & Boundaries

### Complete Project Directory Structure

```
atticcleaning-website/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Lint, type-check, axe-core, Lighthouse CI
├── e2e/
│   ├── search-flow.spec.ts           # Maria's search-to-contact journey
│   ├── content-flow.spec.ts          # David's content-to-directory journey
│   ├── radius-expansion.spec.ts      # Lisa's thin-coverage journey
│   └── homepage.spec.ts              # Homepage browse-to-search journey
├── prisma/
│   ├── schema.prisma                 # Database schema (all models)
│   ├── migrations/                   # Auto-generated migration files
│   └── seed.ts                       # Development seed data
├── public/
│   ├── robots.txt                    # Crawl access control
│   └── favicon.ico                   # Site favicon
├── src/
│   ├── app/
│   │   ├── globals.css               # Tailwind imports + custom color tokens + font variables
│   │   ├── layout.tsx                # Root layout: fonts, metadata defaults, header, footer
│   │   ├── page.tsx                  # Homepage: hero search + city grid + article highlights
│   │   ├── error.tsx                 # Root error boundary
│   │   ├── not-found.tsx             # 404 page with search bar
│   │   ├── sitemap.ts                # Dynamic XML sitemap generation
│   │   ├── search/
│   │   │   └── page.tsx              # Search results page (dynamic, server-rendered)
│   │   ├── [citySlug]/
│   │   │   ├── page.tsx              # City landing page (static via generateStaticParams)
│   │   │   └── [companySlug]/
│   │   │       └── page.tsx          # Listing detail page (static via generateStaticParams)
│   │   ├── articles/
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # Article page (static, renders MDX)
│   │   └── api/
│   │       └── search/
│   │           └── route.ts          # GET /api/search — the only API endpoint
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives (Input, Select — auto-generated)
│   │   ├── listing-card.tsx          # ListingCard — core product element
│   │   ├── service-tag-chip.tsx      # ServiceTagChip — card variant + filter variant
│   │   ├── star-rating.tsx           # StarRating — compact + full variants
│   │   ├── search-bar.tsx            # SearchBar — hero + header variants ("use client")
│   │   ├── city-card.tsx             # CityCard — homepage featured cities
│   │   ├── article-card.tsx          # ArticleCard — homepage + related articles
│   │   ├── header.tsx                # Navigation header: logo + search bar
│   │   ├── footer.tsx                # Footer: city links, content links, legal
│   │   ├── filter-toolbar.tsx        # Filter chips + sort control ("use client")
│   │   └── radius-info.tsx           # "Showing results within X miles" info line
│   ├── lib/
│   │   ├── utils.ts                  # cn() helper (shadcn default)
│   │   ├── prisma.ts                 # Prisma client singleton
│   │   ├── search.ts                 # Search query logic (tsvector, radius expansion)
│   │   ├── seo.ts                    # generateMetadata helpers, JSON-LD generators
│   │   ├── constants.ts              # ServiceType enum, chip color map, sort options
│   │   └── mdx.ts                    # MDX file reading and parsing utilities
│   ├── content/
│   │   └── articles/                 # MDX article files (50 at launch)
│   │       ├── signs-attic-needs-cleaning.mdx
│   │       ├── attic-insulation-replacement-cost.mdx
│   │       ├── how-to-choose-attic-cleaning-company.mdx
│   │       └── ...
│   ├── scripts/
│   │   ├── import-listings.ts        # Outscraper CSV → Postgres (dedupe, validate, upsert)
│   │   ├── classify-service-tags.ts  # Keyword matching on business descriptions
│   │   ├── seed-zip-codes.ts         # Populate zip_codes table with lat/lng data
│   │   └── generate-slugs.ts         # Generate URL slugs for cities and companies
│   └── types/
│       └── index.ts                  # Shared types: ListingResult, SearchResponse, ServiceType, etc.
├── .env.example                      # Template for environment variables
├── .gitignore                        # Standard Next.js + .env exclusions
├── components.json                   # shadcn/ui configuration
├── eslint.config.mjs                 # ESLint 9 flat config
├── next-env.d.ts                     # Next.js TypeScript declarations
├── next.config.ts                    # Next.js config: security headers, MDX, image domains
├── package.json                      # Dependencies and scripts
├── postcss.config.mjs                # PostCSS + Tailwind
└── tsconfig.json                     # TypeScript strict config
```

### Architectural Boundaries

**API Boundary:**
- Single boundary: `src/app/api/search/route.ts`
- Accepts: GET request with query parameters
- Returns: `SearchResponse` JSON (always 200 OK)
- Consumes: `src/lib/search.ts` for query logic, `src/lib/prisma.ts` for database access
- No other API routes exist. All other pages are static HTML.

**Component Boundary:**
- Components in `src/components/` receive data via props only — never fetch data
- Page components in `src/app/` are the data-fetching boundary — they call Prisma directly
- Client components (`search-bar.tsx`, `filter-toolbar.tsx`) own their interaction state but derive display state from URL params
- Server components render static HTML — no client JS, no hydration

**Data Boundary:**
- `src/lib/prisma.ts` is the ONLY file that creates a Prisma client instance
- All database access flows through this singleton
- `src/lib/search.ts` contains all search-specific raw SQL queries
- `src/scripts/` contains all write operations (import, classify, seed) — pages and API only read
- No direct database access from components — always via page-level server components or `src/lib/` functions

**Build Boundary:**
- `src/content/articles/` is read at build time by `src/lib/mdx.ts`
- `generateStaticParams` in page files queries Prisma to enumerate all static pages
- `src/app/sitemap.ts` queries Prisma to generate the complete sitemap
- Build-time operations: static page generation, sitemap generation, MDX compilation
- Runtime operations: search API only

### Requirements to Structure Mapping

**FR Category: Search & Discovery (FR1-FR7)**

| FR | Description | Files |
|---|---|---|
| FR1 | Search by zip/city/state/company | `search-bar.tsx`, `api/search/route.ts`, `lib/search.ts` |
| FR2 | Listing cards with data | `listing-card.tsx`, `star-rating.tsx`, `service-tag-chip.tsx` |
| FR3 | Filter by service type | `filter-toolbar.tsx`, `service-tag-chip.tsx` (filter variant) |
| FR4 | Sort by rating/reviews/distance | `filter-toolbar.tsx` |
| FR5 | Radius expansion to 20mi | `lib/search.ts` |
| FR6 | Distance display on expansion | `listing-card.tsx` (distance prop), `radius-info.tsx` |
| FR7 | Articles on low-result searches | `app/search/page.tsx`, `article-card.tsx` |

**FR Category: Listing Profiles (FR8-FR11)**

| FR | Description | Files |
|---|---|---|
| FR8 | Detailed listing page | `app/[citySlug]/[companySlug]/page.tsx` |
| FR9 | Google reviews on listing | `app/[citySlug]/[companySlug]/page.tsx` |
| FR10 | Service tags on listing | `service-tag-chip.tsx` (card variant) |
| FR11 | Contact via phone/website | `listing-card.tsx` (tel: + href links) |

**FR Category: Programmatic SEO (FR12-FR19)**

| FR | Description | Files |
|---|---|---|
| FR12 | City landing pages | `app/[citySlug]/page.tsx` |
| FR13 | Aggregated city data | `app/[citySlug]/page.tsx` (server query) |
| FR14 | LocalBusiness JSON-LD | `lib/seo.ts` |
| FR15 | XML sitemaps | `app/sitemap.ts` |
| FR16 | Canonical URLs, OG, Twitter | `lib/seo.ts` |
| FR17-19 | Internal linking | Page components (city ↔ listing ↔ nearby) |

**FR Category: Educational Content (FR20-FR23)**

| FR | Description | Files |
|---|---|---|
| FR20 | Browse articles | `app/articles/[slug]/page.tsx`, `content/articles/*.mdx` |
| FR21 | Internal links in articles | MDX content with Next.js Link |
| FR22 | Articles enriched with data | `app/articles/[slug]/page.tsx` (Prisma at build) |
| FR23 | Content → directory nav | `header.tsx` (persistent search bar) |

**FR Category: Data Pipeline (FR24-FR29)**

| FR | Description | Files |
|---|---|---|
| FR24 | Import from Outscraper | `scripts/import-listings.ts` |
| FR25 | Deduplicate by Place ID | `scripts/import-listings.ts` |
| FR26 | Classify service tags | `scripts/classify-service-tags.ts` |
| FR27 | Validate required fields | `scripts/import-listings.ts` |
| FR28 | Import summary report | `scripts/import-listings.ts` (stdout) |
| FR29 | Trigger static rebuild | Push to main → DO auto-deploy |

**FR30 (search logging):** `app/api/search/route.ts`
**FR31-32 (content/metro mgmt):** `content/articles/*.mdx`, `scripts/import-listings.ts`
**FR33 (homepage content):** `app/page.tsx`, `city-card.tsx`, `article-card.tsx`

### Integration Points

**External Integrations:**

| Integration | Files | Data Flow |
|---|---|---|
| Outscraper | `scripts/import-listings.ts` | CSV file → parse → validate → Prisma upsert |
| Google Maps | `app/[citySlug]/[companySlug]/page.tsx` | Lazy-loaded iframe embed on listing detail |
| Google Search Console | `app/sitemap.ts` | Generated sitemap submitted post-deploy |
| Cloudflare CDN | `next.config.ts` (headers) | Proxy all traffic, cache static assets |

**Internal Data Flow:**

```
Import Pipeline:
  Outscraper CSV → import-listings.ts → Prisma → PostgreSQL
                   classify-service-tags.ts → Prisma → PostgreSQL
                   seed-zip-codes.ts → Prisma → PostgreSQL

Build Pipeline:
  PostgreSQL → Prisma → generateStaticParams → Static HTML pages
  MDX files → mdx.ts → Article pages
  PostgreSQL → Prisma → sitemap.ts → XML sitemap

Runtime (search only):
  User search → /api/search → search.ts → Prisma raw SQL → PostgreSQL → JSON response
  Search log → search route → Prisma → search_logs table
```

### Development Workflow Integration

**Development:**
```bash
npm run dev                          # Next.js dev server (Turbopack)
npx tsx src/scripts/import-listings.ts data/outscraper-export.csv  # Import data
npx prisma studio                    # Visual database browser
npx prisma migrate dev               # Run migrations in development
```

**Build & Deploy:**
```bash
npm run build                        # Prisma generate + Next.js static build
npm run start                        # Production server (local testing)
# Deploy: push to main → DO auto-deploy
```

**Testing:**
```bash
npm run lint                         # ESLint
npx tsc --noEmit                     # Type checking
# axe-core + Lighthouse CI run in GitHub Actions CI
```

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices are fully compatible:
- Next.js 16.1.6 + React 19.2.3 + TypeScript 5 — designed to work together
- Tailwind CSS v4 + PostCSS + shadcn/ui 3.x — standard integration path
- shadcn/ui + unified Radix UI 1.4.3 — shadcn's documented dependency
- Prisma 7.2.0 + PostgreSQL (DO Managed) — Prisma's primary target database
- DO App Platform + Cloudflare CDN — standard proxy architecture
- MDX content + next-mdx-remote + App Router — well-supported combination
- Static generation + CDN edge delivery — architecturally aligned, no conflicts

No contradictory decisions found. All versions are current as of February 2026.

**Pattern Consistency:**
- Naming conventions are internally consistent: PascalCase for Prisma models and React components, camelCase for fields and variables, kebab-case for files and directories, SCREAMING_SNAKE for enums
- Structure patterns align with Next.js App Router conventions
- Data flow is clean and unidirectional: Prisma → server component → props → client component
- Anti-patterns are explicitly documented to prevent drift

**Structure Alignment:**
- Directory structure directly supports all architectural decisions
- Four boundaries (API, Component, Data, Build) are clearly defined and non-overlapping
- Every requirement maps to specific files in the structure
- Integration points have explicit file mappings

### Requirements Coverage Validation ✅

**Functional Requirements Coverage (33/33):**

| FR Category | FRs | Coverage | Architectural Support |
|---|---|---|---|
| Search & Discovery | FR1-FR7 | 7/7 ✅ | SearchBar, search API route, search.ts, filter-toolbar, radius-info |
| Listing Profiles | FR8-FR11 | 4/4 ✅ | Listing detail page, ListingCard, ServiceTagChip, tel: links |
| Programmatic SEO | FR12-FR19 | 8/8 ✅ | City pages, seo.ts, sitemap.ts, internal linking in page components |
| Educational Content | FR20-FR23 | 4/4 ✅ | MDX articles, article pages, persistent search bar, data enrichment |
| Data Pipeline | FR24-FR29 | 6/6 ✅ | CLI scripts (import, classify, seed), Prisma schema |
| Search Analytics | FR30 | 1/1 ✅ | SearchLog model, insert in search route handler |
| Content Management | FR31-FR32 | 2/2 ✅ | MDX files (git-managed), import script for new metros |
| Homepage Content | FR33 | 1/1 ✅ | Homepage page component, CityCard, ArticleCard |

**Non-Functional Requirements Coverage (6/6 categories):**

| NFR Category | Key Requirements | Architectural Support |
|---|---|---|
| Performance | LCP < 1.5s, CLS < 0.1, < 500KB | Static generation + CDN, next/font preload, minimal JS |
| Security | HTTPS, headers, sanitization | Cloudflare SSL, next.config.ts headers, Prisma parameterized queries |
| Scalability | 15-20K listings, build < 10min | Static gen scales via CDN, ISR escape hatch documented |
| Accessibility | WCAG 2.1 AA | Radix primitives, semantic HTML patterns, axe-core in CI |
| Integration | 4 external systems | Each mapped to specific files with data flow defined |
| Reliability | 99.5% uptime, < 5min rollback | CDN serves cached pages, DO rollback, static pages independent of search API |

### Implementation Readiness Validation ✅

**Decision Completeness:**
- All critical decisions documented with specific versions ✅
- Implementation patterns cover naming, structure, format, communication, and process ✅
- Consistency rules are enforceable (explicit anti-patterns listed) ✅
- Code examples provided for data fetching pattern and Prisma schema ✅

**Structure Completeness:**
- Complete directory tree with every file and directory specified ✅
- All 33 FRs mapped to specific file locations ✅
- Integration points have explicit file and data flow mappings ✅
- Component boundaries clearly defined (API, Component, Data, Build) ✅

**Pattern Completeness:**
- 12 conflict points identified and resolved ✅
- Naming conventions cover database, files, components, and API ✅
- Process patterns cover error handling, data fetching, and loading states ✅
- Anti-patterns explicitly listed to prevent drift ✅

### Gap Analysis Results

**Critical Gaps:** None identified.

**Minor Gaps (non-blocking, resolved):**

1. **Geocoding data source:** `seed-zip-codes.ts` needs a zip code → lat/lng data source. Resolution: Use GeoNames.org US postal code data (free, CC-BY license, ~43K records). Download once, include in repo as `data/us-zip-codes.csv`. The seed script reads this file and populates the `ZipCode` table.

2. **MDX processing library:** Resolution: Use `next-mdx-remote` (latest stable) rather than `@next/mdx`. Rationale: articles live in `src/content/articles/`, not in the `src/app/` directory. `next-mdx-remote` supports loading MDX from any file path.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed (33 FRs, 6 NFR categories)
- [x] Scale and complexity assessed (low-medium)
- [x] Technical constraints identified (7 hard constraints, 4 performance constraints)
- [x] Cross-cutting concerns mapped (SEO, Performance, Accessibility, Data Quality)

**✅ Starter Template**
- [x] Technology domain identified (web, statically generated directory)
- [x] Starter evaluated and selected (create-next-app + shadcn init)
- [x] All package versions verified current (February 2026)
- [x] Starter limitations documented (7 items need setup)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions (content storage, rendering strategy, geocoding)
- [x] Technology stack fully specified (Next.js 16, Prisma 7, PostgreSQL, Cloudflare)
- [x] Integration patterns defined (4 external systems)
- [x] Performance considerations addressed (CDN, static gen, font loading, JS budget)
- [x] Security posture defined (no auth, Prisma parameterization, Cloudflare)

**✅ Implementation Patterns**
- [x] Naming conventions established (database, files, components, API)
- [x] Structure patterns defined (flat components, co-located tests, feature-adjacent pages)
- [x] Communication patterns specified (no events, URL params as state, props-only data flow)
- [x] Process patterns documented (error handling, no loading states, data fetching)
- [x] Anti-patterns explicitly listed (8 forbidden patterns)

**✅ Project Structure**
- [x] Complete directory structure defined (every file mapped)
- [x] Component boundaries established (4 boundaries)
- [x] Integration points mapped (4 external, 3 internal data flows)
- [x] Requirements to structure mapping complete (33/33 FRs mapped)

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — the architecture is well-constrained by design. The minimal interactivity (3 client components), single API route, and static-first approach reduce the surface area for architectural drift. The extensive anti-pattern list prevents AI agents from adding unnecessary complexity.

**Key Strengths:**
- Extreme simplicity — one API route, 6 custom components, zero state management
- Clear boundaries prevent scope creep (no auth, no real-time, no CMS, no user data)
- Performance architecture is structural, not optimization-dependent (CDN + static gen)
- Every FR maps to specific files — no ambiguity for implementing agents

**Areas for Future Enhancement:**
- ISR strategy details (when build time exceeds 10 min — Phase 2 concern)
- Elasticsearch migration path (if Postgres search becomes insufficient at 50K+ listings)
- CI/CD pipeline expansion for staging environment
- Monitoring and alerting strategy beyond basic uptime checks

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries — no new directories unless documented
- Refer to this document for all architectural questions
- When in doubt, choose the simpler approach — this architecture is intentionally minimal

**First Implementation Priority:**
1. Install Prisma 7 and create the database schema
2. Replace Geist fonts with the three-font system (Plus Jakarta Sans, Source Serif 4, Lora)
3. Replace shadcn default color tokens with UX spec palette
4. Build the data import pipeline (Outscraper → Postgres)
5. Implement core components starting with SearchBar and ListingCard
