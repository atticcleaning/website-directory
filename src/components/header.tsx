import Link from "next/link"
import SearchBar from "@/components/search-bar"

export default function Header() {
  return (
    <header role="banner" className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="shrink-0 font-sans text-xl font-semibold text-foreground"
        >
          AtticCleaning.com
        </Link>

        <div className="ml-4 flex-1 max-w-sm">
          <SearchBar variant="header" />
        </div>
      </div>
    </header>
  )
}
