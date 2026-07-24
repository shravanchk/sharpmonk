import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
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
      </div>
    </main>
  );
}
