"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { searchSite, SEARCH_DOCS, type SearchDoc } from "@/lib/search";
import { useUrlSearchOnce, useUrlSync } from "@/hooks/useShareableInputs";

const SECTION_TINT: Record<SearchDoc["section"], string> = {
  Calculator: "icon-badge--blue",
  Guide: "icon-badge--violet",
  Glossary: "icon-badge--teal",
  Page: "icon-badge--indigo",
};

const SECTION_ICON = {
  Calculator: "calculator",
  Guide: "book",
  Glossary: "book",
  Page: "info",
} as const;

// Spelled out rather than appending "s" — that gave "Glossarys".
const SECTION_HEADING: Record<SearchDoc["section"], string> = {
  Calculator: "Calculators",
  Guide: "Guides",
  Glossary: "Glossary terms",
  Page: "Pages",
};

const SUGGESTED = ["term life", "car", "deductible", "renters", "mediclaim", "pet"];

/**
 * Full-page search.
 *
 * Reads `?q=` through the same URL hooks the calculators use, so a search is
 * linkable and the back button works, without the hydration hazard of reading
 * `location` during render. No Suspense boundary needed either, which
 * `useSearchParams` would have required under `output: "export"`.
 */
export default function SearchPageClient() {
  const initial = useUrlSearchOnce();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Adopt the URL's q= once it arrives (one transition, just after hydration).
  const fromUrl = useMemo(() => new URLSearchParams(initial).get("q") ?? "", [initial]);
  const [prevFromUrl, setPrevFromUrl] = useState(fromUrl);
  if (fromUrl !== prevFromUrl) {
    setPrevFromUrl(fromUrl);
    setQuery(fromUrl);
  }

  useUrlSync(useMemo(() => (query.trim() ? `q=${encodeURIComponent(query.trim())}` : ""), [query]));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const trimmed = query.trim();
  const results = useMemo(() => (trimmed ? searchSite(trimmed, 40) : []), [trimmed]);

  // With an empty box, show the whole catalogue rather than a blank page —
  // it doubles as a site index.
  const shown = trimmed ? results : SEARCH_DOCS;

  const grouped = useMemo(() => {
    const order: SearchDoc["section"][] = ["Calculator", "Guide", "Glossary", "Page"];
    return order
      .map((section) => ({ section, docs: shown.filter((d) => d.section === section) }))
      .filter((g) => g.docs.length > 0);
  }, [shown]);

  return (
    <div>
      <div className="relative">
        <span className="text-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
          <Icon name="search" size={18} />
        </span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calculators, guides and terms…"
          aria-label="Search the site"
          className="field-input !py-3.5 !pl-11 !text-base"
        />
      </div>

      {!trimmed && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-muted text-xs">Try:</span>
          {SUGGESTED.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="btn-ghost rounded-full px-3 py-1.5 text-xs"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <p aria-live="polite" className="text-muted mt-6 text-sm">
        {trimmed
          ? `${results.length} ${results.length === 1 ? "result" : "results"} for “${trimmed}”`
          : `Browse all ${SEARCH_DOCS.length} pages`}
      </p>

      {trimmed && results.length === 0 ? (
        <div className="glass-card mt-4 rounded-2xl p-8 text-center">
          <p className="font-medium">Nothing matches “{trimmed}”.</p>
          <p className="text-muted mt-2 text-sm">
            Try a broader word — “life”, “car”, “health” — or{" "}
            <Link href="/calculators" className="text-[var(--accent)] underline underline-offset-2">
              browse all calculators
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-8">
          {grouped.map(({ section, docs }) => (
            <section key={section}>
              <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                {SECTION_HEADING[section]}
              </h2>
              <div className="mt-3 flex flex-col gap-1">
                {docs.map((doc) => (
                  <Link
                    key={doc.href}
                    href={doc.href}
                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-1)]"
                  >
                    <span
                      className={`icon-badge icon-badge-sm shrink-0 ${SECTION_TINT[doc.section]}`}
                    >
                      <Icon name={SECTION_ICON[doc.section]} size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{doc.title}</span>
                      <span className="text-muted block text-xs leading-relaxed">{doc.body}</span>
                    </span>
                    <Icon name="chevron-right" size={16} className="text-muted shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
