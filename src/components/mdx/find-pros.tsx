import Link from "next/link"

export default function FindPros({
  service,
  query,
}: {
  service: string
  query?: string
}) {
  const searchQuery = encodeURIComponent(query || service)
  return (
    <p className="mt-4 mb-4">
      <Link
        href={`/search?q=${searchQuery}`}
        className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-primary hover:underline transition-colors duration-200"
      >
        Find {service} pros near you →
      </Link>
    </p>
  )
}
