import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import IconBadge from "@/components/IconBadge";
import ToolExplorer from "@/components/ToolExplorer";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators" },
  title: "Free Insurance Calculators",
  description:
    "Ten free, transparent insurance calculators for the US and India: premium estimates for life, health, auto & home, plus coverage-needs, renters, umbrella, pet, term-vs-whole, and India term, health & motor tools.",
};

export default function CalculatorsHubPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }]} />
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            All calculators
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Free insurance calculators
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Every tool runs in your browser, shows its math, and never asks for
            your phone number. Filter by category to find the right one.
          </p>
        </div>

        <ToolExplorer />

        {/* Reference tables, for readers who want a number without touching a
            slider — and the entry point to the per-age cost pages. */}
        <section className="mt-16 border-t border-[var(--line)] pt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Rate charts</h2>
          <p className="text-muted mt-3 max-w-2xl leading-relaxed">
            Prefer to read the numbers straight off a table? These cover the
            most-asked combinations of age and coverage.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                href: "/calculators/term-life",
                title: "Term life rates by age (US)",
                body: "Monthly cost from $250,000 to $2 million, ages 25 to 60.",
              },
              {
                href: "/in/term-life",
                title: "Term insurance premium chart (India)",
                body: "Annual premium from ₹25 lakh to ₹2 crore, ages 25 to 50.",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="glass-card group flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
              >
                <IconBadge name="chart" size={22} />
                <h3 className="mt-4 font-semibold tracking-tight group-hover:text-[var(--accent)]">
                  {card.title}
                </h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{card.body}</p>
                <span className="text-[var(--accent)] mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  View chart
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
