import Image from "next/image"

interface PhotoGalleryProps {
  photos: { id: string; url: string }[]
  companyName: string
  cityName: string
  state: string
}

export default function PhotoGallery({ photos, companyName, cityName, state }: PhotoGalleryProps) {
  if (photos.length === 0) return null

  const primary = photos[0]
  const additional = photos.slice(1, 8)
  const hasAdditional = additional.length > 0

  return (
    <section aria-label={`Photos of ${companyName}`} className="mt-6">
      <div
        className={`grid grid-cols-2 gap-2${
          hasAdditional ? " md:grid-cols-3 md:grid-rows-2" : ""
        }`}
      >
        {/* Primary photo — full-width when solo, 2 cols + 2 rows when gallery */}
        <div
          className={`relative col-span-2 aspect-[16/9] overflow-hidden rounded-lg${
            hasAdditional ? " md:row-span-2 md:aspect-auto" : ""
          }`}
        >
          <Image
            src={primary.url}
            alt={`${companyName} — attic cleaning company in ${cityName}, ${state}`}
            fill
            priority
            sizes={hasAdditional ? "(max-width: 768px) 100vw, 533px" : "100vw"}
            className="object-cover"
          />
        </div>

        {/* Additional photos — fill remaining grid cells */}
        {additional.map((photo, index) => (
          <div
            key={photo.id}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg${
              index >= 5 ? " hidden md:block" : ""
            }`}
          >
            <Image
              src={photo.url}
              alt={`${companyName} — attic cleaning in ${cityName}, ${state} photo ${index + 2}`}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
