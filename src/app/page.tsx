import type { Metadata } from "next"
import { Suspense } from "react"
import SearchBar from "@/components/search-bar"
import CityCard from "@/components/city-card"
import ArticleCard from "@/components/article-card"
import prisma from "@/lib/prisma"
import { getAllArticles } from "@/lib/mdx"
import { buildMetadata } from "@/lib/seo"

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
      <section className="relative overflow-hidden flex flex-col items-center text-center rounded-xl bg-gradient-to-br from-secondary via-secondary to-[oklch(0.955_0.008_90)] px-6 py-10 md:py-14">
        <div className="pointer-events-none absolute -z-10 -right-20 -top-20 h-64 w-64 rounded-full bg-primary/[0.06] blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -z-10 -left-16 -bottom-16 h-48 w-48 rounded-full bg-accent/[0.07] blur-3xl" aria-hidden="true" />
        <h1 className="font-display text-[1.75rem] font-medium leading-[1.2] text-foreground md:text-[2.5rem]">
          Find trusted attic cleaning professionals near you
        </h1>
        <div className="mt-6 w-full max-w-2xl">
          <SearchBar variant="hero" />
        </div>
      </section>

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
