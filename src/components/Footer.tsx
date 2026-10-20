"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MonkMark from "./MonkMark";
import InstallApp from "./InstallApp";
import { EXAMS } from "@/lib/specs";
import { STRINGS, hasHindi, langFromPath, localHref, type Lang } from "@/lib/i18n";

/** The other two sites by the same maker. Linked from every page — they are
 *  the only sites on the web guaranteed to vouch for each other. */
const SISTERS = [
  { href: "https://upaman.com", name: "Upaman", key: "upaman" as const },
  { href: "https://railmonk.com", name: "Railmonk", key: "railmonk" as const },
];

function columns(lang: Lang) {
  const t = STRINGS[lang];
  const f = t.footer;
  // Pages without a Hindi version are marked, so a Hindi reader isn't
  // surprised to land on English.
  const label = (href: string, text: string) => (lang !== "en" && !hasHindi(href) ? `${text}${f.englishOnly}` : text);
  const link = (href: string, text: string) => ({ href: localHref(lang, href), label: label(href, text) });
  return [
    {
      title: f.tools,
      links: [
        link("/resize-image-to-kb", t.tools.resize.title),
        link("/signature-resize", t.tools.signature.title),
        link("/compress-pdf-to-kb", t.tools.pdf.title),
        link("/image-to-pdf", t.tools.imagePdf.title),
        link("/exams", f.allExams),
      ],
    },
    {
      title: f.exams,
      links: EXAMS.map((e) => link(`/exams/${e.slug}`, `${e.short} ${t.uploads(e.docs.some((d) => d.kind === "photo"))}`)),
    },
    {
      title: f.site,
      links: [
        link("/how-it-works", f.how),
        link("/about", f.about),
        link("/contact", f.contact),
        link("/privacy", f.privacy),
        link("/terms", f.terms),
        link("/disclaimer", f.disclaimer),
      ],
    },
  ];
}

export default function Footer() {
  const lang = langFromPath(usePathname());
  const f = STRINGS[lang].footer;
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--panel)]" lang={lang}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <span className="flex items-center gap-2.5 font-mono text-lg font-semibold tracking-tight">
              <MonkMark size={26} />
              Sharpmonk
            </span>
            <p className="mt-2 text-sm font-medium text-[var(--accent)]">{STRINGS[lang].tagline}</p>
            <p className="text-muted mt-3 max-w-xs text-sm leading-relaxed">{f.blurb}</p>
            <div className="mt-3">
              <InstallApp lang={lang} variant="link" />
            </div>
            <ul className="mt-5 flex max-w-xs flex-col gap-3">
              {SISTERS.map((s) => (
                <li key={s.href} className="text-sm leading-snug">
                  <a href={s.href} className="font-medium text-[var(--accent)] hover:underline">
                    {s.name}
                  </a>
                  <span className="text-muted"> — {f[s.key]}</span>
                </li>
              ))}
            </ul>
          </div>

          {columns(lang).map((col) => (
            <div key={col.title}>
              <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-[var(--foreground)]/80 transition-colors hover:text-[var(--accent)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-muted mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Sharpmonk.</p>
          <p className="max-w-2xl sm:text-right">{f.legal}</p>
        </div>
      </div>
    </footer>
  );
}
