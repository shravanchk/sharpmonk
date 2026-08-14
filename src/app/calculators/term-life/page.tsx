import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import Icon from "@/components/Icon";
import IconBadge from "@/components/IconBadge";
import RelatedCalculators from "@/components/RelatedCalculators";
import TrustPanel from "@/components/calculator/TrustPanel";
import { usd } from "@/lib/format";
import { estimateLife, type TermYears } from "@/lib/insuranceMath";
import { US_AGES, US_COVERS, usTermSlug } from "@/lib/longtail";

/**
 * Hub for the generated US term-life cost pages.
 *
 * It is a rate chart in its own right — "term life insurance rates by age" is
 * the query — and it is also the crawl entry point for the 32 generated
 * pages, every one of which is one click from this matrix.
 */

const title = "Term Life Insurance Rates by Age (2026 Cost Chart)";
const description =
  "Estimated monthly term life insurance cost by age and coverage amount, from $250,000 to $2 million, ages 25 to 60. Non-smoker, 20-year level term.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/calculators/term-life" },
  openGraph: { title, description, url: "/calculators/term-life", type: "article" },
  twitter: { card: "summary_large_image", title, description },
};

const FAQS = [
  {
    q: "How much does term life insurance cost per month?",
    a: "For a healthy non-smoker, a $500,000 20-year term policy runs roughly $20 a month at 30, $27 at 35, and $35 at 40 on these estimates. Cost is driven overwhelmingly by age and tobacco use — the same policy at 55 is several times the price it would have been at 35.",
  },
  {
    q: "At what age does life insurance get expensive?",
    a: "The curve is gentle through the thirties and steepens sharply after about 45: mortality cost roughly doubles each decade from there. The chart above shows the inflection clearly — the jump from 45 to 55 is far larger than the jump from 25 to 35.",
  },
  {
    q: "Is a 20-year or 30-year term better?",
    a: "Match the term to the years your dependants actually rely on your income — usually until the mortgage is paid and the children are independent. A 30-year term costs more per year but removes the risk of needing cover again at an older age, when it will be much more expensive.",
  },
  {
    q: "Are these real quotes?",
    a: "No. Every figure is an illustrative estimate built from generic, publicly-documented rating factors, not from any insurer's filed rate table. Use them for budgeting and then get actual quotes from several carriers — for the same person, quotes routinely differ by 30–50%.",
  },
];

export default function TermLifeHubPage() {
  const rows = US_AGES.map((age) => ({
    age,
    cells: US_COVERS.map((cover) => ({
      cover,
      monthly: usd(
        estimateLife({
          age,
          smoker: false,
          healthRating: "good",
          coverageAmount: cover.value,
          term: 20 as TermYears,
        }).monthlyPremium,
      ),
      href: `/calculators/term-life/${usTermSlug(cover.slug, age)}`,
    })),
  }));

  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Calculators", href: "/calculators" },
            { label: "Term life cost", href: "/calculators/term-life" },
          ]}
        />

        <div className="mb-5">
          <IconBadge name="shield" size={24} />
        </div>
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
          Term life cost
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Term life insurance rates by age
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Estimated monthly cost of a 20-year level term policy for a non-smoker
          in good health. Pick any cell for the full breakdown at that age and
          coverage amount — including the smoker rate and other term lengths.
        </p>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-sm">
            <caption className="text-muted mb-3 text-left text-xs">
              Estimated monthly premium, 20-year level term, non-smoker, good health.
            </caption>
            <thead>
              <tr className="border-b border-[var(--line-strong)]">
                <th
                  scope="col"
                  className="text-muted py-2.5 pr-4 text-left font-mono text-xs tracking-[0.14em] uppercase"
                >
                  Age
                </th>
                {US_COVERS.map((cover) => (
                  <th
                    key={cover.slug}
                    scope="col"
                    className="text-muted py-2.5 pl-4 text-right font-mono text-xs tracking-[0.14em] uppercase"
                  >
                    {cover.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.age} className="border-b border-[var(--line)]">
                  <th scope="row" className="py-3 pr-4 text-left font-medium">
                    Age {row.age}
                  </th>
                  {row.cells.map((cell) => (
                    <td key={cell.cover.slug} className="py-3 pl-4 text-right tabular-nums">
                      <Link
                        href={cell.href}
                        className="text-[var(--accent)] underline-offset-2 hover:underline"
                      >
                        {cell.monthly}
                      </Link>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-muted mt-5 text-sm leading-relaxed">
          Figures are per month. Add roughly 2.5× for smoker rates, and see any
          individual page for the 10-, 20- and 30-year term comparison.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/calculator"
            className="btn-glow inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold"
          >
            Run your own numbers
            <Icon name="arrow-right" size={16} />
          </Link>
          <Link
            href="/calculators/life-insurance-needs"
            className="btn-ghost rounded-full px-6 py-2.5 text-sm font-medium"
          >
            How much cover do I need?
          </Link>
        </div>

        <div className="mt-12 max-w-3xl">
          <TrustPanel scope="This chart shows illustrative estimates from generic, publicly-documented rating factors — not quotes, and not drawn from any insurer's filed rates." />
        </div>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculator" />
      </div>
    </main>
  );
}
