import { cache } from "react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getArticleSlugs, getArticleBySlug } from "@/lib/mdx"

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
    return { title: "Article Not Found | AtticCleaning.com" }
  }

  return {
    title: `${article.frontmatter.title} | AtticCleaning.com`,
    description: article.frontmatter.excerpt,
  }
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

  return (
    <div className="mx-auto max-w-[680px] py-6 md:py-8">
      {/* Topic Tag */}
      <span className="font-sans text-xs font-medium uppercase text-muted-foreground">
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
    </div>
  )
}
