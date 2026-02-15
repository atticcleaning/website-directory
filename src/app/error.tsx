"use client";

import { useEffect } from "react";
import SearchBar from "@/components/search-bar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="font-sans text-2xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-muted-foreground">
        We encountered an unexpected error. Try again or search for what you
        need.
      </p>
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => reset()}
          className="min-h-[44px] rounded-md bg-primary px-6 py-2 font-sans text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          Try again
        </button>
      </div>
      <div className="mt-8">
        <SearchBar variant="hero" />
      </div>
    </div>
  );
}
