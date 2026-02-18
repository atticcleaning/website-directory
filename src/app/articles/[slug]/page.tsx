import { cache } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticleSlugs, getArticleBySlug, getAllArticles } from "@/lib/mdx"
import ArticleCard from "@/components/article-card"
import { buildMetadata } from "@/lib/seo"

const getCachedArticle = cache(async function getCachedArticle(slug: string) {
  return getArticleBySlug(slug)
})

export const dynamicParams = false

export function generateStaticParams() {
  return getArticleSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getCachedArticle(slug)

  if (!article) {
    return { title: "Article Not Found | AtticCleaning.com", robots: { index: false } }
  }

  return buildMetadata({
    title: `${article.frontmatter.title} | AtticCleaning.com`,
    description: article.frontmatter.excerpt,
    path: `/articles/${slug}`,
  })
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateStr))
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await getCachedArticle(slug)

  if (!article) {
    notFound()
  }

  const { frontmatter, content } = article

  const allArticles = getAllArticles()
  const sameTopicArticles = allArticles.filter(
    (a) => a.topicTag === frontmatter.topicTag && a.slug !== frontmatter.slug
  )
  const relatedArticles =
    sameTopicArticles.length >= 2
      ? sameTopicArticles.slice(0, 3)
      : allArticles
          .filter((a) => a.slug !== frontmatter.slug)
          .slice(0, 3)

  return (
    <div className="mx-auto max-w-[680px] py-6 md:py-8">
      {/* Topic Tag */}
      <span className="inline-flex items-center bg-secondary rounded-full px-2.5 py-0.5 font-sans text-xs font-medium uppercase text-muted-foreground">
        {frontmatter.topicTag}
      </span>

      {/* Article Title */}
      <h1 className="mt-2 font-sans text-2xl font-bold text-foreground md:text-[2rem]">
        {frontmatter.title}
      </h1>

      {/* Published Date */}
      <time
        dateTime={frontmatter.publishedAt}
        className="mt-2 block font-sans text-sm text-muted-foreground"
      >
        {formatDate(frontmatter.publishedAt)}
      </time>

      {/* Article Content */}
      <article className="prose mt-8">{content}</article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-10 md:mt-12">
          <h2 className="font-sans text-xl font-semibold text-foreground md:text-2xl">
            Related Articles
          </h2>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((related) => (
              <ArticleCard
                key={related.slug}
                title={related.title}
                excerpt={related.excerpt}
                topicTag={related.topicTag}
                slug={related.slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
