import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleToc from "@/components/ArticleToc";
import ArticleSchema from "@/components/ArticleSchema";
import GuideCTA from "@/components/GuideCTA";
import FAQAccordion from "@/components/FAQAccordion";

const PATH = "/guides/how-much-life-insurance-do-you-need";
const PUBLISHED = "2026-07-24";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "How Much Life Insurance Do You Need? (DIME Method + Examples)",
  description:
    "Work out exactly how much life insurance to buy using the DIME method — replace income, clear debts and the mortgage, and fund education — with a worked example and a free calculator.",
};

const FAQS = [
  {
    q: "Does everyone need life insurance?",
    a: "Not necessarily. If no one depends on your income and you have no shared debts, you may not need cover at all. Life insurance matters most when other people — a partner, children, ageing parents, or a co-signed loan — would be financially worse off without you.",
  },
  {
    q: "Should I include my spouse's income in the calculation?",
    a: "Size each person's cover around the gap their absence would create. If both partners earn, each typically needs enough to replace their own income and their share of shared debts. A stay-at-home parent still has real replacement value (childcare, household work), so don't insure them at zero.",
  },
  {
    q: "Is the life cover from my employer enough?",
    a: "Usually not on its own. Group cover is typically one to two times salary and disappears when you change jobs. It's a useful top-up, but most families need an individual policy sized to their actual obligations.",
  },
  {
    q: "How often should I re-check the number?",
    a: "Any time your obligations change materially — a new mortgage, a child, a big income change, or clearing a large debt. A quick re-run once a year keeps the cover roughly matched to your life.",
  },
];

export default function Page() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <ArticleSchema
        headline="How Much Life Insurance Do You Need? (DIME Method)"
        description="Size your life insurance cover with the DIME method — replace income, clear debts and mortgage, fund education — with a worked example."
        path={PATH}
        datePublished={PUBLISHED}
      />
      <div id="article" className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "How much life insurance", href: PATH },
          ]}
        />
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Guide</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          How much life insurance do you need?
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          The right coverage amount isn’t a guess — it’s the money your family
          would need to replace your income, clear debts, and fund big future
          costs if you were gone. Here’s how to size it in a few minutes.
        </p>

        <ArticleToc />

        <div className="prose-legal mt-10">
          <h2>Start with the job the payout has to do</h2>
          <p>
            A life insurance payout has one purpose: to keep the people who
            depend on you financially whole. So the right number isn’t a round
            figure that sounds comforting — it’s the total of everything your
            income currently covers, minus what your family already has to fall
            back on. Four things drive almost all of it: ongoing income, debts,
            the mortgage, and future costs like education.
          </p>

          <h2>The DIME method</h2>
          <p>
            DIME is the most widely used quick framework for this. You add up
            four buckets, then subtract what you already have:
          </p>
          <ul>
            <li><strong>Debt</strong> — non-mortgage debts (credit cards, car and personal loans) that would otherwise fall to your family.</li>
            <li><strong>Income</strong> — your annual income multiplied by the number of years dependents would rely on it (commonly around 10 years, or until the youngest child is independent).</li>
            <li><strong>Mortgage</strong> — the remaining balance, so the family can keep the home free and clear.</li>
            <li><strong>Education</strong> — estimated cost per child multiplied by the number of children.</li>
          </ul>
          <p>
            Add those four for a <strong>gross need</strong>, then subtract any
            existing life insurance and liquid savings to get the{" "}
            <strong>net cover you should buy</strong>.
          </p>

          <h3>Worked example</h3>
          <table>
            <thead>
              <tr><th>Component</th><th>Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Debt (cards + car loan)</td><td>$15,000</td></tr>
              <tr><td>Income replacement (10 × $80,000)</td><td>$800,000</td></tr>
              <tr><td>Mortgage balance</td><td>$250,000</td></tr>
              <tr><td>Education (1 child × $80,000)</td><td>$80,000</td></tr>
              <tr><td><strong>Gross need</strong></td><td><strong>$1,145,000</strong></td></tr>
              <tr><td>Less existing cover + savings</td><td>−$20,000</td></tr>
              <tr><td><strong>Recommended cover</strong></td><td><strong>≈ $1,125,000</strong></td></tr>
            </tbody>
          </table>
        </div>

        <GuideCTA
          href="/calculators/life-insurance-needs"
          icon="clipboard"
          title="Run your own DIME numbers"
          body="Enter your income, debts, mortgage, and education costs to get a recommended cover figure with a breakdown."
          cta="Life insurance needs calculator"
        />

        <div className="prose-legal mt-2">
          <h2>The quicker rule of thumb</h2>
          <p>
            If you just want a ballpark in ten seconds, <strong>10–15× your
            annual income</strong> is the common heuristic — so someone earning
            $80,000 lands somewhere between $800,000 and $1.2M. It’s blunt
            because it ignores your specific debts and existing savings, but
            it’s a fine sanity check against the DIME figure. When the two are
            far apart, trust DIME.
          </p>

          <h2>How long should the term be?</h2>
          <p>
            Match the term to how long your dependents actually need protection
            — usually until the mortgage is paid off and the children are
            financially independent. For most families that means a 20- or
            30-year term. A longer term costs more per year but locks in the
            rate while you’re younger and healthier.
          </p>

          <h2>Common mistakes to avoid</h2>
          <ul>
            <li>Insuring only the higher earner — a stay-at-home parent’s work has real replacement cost too.</li>
            <li>Picking a round number that “feels right” instead of checking it against actual obligations.</li>
            <li>Relying only on employer cover, which is usually small and vanishes when you leave.</li>
            <li>Confusing <em>how much cover</em> (this guide) with <em>how much it costs</em> — those are two different questions.</li>
          </ul>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <h2 className="text-lg font-semibold tracking-tight">Keep going</h2>
          <ul className="text-muted mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/guides/term-vs-whole-life-insurance" className="text-[var(--accent)] underline underline-offset-2">Term vs. whole life insurance →</Link></li>
            <li><Link href="/calculators/life-insurance-needs" className="text-[var(--accent)] underline underline-offset-2">Life insurance needs calculator →</Link></li>
            <li><Link href="/calculator" className="text-[var(--accent)] underline underline-offset-2">Premium estimator (what a policy costs) →</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
