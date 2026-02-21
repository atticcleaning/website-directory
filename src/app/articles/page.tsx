import type { Metadata } from "next"
import Image from "next/image"
import ArticleCard from "@/components/article-card"
import { getAllArticles } from "@/lib/mdx"
import { buildMetadata } from "@/lib/seo"

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Attic Cleaning Articles & Guides | AtticCleaning.com",
    description:
      "Expert guides on attic cleaning, insulation removal, rodent cleanup, mold remediation, and more. Learn how to maintain your attic and choose the right professionals.",
    path: "/articles",
  })
}

// Display order for topic tags
const TOPIC_ORDER = [
  "Service Guide",
  "Cost Guide",
  "Hiring Guide",
  "DIY vs Professional",
  "Homeowner Guide",
  "Maintenance",
  "Seasonal",
  "Regional",
]

export default function ArticlesPage() {
  const articles = getAllArticles()

  // Group articles by topic tag
  const grouped = new Map<string, typeof articles>()
  for (const tag of TOPIC_ORDER) {
    const matching = articles.filter((a) => a.topicTag === tag)
    if (matching.length > 0) grouped.set(tag, matching)
  }

  // Featured article — most recent
  const featured = articles[0]
  const remaining = articles.slice(1)

  return (
    <div className="py-8 md:py-12">
      {/* Page Header */}
      <header>
        <h1 className="font-sans text-2xl font-bold text-foreground md:text-[2rem]">
          Attic Cleaning Guides
        </h1>
        <p className="mt-2 max-w-2xl font-serif text-base text-muted-foreground">
          Expert advice on insulation, rodent cleanup, mold remediation, and
          everything else you need to know about maintaining a healthy attic.
        </p>
        <p className="mt-3 font-sans text-sm text-muted-foreground">
          {articles.length} articles across {grouped.size} topics
        </p>
      </header>

      {/* Featured Article */}
      {featured && (
        <section className="mt-8">
          <FeaturedArticle article={featured} />
        </section>
      )}

      {/* Articles by Topic */}
      {Array.from(grouped.entries()).map(([tag, tagArticles]) => (
        <section
          key={tag}
          className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50"
        >
          <div className="flex items-baseline justify-between">
            <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
              {tag}
            </h2>
            <span className="font-sans text-sm text-muted-foreground">
              {tagArticles.length}{" "}
              {tagArticles.length === 1 ? "article" : "articles"}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tagArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                topicTag={article.topicTag}
                slug={article.slug}
                heroImage={article.heroImage}
              />
            ))}
          </div>
        </section>
      ))}

      {/* All Articles — flat grid for browsing */}
      <section className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50">
        <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
          All Articles
        </h2>
        <p className="mt-2 font-serif text-sm text-muted-foreground">
          Browse our complete library, sorted by most recent.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {remaining.map((article) => (
            <ArticleCard
              key={article.slug}
              title={article.title}
              excerpt={article.excerpt}
              topicTag={article.topicTag}
              slug={article.slug}
              heroImage={article.heroImage}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

function FeaturedArticle({
  article,
}: {
  article: ReturnType<typeof getAllArticles>[number]
}) {
  return (
    <a
      href={`/articles/${article.slug}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-primary/60 md:grid md:grid-cols-2 md:gap-0"
    >
      {article.heroImage && (
        <div className="relative aspect-video md:aspect-auto md:h-full">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col justify-center p-6 md:p-8">
        <span className="font-sans text-xs font-medium uppercase text-muted-foreground">
          {article.topicTag}
        </span>
        <h3 className="mt-2 font-sans text-xl font-semibold text-foreground md:text-2xl">
          {article.title}
        </h3>
        <p className="mt-2 font-serif text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {article.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center font-sans text-sm font-medium text-primary group-hover:underline">
          Read article
          <svg
            className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </a>
  )
}
