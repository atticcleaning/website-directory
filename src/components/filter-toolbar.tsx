"use client"

import { useState, useMemo } from "react"
import { SERVICE_TAG_CONFIG } from "@/components/service-tag-chip"
import ListingCard from "@/components/listing-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ListingResult } from "@/types"
import { ServiceType } from "@/types"

interface FilterToolbarProps {
  results: ListingResult[]
}

type SortOption = "rating" | "reviews" | "distance"

const SERVICE_TYPES = Object.keys(SERVICE_TAG_CONFIG) as ServiceType[]

export default function FilterToolbar({ results }: FilterToolbarProps) {
  const [activeFilters, setActiveFilters] = useState<Set<ServiceType>>(new Set())
  const [sortBy, setSortBy] = useState<SortOption>("rating")

  function toggleFilter(serviceType: ServiceType) {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(serviceType)) {
        next.delete(serviceType)
      } else {
        next.add(serviceType)
      }
      return next
    })
  }

  function clearFilters() {
    setActiveFilters(new Set())
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = results
    if (activeFilters.size > 0) {
      filtered = results.filter((listing) =>
        listing.serviceTags.some((tag) => activeFilters.has(tag))
      )
    }

    const sorted = [...filtered]
    if (sortBy === "rating") {
      sorted.sort((a, b) => b.starRating - a.starRating || b.reviewCount - a.reviewCount)
    } else if (sortBy === "reviews") {
      sorted.sort((a, b) => b.reviewCount - a.reviewCount || b.starRating - a.starRating)
    } else if (sortBy === "distance") {
      sorted.sort((a, b) => {
        if (a.distanceMiles === null && b.distanceMiles === null) return 0
        if (a.distanceMiles === null) return 1
        if (b.distanceMiles === null) return -1
        return a.distanceMiles - b.distanceMiles
      })
    }

    return sorted
  }, [results, activeFilters, sortBy])

  return (
    <div>
      {/* Toolbar: chips + sort */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Filter by service type">
          <button
            type="button"
            aria-pressed={activeFilters.size === 0}
            onClick={clearFilters}
            className={cn(
              "shrink-0 rounded-full px-3 min-h-[44px] font-sans text-sm font-medium transition-colors duration-200",
              activeFilters.size === 0
                ? "bg-primary text-primary-foreground border border-primary shadow-sm"
                : "bg-transparent text-foreground border border-border hover:bg-muted"
            )}
          >
            All Services
          </button>
          {SERVICE_TYPES.map((type) => {
            const isActive = activeFilters.has(type)
            return (
              <button
                key={type}
                type="button"
                aria-pressed={isActive}
                onClick={() => toggleFilter(type)}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-full px-3 min-h-[44px] font-sans text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground border border-primary shadow-sm"
                    : "bg-transparent text-foreground border border-border hover:bg-muted"
                )}
              >
                {SERVICE_TAG_CONFIG[type].label}
              </button>
            )
          })}
        </div>

        {/* Sort control */}
        <div className="shrink-0">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="min-h-[44px] w-full md:w-auto" aria-label="Sort results">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results grid */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        {filteredAndSorted.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  )
}
