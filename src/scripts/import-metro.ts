import "dotenv/config"
import { readFileSync } from "fs"
import { resolve } from "path"
import {
  type ImportSummary,
  emptyImportSummary,
  mergeImportSummaries,
  printImportSummary,
  printDatabaseTotals,
  runImport,
  createPrismaClient,
  initImportCache,
} from "./import-listings"

// DO Managed PostgreSQL uses a certificate not in the default trust chain.
// Safe for local admin CLI scripts — not used in production server code.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// ─── Metro Config Types ──────────────────────────────────

interface MetroConfig {
  key: string
  city: string
  state: string
  region: string
  tier: string
  searchQueries: string[]
}

interface MetroConfigFile {
  metros: MetroConfig[]
}

// ─── CLI Argument Parsing ────────────────────────────────

interface CliArgs {
  metroKey: string | null
  all: boolean
  withReviews: boolean
  limit: number
  configPath: string
}

function parseArgs(argv: string[]): CliArgs {
  let metroKey: string | null = null
  let all = false
  let withReviews = false
  let limit = 500
  let configPath = resolve(process.cwd(), "data/metro-config.json")

  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === "--metro" && argv[i + 1]) {
      metroKey = argv[++i]
    } else if (argv[i] === "--all") {
      all = true
    } else if (argv[i] === "--with-reviews") {
      withReviews = true
    } else if (argv[i] === "--limit" && argv[i + 1]) {
      const parsed = parseInt(argv[++i], 10)
      if (isNaN(parsed) || parsed < 1) {
        console.error("Error: --limit must be a positive integer.")
        process.exit(1)
      }
      limit = parsed
    } else if (argv[i] === "--config" && argv[i + 1]) {
      configPath = argv[++i]
    }
  }

  if (!metroKey && !all) {
    console.error("Usage:")
    console.error("  Single metro:  npx tsx src/scripts/import-metro.ts --metro phoenix-az")
    console.error("  All metros:    npx tsx src/scripts/import-metro.ts --all")
    console.error("")
    console.error("Options:")
    console.error("  --metro <key>       Import a single metro by key (from metro-config.json)")
    console.error("  --all               Import all metros sequentially")
    console.error("  --with-reviews      Also fetch reviews for imported listings")
    console.error("  --limit <n>         Max results per query (default: 500)")
    console.error("  --config <path>     Path to metro config file (default: data/metro-config.json)")
    process.exit(1)
  }

  return { metroKey, all, withReviews, limit, configPath }
}

// ─── Config Loading ──────────────────────────────────────

function loadMetroConfig(configPath: string): MetroConfigFile {
  try {
    const raw = readFileSync(configPath, "utf-8")
    const config = JSON.parse(raw) as MetroConfigFile

    if (!config.metros || !Array.isArray(config.metros)) {
      console.error("Error: metro-config.json must have a 'metros' array.")
      process.exit(1)
    }

    return config
  } catch (err) {
    console.error(`Error reading metro config: ${err instanceof Error ? err.message : err}`)
    process.exit(1)
  }
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv)

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL environment variable is not set. Check your .env file.")
    process.exit(1)
  }

  if (!process.env.OUTSCRAPER_API_KEY) {
    console.error("Error: OUTSCRAPER_API_KEY environment variable is not set. Check your .env file.")
    process.exit(1)
  }

  const config = loadMetroConfig(args.configPath)

  // Determine which metros to import
  let metros: MetroConfig[]

  if (args.all) {
    metros = config.metros
    console.log(`\n🌎 Importing ALL ${metros.length} metros...\n`)
  } else {
    const metro = config.metros.find((m) => m.key === args.metroKey)
    if (!metro) {
      console.error(`Error: Metro "${args.metroKey}" not found in config.`)
      console.error(`Available metros: ${config.metros.map((m) => m.key).join(", ")}`)
      process.exit(1)
    }
    metros = [metro]
  }

  const prisma = createPrismaClient()
  const aggregateSummary = emptyImportSummary()
  const metroResults: { key: string; summary: ImportSummary }[] = []

  try {
    // Pre-load shared cache once to avoid re-querying per metro
    console.log("Loading existing data cache...")
    const cache = await initImportCache(prisma)
    console.log(`Cache loaded: ${cache.cityCache.size} cities, ${cache.existingPlaceIds.size} listings`)

    for (let i = 0; i < metros.length; i++) {
      const metro = metros[i]

      console.log(`\n${"─".repeat(50)}`)
      console.log(`📍 [${i + 1}/${metros.length}] ${metro.city}, ${metro.state} (${metro.key})`)
      console.log(`   Region: ${metro.region} | Tier: ${metro.tier}`)
      console.log(`   Queries: ${metro.searchQueries.length}`)
      console.log(`${"─".repeat(50)}`)

      const metroSummary = await runImport(prisma, {
        queries: metro.searchQueries,
        withReviews: args.withReviews,
        limit: args.limit,
      }, cache)

      printImportSummary(metroSummary, `${metro.city}, ${metro.state}`, args.withReviews)
      mergeImportSummaries(aggregateSummary, metroSummary)
      metroResults.push({ key: metro.key, summary: metroSummary })
    }

    // ── Aggregate Report ────────────────────────────────

    if (metros.length > 1) {
      console.log(`\n${"═".repeat(50)}`)
      console.log("  AGGREGATE RESULTS")
      console.log(`${"═".repeat(50)}`)

      for (const { key, summary } of metroResults) {
        const status = summary.listingsAdded > 0 ? "✅" : "⚠️"
        console.log(`  ${status} ${key}: +${summary.listingsAdded} new, ${summary.listingsUpdated} updated, ${summary.rejected} rejected`)
      }

      printImportSummary(aggregateSummary, "Aggregate Summary", args.withReviews)
    }

    await printDatabaseTotals(prisma)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error("Metro import failed:", e)
  process.exit(1)
})
