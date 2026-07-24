import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Sharpmonk",
  description:
    "Sharpmonk builds free, transparent calculators — starting with an insurance premium estimator that shows its math instead of hiding it behind a lead-gen form.",
};

export default function AboutPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
          About
        </span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Why Sharpmonk exists
        </h1>

        <div className="prose-legal mt-10">
          <p>
            Most insurance &ldquo;calculators&rdquo; online are lead-generation forms in
            disguise: enter your phone number to see a number, then field
            calls from agents for a week. Sharpmonk started from a simpler
            idea — show the estimate first, show the math behind it, and
            never ask for contact information to do it.
          </p>

          <h2>What the calculators actually do</h2>
          <p>
            <Link href="/calculators">Our free calculators</Link> apply
            generic, publicly understood rating factors — age curves,
            tobacco surcharges, deductible credits, regional risk
            multipliers — to estimate premiums and coverage needs for life,
            health, auto, home, renters, umbrella, and pet insurance in the
            US, plus term, health, and motor insurance for{" "}
            <Link href="/in">India</Link>. Every
            input you change updates the estimate and its breakdown
            instantly, entirely in your browser. Each calculator&apos;s page
            includes a methodology panel showing the exact formula and
            sources behind its number — see the{" "}
            <Link href="/methodology">Methodology</Link> page for the
            approach across all of them.
          </p>
          <p>
            It is a budgeting and comparison-shopping aid, not a substitute
            for a real quote. See the <Link href="/disclaimer">disclaimer</Link>{" "}
            for the full picture of what these tools are and aren&apos;t.
          </p>

          <h2>Who&apos;s behind it</h2>
          <p>
            Sharpmonk is built and maintained by{" "}
            <a href="https://www.linkedin.com/in/ch-shravan-kumar-b6a89974/" target="_blank" rel="noopener noreferrer">
              Shravan Cherukuri
            </a>
            , a software engineer, as an independent, self-funded project. It
            is a sister site to <a href="https://upaman.com">Upaman</a> — a
            decision-first platform of free financial calculators, workflows,
            and guides by the same maker. If these insurance tools were useful,
            the <a href="https://upaman.com">Upaman calculators</a> cover
            paychecks, loans, tax, compound interest, and long-term savings.
          </p>
          <p>
            Sharpmonk is not an insurance company, agent, broker, or carrier,
            and we don&apos;t sell your information to one. The site is
            supported by display advertising, which is disclosed in the{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </p>

          <h2>What&apos;s next</h2>
          <p>
            Insurance is the first category. More free, transparent
            calculators are planned — the goal is the same each time: real
            math, shown in the open, with no form to unlock it.
          </p>

          <h2>Questions or feedback</h2>
          <p>
            Reach out any time via the <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
