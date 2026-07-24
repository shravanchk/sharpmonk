"use client";

import { useEffect, useState } from "react";

/**
 * "On this page" contents box for long-form guides. On mount it scans the
 * article container for <h2> headings, assigns slug ids to any without one,
 * and renders jump links — so guides get a table of contents without hand-
 * maintaining anchors. Highlights the section currently in view.
 */

type Item = { id: string; label: string };

const slug = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ArticleToc({ containerId = "article" }: { containerId?: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const hs = Array.from(root.querySelectorAll("h2"));
    const list: Item[] = hs.map((h) => {
      if (!h.id) h.id = slug(h.textContent || "");
      return { id: h.id, label: h.textContent || "" };
    });
    const raf = requestAnimationFrame(() => setItems(list));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    hs.forEach((h) => obs.observe(h));
    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [containerId]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="On this page" className="glass-card mt-8 rounded-2xl p-5">
      <p className="text-muted font-mono text-[0.7rem] tracking-[0.14em] uppercase">On this page</p>
      <ul className="mt-3 flex flex-col gap-1.5 text-sm">
        {items.map((it) => (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              className={`transition-colors ${
                active === it.id ? "text-[var(--accent)]" : "text-muted hover:text-[var(--foreground)]"
              }`}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
