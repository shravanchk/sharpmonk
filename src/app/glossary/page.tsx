import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import { TERMS } from "@/lib/content";
// Shared with the search index so its deep links land on the right term.
import { slugifyTerm as slug } from "@/lib/search";

export const metadata: Metadata = {
  alternates: { canonical: "/glossary" },
  title: "Insurance Glossary — Key Terms Explained Simply",
  description:
    "Plain-English definitions of common insurance terms — premium, deductible, sum assured, IDV, No-Claim Bonus, family floater, rider, and more, for US and India insurance.",
};



const schema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Sharpmonk Insurance Glossary",
  hasDefinedTerm: TERMS.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.def })),
};

export default function GlossaryPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Glossary", href: "/glossary" }]} />
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Glossary</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Insurance terms, explained simply</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Short, plain-English definitions of the terms you’ll meet across life,
          health, and motor insurance in the US and India.
        </p>

        <dl className="mt-10 divide-y divide-[var(--line)] border-t border-[var(--line)]">
          {TERMS.map((t) => (
            <div key={t.term} id={slug(t.term)} className="scroll-mt-24 py-5">
              <dt className="font-semibold tracking-tight">{t.term}</dt>
              <dd className="text-muted mt-1.5 leading-relaxed">{t.def}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-14 border-t border-[var(--line)] pt-8">
          <p className="text-muted text-sm">
            Put these into practice with the{" "}
            <Link href="/calculators" className="text-[var(--accent)] underline underline-offset-2">free calculators</Link>{" "}
            or read the{" "}
            <Link href="/guides" className="text-[var(--accent)] underline underline-offset-2">insurance guides</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
