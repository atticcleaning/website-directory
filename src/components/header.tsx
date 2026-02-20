import Link from "next/link"
import Image from "next/image"
import SearchBar from "@/components/search-bar"

export default function Header() {
  return (
    <header role="banner" className="bg-card shadow-card">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
        >
          <Image
            src="/images/attic-cleaning-logo-mark.png"
            alt="AtticCleaning.com logo"
            width={32}
            height={32}
            className="h-8 w-8"
            unoptimized
          />
          <span className="font-sans text-xl font-semibold text-foreground">
            AtticCleaning.com
          </span>
        </Link>

        <div className="ml-4 flex-1 max-w-sm">
          <SearchBar variant="header" />
        </div>
      </div>
    </header>
  )
}
