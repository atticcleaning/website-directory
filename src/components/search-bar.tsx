"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, MapPin, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const GEO_STORAGE_KEY = "geo_location"
const GEO_CACHE_MS = 24 * 60 * 60 * 1000 // 24 hours

interface SearchBarProps {
  variant: "hero" | "header"
  defaultValue?: string
}

export default function SearchBar({ variant, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [geoState, setGeoState] = useState<"idle" | "loading" | "error">("idle")
  const router = useRouter()
  const inputId = variant === "hero" ? "search-hero" : "search-header"
  const isHero = variant === "hero"

  function handleUseLocation() {
    if (!navigator.geolocation) {
      setGeoState("error")
      setTimeout(() => setGeoState("idle"), 3000)
      return
    }
    setGeoState("loading")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        localStorage.setItem(
          GEO_STORAGE_KEY,
          JSON.stringify({ lat: latitude, lng: longitude, timestamp: Date.now() })
        )
        setGeoState("idle")
        router.push(`/search?lat=${latitude}&lng=${longitude}`)
      },
      () => {
        setGeoState("error")
        setTimeout(() => setGeoState("idle"), 3000)
      },
      { timeout: 10000 }
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // If query contains "near me" and we have cached geolocation, redirect with coords
    if (/\bnear\s+me\b/i.test(query)) {
      const raw = localStorage.getItem(GEO_STORAGE_KEY)
      if (raw) {
        try {
          const geo = JSON.parse(raw)
          if (
            geo.lat &&
            geo.lng &&
            Date.now() - geo.timestamp < GEO_CACHE_MS
          ) {
            e.preventDefault()
            const cleaned = query.replace(/\b(near|close\s+to|around)\s+me\b/gi, "").trim()
            const params = new URLSearchParams({ lat: geo.lat, lng: geo.lng })
            if (cleaned) params.set("q", cleaned)
            router.push(`/search?${params}`)
            return
          }
        } catch {
          // ignore parse errors, fall through to normal submit
        }
      }
    }
  }

  const locationTitle =
    geoState === "loading"
      ? "Detecting location…"
      : geoState === "error"
      ? "Location unavailable"
      : "Use my location"

  return (
    <form
      role="search"
      action="/search"
      onSubmit={handleSubmit}
      className={cn("flex w-full", isHero && "max-w-2xl")}
    >
      <label htmlFor={inputId} className="sr-only">
        Search for attic cleaning companies by city or zip code
      </label>
      <div className="relative flex w-full">
        <Search
          className={cn(
            "absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none",
            isHero ? "left-3.5 h-5 w-5" : "left-3 h-4 w-4"
          )}
          aria-hidden="true"
        />
        <input
          type="search"
          id={inputId}
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search for attic cleaning companies by city or zip code"
          placeholder="Search by city, zip code, or company name"
          className={cn(
            "w-full rounded-l-md border border-r-0 border-border bg-background font-sans text-foreground placeholder:text-muted-foreground",
            isHero
              ? "h-11 pl-11 pr-4 text-base shadow-[inset_0_2px_4px_0_oklch(0.85_0.005_100_/_0.15)]"
              : "h-11 pl-9 pr-3 text-sm"
          )}
        />
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={geoState === "loading"}
          title={locationTitle}
          aria-label={locationTitle}
          className={cn(
            "flex shrink-0 items-center justify-center border border-r-0 border-border bg-background text-muted-foreground transition-colors duration-200 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60",
            geoState === "error" && "text-destructive",
            isHero ? "h-11 w-10" : "h-11 w-9"
          )}
        >
          {geoState === "loading" ? (
            <Loader2 className={cn("animate-spin", isHero ? "h-4 w-4" : "h-4 w-4")} aria-hidden="true" />
          ) : (
            <MapPin className={cn(isHero ? "h-4 w-4" : "h-[14px] w-[14px]")} aria-hidden="true" />
          )}
        </button>
        <button
          type="submit"
          disabled={!query.trim() && geoState !== "loading"}
          className={cn(
            "shrink-0 rounded-r-md font-sans font-semibold text-primary-foreground transition-all duration-200 hover:brightness-90 disabled:opacity-50 disabled:cursor-not-allowed",
            isHero
              ? "h-12 px-6 text-base bg-gradient-to-b from-primary to-[oklch(0.50_0.215_264)]"
              : "h-11 px-3 text-sm bg-primary"
          )}
        >
          Search
        </button>
      </div>
    </form>
  )
}
