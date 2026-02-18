import prisma from "@/lib/prisma"

export default async function CityStats({ city }: { city: string }) {
  const cityData = await prisma.city.findUnique({
    where: { slug: city },
    include: {
      _count: { select: { listings: true } },
      listings: { select: { starRating: true } },
    },
  })

  if (!cityData || cityData._count.listings === 0) return null

  const avgRating = (
    cityData.listings.reduce((sum, l) => sum + l.starRating, 0) /
    cityData.listings.length
  ).toFixed(1)

  return (
    <span className="font-sans text-sm font-medium">
      There are {cityData._count.listings} attic cleaning{" "}
      {cityData._count.listings === 1 ? "company" : "companies"} in{" "}
      {cityData.name} with an average rating of {avgRating} stars.
    </span>
  )
}
