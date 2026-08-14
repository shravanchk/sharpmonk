import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import IconBadge from "@/components/IconBadge";
import IndiaTermCalculator from "@/components/calculator/IndiaTermCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import TrustPanel from "@/components/calculator/TrustPanel";
import { estimateIndiaTermLife } from "@/lib/insuranceIndia";
import { INDIA_AGES, INDIA_COVERS, indiaTermSlug } from "@/lib/longtail";

export const metadata: Metadata = {
  alternates: { canonical: "/in/term-life" },
  title: "Term Life Insurance Premium Calculator (India, ₹)",
  description:
    "Free term life insurance premium calculator for India. Estimate the annual and monthly premium for a pure term cover by sum assured, age, policy term, and tobacco use — in rupees.",
};

const FAQS = [
  {
    q: "How is a term insurance premium decided in India?",
    a: "Mainly by your age, the sum assured, the policy term, and whether you use tobacco. Younger, non-smoking buyers lock in far lower rates, and premiums stay level for the whole term on most plans. Occupation, income, and medical history also matter with real insurers.",
  },
  {
    q: "How much term cover should I take?",
    a: "A common rule of thumb is 10–15× your annual income, plus any outstanding loans (home, car) and future goals like children's education. This calculator estimates the cost of a chosen sum assured; it doesn't recommend a figure.",
  },
  {
    q: "Is the premium shown final?",
    a: "No. It's an illustrative estimate using generic rating factors, not a quote. Actual premiums depend on the insurer, riders, medical underwriting, and current IRDAI-approved rates.",
  },
];

export default function IndiaTermLifePage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "India", href: "/in" }, { label: "Term life", href: "/in/term-life" }]} />
          <div className="mb-5"><IconBadge name="shield" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            India · term life
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Term life insurance premium calculator
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Estimate the yearly and monthly premium for a pure term cover in
            rupees. Move the sliders to see how age, sum assured, and term
            change the number — and exactly which factor drives it.
          </p>
        </div>

        <div className="mt-10">
          <IndiaTermCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative term life premium estimate for India using generic rating factors — not a quote or a substitute for an IRDAI-registered advisor." />
        </div>

        {/* Static rate chart. The calculator above only yields numbers after
            hydration, so these figures exist to be readable — by someone
            skimming, and by a crawler — without touching a slider. Each cell
            opens the full page for that sum assured and age. */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Term insurance premium chart by age and cover
          </h2>
          <p className="text-muted mt-3 max-w-3xl leading-relaxed">
            Estimated annual premium for a 20-year term, non-smoker. Pick any
            figure for the full breakdown at that cover and age — including
            smoker rates and other policy terms.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--line-strong)]">
                  <th scope="col" className="text-muted py-2.5 pr-4 text-left font-mono text-xs tracking-[0.14em] uppercase">
                    Age
                  </th>
                  {INDIA_COVERS.map((cover) => (
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
                {INDIA_AGES.map((age) => (
                  <tr key={age} className="border-b border-[var(--line)]">
                    <th scope="row" className="py-3 pr-4 text-left font-medium">
                      {age}
                    </th>
                    {INDIA_COVERS.map((cover) => {
                      const r = estimateIndiaTermLife({
                        age,
                        smoker: false,
                        sumAssured: cover.value,
                        term: 20,
                      });
                      return (
                        <td key={cover.slug} className="py-3 pl-4 text-right tabular-nums">
                          <Link
                            href={`/in/term-life/${indiaTermSlug(cover.slug, age)}`}
                            className="text-[var(--accent)] underline-offset-2 hover:underline"
                          >
                            ₹{r.annualPremium.toLocaleString("en-IN")}
                          </Link>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-muted mt-4 text-sm leading-relaxed">
            Figures are the annual base premium, before 18% GST.
          </p>
        </section>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/in/term-life" />
      </div>
    </main>
  );
}
