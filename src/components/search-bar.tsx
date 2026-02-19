"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  variant: "hero" | "header"
  defaultValue?: string
}

export default function SearchBar({ variant, defaultValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const inputId = variant === "hero" ? "search-hero" : "search-header"
  const isHero = variant === "hero"

  return (
    <form
      role="search"
      action="/search"
      className={cn(
        "flex w-full",
        isHero && "max-w-2xl"
      )}
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
          type="submit"
          disabled={!query.trim()}
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
