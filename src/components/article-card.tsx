interface ArticleCardProps {
  title: string
  excerpt: string
  topicTag: string
  slug: string
}

export default function ArticleCard({ title, excerpt, topicTag }: ArticleCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="font-sans text-xs font-medium uppercase text-muted-foreground">
        {topicTag}
      </span>
      <p className="mt-1 font-sans text-base font-semibold text-foreground">
        {title}
      </p>
      <p className="mt-1 font-serif text-sm text-muted-foreground line-clamp-2">
        {excerpt}
      </p>
    </div>
  )
}
