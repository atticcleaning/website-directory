import type { Metadata } from "next"
import SearchBar from "@/components/search-bar"
import CityCard from "@/components/city-card"
import ArticleCard from "@/components/article-card"
import prisma from "@/lib/prisma"
import { getAllArticles } from "@/lib/mdx"
import { buildMetadata } from "@/lib/seo"

// Dynamic page — city data served fresh per request.
// Can be cached at CDN layer (Cloudflare) in production.
export const dynamic = "force-dynamic"

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "AtticCleaning.com - Find Top-Rated Attic Cleaning Companies",
    description:
      "Search and compare attic cleaning specialists near you. Browse ratings, reviews, and service tags for insulation removal, rodent cleanup, decontamination, and more.",
    path: "/",
  })
}

export default async function HomePage() {
  let articles: ReturnType<typeof getAllArticles> = []
  try {
    articles = getAllArticles()
  } catch {
    // Malformed MDX frontmatter — don't crash the homepage
  }
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

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <h1 className="font-display text-[1.75rem] font-medium leading-[1.2] text-foreground md:text-[2.5rem]">
          Find trusted attic cleaning professionals near you
        </h1>
        <div className="mt-6 w-full max-w-2xl">
          <SearchBar variant="hero" />
        </div>
      </section>

      {/* Featured Cities */}
      {cities.length > 0 && (
        <section className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
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
      )}

      {/* Educational Content */}
      {articles.length > 0 && (
        <section className="mt-8">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
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
      )}
    </div>
  )
}
