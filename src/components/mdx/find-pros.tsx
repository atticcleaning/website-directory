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
    <p>
      <Link href={`/search?q=${searchQuery}`}>
        Find {service} pros near you →
      </Link>
    </p>
  )
}
