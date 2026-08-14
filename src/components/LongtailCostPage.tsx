import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import CostTable from "@/components/CostTable";
import FAQAccordion from "@/components/FAQAccordion";
import Icon from "@/components/Icon";
import IconBadge from "@/components/IconBadge";
import RelatedCalculators from "@/components/RelatedCalculators";
import TrustPanel from "@/components/calculator/TrustPanel";
import type { LongtailPage } from "@/lib/longtail";

/**
 * Renders one generated cost page.
 *
 * The order is deliberate and the same on every page: the number the query
 * asked for, then what that number assumes, then the tables that move one
 * variable at a time, then the interactive tool. A visitor who arrived from a
 * search for a specific figure gets it above the fold without touching a
 * control; a visitor who wants their own numbers is one click from the
 * calculator, pre-filled to match what they just read.
 */
export default function LongtailCostPage({
  page,
  relatedTo,
  calculatorLabel,
}: {
  page: LongtailPage;
  /** Route whose cross-link block to reuse — the parent calculator. */
  relatedTo: string;
  calculatorLabel: string;
}) {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={page.breadcrumb} />

        <div className="mb-5">
          <IconBadge name="shield" size={24} />
        </div>
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
          {page.eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{page.h1}</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">{page.answer}</p>

        {/* The headline figure, stated plainly rather than animated into place —
            this is the answer the page exists to give. */}
        <div className="glass-card mt-8 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div>
              <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                Estimated premium
              </span>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  {page.monthly}
                </span>
                <span className="text-muted mb-1 text-sm">/ month</span>
              </div>
            </div>
            <div className="mb-1">
              <span className="text-muted text-sm">{page.annual} / year</span>
            </div>
          </div>

          <ul className="text-muted mt-6 grid gap-2 border-t border-[var(--line)] pt-5 text-sm sm:grid-cols-2">
            {page.assumptions.map((a) => (
              <li key={a} className="flex items-start gap-2">
                <Icon name="check" size={15} className="text-[var(--accent)] mt-0.5 shrink-0" />
                {a}
              </li>
            ))}
          </ul>

          <Link
            href={page.calculatorHref}
            className="btn-glow mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Change these numbers in the {calculatorLabel}
            <Icon name="arrow-right" size={16} />
          </Link>
        </div>

        {page.tables.map((table) => (
          <CostTable key={table.heading} table={table} />
        ))}

        <div className="mt-12">
          <TrustPanel scope="Every figure on this page is an illustrative estimate produced from generic, publicly-documented rating factors — not a quote, and not drawn from any insurer's filed rates." />
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={page.faqs} />
          </div>
        </section>

        <RelatedCalculators current={relatedTo} />
      </div>
    </main>
  );
}
