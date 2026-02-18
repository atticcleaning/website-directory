import { Info } from "lucide-react"

interface RadiusInfoProps {
  radiusMiles: number
  location: { city: string; state: string } | null
}

export default function RadiusInfo({ radiusMiles, location }: RadiusInfoProps) {
  if (!location) return null

  return (
    <p className="inline-flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
      <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
      Showing results within {radiusMiles} miles of {location.city}, {location.state}
    </p>
  )
}
