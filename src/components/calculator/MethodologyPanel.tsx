"use client";

import { useState } from "react";

type Source = { label: string; url: string };

type Props = {
  title?: string;
  inputs?: string[];
  formulas?: string[];
  assumptions?: string[];
  sources?: Source[];
};

function MethodologySection({ heading, items }: { heading: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-muted font-mono text-xs tracking-[0.12em] uppercase">{heading}</h4>
      <ul className="mt-2 flex flex-col gap-1.5 text-sm text-[var(--foreground)]/85">
        {items.map((item) => (
          <li key={item} className="flex gap-2 leading-relaxed">
            <span aria-hidden className="text-[var(--accent)]">
              ›
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Per-calculator "show your work" panel — the inputs, formulas, assumptions,
 *  and cited sources behind the number on screen. Modeled on the
 *  methodology/source-notes pattern used across Sharpmonk's sibling
 *  calculator properties. */
export default function MethodologyPanel({
  title = "Methodology and source notes",
  inputs = [],
  formulas = [],
  assumptions = [],
  sources = [],
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl p-1.5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 rounded-lg px-3.5 py-3 text-left text-sm font-semibold text-[var(--foreground)]/95"
      >
        {title}
        <span aria-hidden className={`accordion-chevron text-muted shrink-0 ${open ? "is-open" : ""}`}>
          +
        </span>
      </button>
      <div className={`accordion-panel ${open ? "is-open" : ""}`}>
        <div>
          <div className="flex flex-col gap-5 px-3.5 pt-1 pb-4">
            {!!inputs.length && <MethodologySection heading="Inputs used" items={inputs} />}
            {!!formulas.length && <MethodologySection heading="Formula basis" items={formulas} />}
            {!!assumptions.length && (
              <MethodologySection heading="Assumptions and limits" items={assumptions} />
            )}
            {!!sources.length && (
              <div>
                <h4 className="text-muted font-mono text-xs tracking-[0.12em] uppercase">
                  Official sources
                </h4>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {sources.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--accent)] underline underline-offset-2"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
