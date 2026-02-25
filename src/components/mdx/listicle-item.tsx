import Link from "next/link"
import Image from "next/image"
import { Phone, ExternalLink } from "lucide-react"
import prisma from "@/lib/prisma"
import StarRating from "@/components/star-rating"
import ServiceTagChip from "@/components/service-tag-chip"

interface ListicleItemProps {
  rank: number
  citySlug: string
  companySlug: string
}

export default async function ListicleItem({
  rank,
  citySlug,
  companySlug,
}: ListicleItemProps) {
  const listing = await prisma.listing.findFirst({
    where: {
      slug: companySlug,
      city: { slug: citySlug },
    },
    include: {
      city: true,
      serviceTags: true,
      photos: { where: { isPrimary: true }, take: 1 },
      reviews: {
        where: { text: { not: null } },
        orderBy: { rating: "desc" },
        take: 1,
      },
    },
  })

  if (!listing) return null

  const photo = listing.photos[0]
  const topReview = listing.reviews[0]

  return (
    <div className="my-6 rounded-lg border border-border bg-card p-4 shadow-card md:p-5">
      <div className="flex gap-4">
        {/* Rank Badge */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent font-sans text-lg font-bold text-accent-foreground">
          {rank}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Company Name */}
          <Link
            href={`/${citySlug}/${companySlug}`}
            className="font-sans text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200 md:text-xl"
          >
            {listing.name}
          </Link>

          {/* Rating */}
          <div className="mt-1">
            <StarRating
              rating={listing.starRating}
              reviewCount={listing.reviewCount}
              variant="full"
            />
          </div>

          {/* Service Tags */}
          {listing.serviceTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {listing.serviceTags.map((tag) => (
                <ServiceTagChip
                  key={tag.id}
                  serviceType={tag.serviceType}
                  variant="card"
                />
              ))}
            </div>
          )}

          {/* Address */}
          <p className="mt-2 font-sans text-sm text-muted-foreground">
            {listing.address}
          </p>

          {/* Contact Links */}
          <div className="mt-2 flex flex-wrap items-center gap-4">
            {listing.phone && (
              <a
                href={`tel:${listing.phone.replace(/[^\d+]/g, "")}`}
                aria-label={`Call ${listing.name}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-sm font-medium text-primary hover:underline transition-colors duration-200"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {listing.phone}
              </a>
            )}
            {listing.website && (
              <a
                href={listing.website}
                target="_blank"
                rel="noopener"
                aria-label={`Visit ${listing.name} website`}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-sans text-sm font-medium text-primary hover:underline transition-colors duration-200"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Visit Website
              </a>
            )}
          </div>
        </div>

        {/* Photo Thumbnail */}
        {photo && (
          <div className="hidden shrink-0 md:block">
            <Image
              src={photo.url}
              alt={`${listing.name} in ${listing.city.name}, ${listing.city.state}`}
              width={120}
              height={120}
              className="rounded-lg object-cover"
              sizes="120px"
            />
          </div>
        )}
      </div>

      {/* Top Review */}
      {topReview?.text && (
        <blockquote className="mt-3 border-l-4 border-primary/30 pl-3">
          <p className="font-serif text-sm italic leading-relaxed text-muted-foreground line-clamp-3">
            &ldquo;{topReview.text}&rdquo;
          </p>
          <cite className="mt-1 block font-sans text-xs font-medium not-italic text-muted-foreground">
            — {topReview.authorName}
          </cite>
        </blockquote>
      )}
    </div>
  )
}
