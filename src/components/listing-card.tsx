import Link from "next/link"
import Image from "next/image"
import { Phone, ExternalLink } from "lucide-react"
import StarRating from "@/components/star-rating"
import ServiceTagChip from "@/components/service-tag-chip"
import type { ListingResult } from "@/types"

interface ListingCardProps {
  listing: ListingResult
}

export default function ListingCard({ listing }: ListingCardProps) {
  const hasContact = listing.phone || listing.website
  const roundedDistance = listing.distanceMiles !== null ? Math.round(listing.distanceMiles) : null
  const distanceText = roundedDistance !== null
    ? `${roundedDistance} ${roundedDistance === 1 ? "mile" : "miles"} away`
    : null

  return (
    <article className="rounded-lg border border-border bg-card p-4 md:p-5 shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1">
      <div className={listing.primaryPhotoUrl ? "flex gap-3" : undefined}>
        {listing.primaryPhotoUrl && (
          <Image
            src={listing.primaryPhotoUrl}
            alt={`${listing.name} — attic cleaning services`}
            width={96}
            height={96}
            loading="lazy"
            sizes="96px"
            className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-24 md:w-24"
          />
        )}
        <div className={listing.primaryPhotoUrl ? "min-w-0" : undefined}>
          <Link
            href={`/${listing.citySlug}/${listing.companySlug}`}
            className="inline-flex min-h-[44px] items-center font-sans text-lg font-semibold leading-snug text-foreground hover:text-primary transition-colors duration-200"
          >
            {listing.name}
          </Link>
          <div className="mt-1">
            <StarRating
              rating={listing.starRating}
              reviewCount={listing.reviewCount}
              variant="compact"
            />
          </div>
          {listing.serviceTags.length > 0 && (
            <div className="mt-2 flex gap-1.5 overflow-x-auto md:flex-wrap">
              {listing.serviceTags.map((tag) => (
                <ServiceTagChip key={tag} serviceType={tag} variant="card" />
              ))}
            </div>
          )}
        </div>
      </div>

      {listing.reviewSnippet && (
        <p className="mt-2 font-serif text-sm italic text-muted-foreground/90 line-clamp-2">
          {listing.reviewSnippet}
        </p>
      )}

      {distanceText && (
        <p className="mt-1 font-sans text-[13px] font-medium text-muted-foreground">
          {distanceText}
        </p>
      )}

      {hasContact && (
        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3">
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
      )}
    </article>
  )
}
