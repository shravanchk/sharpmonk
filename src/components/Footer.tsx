import Link from "next/link";
import MonkMark from "./MonkMark";
import { EXAM_ENTRIES, TOOLS } from "@/lib/content";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Tools",
    links: [...TOOLS.map((t) => ({ href: t.href, label: t.title })), { href: "/exams", label: "All exams" }],
  },
  {
    title: "Exams",
    links: EXAM_ENTRIES.map((e) => ({ href: e.href, label: e.title })),
  },
  {
    title: "Sharpmonk",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

/** The other two sites by the same maker. Linked from every page — they are
 *  the only sites on the web guaranteed to vouch for each other. */
const SISTERS = [
  { href: "https://upaman.com", name: "Upaman", body: "Financial calculators that show their working." },
  { href: "https://railmonk.com", name: "Railmonk", body: "IRCTC refund, Tatkal and waitlist tools, built on the official rules." },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--panel)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <span className="flex items-center gap-2.5 font-mono text-lg font-semibold tracking-tight">
              <MonkMark size={26} />
              Sharpmonk
            </span>
            <p className="text-muted mt-3 max-w-xs text-sm leading-relaxed">
              Exam photos and signatures, sized exactly to the official
              specification. Everything runs in your browser — your images are
              never uploaded.
            </p>
            <ul className="mt-5 flex max-w-xs flex-col gap-3">
              {SISTERS.map((s) => (
                <li key={s.href} className="text-sm leading-snug">
                  <a href={s.href} className="font-medium text-[var(--accent)] hover:underline">
                    {s.name}
                  </a>
                  <span className="text-muted"> — {s.body}</span>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{col.title}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground)]/80 transition-colors hover:text-[var(--accent)]"
                    >
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
          <p className="max-w-2xl sm:text-right">
            Not affiliated with IBPS, NTA or any exam body. Specifications are
            taken from each official notification and dated; always check the
            current notification before you submit.
          </p>
        </div>
      </div>
    </footer>
  );
}
