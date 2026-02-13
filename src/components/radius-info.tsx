interface RadiusInfoProps {
  radiusMiles: number
  location: { city: string; state: string } | null
}

export default function RadiusInfo({ radiusMiles, location }: RadiusInfoProps) {
  if (!location) return null

  return (
    <p className="font-sans text-sm text-muted-foreground">
      Showing results within {radiusMiles} miles of {location.city}, {location.state}
    </p>
  )
}
