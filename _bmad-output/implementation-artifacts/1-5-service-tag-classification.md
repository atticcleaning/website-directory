# Story 1.5: Service Tag Classification

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As an **admin**,
I want service tags automatically classified for imported listings based on business name, description, and subtypes,
So that homeowners can filter and identify specialists by specific attic cleaning services.

## Acceptance Criteria

1. **Script Location:** Classification script exists at `src/scripts/classify-service-tags.ts` and runs via `npx tsx src/scripts/classify-service-tags.ts`
2. **Input Data:** The script reads all listings from the database. Primary classification uses `description` and `subtypes` fields. The `name` field is used only as a fallback for listings where both `description` and `subtypes` are null (FR26)
3. **Service Types:** Keywords map to the 6 ServiceType enum values: `RODENT_CLEANUP`, `INSULATION_REMOVAL`, `DECONTAMINATION`, `MOLD_REMEDIATION`, `GENERAL_CLEANING`, `ATTIC_RESTORATION`
4. **Multiple Tags:** A listing can have multiple service tags (e.g., both `RODENT_CLEANUP` and `DECONTAMINATION`)
5. **Conservative Matching:** Conservative keyword matching is used — better to show no tag than a wrong tag. Word-boundary matching is preferred over substring matching to reduce false positives
6. **Idempotent:** Existing service tags are cleared and re-classified on each run — running the script twice produces identical results
7. **Summary Report:** The script outputs a summary: total listings processed, listings with at least one tag, listings without tags, tag distribution by service type, and classification rate percentage
8. **Classification Rate:** The classification rate is logged, with a target of tags applied to 80%+ of listings
9. **No Schema Changes:** The ServiceTag model and ServiceType enum already exist in the Prisma schema from Story 1.2 — no migration needed
10. **Build Trigger:** After classification, the admin can trigger a full static site rebuild by running `npm run build` to generate updated pages (FR29)

## Tasks / Subtasks

- [x] Task 1: Create classification script with keyword matching engine (AC: #1, #2, #3, #4, #5)
  - [x] 1.1 Create `src/scripts/classify-service-tags.ts` following established script pattern (dotenv, PrismaPg adapter, async main, DATABASE_URL guard, TLS bypass)
  - [x] 1.2 Define keyword map: `Record<ServiceType, string[]>` with keyword lists for each of the 6 service types
  - [x] 1.3 Implement `classifyListing()` function that checks `description` and `subtypes` (primary) against keyword lists, falling back to `name` only when both primary fields are null. Use case-insensitive word-boundary matching
  - [x] 1.4 Load all listings from database with `select: { id, name, description, subtypes }`
  - [x] 1.5 For each listing, run classification and collect matched ServiceType values

- [x] Task 2: Implement idempotent tag persistence (AC: #6)
  - [x] 2.1 Delete all existing ServiceTag records at the start of the run (`prisma.serviceTag.deleteMany()`)
  - [x] 2.2 Batch-insert new ServiceTag records using `prisma.serviceTag.createMany({ data, skipDuplicates: true })` for efficiency and safety
  - [x] 2.3 Verify the `@@unique([listingId, serviceType])` constraint prevents any accidental duplicates (skipDuplicates handles edge cases defensively)

- [x] Task 3: Implement summary report (AC: #7, #8)
  - [x] 3.1 Track: total listings, listings with tags, listings without tags, per-type tag counts
  - [x] 3.2 Calculate and display classification rate as percentage
  - [x] 3.3 Output formatted summary report to stdout

- [x] Task 4: Test and verify (AC: #2, #5, #6, #7, #8)
  - [x] 4.1 Check null rates: query how many listings have null `description` and/or null `subtypes` — this determines achievable classification rate
  - [x] 4.2 Run against current database (18 listings from Story 1.4 live import)
  - [x] 4.3 Verify word-boundary regex edge cases: "mold" must NOT match "remodel", "clean" must NOT match every company name, "pest" SHOULD match "Pest control service" in subtypes
  - [x] 4.4 Verify GENERAL_CLEANING is NOT applied to every listing — only those with "cleaning"/"clean" in description/subtypes (not name)
  - [x] 4.5 Verify idempotency: re-run produces identical ServiceTag records (same count, same distribution)
  - [x] 4.6 Verify summary report accuracy against manual spot-checks
  - [x] 4.7 If classification rate < 80%, check if low rate is due to missing description/subtypes data — tune keywords or document expected rate for current dataset

- [x] Task 5: Validate build integrity (AC: all)
  - [x] 5.1 Run `npx tsc --noEmit` — zero type errors
  - [x] 5.2 Run `npm run lint` — zero violations
  - [x] 5.3 Run `npm run build` — compiles successfully

## Dev Notes

### Keyword Matching Strategy (CRITICAL)

The script classifies listings using a **two-tier field strategy** to avoid false positives:

**Primary fields** (used for all listings that have them):
1. **`subtypes`** (String?, comma-separated) — GOLD signal. Outscraper provides categories like `"Insulation contractor, Pest control service"` that map directly to our ServiceType enum. This field alone can classify most listings accurately.
2. **`description`** (String?, may be null) — Rich free-text from Outscraper. Contains service details when present.

**Fallback field** (used ONLY when both `description` and `subtypes` are null):
3. **`name`** (String, always present) — Used as last resort. Company names often contain generic terms like "Attic Cleaning" that would cause mass false positives if always included.

**Why NOT combine all three fields:** Nearly every business in the directory has "cleaning" or "attic" in its name. If `name` is always included, `GENERAL_CLEANING` would tag 95%+ of all listings — making the filter useless. By excluding `name` from primary matching, `GENERAL_CLEANING` only applies to businesses whose `description` or `subtypes` explicitly mention cleaning services.

### Keyword Map Design

```typescript
import { ServiceType } from "../app/generated/prisma/client"

const SERVICE_KEYWORDS: Record<ServiceType, string[]> = {
  RODENT_CLEANUP: [
    "rodent", "rat", "rats", "mice", "mouse", "pest", "animal",
    "critter", "wildlife", "vermin", "raccoon", "squirrel",
    "bat", "bird", "exterminator", "trapping",
  ],
  INSULATION_REMOVAL: [
    "insulation", "blown-in", "fiberglass", "cellulose", "batt",
    "r-value", "spray foam", "radiant barrier", "thermal",
    "blown in", "insulating",
  ],
  DECONTAMINATION: [
    "decontamination", "decontaminate", "sanitize", "sanitization",
    "disinfect", "disinfection", "biohazard", "hazmat",
    "feces", "urine", "droppings",
  ],
  MOLD_REMEDIATION: [
    "mold", "mildew", "fungus", "fungal", "moisture",
    "water damage", "mold removal", "mold remediation",
    "moisture barrier", "vapor barrier",
  ],
  GENERAL_CLEANING: [
    "cleaning", "clean", "clean-up", "cleanup", "debris",
    "junk", "dust", "vacuum", "sweep",
    "cleanout", "clean out",
  ],
  ATTIC_RESTORATION: [
    "restoration", "restore", "renovation", "renovate",
    "rebuild", "repair", "replacement",
    "full service", "full-service", "complete attic",
  ],
}
```

### Word-Boundary Matching (CRITICAL for conservative matching)

Use **case-insensitive matching** but prefer **word boundary awareness** to reduce false positives:

```typescript
function matchesKeyword(text: string, keyword: string): boolean {
  // For multi-word keywords, use simple includes (case-insensitive)
  if (keyword.includes(" ") || keyword.includes("-")) {
    return text.includes(keyword)
  }
  // For single-word keywords, use word-boundary regex to avoid
  // matching "molding" when looking for "mold", etc.
  const regex = new RegExp(`\\b${keyword}\\b`, "i")
  return regex.test(text)
}
```

**Why regex for single words:** Without word boundaries, "clean" would match "cleaner" (fine) but "mold" would also match "molding" or "remodel" — false positives. The `\b` word boundary prevents this. For multi-word keywords like "spray foam" or "water damage", simple `includes()` is sufficient since the phrase itself provides enough specificity.

**Edge case — "mold" vs "remodel":** The word "mold" with `\b` boundaries will NOT match "remodel" because "mold" in "remodel" is not at a word boundary. This is the correct conservative behavior.

### Classification Function (Two-Tier Strategy)

```typescript
function classifyListing(listing: { name: string; description: string | null; subtypes: string | null }): ServiceType[] {
  // Primary: use description + subtypes (avoids false positives from company names)
  const hasPrimaryFields = listing.description || listing.subtypes
  const text = hasPrimaryFields
    ? [listing.description, listing.subtypes].filter(Boolean).join(" ").toLowerCase()
    : listing.name.toLowerCase() // Fallback: name only when no description/subtypes

  const matched: ServiceType[] = []

  for (const [serviceType, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (matchesKeyword(text, keyword)) {
        matched.push(serviceType as ServiceType)
        break // One keyword match per type is enough
      }
    }
  }

  return matched
}
```

**Two-tier logic explained:**
- If a listing has `description` OR `subtypes` → classify using those fields only (excludes `name` to avoid "cleaning" false positives)
- If a listing has NEITHER `description` NOR `subtypes` → fall back to `name` field (better than no classification at all)
- This prevents `GENERAL_CLEANING` from tagging every listing while still giving name-only listings a chance at classification

### Idempotency Strategy

The simplest approach: **delete all, then re-create**.

```typescript
// Step 1: Delete all existing service tags
const deleted = await prisma.serviceTag.deleteMany()
console.log(`Cleared ${deleted.count} existing service tags`)

// Step 2: Classify and batch-insert
const allTags: { listingId: string; serviceType: ServiceType }[] = []
for (const listing of listings) {
  const types = classifyListing(listing)
  for (const serviceType of types) {
    allTags.push({ listingId: listing.id, serviceType })
  }
}

await prisma.serviceTag.createMany({ data: allTags, skipDuplicates: true })
```

This is idempotent because re-running produces the exact same set of tags. The `deleteMany` + `createMany` pattern is efficient and avoids complex diff logic. `skipDuplicates: true` is a defensive safeguard — if the classification function accidentally returns the same ServiceType twice for a listing, the batch insert won't crash (follows the pattern from `seed-zip-codes.ts` in Story 1.3).

### GENERAL_CLEANING Behavior (CRITICAL DECISION)

With the two-tier strategy, `GENERAL_CLEANING` is only applied when `description` or `subtypes` explicitly mention cleaning — NOT because the company name contains "cleaning." This makes the tag meaningful as a filter: it identifies businesses that specifically describe cleaning services, rather than tagging the entire directory.

Listings with no `description`/`subtypes` fall back to `name` matching, where `GENERAL_CLEANING` may apply — but these are a minority of listings.

The "conservative" directive applies to ALL types equally. The two-tier strategy enforces conservatism structurally by limiting which fields are searched.

### Prisma 7 Script Pattern (from Story 1.3/1.4)

```typescript
import "dotenv/config"
import { PrismaClient, ServiceType } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set. Check your .env file.")
  process.exit(1)
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  try {
    // ... classification logic ...
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => { console.error("Classification failed:", e); process.exit(1) })
```

**CRITICAL import notes:**
- Import from `"../app/generated/prisma/client"` — the `/client` suffix is required (Prisma 7)
- `ServiceType` enum is exported from the same import path
- `PrismaPg` from `@prisma/adapter-pg` is required for the driver adapter pattern
- `import "dotenv/config"` at the very top for env var loading
- `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"` for DO Managed PostgreSQL TLS

### Summary Report Format

```
═══════════════════════════════════════
  Service Tag Classification Summary
═══════════════════════════════════════
  Total listings processed:  18
  Listings with tags:        15
  Listings without tags:      3
  Classification rate:       83.3%
───────────────────────────────────────
  Tag Distribution:
    RODENT_CLEANUP:           4
    INSULATION_REMOVAL:       7
    DECONTAMINATION:          3
    MOLD_REMEDIATION:         2
    GENERAL_CLEANING:        14
    ATTIC_RESTORATION:        5
  Total tags assigned:       35
═══════════════════════════════════════
```

### What This Story Does NOT Do

- Does NOT modify the Prisma schema — ServiceTag model and ServiceType enum already exist
- Does NOT create any migrations
- Does NOT modify any React components or pages
- Does NOT call any external API
- Does NOT import `src/lib/prisma.ts` — standalone scripts use their own PrismaClient instance
- Does NOT modify `import-listings.ts` — classification is a separate concern

### Anti-Patterns to Avoid

- **Do NOT import from `src/lib/prisma.ts`** — standalone scripts need their own PrismaClient instance with PrismaPg adapter
- **Do NOT use substring matching without word boundaries** — "mold" should not match "remodel"
- **Do NOT use fuzzy/AI-based matching** — simple keyword matching is the correct approach per architecture
- **Do NOT create individual ServiceTag records in a loop** — use batch `createMany()` for efficiency
- **Do NOT skip the `subtypes` field** — it contains Outscraper categories like "Insulation contractor" that are the most reliable classification signal
- **Do NOT hard-code listing IDs or test against specific businesses** — the script must work on any dataset
- **Do NOT add error handling for missing ServiceType enum values** — the enum is defined in the Prisma schema and TypeScript enforces type safety
- **Do NOT always include `name` in the keyword search text** — nearly every business has "cleaning" or "attic" in the name, which causes GENERAL_CLEANING to tag 95%+ of listings. Use the two-tier strategy: primary fields (description/subtypes) first, `name` only as fallback
- **Do NOT include "attic cleaning" or "remodel" as keywords** — "attic cleaning" matches every description in the directory, "remodel" conflicts with word-boundary matching for "mold"

### Current Database State (from Story 1.4)

- 18 listings across 8 cities (Phoenix, Scottsdale, Chandler + LA area)
- 4 test listings with test data (from `data/test-outscraper-listings.json`): "Desert Attic Pros", "Arizona Attic Masters", "Valley Critter Control & Attic Clean", "Tucson Attic Solutions"
- 14 real listings from live Outscraper API imports (Phoenix + LA queries)
- Listing fields available for classification:
  - `name`: Always present (required field)
  - `description`: Present on some listings (Outscraper "about" field)
  - `subtypes`: Present on some listings (e.g., `"Insulation contractor, Pest control service"`)

### Project Structure Notes

- `src/scripts/classify-service-tags.ts` matches the exact path in architecture.md
- `src/scripts/` directory exists from Story 1.3
- No new npm dependencies needed — all imports already available
- No schema migration needed — ServiceTag model exists from Story 1.2

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5] — Acceptance criteria and user story
- [Source: _bmad-output/planning-artifacts/architecture.md#Naming Patterns] — ServiceType enum values, naming conventions
- [Source: _bmad-output/planning-artifacts/architecture.md#Structure Patterns] — Script location at `src/scripts/classify-service-tags.ts`
- [Source: prisma/schema.prisma] — ServiceTag model with @@unique([listingId, serviceType]), ServiceType enum
- [Source: _bmad-output/implementation-artifacts/1-4-outscraper-data-import-pipeline.md] — Established script pattern, Listing fields (description, subtypes, workingHours added in Story 1.4)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Debug Log References

None — implementation was straightforward with no debugging needed.

### Completion Notes List

- Created `src/scripts/classify-service-tags.ts` with two-tier keyword classification strategy
- Keyword map covers all 6 ServiceType enum values with conservative word-boundary matching
- Two-tier field strategy: primary (description + subtypes), fallback (name only when both null)
- `matchesKeyword()` uses `\b` regex for single words, `includes()` for multi-word/hyphenated keywords
- Idempotent via `$transaction(deleteMany + createMany({ skipDuplicates: true }))` — atomic swap
- Classification results on 18 listings: 94.4% rate (17/18 tagged), 30 total tags
- GENERAL_CLEANING applied to only 3/18 listings (16.7%) — two-tier strategy prevents mass false positives
- 1 untagged listing: "Home Attics" (subtypes="Contractor") — correct conservative behavior
- Null rates: 0/18 null description, 0/18 null subtypes — all listings have primary fields
- Word boundary verified: "mold" ≠ "remodel", "clean" ≠ "cleaning" (as standalone word), "pest" = "Pest control service"
- Idempotency verified: second run cleared 30 tags and recreated identical 30 tags
- Zero TypeScript errors, zero lint violations, build compiles successfully
- Classification rate 94.4% exceeds 80% target — Task 4.7 N/A
- Code review fixes applied: M1 (transaction atomicity), M2 (removed generic keywords: thermal, r-value, insulating), M3 ("repair" → "attic repair" for conservative matching)

### Change Log

- 2026-02-12: Created classify-service-tags.ts with full classification engine, ran against 18 listings (94.4% rate)
- 2026-02-12: Code review — wrapped deleteMany+createMany in $transaction, narrowed INSULATION_REMOVAL/ATTIC_RESTORATION keywords

### File List

- src/scripts/classify-service-tags.ts (new)
