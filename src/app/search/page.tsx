import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SearchPageClient from "@/components/SearchPageClient";

export const metadata: Metadata = {
  alternates: { canonical: "/search" },
  title: "Search",
  description:
    "Search Sharpmonk's free insurance calculators, guides, and glossary of insurance terms.",
  // Search-results pages are thin and infinitely variable by query — standard
  // practice is to keep them out of the index while still letting crawlers
  // follow the links through to the real pages.
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }]} />
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Search</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Everything on Sharpmonk &mdash; calculators, guides, and plain-English
          definitions. Results appear as you type.
        </p>

        <div className="mt-10">
          <SearchPageClient />
        </div>
      </div>
    </main>
  );
}
