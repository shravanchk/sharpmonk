import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import LifeNeedsCalculator from "@/components/calculator/LifeNeedsCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/life-insurance-needs" },
  title: "How Much Life Insurance Do I Need? — DIME Method Calculator",
  description:
    "Free life insurance needs calculator using the DIME method (Debt, Income, Mortgage, Education) to estimate how much coverage your family actually needs.",
};

const FAQS = [
  {
    q: "What is the DIME method?",
    a: "DIME stands for Debt, Income, Mortgage, Education — four categories of financial obligation a life insurance payout is typically meant to cover. Adding them up and subtracting existing coverage and savings gives a reasonable starting estimate for how much coverage to buy.",
  },
  {
    q: "How many years of income should I replace?",
    a: "A common range is 5–15 years, depending on how long dependents will rely on that income — for example, until the youngest child finishes school, or until a spouse's own retirement savings are on track.",
  },
  {
    q: "Does this replace a conversation with a financial advisor?",
    a: "No. This is a starting point for budgeting the conversation, not a substitute for advice tailored to your full financial picture, tax situation, and existing coverage.",
  },
];

export default function LifeInsuranceNeedsPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Life insurance needs", href: "/calculators/life-insurance-needs" }]} />
          <div className="mb-5"><IconBadge name="clipboard" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Life insurance
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            How much life insurance do you need?
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            This is different from the{" "}
            <a href="/calculator" className="text-[var(--accent)] underline underline-offset-2">
              premium estimator
            </a>{" "}
            — it answers &ldquo;how much coverage&rdquo;, not &ldquo;how much will it cost&rdquo;, using the
            widely-used DIME method.
          </p>
        </div>

        <div className="mt-10">
          <LifeNeedsCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides a planning estimate for life insurance coverage using the DIME method — not a substitute for a licensed agent's needs analysis." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Life Insurance Needs Calculator"
            description="Estimate how much life insurance coverage you need using the DIME method."
            steps={[
              { name: "Enter income and years to replace", text: "How much you earn annually, and how many years dependents would need that income replaced." },
              { name: "Add debts and mortgage", text: "Non-mortgage debt (cards, loans) and your remaining mortgage balance." },
              { name: "Add education costs", text: "Number of children and an estimated education cost per child." },
              { name: "Subtract what you already have", text: "Existing life insurance and liquid savings reduce the net need." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={[
              "Annual income and years of income to replace",
              "Non-mortgage debt and remaining mortgage balance",
              "Number of children and education cost per child",
              "Existing life insurance coverage and liquid savings",
            ]}
            formulas={[
              "Gross need = non-mortgage debt + (annual income × years to replace) + mortgage balance + (children × education cost per child)",
              "Net need = gross need − existing life insurance − liquid savings",
            ]}
            assumptions={[
              "Does not account for inflation, investment growth on the payout, or a family's changing needs over time",
              "A widely-used starting-point method (DIME), not a substitute for a full financial needs analysis",
              "Treats each input as a fixed, known amount rather than a range or probability",
            ]}
            sources={[
              { label: "Insurance Information Institute — How much life insurance do I need?", url: "https://www.iii.org/article/how-much-life-insurance-do-i-need" },
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

        <RelatedCalculators current="/calculators/life-insurance-needs" />
      </div>
    </main>
  );
}
