import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/methodology" },
  title: "Methodology",
  description:
    "How Sharpmonk's calculators work: formula logic, assumptions, sources, and how often the numbers get reviewed.",
};

const EFFECTIVE_DATE = "July 23, 2026";

export default function MethodologyPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Trust</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Methodology</h1>
        <p className="text-muted mt-4 text-sm">Last reviewed {EFFECTIVE_DATE}</p>

        <div className="prose-legal mt-10">
          <h2>How the calculators work</h2>
          <p>
            Every Sharpmonk calculator runs a deterministic formula, entirely
            in your browser: a base rate for the policy type, adjusted by a
            fixed set of multipliers for the factors you enter (age,
            coverage amount, deductible, regional risk, and so on). Nothing
            is looked up from a live insurer feed or a machine-learning
            model — the same inputs always produce the same output, and you
            can see exactly which factor moved the number by how much.
          </p>
          <p>
            Each calculator page has its own &ldquo;Methodology and source
            notes&rdquo; panel listing the exact inputs, formula, assumptions,
            and cited sources for that tool. This page covers the approach
            that&apos;s common across all of them.
          </p>

          <h2>Where the numbers come from</h2>
          <p>
            The rating factors used (age bands, tobacco surcharges,
            deductible credits, coverage-tier multipliers, regional risk
            adjustments) are generic patterns that are broadly documented by
            industry and regulatory sources — the Insurance Information
            Institute, the National Association of Insurance Commissioners
            (NAIC), and HealthCare.gov, among others. They are{" "}
            <strong>not</strong> pulled from any specific insurer&apos;s
            filed rate tables. See the{" "}
            <Link href="/disclaimer">Disclaimer</Link> for what that means
            for how you should use the output.
          </p>

          <h2>Assumptions and limits</h2>
          <ul>
            <li>Inputs are treated as exact, known values — none of the calculators model uncertainty or ranges.</li>
            <li>State-specific regulation, credit-based insurance scores, and insurer-specific underwriting are not modeled.</li>
            <li>Formulas use illustrative rate levels chosen to be broadly representative, not tuned to any particular market or time period beyond general accuracy.</li>
            <li>Where a calculator makes a simplifying rule-of-thumb assumption (for example, the whole-life-vs-term multiplier), that assumption is called out explicitly in its methodology panel.</li>
          </ul>

          <h2>Review cadence</h2>
          <p>
            Formulas and rate assumptions are reviewed when a calculator is
            first published and whenever the underlying industry guidance
            they&apos;re based on changes materially (for example, a shift in
            ACA age-rating rules). The methodology panel on each calculator
            page reflects the current version of that tool&apos;s formula.
          </p>

          <h2>Spot something off?</h2>
          <p>
            If a formula looks wrong or a source link is broken, use the{" "}
            <Link href="/contact">contact page</Link> — corrections get
            made directly in the calculator&apos;s methodology panel once
            verified.
          </p>

          <h2>Related pages</h2>
          <p>
            <Link href="/about">About Sharpmonk</Link> ·{" "}
            <Link href="/disclaimer">Disclaimer</Link> ·{" "}
            <Link href="/privacy">Privacy Policy</Link> ·{" "}
            <Link href="/terms">Terms of Service</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
