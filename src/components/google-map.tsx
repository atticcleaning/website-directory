"use client"

import { useState, useEffect, useCallback } from "react"

interface GoogleMapProps {
  latitude: number
  longitude: number
  address: string
  companyName: string
  apiKey: string
}

export default function GoogleMap({
  latitude,
  longitude,
  address,
  companyName,
  apiKey,
}: GoogleMapProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "fallback">(
    apiKey ? "loading" : "fallback"
  )

  useEffect(() => {
    if (status !== "loading") return

    const timer = setTimeout(() => {
      setStatus((prev) => (prev === "loading" ? "fallback" : prev))
    }, 2000)

    return () => clearTimeout(timer)
  }, [status])

  const handleLoad = useCallback(() => {
    setStatus("loaded")
  }, [])

  if (status === "fallback") {
    return (
      <p className="font-sans text-sm text-muted-foreground">{address}</p>
    )
  }

  return (
    <>
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}`}
        loading="lazy"
        title={`Map showing location of ${companyName}`}
        className={`w-full rounded-lg border border-border ${status === "loaded" ? "h-[300px]" : "absolute h-0 w-0 overflow-hidden opacity-0"}`}
        onLoad={handleLoad}
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      {status === "loading" && (
        <p className="font-sans text-sm text-muted-foreground">{address}</p>
      )}
    </>
  )
}
