import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import InsuranceCalculator from "@/components/calculator/InsuranceCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculator" },
  title: "Free Insurance Calculator — Life, Health, Auto & Home Estimates",
  description:
    "Estimate life, health, auto, and home insurance premiums instantly with Sharpmonk's free calculator. No signup, no phone calls, transparent breakdown.",
};

const FAQS = [
  {
    q: "Is this a real insurance quote?",
    a: "No. This tool produces an educational estimate based on generic, publicly-known rating factors (age, coverage amount, deductible, risk region, and so on). Real quotes depend on underwriting data specific to you and the insurer you apply with, and can differ significantly from this estimate.",
  },
  {
    q: "Why do estimates vary so much between insurers?",
    a: "Every insurer weighs rating factors differently, uses its own claims data, and applies state-specific rules. That's why shopping around with 3–5 insurers typically finds a meaningfully better price than accepting the first quote.",
  },
  {
    q: "What factors move my premium the most?",
    a: "For life and health insurance, age and tobacco use dominate. For auto insurance, driver age, violation history, and coverage level matter most. For home insurance, coverage level, deductible, and regional catastrophe risk are the biggest levers.",
  },
  {
    q: "Do you store or sell the numbers I enter?",
    a: "No. Every calculation runs in your browser — nothing you type into the calculator is sent to a server or stored. See the Privacy Policy for details on the limited analytics/advertising cookies the rest of the site may use.",
  },
];

export default function CalculatorPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Premium estimator", href: "/calculator" }]} />
          <div className="mb-5"><IconBadge name="shield" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Insurance calculator
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Estimate your premium in under a minute
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Pick a policy type below. The estimate and its breakdown update
            live as you adjust the inputs — nothing leaves your browser.
          </p>
        </div>

        <div className="mt-10">
          <InsuranceCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides planning estimates for life, health, auto, and home premiums based on the generic assumptions shown below — not a quote from any insurer." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Sharpmonk Insurance Calculator"
            description="Estimate life, health, auto, or home insurance premiums."
            steps={[
              { name: "Pick a policy type", text: "Choose Life, Health, Auto, or Home from the tabs above the form." },
              { name: "Enter the basics", text: "Age, coverage amount, vehicle or home value, deductible — whatever that policy type rates on." },
              { name: "Read the live estimate", text: "The monthly and annual premium update as you type, with a breakdown of what's driving the number." },
              { name: "Check the methodology", text: "Open the panel below to see the exact formula and rating factors used for that policy type." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={[
              "Life: age, coverage amount, term length, self-reported health rating, tobacco use",
              "Health: age, plan tier, regional cost of care, tobacco use",
              "Auto: driver age, years licensed, vehicle value, coverage level, violation history, annual mileage, regional risk",
              "Home: home value, home age, construction type, coverage level, deductible, regional risk, claims history",
            ]}
            formulas={[
              "Life: age-banded mortality rate per $1,000 of coverage, adjusted by tobacco use, health rating, and term-length multipliers",
              "Health: plan-tier base premium × an ACA-style 3:1 age curve × a tobacco surcharge × a regional cost index",
              "Auto: coverage-level base rate × driver-age, experience, violation, vehicle-value, mileage, and regional multipliers",
              "Home: 0.42% of home value per year × home-age, construction, coverage, deductible, region, and claims-history multipliers",
            ]}
            assumptions={[
              "All rates are generic, publicly-representative approximations — not a filed rate table from any specific insurer",
              "State-specific regulation, credit-based insurance scores, and individual underwriting are not modeled",
              "Health estimates assume an ACA individual marketplace plan; employer coverage pricing differs",
            ]}
            sources={[
              { label: "Insurance Information Institute — Life insurance basics", url: "https://www.iii.org/article/life-insurance-basics" },
              { label: "HealthCare.gov — How plans set your premiums", url: "https://www.healthcare.gov/how-plans-set-your-premiums/" },
              { label: "Insurance Information Institute — Auto insurance basics", url: "https://www.iii.org/article/auto-insurance-basics" },
              { label: "Insurance Information Institute — Homeowners insurance basics", url: "https://www.iii.org/article/homeowners-insurance-basics" },
            ]}
          />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Frequently asked questions
          </h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculator" />
      </div>
    </main>
  );
}
