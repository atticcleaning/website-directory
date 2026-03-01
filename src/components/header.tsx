import Link from "next/link"
import Image from "next/image"
import SearchBar from "@/components/search-bar"

export default function Header() {
  return (
    <header role="banner" className="bg-card shadow-card">
      <div className="mx-auto flex w-full max-w-[1200px] items-center gap-3 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="AtticCleaning.com home"
        >
          <Image
            src="/images/attic-cleaning-logo-mark.webp"
            alt="AtticCleaning.com logo"
            width={32}
            height={32}
            className="h-8 w-8"
            unoptimized
          />
          <span className="hidden font-sans text-xl font-semibold text-foreground md:inline">
            AtticCleaning.com
          </span>
        </Link>

        <div className="flex-1">
          <SearchBar variant="header" />
        </div>
      </div>
    </header>
  )
}
