import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"
import { getAllArticles } from "@/lib/mdx"
import { BASE_URL } from "@/lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, listings] = await Promise.all([
    prisma.city.findMany({ select: { slug: true, createdAt: true } }),
    prisma.listing.findMany({
      select: { slug: true, updatedAt: true, city: { select: { slug: true } } },
    }),
  ])

  let articles: ReturnType<typeof getAllArticles> = []
  try {
    articles = getAllArticles()
  } catch {
    // Malformed MDX frontmatter — don't crash sitemap generation
  }

  const cityEntries: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/${city.slug}`,
    lastModified: city.createdAt,
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const listingEntries: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${BASE_URL}/${listing.city.slug}/${listing.slug}`,
    lastModified: listing.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${BASE_URL}/articles/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...cityEntries,
    ...listingEntries,
    ...articleEntries,
  ]
}
