import type { Metadata } from "next";
import { alternates } from "@/lib/i18n";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import { EXAMS, kbRange, longDate, pxLabel } from "@/lib/specs";

const TITLE = "Exam Photo & Signature Sizes — From the Official Notifications";
const DESCRIPTION =
  "Photo, signature, thumb impression and declaration sizes for UPSC, SSC, RRB, IBPS, SBI, NEET and JEE exams, read from each official notification and dated — with a resizer for each.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternates("/exams", "en"),
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/exams", type: "website" },
};

export default function ExamsPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Exams", href: "/exams" }]} />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Exam upload sizes, from the source</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Each exam here was added by reading its official notification — not by copying another resizer site — and shows
          the document, the page, and the date it was checked.
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {EXAMS.map((e) => (
          <Link
            key={e.slug}
            href={`/exams/${e.slug}`}
            className="glass-card group flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">{e.conductedBy}</span>
            <h2 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-[var(--accent)]">{e.name}</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm">
              {e.docs.map((d) => (
                <li key={d.kind} className="flex justify-between gap-3">
                  <span className="text-muted">{d.label}</span>
                  <span className="shrink-0 text-right font-medium">
                    {pxLabel(d) ? `${pxLabel(d)} · ` : ""}
                    {kbRange(d)}
                  </span>
                </li>
              ))}
            </ul>
            <span className="text-muted mt-5 text-xs">Checked {longDate(e.verifiedOn)}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
              Open resizer
              <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-14 max-w-3xl rounded-2xl border border-[var(--line)] p-6">
        <h2 className="font-semibold tracking-tight">Your exam isn&apos;t listed?</h2>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          Use the <Link href="/resize-image-to-kb" className="text-[var(--accent)] hover:underline">resize-to-KB tool</Link> or the{" "}
          <Link href="/signature-resize" className="text-[var(--accent)] hover:underline">signature resizer</Link> with the numbers
          from your notification — both take any pixels and KB window. And{" "}
          <Link href="/contact" className="text-[var(--accent)] hover:underline">tell us which exam</Link> to add next; it goes up
          once we&apos;ve read the official notification ourselves.
        </p>
      </section>
    </main>
  );
}
