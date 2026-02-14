import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"

export interface ArticleFrontmatter {
  title: string
  slug: string
  excerpt: string
  topicTag: string
  publishedAt: string
  relatedCities: string[]
}

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles")

export function getArticleSlugs(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""))
}

export async function getArticleBySlug(slug: string) {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const rawContent = fs.readFileSync(filePath, "utf-8")

  const { content, frontmatter } = await compileMDX<ArticleFrontmatter>({
    source: rawContent,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return { content, frontmatter }
}

export function getAllArticles(): ArticleFrontmatter[] {
  const slugs = getArticleSlugs()
  const articles = slugs.map((slug) => {
    const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
    const rawContent = fs.readFileSync(filePath, "utf-8")
    const { data } = matter(rawContent)
    const fm = data as ArticleFrontmatter
    if (!fm.title || !fm.slug || !fm.publishedAt) {
      throw new Error(`Invalid frontmatter in ${slug}.mdx: missing required fields`)
    }
    return fm
  })

  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}
