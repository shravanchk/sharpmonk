import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/disclaimer" },
  title: "Disclaimer",
  description: "Important limitations of the Sharpmonk insurance calculator and how its estimates should be used.",
};

export default function DisclaimerPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Legal</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Disclaimer</h1>

        <div className="prose-legal mt-10">
          <h2>Estimates only — not a quote</h2>
          <p>
            The <Link href="/calculator">Sharpmonk insurance calculator</Link>{" "}
            produces an illustrative estimate using generic, publicly
            understood rating factors (such as age bands, tobacco
            surcharges, coverage tiers, deductible credits, and regional
            risk multipliers). It does not use real-time rate tables from
            any specific insurer, is not underwritten, and is not a
            binding, formal, or informal quote.
          </p>

          <h2>Not affiliated with any insurer</h2>
          <p>
            Sharpmonk is not an insurance company, agent, broker, carrier,
            or underwriter, and is not affiliated with, endorsed by, or
            sponsored by any specific insurance provider. We do not sell
            insurance policies.
          </p>

          <h2>Actual premiums will differ</h2>
          <p>
            Real insurance premiums depend on underwriting factors this
            calculator does not and cannot access — including your exact
            location, credit-based insurance score (where legally used),
            detailed medical history, motor vehicle record, insurer-specific
            pricing models, discounts, and state regulations. Actual quotes
            from licensed insurers may be higher or lower than the estimate
            shown.
          </p>

          <h2>Not professional advice</h2>
          <p>
            Nothing on this Site constitutes insurance, financial, legal, or
            tax advice. Before making any insurance, financial, or legal
            decision, consult a licensed insurance agent, financial advisor,
            or attorney qualified in your jurisdiction.
          </p>

          <h2>No guarantee of accuracy</h2>
          <p>
            While we aim for the calculator&apos;s methodology to be reasonable
            and transparent (each result includes the exact factors and
            multipliers used), we make no representation or warranty as to
            the accuracy, completeness, or reliability of any estimate.
          </p>

          <h2>Use at your own discretion</h2>
          <p>
            Your use of the calculator and any reliance on its output is
            entirely at your own risk. See the{" "}
            <Link href="/terms">Terms of Service</Link> for the full
            limitation of liability, and the{" "}
            <Link href="/privacy">Privacy Policy</Link> for how information
            on this Site is handled.
          </p>
        </div>
      </div>
    </main>
  );
}
