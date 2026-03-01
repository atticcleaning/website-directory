import { NextRequest, NextResponse } from "next/server"
import { searchListings } from "@/lib/search"
import type { SearchResponse } from "@/types"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get("q") || ""
    const service = searchParams.get("service") || undefined
    const sort = searchParams.get("sort") || "rating"

    const rawLat = searchParams.get("lat")
    const rawLng = searchParams.get("lng")
    const lat = rawLat !== null ? parseFloat(rawLat) : undefined
    const lng = rawLng !== null ? parseFloat(rawLng) : undefined
    const validLat = lat !== undefined && !isNaN(lat) && lat >= -90 && lat <= 90 ? lat : undefined
    const validLng = lng !== undefined && !isNaN(lng) && lng >= -180 && lng <= 180 ? lng : undefined

    const response = await searchListings({ q, service, sort, lat: validLat, lng: validLng })
    return NextResponse.json(response)
  } catch (error) {
    console.error("Search API error:", error)
    const emptyResponse: SearchResponse = {
      results: [],
      meta: {
        query: "",
        totalCount: 0,
        expanded: true,
        radiusMiles: 50,
        location: null,
      },
    }
    return NextResponse.json(emptyResponse)
  }
}
