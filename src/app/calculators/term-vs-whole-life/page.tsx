import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import TermVsWholeCalculator from "@/components/calculator/TermVsWholeCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/term-vs-whole-life" },
  title: "Term vs. Whole Life Insurance Calculator — Cost & Value Comparison",
  description:
    "Compare term and whole life insurance side by side: monthly cost, cash value growth, and what investing the premium difference could be worth.",
};

const FAQS = [
  {
    q: "Why is whole life so much more expensive than term?",
    a: "Term life only pays out if you die during the term. Whole life is permanent and builds cash value you (or your beneficiaries) can eventually access, so insurers price it to cover that lifelong guarantee — typically 10-15x the cost of an equivalent term policy at younger ages.",
  },
  {
    q: "What does “buy term, invest the difference” mean?",
    a: "It's a popular strategy: buy the cheaper term policy and invest what you would have spent on whole life premiums instead. Whether it beats whole life depends heavily on your actual investment returns and discipline over the full term.",
  },
  {
    q: "Is whole life ever the better choice?",
    a: "It can suit people who want permanent coverage, a forced-savings vehicle, or estate-planning benefits like tax-advantaged cash value growth. It's a smaller-but-real use case compared to the larger term-buying population.",
  },
];

export default function TermVsWholeLifePage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Term vs. whole life", href: "/calculators/term-vs-whole-life" }]} />
          <div className="mb-5"><IconBadge name="scale" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Term vs. whole life
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Term or whole life? See the real numbers
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Same age, same coverage amount, side by side &mdash; including
            what the premium difference could be worth if invested instead.
          </p>
        </div>

        <div className="mt-10">
          <TermVsWholeCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative cost comparison for planning purposes — not a quote from any insurer." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Term vs. Whole Life Calculator"
            description="Compare term and whole life insurance cost and cash value for the same coverage amount."
            steps={[
              { name: "Enter age and coverage amount", text: "The same inputs are used to price both the term and whole life estimates." },
              { name: "Pick a term length", text: "10, 20, or 30 years — whole life is compared over the same time horizon." },
              { name: "Set an expected investment return", text: "Used for the \"invest the difference\" projection, not the insurance pricing itself." },
              { name: "Compare the two cards", text: "See monthly cost, estimated whole life cash value, and the projected value of investing the premium gap." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={["Age", "Coverage amount", "Term length", "Self-reported health rating", "Tobacco use", "Expected investment return"]}
            formulas={[
              "Term premium: same age-banded mortality formula used in the premium estimator",
              "Whole life premium ≈ term premium × 11 (a widely-cited rule-of-thumb multiplier for permanent vs. term coverage at comparable ages)",
              "Estimated cash value ≈ 50% of whole life premiums paid over the comparison term (a conservative illustrative assumption — actual cash value schedules vary by carrier and policy design)",
              "Invested-difference projection: future value of a monthly annuity equal to the premium gap, compounded at the entered return rate",
            ]}
            assumptions={[
              "The whole-life multiplier and cash-value assumption are illustrative rules of thumb, not a specific carrier's policy illustration",
              "Ignores taxes, fees, policy loans, and dividend variability that affect real whole life cash value",
              "The invested-difference projection assumes disciplined, consistent monthly investing at a constant return — real returns vary year to year",
            ]}
            sources={[
              { label: "Insurance Information Institute — What are the principal types of life insurance?", url: "https://www.iii.org/article/what-are-principal-types-life-insurance" },
              { label: "Insurance Information Institute — Life insurance basics", url: "https://www.iii.org/article/life-insurance-basics" },
            ]}
          />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculators/term-vs-whole-life" />
      </div>
    </main>
  );
}
