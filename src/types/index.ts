import type { ServiceType } from "@/app/generated/prisma/client"

export { ServiceType } from "@/app/generated/prisma/client"

export interface SearchResponse {
  results: ListingResult[]
  meta: {
    query: string
    totalCount: number
    expanded: boolean
    radiusMiles: number
    location: {
      city: string
      state: string
      latitude: number
      longitude: number
    } | null
  }
}

export interface ListingResult {
  id: string
  name: string
  starRating: number
  reviewCount: number
  phone: string | null
  website: string | null
  address: string
  distanceMiles: number | null
  serviceTags: ServiceType[]
  reviewSnippet: string | null
  citySlug: string
  companySlug: string
}
