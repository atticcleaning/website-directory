import SearchBar from "@/components/search-bar"
import CityCard from "@/components/city-card"
import ArticleCard from "@/components/article-card"
import prisma from "@/lib/prisma"

// SSG not possible — database connection requires runtime (SSL cert at build time fails).
// Page renders dynamically per request. Can be cached at CDN layer (Cloudflare) in production.
export const dynamic = "force-dynamic"

const PLACEHOLDER_ARTICLES = [
  {
    title: "What to Expect from an Attic Cleaning Service",
    excerpt:
      "A comprehensive guide to understanding the attic cleaning process, from initial inspection to final cleanup.",
    topicTag: "Getting Started",
    slug: "what-to-expect",
  },
  {
    title: "Signs Your Attic Needs Professional Cleaning",
    excerpt:
      "Learn the warning signs that indicate your attic may need professional attention, including pest evidence and insulation issues.",
    topicTag: "Maintenance",
    slug: "signs-attic-needs-cleaning",
  },
  {
    title: "How to Choose the Right Attic Cleaning Company",
    excerpt:
      "Tips for evaluating and selecting a reputable attic cleaning service, including what questions to ask and certifications to look for.",
    topicTag: "Hiring Guide",
    slug: "choosing-attic-cleaning-company",
  },
]

export default async function HomePage() {
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
      <section className="mt-8">
        <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
          Learn About Attic Cleaning
        </h2>
        <p className="mt-2 font-serif text-sm text-muted-foreground">
          Explore our guides to help you make informed decisions about attic
          cleaning services.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_ARTICLES.map((article) => (
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
    </div>
  )
}
