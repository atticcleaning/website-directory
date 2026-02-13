import Link from "next/link"

export default function Footer() {
  return (
    <footer role="contentinfo" className="border-t border-border">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          {/* Featured Cities */}
          <div>
            <p className="font-sans text-sm font-semibold text-foreground">
              Featured Cities
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/phoenix-az"
                  className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Phoenix, AZ
                </Link>
              </li>
              <li>
                <Link
                  href="/los-angeles-ca"
                  className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Los Angeles, CA
                </Link>
              </li>
              <li>
                <Link
                  href="/houston-tx"
                  className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Houston, TX
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="font-sans text-sm font-semibold text-foreground">
              Resources
            </p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/articles"
                  className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="font-sans text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-sans text-sm font-semibold text-foreground">
              AtticCleaning.com
            </p>
            <p className="mt-3 font-sans text-sm text-muted-foreground">
              Find top-rated attic cleaning companies near you.
            </p>
            <p className="mt-2 font-sans text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} AtticCleaning.com. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
