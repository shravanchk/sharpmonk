"use client";

import { useState } from "react";
import Link from "next/link";
import IconBadge from "@/components/IconBadge";
import Icon from "@/components/Icon";
import { TOOLS, type Cat } from "@/lib/content";



const TABS: { id: "all" | Cat; label: string }[] = [
  { id: "all", label: "All" },
  { id: "life", label: "Life" },
  { id: "health", label: "Health" },
  { id: "autohome", label: "Auto & Home" },
  { id: "other", label: "Other" },
  { id: "india", label: "India" },
];


export default function ToolExplorer() {
  const [tab, setTab] = useState<"all" | Cat>("all");
  const shown = TOOLS.filter((t) => tab === "all" || t.cats.includes(tab));

  return (
    <div>
      <div role="tablist" aria-label="Filter calculators" className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "border-transparent bg-[var(--accent)] text-[var(--background)]"
                  : "text-muted border-[var(--line-strong)] hover:bg-[var(--surface-1)] hover:text-[var(--foreground)]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <IconBadge name={tool.icon} size={22} />
            <h2 className="mt-4 font-semibold tracking-tight group-hover:text-[var(--accent)]">{tool.title}</h2>
            <p className="text-muted mt-2 text-sm leading-relaxed">{tool.body}</p>
            <span className="text-[var(--accent)] mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
              Open calculator
              <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
