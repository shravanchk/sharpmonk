"use client";

import { useState } from "react";

type FAQItem = { q: string; a: string };

function AccordionRow({ q, a }: FAQItem) {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 text-left font-medium text-[var(--foreground)]/95"
      >
        {q}
        <span aria-hidden className={`accordion-chevron text-muted shrink-0 ${open ? "is-open" : ""}`}>
          +
        </span>
      </button>
      <div className={`accordion-panel ${open ? "is-open" : ""}`}>
        <div>
          <p className="text-muted mt-3 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="flex flex-col divide-y divide-[var(--line)] border-t border-[var(--line)]">
        {items.map((item) => (
          <AccordionRow key={item.q} q={item.q} a={item.a} />
        ))}
      </div>
    </>
  );
}
