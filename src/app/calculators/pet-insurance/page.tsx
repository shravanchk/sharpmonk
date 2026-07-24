import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import PetCalculator from "@/components/calculator/PetCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/pet-insurance" },
  title: "Pet Insurance Calculator — Estimate Monthly Premium for Dogs & Cats",
  description:
    "Free pet insurance calculator. Estimate monthly premiums for dogs and cats based on age, breed size, coverage level, deductible, and reimbursement rate.",
};

const FAQS = [
  {
    q: "Why does my pet's age matter so much?",
    a: "Like human health insurance, older pets are statistically more likely to develop conditions that generate claims, so premiums rise with age — often sharply after age 7–8.",
  },
  {
    q: "What's the difference between accident-only and comprehensive plans?",
    a: "Accident-only plans cover injuries (broken bones, swallowed objects) but not illnesses. Accident & illness plans add coverage for conditions like cancer or diabetes. Comprehensive/wellness plans also cover routine care like vaccines and checkups.",
  },
  {
    q: "How do deductible and reimbursement rate affect cost?",
    a: "A higher deductible (you pay more before coverage kicks in) lowers your premium. A higher reimbursement rate (the insurer pays a larger share of each claim) raises it.",
  },
];

export default function PetInsurancePage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Pet insurance", href: "/calculators/pet-insurance" }]} />
          <div className="mb-5"><IconBadge name="paw" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Pet insurance
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Estimate your pet&apos;s insurance premium
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Dogs, cats, puppies, seniors &mdash; adjust the inputs and watch
            the estimate update live.
          </p>
        </div>

        <div className="mt-10">
          <PetCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative pet insurance premium estimate based on the generic factors shown below — not a quote from any insurer." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Pet Insurance Calculator"
            description="Estimate a monthly pet insurance premium for a dog or cat."
            steps={[
              { name: "Pick species and age", text: "Dog or cat, and their current age — the single biggest driver of the estimate." },
              { name: "Add breed size (dogs)", text: "Small, medium, or large breed, since larger dogs tend to have higher claim costs." },
              { name: "Choose a coverage level", text: "Accident-only, accident & illness, or comprehensive with wellness." },
              { name: "Set deductible and reimbursement", text: "A higher deductible lowers the premium; a higher reimbursement rate raises it." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={["Species (dog/cat)", "Age", "Breed size (dogs)", "Coverage level", "Annual deductible", "Reimbursement percentage"]}
            formulas={[
              "Monthly premium = species base rate × age multiplier × breed-size multiplier × coverage-level multiplier × deductible multiplier × reimbursement multiplier",
            ]}
            assumptions={[
              "Generic, publicly-representative rate assumptions — not a filed rate table from any specific insurer",
              "Does not model breed-specific hereditary condition exclusions or waiting periods, which vary by carrier",
              "Assumes no pre-existing conditions, which most pet insurers exclude by default",
            ]}
            sources={[
              { label: "NAIC — Pet insurance consumer information", url: "https://content.naic.org/insurance-topics/pet-insurance" },
            ]}
          />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculators/pet-insurance" />
      </div>
    </main>
  );
}
