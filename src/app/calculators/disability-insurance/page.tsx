import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import DisabilityCalculator from "@/components/calculator/DisabilityCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/disability-insurance" },
  title: "Disability Insurance Calculator — Income Gap & Cost Estimate",
  description:
    "Estimate your long-term disability insurance coverage gap and illustrative premium based on income, employer coverage, and occupation risk.",
};

const FAQS = [
  {
    q: "Why would I need disability insurance if I have employer coverage?",
    a: "Employer-provided long-term disability (LTD) often replaces only 50–60% of income and may be capped at a low dollar amount. Many people supplement it with an individual policy to close the gap, which is what the coverage-gap figure above estimates.",
  },
  {
    q: "Why does occupation matter so much?",
    a: "Insurers price disability coverage heavily on injury/illness risk tied to your job. Physically demanding occupations carry meaningfully higher premiums than desk jobs for the same benefit amount.",
  },
  {
    q: "Is this the same as short-term disability?",
    a: "No — this estimates long-term disability (LTD) coverage, which kicks in after a waiting period and can last years. Short-term disability is a separate, usually employer-provided benefit for shorter absences.",
  },
];

export default function DisabilityInsurancePage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Disability insurance", href: "/calculators/disability-insurance" }]} />
          <div className="mb-5"><IconBadge name="briefcase" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Disability insurance
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            What would a disability cost you?
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Find the gap between what your employer covers and what you&apos;d
            actually need, plus an illustrative cost to close it.
          </p>
        </div>

        <div className="mt-10">
          <DisabilityCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative income-replacement gap and cost estimate for long-term disability insurance — not a quote from any insurer." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Disability Insurance Calculator"
            description="Estimate your long-term disability coverage gap and illustrative premium."
            steps={[
              { name: "Enter your income", text: "Monthly income and the percentage you'd want replaced if you couldn't work." },
              { name: "Add employer coverage", text: "The percentage of income your employer's group LTD plan already covers, if any." },
              { name: "Pick your occupation risk", text: "Office, field, or manual work — this is the biggest driver of the premium estimate." },
              { name: "Read the gap and cost", text: "See the monthly benefit gap and an illustrative annual/monthly premium to close it." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={["Age", "Monthly income", "Target income-replacement percentage", "Employer-provided LTD coverage percentage", "Occupation risk class"]}
            formulas={[
              "Coverage gap = (income × target replacement %) − (income × employer coverage %)",
              "Estimated annual premium = annual coverage gap × 2% base rate × age multiplier × occupation multiplier",
            ]}
            assumptions={[
              "2% of the covered annual benefit is used as an illustrative base rate for individual LTD riders — real quotes commonly range 1–3%",
              "Does not model elimination periods, benefit periods, or own-occupation vs. any-occupation policy definitions, which materially affect real pricing",
              "Occupation risk is simplified to three broad classes; real underwriting uses detailed job-class tables",
            ]}
            sources={[
              { label: "Insurance Information Institute — How are disability premiums determined?", url: "https://www.iii.org/article/how-are-disability-premiums-determined" },
              { label: "Insurance Information Institute — Buying disability insurance", url: "https://www.iii.org/article/buying-disability-insurance" },
            ]}
          />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculators/disability-insurance" />
      </div>
    </main>
  );
}
