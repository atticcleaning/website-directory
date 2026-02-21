import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import CityCard from "@/components/city-card"
import ListingCard from "@/components/listing-card"
import ArticleCard from "@/components/article-card"
import prisma from "@/lib/prisma"
import { getAllArticles } from "@/lib/mdx"
import { buildMetadata } from "@/lib/seo"
import type { ListingResult } from "@/types"

// Revalidate hourly — homepage data only changes on build/import
export const revalidate = 3600

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "AtticCleaning.com - Find Top-Rated Attic Cleaning Companies",
    description:
      "Search and compare attic cleaning specialists near you. Browse ratings, reviews, and service tags for insulation removal, rodent cleanup, decontamination, and more.",
    path: "/",
  })
}

async function FeaturedCities() {
  const cities = await prisma.city.findMany({
    select: {
      name: true,
      state: true,
      slug: true,
      _count: {
        select: { listings: true },
      },
    },
    orderBy: {
      listings: {
        _count: "desc",
      },
    },
    take: 8,
  })

  if (cities.length === 0) return null

  return (
    <section className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50">
      <h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
        Featured Cities
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {cities.map((city) => (
          <CityCard
            key={city.slug}
            name={city.name}
            state={city.state}
            slug={city.slug}
            companyCount={city._count.listings}
          />
        ))}
      </div>
    </section>
  )
}

async function FeaturedListings() {
  const listings = await prisma.listing.findMany({
    orderBy: [{ starRating: "desc" }, { reviewCount: "desc" }],
    take: 4,
    include: {
      serviceTags: true,
      photos: { where: { isPrimary: true }, take: 1 },
      city: { select: { slug: true } },
    },
  })

  if (listings.length === 0) return null

  const results: ListingResult[] = listings.map((listing) => ({
    id: listing.id,
    name: listing.name,
    starRating: listing.starRating,
    reviewCount: listing.reviewCount,
    phone: listing.phone,
    website: listing.website,
    address: listing.address,
    distanceMiles: null,
    serviceTags: listing.serviceTags.map((t) => t.serviceType),
    reviewSnippet: null,
    citySlug: listing.city.slug,
    companySlug: listing.slug,
    primaryPhotoUrl: listing.photos[0]?.url ?? null,
  }))

  return (
    <section className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50">
      <h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
        Featured Attic Cleaning Services
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {results.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </section>
  )
}

function EducationalContent() {
  let articles: ReturnType<typeof getAllArticles> = []
  try {
    articles = getAllArticles()
  } catch {
    // Malformed MDX frontmatter — don't crash the homepage
  }

  if (articles.length === 0) return null

  return (
    <section className="mt-10 md:mt-12">
      <h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
        Learn About Attic Cleaning
      </h2>
      <p className="mt-2 font-serif text-sm text-muted-foreground">
        Explore our guides to help you make informed decisions about attic
        cleaning services.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <ArticleCard
            key={article.slug}
            title={article.title}
            excerpt={article.excerpt}
            topicTag={article.topicTag}
            slug={article.slug}
          />
        ))}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center rounded-xl px-6 py-24 min-h-[420px] md:py-28 md:min-h-[400px]">
        <Image
          src="/images/professional-attic-cleaning-insulation-removal-service.webp"
          alt="Professional attic cleaning technician in protective gear vacuuming old insulation and installing fresh fiberglass insulation in residential attic"
          fill
          priority
          fetchPriority="high"
          className="object-cover"
          sizes="(max-width: 1248px) 100vw, 1200px"
          quality={60}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" aria-hidden="true" />
        <h1 className="relative font-display text-[1.75rem] font-medium leading-[1.2] text-white md:text-[2.5rem] drop-shadow-lg">
          Find trusted attic cleaning professionals near you
        </h1>
        <div className="relative mt-6 w-full max-w-2xl">
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* Featured Listings */}
      <Suspense>
        <FeaturedListings />
      </Suspense>

      {/* Featured Cities */}
      <Suspense>
        <FeaturedCities />
      </Suspense>

      {/* Educational Content */}
      <Suspense>
        <EducationalContent />
      </Suspense>
    </div>
  )
}
