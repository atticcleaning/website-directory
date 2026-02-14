import { PrismaClient } from "../app/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  // Strip sslmode from connection string — pg driver maps "require" to "verify-full"
  // which rejects Digital Ocean's self-signed cert. We set SSL explicitly instead.
  const dbUrl = new URL(process.env.DATABASE_URL!)
  dbUrl.searchParams.delete("sslmode")

  const adapter = new PrismaPg({
    connectionString: dbUrl.toString(),
    ssl: { rejectUnauthorized: false },
    max: 3,
  })

  const client = new PrismaClient({ adapter })
  globalForPrisma.prisma = client

  return client
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return Reflect.get(getPrismaClient(), prop)
  },
})

export default prisma
