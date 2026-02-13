# Story 1.2: Database Schema & Prisma Setup

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want the complete database schema defined in Prisma with all models needed for the directory,
So that data can be imported and queried by the application.

## Acceptance Criteria

1. **Prisma Installation:** Prisma 7 is installed and configured with PostgreSQL connection via `DATABASE_URL`
2. **Schema Models:** The schema defines models: `Listing`, `City`, `Review`, `ServiceTag`, `SearchLog`, `ZipCode` following PascalCase model names and camelCase field names
3. **Listing Model:** Includes `id` (cuid), `googlePlaceId` (unique), `name`, `slug`, `starRating` (Float), `reviewCount` (Int), `phone?`, `website?`, `address`, `latitude`, `longitude`, city relation, reviews relation, serviceTags relation, `createdAt`, `updatedAt`
4. **City Model:** Includes `id` (cuid), `name`, `state`, `slug` (unique), `latitude`, `longitude`, listings relation, `createdAt`
5. **Review Model:** Includes `id` (cuid), listing relation, `authorName`, `rating` (Float), `text`, `publishedAt`, `createdAt`
6. **ServiceTag Model:** Includes `id` (cuid), listing relation, `serviceType` (enum: `RODENT_CLEANUP`, `INSULATION_REMOVAL`, `DECONTAMINATION`, `MOLD_REMEDIATION`, `GENERAL_CLEANING`, `ATTIC_RESTORATION`)
7. **ZipCode Model:** Includes `id` (cuid), `code` (unique), `city`, `state`, `latitude`, `longitude`
8. **SearchLog Model:** Includes `id` (cuid), `query`, `resultCount` (Int), `radiusMiles` (Float), `latitude?`, `longitude?`, `createdAt`
9. **GIN Indexes:** GIN indexes are defined for full-text search on Listing (`name`, `address`)
10. **Migration Success:** `npx prisma migrate dev` runs successfully creating all tables
11. **Prisma Client Singleton:** `src/lib/prisma.ts` exports a singleton Prisma client instance
12. **Type Generation:** `npx prisma generate` produces TypeScript types for all models

## Tasks / Subtasks

- [x] Task 1: Install Prisma 7 and initialize configuration (AC: #1)
  - [x] 1.1 Install `prisma` as dev dependency and `@prisma/client` as dependency
  - [x] 1.2 Install `@prisma/adapter-pg` driver adapter for PostgreSQL
  - [x] 1.3 Run `npx prisma init` to create `prisma/schema.prisma` and scaffold config
  - [x] 1.4 Update `generator client` block: set `provider = "prisma-client"` and `output = "../src/app/generated/prisma"`
  - [x] 1.5 Configure `datasource db` with `provider = "postgresql"` (connection via `DATABASE_URL` env var)
  - [x] 1.6 Add `src/app/generated/` to `.gitignore` (generated Prisma client should not be committed)

- [x] Task 2: Define ServiceType enum (AC: #6)
  - [x] 2.1 Create `enum ServiceType` with values: `RODENT_CLEANUP`, `INSULATION_REMOVAL`, `DECONTAMINATION`, `MOLD_REMEDIATION`, `GENERAL_CLEANING`, `ATTIC_RESTORATION`

- [x] Task 3: Define City model (AC: #4)
  - [x] 3.1 Create `model City` with fields: `id` (cuid), `name` (String), `state` (String), `slug` (String, @unique), `latitude` (Float), `longitude` (Float), `listings` (Listing[]), `createdAt` (DateTime @default(now()))

- [x] Task 4: Define Listing model (AC: #3)
  - [x] 4.1 Create `model Listing` with all fields per AC #3
  - [x] 4.2 Add `slug` field (String) for URL-safe company slugs
  - [x] 4.3 Add `city` relation via `cityId` foreign key
  - [x] 4.4 Add `reviews` and `serviceTags` relation arrays

- [x] Task 5: Define Review model (AC: #5)
  - [x] 5.1 Create `model Review` with fields per AC #5
  - [x] 5.2 Add `listing` relation via `listingId` foreign key

- [x] Task 6: Define ServiceTag model (AC: #6)
  - [x] 6.1 Create `model ServiceTag` with `listing` relation and `serviceType` enum field

- [x] Task 7: Define ZipCode model (AC: #7)
  - [x] 7.1 Create `model ZipCode` with fields per AC #7
  - [x] 7.2 Add `@@index([code])` for fast zip code lookups

- [x] Task 8: Define SearchLog model (AC: #8)
  - [x] 8.1 Create `model SearchLog` with fields per AC #8
  - [x] 8.2 Add `@@index([createdAt])` for time-based query analysis

- [x] Task 9: Add GIN indexes for full-text search (AC: #9)
  - [x] 9.1 Add GIN index on `Listing.name` for text search
  - [x] 9.2 Add GIN index on `Listing.address` for text search
  - [x] 9.3 Created follow-up raw SQL migration with tsvector GIN indexes and pg_trgm trigram indexes

- [x] Task 10: Create Prisma client singleton (AC: #11)
  - [x] 10.1 Create `src/lib/prisma.ts` with singleton pattern using `PrismaPg` driver adapter
  - [x] 10.2 Import from generated path: `../app/generated/prisma/client`
  - [x] 10.3 Use `globalForPrisma` pattern to prevent hot-reload connection leaks in development

- [x] Task 11: Run migration and verify (AC: #10, #12)
  - [x] 11.1 DATABASE_URL set in `.env` pointing to DO Managed PostgreSQL (`atticcleaning-db`)
  - [x] 11.2 Run `npx prisma migrate dev --name init` — 6 tables created successfully
  - [x] 11.3 Run `npx prisma generate` — Prisma Client 7.4.0 generated to `src/app/generated/prisma`
  - [x] 11.4 `npm run build` — compiled successfully, zero errors
  - [x] 11.5 `npx tsc --noEmit` — zero type errors

### Review Follow-ups (AI)

- [x] [AI-Review H1] Fix build script to include `prisma generate` before `next build` in `package.json`
- [x] [AI-Review H2] Make `Review.text` optional (`String?`) in schema and create migration
- [x] [AI-Review M1] Remove redundant `@@index([code])` from ZipCode model and create migration
- [x] [AI-Review-2 M1] Add `@@unique([listingId, serviceType])` to ServiceTag model to prevent duplicate tags per listing
- [x] [AI-Review-2 M2] Add `postinstall` script (`"postinstall": "prisma generate"`) so `npm run dev` works after fresh clone

## Dev Notes

### Critical Architecture Constraints

- **Prisma 7 uses a NEW generator name.** The generator provider is `"prisma-client"` (NOT `"prisma-client-js"` which was Prisma 5/6). This is a breaking change.
- **Prisma 7 requires a driver adapter.** You MUST use `@prisma/adapter-pg` with `PrismaPg` class. Direct connection strings in `PrismaClient()` constructor are no longer supported without an adapter.
- **Prisma 7 requires explicit output path.** The generator MUST specify `output = "../src/app/generated/prisma"` — the client is no longer auto-placed in `node_modules`.
- **Import path includes `/client`.** Import as `from "../app/generated/prisma/client"` (or relative equivalent from `src/lib/prisma.ts`). Missing the `/client` suffix will cause import errors.
- **PascalCase models, camelCase fields, SCREAMING_SNAKE enums.** This naming convention is locked per architecture. Do NOT use snake_case for fields or lowercase for models.
- **Flat component structure.** Per architecture, `src/lib/prisma.ts` is the ONLY file that creates a Prisma client instance. All database access flows through this singleton.
- **No services/repositories layer.** Do NOT create `src/services/` or `src/repositories/` abstraction layers. Pages query Prisma directly through `src/lib/` functions.
- **`cuid()` for all IDs.** Use `@default(cuid())` for all primary keys. Do NOT use `autoincrement()` or `uuid()`.

### Prisma 7 Configuration Pattern (CRITICAL — follow exactly)

**`prisma/schema.prisma` generator block:**
```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/app/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**`src/lib/prisma.ts` singleton pattern:**
```typescript
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({
  adapter,
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
```

### Schema Design Details

**Listing model** is the core entity. It has:
- `googlePlaceId` as unique identifier for Outscraper deduplication (FR25)
- `slug` for URL-safe paths like `abc-attic-cleaning` used in `/[citySlug]/[companySlug]` routes
- `starRating` as Float (not Int) — Google ratings are decimal (e.g., 4.7)
- `phone` and `website` are optional — cards adapt when missing per UX-2
- `latitude`/`longitude` for radius-based search queries

**City model** has:
- `slug` as unique — used in URL structure `/[citySlug]/` (e.g., `phoenix-az`)
- `latitude`/`longitude` for determining nearby cities (FR19) and search location resolution

**ServiceTag model** uses enum, not freetext:
- Exactly 6 values per UX-8 (each has a dedicated chip color defined in Story 1.1)
- A listing can have MULTIPLE tags (one-to-many relation)
- Tags are re-classified on each run (idempotent) per Story 1.5

**ZipCode model** is a lookup table:
- ~43,000 US zip codes from GeoNames.org (seeded in Story 1.3)
- Used by search API to resolve zip code queries to coordinates without runtime API calls
- `code` is unique and indexed for fast lookup

**SearchLog model** is for analytics only:
- Only records searches with < 3 results (FR30)
- `latitude`/`longitude` are optional — only set when location resolution succeeds
- Used for geographic expansion prioritization

### GIN Index Implementation Notes

Prisma's `@@index` supports `type: Gin` but primarily for JSONB fields. For `tsvector`-based full-text search, the recommended approach is:
1. Create the initial migration with Prisma's schema (creates tables and basic indexes)
2. Add a follow-up raw SQL migration for the GIN indexes:
```sql
-- Create tsvector GIN indexes for full-text search
CREATE INDEX listing_name_search_idx ON "Listing" USING GIN (to_tsvector('english', name));
CREATE INDEX listing_address_search_idx ON "Listing" USING GIN (to_tsvector('english', address));
```
3. To add this as a Prisma migration: `npx prisma migrate dev --create-only --name add_gin_indexes`, then edit the generated SQL file to add the above statements, then run `npx prisma migrate dev`

### Previous Story Intelligence (Story 1.1)

**What was established:**
- Font system: Plus Jakarta Sans, Source Serif 4, Lora — all configured in `src/app/layout.tsx` and `src/app/globals.css`
- Color tokens: Full UX spec palette in oklch format in `globals.css`
- Service tag chip colors: All 6 defined as CSS custom properties in oklch
- `.env.example`: Already created with `DATABASE_URL` and `GOOGLE_MAPS_API_KEY` placeholders
- `.gitignore`: Modified to allow `.env.example`

**Patterns to follow from Story 1.1:**
- Keep modifications focused — only touch files necessary for the task
- Build/lint/tsc verification at the end of implementation
- Co-locate all Prisma config in `prisma/` directory per architecture
- Prisma client singleton goes in `src/lib/prisma.ts` per architecture

**Files modified in Story 1.1:**
- `src/app/layout.tsx` — fonts and metadata
- `src/app/globals.css` — color tokens, font mappings, chip colors
- `.env.example` — environment variable template
- `.gitignore` — `.env.example` exception

### Git Intelligence

**Last commit:** `c5c2ca6 Implement Story 1.1: Project Configuration & Design System Setup`
- Modified: `src/app/layout.tsx`, `src/app/globals.css`, `.env.example`, `.gitignore`
- No Prisma files exist yet — this story creates the entire database layer from scratch

**Current source tree:**
- `src/app/` — `globals.css`, `layout.tsx`, `page.tsx`, `favicon.ico`
- `src/lib/` — `utils.ts` (cn() helper only)
- `src/components/ui/` — shadcn primitives (untouched)
- No `prisma/` directory yet
- No `src/lib/prisma.ts` yet

### Prisma 7 Latest Technical Information

**CRITICAL breaking changes from Prisma 5/6:**

| Feature | Prisma 5/6 | Prisma 7 |
|---|---|---|
| Generator provider | `prisma-client-js` | `prisma-client` |
| Client output | Auto in `node_modules` | MUST specify `output` path |
| Import path | `@prisma/client` | `../app/generated/prisma/client` (relative to output) |
| DB connection | Direct in `PrismaClient()` | Requires `@prisma/adapter-pg` driver adapter |
| Runtime engine | Rust binary engine | TypeScript-native (no Rust engine, smaller bundle) |

**Required packages:**
```bash
npm install prisma --save-dev
npm install @prisma/client @prisma/adapter-pg
```

**Full-text search in Prisma 7:**
- Native PostgreSQL `to_tsvector` / `to_tsquery` via `$queryRaw` or TypedSQL
- No built-in `search` field for PostgreSQL in Prisma 7 without preview features
- Recommended: Use Prisma raw SQL for search queries in `src/lib/search.ts` (Story 2.2)
- GIN indexes must be created via raw SQL migration for tsvector support

### Packages to Install

```bash
# Dev dependency
npm install prisma --save-dev

# Runtime dependencies
npm install @prisma/client @prisma/adapter-pg
```

### What This Story Does NOT Do

- Does NOT create CLI import scripts (that's Story 1.4)
- Does NOT seed the ZipCode table (that's Story 1.3)
- Does NOT implement the search API route (that's Story 2.2)
- Does NOT create any React components
- Does NOT modify `src/app/layout.tsx` or `src/app/globals.css`
- Does NOT set up testing infrastructure
- Does NOT create `src/lib/search.ts` or `src/lib/constants.ts`

### Project Structure Notes

- **New files created:**
  - `prisma/schema.prisma` — Database schema with all 6 models + 1 enum
  - `src/lib/prisma.ts` — Prisma client singleton with PrismaPg adapter
  - `prisma/migrations/` — Auto-generated migration files
  - `src/app/generated/prisma/` — Generated Prisma client (gitignored)

- **Files modified:**
  - `.gitignore` — Add `src/app/generated/` to ignore generated Prisma client
  - `package.json` — New dependencies added via npm install

- **Architecture alignment:**
  - `prisma/schema.prisma` at project root per Prisma convention ✓
  - `src/lib/prisma.ts` as singleton per architecture data boundary ✓
  - No new directories outside established structure ✓

### Anti-Patterns to Avoid

- **Do NOT use `prisma-client-js` as generator provider** — That's Prisma 5/6. Prisma 7 uses `prisma-client`
- **Do NOT import from `@prisma/client`** — Prisma 7 uses local generated output. Import from the `output` path
- **Do NOT create PrismaClient without a driver adapter** — Prisma 7 requires `PrismaPg` adapter
- **Do NOT use `autoincrement()` for IDs** — Architecture specifies `cuid()` for all primary keys
- **Do NOT use snake_case for Prisma field names** — Architecture mandates camelCase fields
- **Do NOT create `src/services/database.ts` or similar abstractions** — Direct Prisma usage only
- **Do NOT add `@prisma/extension-accelerate`** — Not needed for MVP, adds unnecessary complexity
- **Do NOT put the Prisma output in `node_modules`** — Prisma 7 pattern uses local `src/app/generated/prisma`

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture] — Prisma 7.2.0 with PostgreSQL, schema models, geocoding lookup table
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns] — PascalCase models, camelCase fields, SCREAMING_SNAKE enums, flat component structure
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries] — `prisma/schema.prisma`, `src/lib/prisma.ts`, data boundary rules
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — Complete Listing model example with exact field types
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2] — All acceptance criteria and BDD scenarios
- [Source: _bmad-output/planning-artifacts/architecture.md#Full-Text Search] — tsvector + pg_trgm, GIN indexes, Prisma raw SQL
- [Source: prisma.io/docs/ai/prompts/nextjs] — Prisma 7 Next.js setup pattern with PrismaPg adapter
- [Source: prisma.io/docs/orm/prisma-schema/data-model/indexes] — GIN index configuration in Prisma schema
- [Source: _bmad-output/implementation-artifacts/1-1-project-configuration-design-system-setup.md] — Previous story learnings, file patterns, review findings

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

- DATABASE_URL initially contained placeholder values — resolved by connecting to existing DO Managed PostgreSQL instance `atticcleaning-db` (discovered via `doctl databases list`)
- Prisma 7 `prisma init` now generates `prisma.config.ts` (new in Prisma 7) — datasource URL configured there, not in schema.prisma
- GIN indexes migration required `--create-only` then manual SQL edit, then `prisma migrate dev` — two-migration approach worked as planned
- Added `pg_trgm` extension and trigram GIN indexes in addition to tsvector indexes for fuzzy matching support (architecture specifies both tsvector + pg_trgm)

### Completion Notes List

- ✅ Resolved review finding [MEDIUM]: Added `@@unique([listingId, serviceType])` on ServiceTag — prevents duplicate tags per listing
- ✅ Resolved review finding [MEDIUM]: Added `postinstall` script `prisma generate` — fresh clones work with `npm run dev`
- ✅ Resolved review finding [HIGH]: Build script now runs `prisma generate` before `next build`
- ✅ Resolved review finding [HIGH]: `Review.text` changed to optional (`String?`) for rating-only Google reviews
- ✅ Resolved review finding [MEDIUM]: Removed redundant `@@index([code])` from ZipCode (unique already creates index)
- All 11 tasks (30 subtasks) completed successfully
- Prisma 7.4.0 installed with `@prisma/adapter-pg` driver adapter pattern
- Schema defines 6 models (Listing, City, Review, ServiceTag, ZipCode, SearchLog) + 1 enum (ServiceType)
- Added `@@unique([cityId, slug])` compound constraint on Listing (party mode refinement from dev review — prevents slug collisions per city for `/[citySlug]/[companySlug]` routes)
- Prisma 7 uses `prisma.config.ts` for datasource URL (not schema.prisma) — this is new and differs from story Dev Notes pattern
- 2 migrations applied: `init` (tables + basic indexes) and `add_gin_indexes` (tsvector + pg_trgm GIN indexes)
- `src/lib/prisma.ts` singleton created with PrismaPg adapter and globalForPrisma pattern
- `npm run build` — compiled successfully
- `npm run lint` — zero violations
- `npx tsc --noEmit` — zero type errors
- `npx prisma migrate status` — database schema is up to date

### Change Log

- 2026-02-13: Addressed code review 2 findings — 2 items resolved (R2-M1: ServiceTag unique constraint, R2-M2: postinstall script)
- 2026-02-13: Addressed code review findings — 3 items resolved (H1: build script, H2: Review.text optional, M1: redundant ZipCode index)
- 2026-02-13: Story 1.2 implemented — Prisma 7 schema, migrations, client singleton, GIN indexes

### Code Review Findings

**Reviewed by:** Claude Opus 4.6 (adversarial code review)
**Date:** 2026-02-13
**Disposition:** Action items for next story or follow-up

| ID | Severity | Finding | File | Action |
|----|----------|---------|------|--------|
| H1 | HIGH | Build script missing `prisma generate` — `"build": "next build"` should be `"npx prisma generate && next build"` per architecture. Fresh clones/CI will fail. | `package.json` | ✅ Resolved |
| H2 | HIGH | `Review.text` is required (`String`) but should be optional (`String?`) — Google reviews can be rating-only. Will block data import in Story 1.4. | `prisma/schema.prisma` | ✅ Resolved |
| M1 | MEDIUM | Redundant `@@index([code])` on ZipCode — `@unique` already creates a B-tree index. Wastes storage, slows writes. | `prisma/schema.prisma` | ✅ Resolved |
| L1 | LOW | Dev Notes describe `url = env("DATABASE_URL")` in schema.prisma but Prisma 7 uses `prisma.config.ts` instead. Implementation is correct; docs are stale. | Story file | Informational |
| L2 | LOW | FK cascade behavior (`ON DELETE RESTRICT`) not documented. Correct default for directory site, but future story authors should be aware. | `prisma/schema.prisma` | Document in Epic 3 story |

**Review 2** — Claude Opus 4.6 (2026-02-13) — Previous H1/H2/M1 verified resolved

| ID | Severity | Finding | File | Action |
|----|----------|---------|------|--------|
| R2-M1 | MEDIUM | ServiceTag lacks `@@unique([listingId, serviceType])` — allows duplicate tags per listing. DB has no integrity constraint to prevent this. | `prisma/schema.prisma` | ✅ Resolved |
| R2-M2 | MEDIUM | `dev` script is `"next dev"` only — fresh clone + `npm run dev` fails because generated Prisma client doesn't exist. Add `"postinstall": "prisma generate"`. | `package.json` | ✅ Resolved |
| R2-L1 | LOW | FK columns `Review.listingId` and `ServiceTag.listingId` lack standalone indexes — sequential scans at scale. Fine for MVP. | `prisma/schema.prisma` | Defer |
| R2-L2 | LOW | GIN indexes use manual names vs architecture's "auto-named by Prisma" — expected for raw SQL, not actionable. | Migration SQL | Informational |
| R2-L3 | LOW | No unit tests — acceptable for schema-only story; migration + build verification serves as validation. | N/A | Informational |

### File List

- `prisma/schema.prisma` — Created: 6 models + 1 enum; Modified: Review.text optional, removed ZipCode @@index([code]), added ServiceTag @@unique([listingId, serviceType])
- `prisma/migrations/20260213045807_init/migration.sql` — Created: Initial migration creating all 6 tables with indexes
- `prisma/migrations/20260213045833_add_gin_indexes/migration.sql` — Created: tsvector + pg_trgm GIN indexes on Listing name/address
- `prisma/migrations/migration_lock.toml` — Created: Prisma migration lock file
- `prisma.config.ts` — Created: Prisma 7 config with datasource URL from environment
- `src/lib/prisma.ts` — Created: Prisma client singleton with PrismaPg driver adapter
- `src/app/generated/prisma/` — Generated: Prisma Client 7.4.0 (gitignored)
- `.gitignore` — Modified: Updated generated Prisma client path from `/src/generated/prisma` to `/src/app/generated/prisma`
- `prisma/migrations/20260213051114_review_fixes/migration.sql` — Created: Drop redundant ZipCode index, make Review.text nullable
- `prisma/migrations/20260213052853_add_servicetag_unique/migration.sql` — Created: Add unique constraint on ServiceTag(listingId, serviceType)
- `package.json` — Modified: Added prisma (dev), @prisma/client, @prisma/adapter-pg, dotenv (dev); Fixed build script to include prisma generate
- `package-lock.json` — Modified: Updated lockfile with new dependencies
- `.env` — Modified: Updated DATABASE_URL with real DO Managed PostgreSQL connection string
