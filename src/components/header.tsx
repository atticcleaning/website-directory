import Link from "next/link"

interface HeaderProps {
  showSearch?: boolean
}

export default function Header({ showSearch = true }: HeaderProps) {
  return (
    <header role="banner" className="border-b border-border">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-sans text-xl font-semibold text-foreground"
        >
          AtticCleaning.com
        </Link>

        {showSearch && (
          <div className="ml-4 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground sm:px-4 sm:text-sm">
            Search by city or zip...
          </div>
        )}
      </div>
    </header>
  )
}
