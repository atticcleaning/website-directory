import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Strip sslmode from connection string — pg driver maps "require" to "verify-full"
// which rejects Digital Ocean's self-signed cert. We set SSL explicitly instead.
const dbUrl = new URL(process.env.DATABASE_URL!)
dbUrl.searchParams.delete("sslmode")

const adapter = new PrismaPg({
  connectionString: dbUrl.toString(),
  ssl: { rejectUnauthorized: false },
  max: 3,
})

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
