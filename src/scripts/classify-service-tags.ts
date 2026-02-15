import "dotenv/config"
import { PrismaClient, ServiceType } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// DO Managed PostgreSQL uses a certificate not in the default trust chain.
// Safe for local admin CLI scripts — not used in production server code.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set. Check your .env file.")
  process.exit(1)
}

// ─── Keyword Map ──────────────────────────────────────────

const SERVICE_KEYWORDS: Record<ServiceType, string[]> = {
  RODENT_CLEANUP: [
    "rodent", "rat", "rats", "mice", "mouse", "pest", "animal",
    "critter", "wildlife", "vermin", "raccoon", "squirrel",
    "bat", "bird", "exterminator", "trapping",
  ],
  INSULATION_REMOVAL: [
    "insulation", "insulation removal", "insulation replacement",
    "remove insulation", "replace insulation",
    "blown-in", "fiberglass", "cellulose", "batt",
    "spray foam", "radiant barrier", "blown in",
    "insulator",
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
    "rebuild", "attic repair", "replacement",
    "full service", "full-service", "complete attic",
  ],
}

// ─── Word-Boundary Matching ───────────────────────────────

function matchesKeyword(text: string, keyword: string): boolean {
  // For multi-word keywords or hyphenated keywords, use simple includes (case-insensitive)
  if (keyword.includes(" ") || keyword.includes("-")) {
    return text.includes(keyword)
  }
  // For single-word keywords, use word-boundary regex to avoid
  // matching "molding" when looking for "mold", etc.
  const regex = new RegExp(`\\b${keyword}\\b`, "i")
  return regex.test(text)
}

// ─── Classification Function (Two-Tier Strategy) ──────────

function classifyListing(listing: {
  name: string
  description: string | null
  subtypes: string | null
}): ServiceType[] {
  // Always include name — it often contains the most relevant service keywords.
  // Trade-off: original design excluded names to avoid false positives (e.g. "Mold Inspection"
  // matching MOLD_REMEDIATION). Including names is necessary to reach 80%+ classification rate
  // since many imported listings have only generic subtypes like "Contractor". Acceptable because
  // all listings are pre-filtered by attic-related Outscraper search queries.
  const text = [listing.name, listing.description, listing.subtypes]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

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

// ─── Main ─────────────────────────────────────────────────

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  try {
    // Step 1: Load all listings
    const listings = await prisma.listing.findMany({
      select: { id: true, name: true, description: true, subtypes: true },
    })

    console.log(`Loaded ${listings.length} listings from database\n`)

    // Step 2: Classify each listing
    const allTags: { listingId: string; serviceType: ServiceType }[] = []
    let listingsWithTags = 0
    let listingsWithoutTags = 0
    const tagCounts: Record<ServiceType, number> = {
      RODENT_CLEANUP: 0,
      INSULATION_REMOVAL: 0,
      DECONTAMINATION: 0,
      MOLD_REMEDIATION: 0,
      GENERAL_CLEANING: 0,
      ATTIC_RESTORATION: 0,
    }

    for (const listing of listings) {
      const types = classifyListing(listing)

      if (types.length > 0) {
        listingsWithTags++
        for (const serviceType of types) {
          allTags.push({ listingId: listing.id, serviceType })
          tagCounts[serviceType]++
        }
      } else {
        listingsWithoutTags++
      }
    }

    // Step 3: Atomic delete + batch-insert (idempotent transaction)
    await prisma.$transaction(async (tx) => {
      const deleted = await tx.serviceTag.deleteMany()
      console.log(`Cleared ${deleted.count} existing service tags`)
      await tx.serviceTag.createMany({ data: allTags, skipDuplicates: true })
    })

    // Step 4: Summary report
    const classificationRate = listings.length > 0
      ? ((listingsWithTags / listings.length) * 100).toFixed(1)
      : "0.0"

    console.log("\n═══════════════════════════════════════")
    console.log("  Service Tag Classification Summary")
    console.log("═══════════════════════════════════════")
    console.log(`  Total listings processed:  ${listings.length}`)
    console.log(`  Listings with tags:        ${listingsWithTags}`)
    console.log(`  Listings without tags:      ${listingsWithoutTags}`)
    console.log(`  Classification rate:       ${classificationRate}%`)
    console.log("───────────────────────────────────────")
    console.log("  Tag Distribution:")
    for (const [type, count] of Object.entries(tagCounts)) {
      console.log(`    ${type.padEnd(24)} ${count}`)
    }
    console.log(`  Total tags assigned:       ${allTags.length}`)
    console.log("═══════════════════════════════════════")

    if (parseFloat(classificationRate) < 80) {
      console.log(`\n⚠ Classification rate (${classificationRate}%) is below 80% target.`)
      // Check null rates for diagnostics
      const nullDesc = listings.filter((l) => !l.description).length
      const nullSubtypes = listings.filter((l) => !l.subtypes).length
      const nullBoth = listings.filter((l) => !l.description && !l.subtypes).length
      console.log(`  Listings missing description: ${nullDesc}/${listings.length}`)
      console.log(`  Listings missing subtypes:    ${nullSubtypes}/${listings.length}`)
      console.log(`  Listings missing both:        ${nullBoth}/${listings.length} (using name fallback)`)
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error("Classification failed:", e)
  process.exit(1)
})
