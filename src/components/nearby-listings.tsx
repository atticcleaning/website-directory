"use client"

import { useEffect, useState } from "react"
import ListingCard from "@/components/listing-card"
import type { ListingResult, SearchResponse } from "@/types"

const GEO_STORAGE_KEY = "geo_location"
const GEO_CACHE_MS = 24 * 60 * 60 * 1000 // 24 hours

interface CachedGeo {
  lat: number
  lng: number
  timestamp: number
}

export default function NearbyListings() {
  const [listings, setListings] = useState<ListingResult[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem(GEO_STORAGE_KEY)
    if (!raw) {
      setLoading(false)
      return
    }

    let geo: CachedGeo
    try {
      geo = JSON.parse(raw)
    } catch {
      setLoading(false)
      return
    }

    if (!geo.lat || !geo.lng || Date.now() - geo.timestamp > GEO_CACHE_MS) {
      setLoading(false)
      return
    }

    fetch(`/api/search?lat=${geo.lat}&lng=${geo.lng}&sort=distance`)
      .then((r) => r.json())
      .then((data: SearchResponse) => {
        setListings(data.results.slice(0, 5))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // No cached location — render nothing, homepage shows static featured listings
  if (!loading && !listings) return null

  return (
    <section className="mt-10 md:mt-12 pt-8 md:pt-10 border-t border-border/50">
      <h2 className="font-sans text-xl font-bold text-foreground md:text-2xl">
        Top Services Near You
      </h2>
      {loading && (
        <p className="mt-4 font-sans text-sm text-muted-foreground">
          Finding services near you…
        </p>
      )}
      {listings && listings.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
      {listings && listings.length === 0 && (
        <p className="mt-4 font-sans text-sm text-muted-foreground">
          No services found nearby. Try searching a specific city.
        </p>
      )}
    </section>
  )
}
