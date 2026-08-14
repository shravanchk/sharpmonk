"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import type { Embeddable } from "@/lib/embeds";

/**
 * One row of the embed gallery: what the calculator is, a live preview of the
 * framed page, and the snippet to copy.
 *
 * The preview is a real iframe pointing at the same URL the snippet hands out,
 * so a publisher can see exactly what their readers will get before pasting
 * anything.
 */
export default function EmbedSnippet({
  embed,
  snippet,
}: {
  embed: Embeddable;
  snippet: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      // Absent over plain http and in some in-app browsers.
      if (!navigator.clipboard) throw new Error("no clipboard api");
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Leave the snippet on screen — it is selectable either way.
    }
  };

  return (
    <section className="glass-card rounded-2xl p-6">
      <h2 className="text-lg font-semibold tracking-tight">{embed.title}</h2>
      <p className="text-muted mt-1.5 text-sm leading-relaxed">{embed.blurb}</p>

      <div className="mt-5 flex items-center justify-between gap-4">
        <span className="text-muted font-mono text-[0.7rem] tracking-[0.14em] uppercase">
          Copy this
        </span>
        <button
          type="button"
          onClick={copy}
          className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
        >
          <Icon name={copied ? "check" : "link"} size={14} />
          {copied ? "Copied" : "Copy snippet"}
        </button>
      </div>

      <pre className="mt-2 overflow-x-auto rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-4 text-xs leading-relaxed">
        <code>{snippet}</code>
      </pre>

      <details className="mt-4">
        <summary className="text-[var(--accent)] cursor-pointer text-sm font-medium">
          Preview it
        </summary>
        <iframe
          src={`/embed/${embed.slug}`}
          title={`${embed.title} preview`}
          loading="lazy"
          className="mt-4 w-full rounded-xl border border-[var(--line)]"
          style={{ height: embed.height }}
        />
      </details>
    </section>
  );
}
