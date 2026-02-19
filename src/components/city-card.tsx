import Link from "next/link"

interface CityCardProps {
  name: string
  state: string
  slug: string
  companyCount: number
}

export default function CityCard({ name, state, slug, companyCount }: CityCardProps) {
  return (
    <Link
      href={`/${slug}`}
      aria-label={`View ${companyCount} attic cleaning companies in ${name}, ${state}`}
      className="flex min-h-[44px] flex-col rounded-lg border border-border bg-card p-4 font-sans shadow-card transition-all duration-200 hover:shadow-card-hover motion-safe:hover:-translate-y-1 hover:border-primary/60"
    >
      <span className="text-base font-semibold text-foreground">
        {name}, {state}
      </span>
      <span className="text-sm text-muted-foreground">
        {companyCount} {companyCount === 1 ? "company" : "companies"}
      </span>
    </Link>
  )
}
