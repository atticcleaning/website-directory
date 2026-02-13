interface StarRatingProps {
  rating: number
  reviewCount: number
  variant: "compact" | "full"
}

const STAR_PATH = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"

export default function StarRating({ rating, reviewCount, variant }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasPartialStar = rating % 1 >= 0.25
  const emptyStars = 5 - fullStars - (hasPartialStar ? 1 : 0)

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rated ${rating} out of 5${reviewCount > 0 ? ` based on ${reviewCount} reviews` : ""}`}
    >
      {Array.from({ length: fullStars }, (_, i) => (
        <svg
          key={`full-${i}`}
          aria-hidden="true"
          className="h-4 w-4 text-accent"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      {hasPartialStar && (
        <svg
          key="partial"
          aria-hidden="true"
          className="h-4 w-4 text-accent opacity-50"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
      )}
      {Array.from({ length: emptyStars }, (_, i) => (
        <svg
          key={`empty-${i}`}
          aria-hidden="true"
          className="h-4 w-4 text-muted-foreground/20"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      <span className="font-sans text-sm font-medium text-foreground">{rating}</span>
      {reviewCount > 0 && (
        <span className="font-sans text-sm text-muted-foreground">
          {variant === "compact" ? `(${reviewCount})` : `(${reviewCount} reviews)`}
        </span>
      )}
    </div>
  )
}
