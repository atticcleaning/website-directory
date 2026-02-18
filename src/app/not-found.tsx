import Link from "next/link";
import SearchBar from "@/components/search-bar";

export default function NotFound() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-2xl bg-secondary rounded-xl px-6 py-10 text-center">
        <h1 className="font-sans text-2xl font-bold">Page not found</h1>
        <p className="mt-4 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="min-h-[44px] inline-flex items-center rounded-md bg-primary px-6 py-2 font-sans text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Go to homepage
          </Link>
        </div>
        <div className="mt-8">
          <SearchBar variant="hero" />
        </div>
      </div>
    </div>
  );
}
