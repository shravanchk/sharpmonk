import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import RentersCalculator from "@/components/calculator/RentersCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/renters-insurance" },
  title: "Renters Insurance Calculator — Estimate Your Monthly Premium",
  description:
    "Free renters insurance calculator. Estimate your monthly premium based on personal property value, liability coverage, deductible, and location risk.",
};

const FAQS = [
  {
    q: "Do I really need renters insurance?",
    a: "Most landlords require it, and it's one of the cheapest ways to protect your belongings and cover liability if someone is injured in your rental — often just a few dollars more per month than going without it.",
  },
  {
    q: "What does renters insurance not cover?",
    a: "It doesn't cover the building itself (that's your landlord's policy) or damage from floods and earthquakes, which usually require separate coverage.",
  },
  {
    q: "How is my premium calculated?",
    a: "Insurers weigh the value of belongings you're insuring, the liability limit you choose, your deductible, and location-based risk (theft rates, weather). This calculator mirrors those same generic factors.",
  },
];

export default function RentersInsurancePage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Renters insurance", href: "/calculators/renters-insurance" }]} />
          <div className="mb-5"><IconBadge name="key" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Renters insurance
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            What will renters insurance cost you?
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Enter what you own and the coverage you want — the estimate
            updates instantly.
          </p>
        </div>

        <div className="mt-10">
          <RentersCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative renters insurance premium estimate based on the generic factors shown below — not a quote from any insurer." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Renters Insurance Calculator"
            description="Estimate your monthly renters insurance premium."
            steps={[
              { name: "Value your belongings", text: "A rough total for furniture, electronics, clothing, and other personal property." },
              { name: "Pick a liability limit", text: "How much coverage you want if someone is injured in your rental or you damage someone else's property." },
              { name: "Set your deductible", text: "What you'd pay out of pocket before coverage kicks in on a claim." },
              { name: "Add location and claims history", text: "Regional risk and any past claims adjust the estimate up or down." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={["Personal property value", "Liability coverage limit", "Deductible", "Regional risk", "Claims history (5 years)"]}
            formulas={[
              "Base = (personal property value × 0.4%) + a flat liability-limit charge",
              "Annual premium = base × deductible multiplier × regional-risk multiplier × claims-history multiplier",
            ]}
            assumptions={[
              "Generic, publicly-representative rate assumptions — not a filed rate table from any specific insurer",
              "Does not model scheduled/high-value items (jewelry, art) that often need separate riders",
              "Flood and earthquake damage are excluded from standard renters policies and are not part of this estimate",
            ]}
            sources={[
              { label: "Insurance Information Institute — Renters insurance", url: "https://www.iii.org/article/renters-insurance" },
            ]}
          />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculators/renters-insurance" />
      </div>
    </main>
  );
}
