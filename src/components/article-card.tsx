import Link from "next/link"

interface ArticleCardProps {
  title: string
  excerpt: string
  topicTag: string
  slug: string
}

export default function ArticleCard({ title, excerpt, topicTag, slug }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="block min-h-[44px] rounded-lg border border-border bg-card p-4 shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary"
    >
      <span className="font-sans text-xs font-medium uppercase text-muted-foreground">
        {topicTag}
      </span>
      <p className="mt-1 font-sans text-base font-semibold text-foreground">
        {title}
      </p>
      <p className="mt-1 font-serif text-sm text-muted-foreground line-clamp-2">
        {excerpt}
      </p>
    </Link>
  )
}
