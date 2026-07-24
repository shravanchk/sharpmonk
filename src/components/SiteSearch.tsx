"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";
import { searchSite, type SearchDoc } from "@/lib/search";

const SECTION_TINT: Record<SearchDoc["section"], string> = {
  Calculator: "icon-badge--blue",
  Guide: "icon-badge--violet",
  Glossary: "icon-badge--teal",
  Page: "icon-badge--indigo",
};

/**
 * Search over calculators, guides and the glossary. The whole index is a
 * build-time constant (see lib/search.ts), so this runs entirely in the page —
 * no request, and it works on a static export.
 *
 * Opens on click or "/" and behaves like a combobox: arrows move, Enter goes,
 * Escape closes.
 */
export default function SiteSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const results = useMemo(() => searchSite(query), [query]);

  // Clamp the highlight during render rather than in an effect, so it can
  // never point past a shrunken result list.
  const active = results.length === 0 ? 0 : Math.min(cursor, results.length - 1);

  // "/" focuses search from anywhere, the way most doc sites behave.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      const el = e.target as HTMLElement | null;
      const typing =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (typing) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close when focus or a click leaves the widget.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const go = (doc: SearchDoc) => {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(doc.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (Math.min(c, results.length - 1) + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (Math.min(c, results.length - 1) - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  const showList = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className="relative w-full">
      <div className="relative">
        <span className="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          <Icon name="search" size={16} />
        </span>
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search calculators, guides and glossary"
          placeholder="Search calculators and guides…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="field-input !pl-9"
        />
      </div>

      {showList && (
        <div
          id={listId}
          role="listbox"
          className="glass-card absolute top-full right-0 left-0 z-50 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl p-1.5"
        >
          {results.length === 0 ? (
            <p className="text-muted px-3 py-6 text-center text-sm">
              Nothing matches “{query.trim()}”.
            </p>
          ) : (
            results.map((doc, i) => (
              <button
                key={doc.href}
                type="button"
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setCursor(i)}
                onClick={() => go(doc)}
                className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors ${
                  i === active ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-1)]"
                }`}
              >
                <span className={`icon-badge icon-badge-sm shrink-0 ${SECTION_TINT[doc.section]}`}>
                  <Icon
                    name={
                      doc.section === "Calculator"
                        ? "calculator"
                        : doc.section === "Guide"
                          ? "book"
                          : doc.section === "Glossary"
                            ? "book"
                            : "info"
                    }
                    size={16}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{doc.title}</span>
                  <span className="text-muted block truncate text-xs">{doc.body}</span>
                </span>
                <span className="text-muted shrink-0 font-mono text-[10px] tracking-wider uppercase">
                  {doc.section}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
