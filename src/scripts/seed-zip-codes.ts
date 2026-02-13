import "dotenv/config"
import { readFileSync } from "fs"
import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// DO Managed PostgreSQL uses a certificate not in the default trust chain.
// Safe for local admin CLI scripts — not used in production server code.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set. Check your .env file.")
  process.exit(1)
}

const BATCH_SIZE = 1000

const VALID_STATES = new Set([
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
  "DC",
])

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  const prisma = new PrismaClient({ adapter })

  try {
    const raw = readFileSync("data/US.txt", "utf-8")
    const lines = raw.split("\n").filter((line) => line.trim() !== "")

    console.log(`Total lines read: ${lines.length}`)

    const seen = new Set<string>()
    const records: { code: string; city: string; state: string; latitude: number; longitude: number }[] = []
    let territoryFiltered = 0
    let malformed = 0

    for (const line of lines) {
      const cols = line.split("\t")

      if (cols.length < 11) {
        malformed++
        continue
      }

      const postalCode = cols[1]
      const placeName = cols[2]
      const stateCode = cols[4]
      const lat = parseFloat(cols[9])
      const lng = parseFloat(cols[10])

      if (!VALID_STATES.has(stateCode)) {
        territoryFiltered++
        continue
      }

      if (isNaN(lat) || isNaN(lng)) {
        malformed++
        continue
      }

      if (seen.has(postalCode)) {
        continue
      }

      seen.add(postalCode)
      records.push({
        code: postalCode,
        city: placeName,
        state: stateCode,
        latitude: lat,
        longitude: lng,
      })
    }

    console.log(`Territory records filtered: ${territoryFiltered}`)
    console.log(`Malformed lines skipped: ${malformed}`)
    console.log(`Unique zip codes (50 states + DC): ${records.length}`)

    let totalInserted = 0

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE)
      const result = await prisma.zipCode.createMany({
        data: batch,
        skipDuplicates: true,
      })
      totalInserted += result.count
    }

    const totalSkipped = records.length - totalInserted

    console.log(`\nSummary:`)
    console.log(`  Records inserted: ${totalInserted}`)
    console.log(`  Records skipped (already existed): ${totalSkipped}`)
    console.log(`  Total unique zip codes: ${records.length}`)

    // Verify specific zip code
    const phoenix = await prisma.zipCode.findUnique({ where: { code: "85001" } })
    if (phoenix) {
      console.log(`\nVerification: 85001 → ${phoenix.city}, ${phoenix.state} (${phoenix.latitude}, ${phoenix.longitude})`)
    } else {
      console.warn("\nWarning: Zip code 85001 not found after seeding")
    }
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error("Seed failed:", e)
  process.exit(1)
})
