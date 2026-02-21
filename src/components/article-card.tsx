import Link from "next/link"
import Image from "next/image"

interface ArticleCardProps {
  title: string
  excerpt: string
  topicTag: string
  slug: string
  heroImage?: string
}

export default function ArticleCard({ title, excerpt, topicTag, slug, heroImage }: ArticleCardProps) {
  return (
    <Link
      href={`/articles/${slug}`}
      className="block min-h-[44px] rounded-lg border border-border bg-card shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary/60 overflow-hidden"
    >
      {heroImage && (
        <Image
          src={heroImage}
          alt={title}
          width={600}
          height={338}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="p-4">
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
    </Link>
  )
}
