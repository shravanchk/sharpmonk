import type { Metadata } from "next";
import IconBadge from "@/components/IconBadge";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import UmbrellaCalculator from "@/components/calculator/UmbrellaCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import HowToSteps from "@/components/calculator/HowToSteps";
import MethodologyPanel from "@/components/calculator/MethodologyPanel";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/calculators/umbrella-insurance" },
  title: "Umbrella Insurance Calculator — Extra Liability Coverage Cost",
  description:
    "Estimate the cost of an umbrella (excess liability) insurance policy based on coverage limit, underlying auto/home policies, and claims history.",
};

const FAQS = [
  {
    q: "What does umbrella insurance actually cover?",
    a: "It adds extra liability protection above the limits of your auto and home policies — for example, if you're sued for more than your auto policy's liability limit after a serious accident, umbrella coverage picks up the rest.",
  },
  {
    q: "Who typically needs it?",
    a: "Anyone with meaningful assets to protect (home equity, savings, investments) or elevated liability exposure — a pool, a dog, teen drivers, or rental property are common triggers people cite.",
  },
  {
    q: "Why is it so cheap relative to the coverage amount?",
    a: "Umbrella claims are relatively rare because your underlying auto/home policy has to be exhausted first. That lower claim frequency is why $1M+ of coverage often costs a few hundred dollars a year.",
  },
];

export default function UmbrellaInsurancePage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Calculators", href: "/calculators" }, { label: "Umbrella insurance", href: "/calculators/umbrella-insurance" }]} />
          <div className="mb-5"><IconBadge name="umbrella" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            Umbrella insurance
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Protect your assets beyond your policy limits
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            See roughly what extra liability coverage costs on top of your
            existing auto and home policies.
          </p>
        </div>

        <div className="mt-10">
          <UmbrellaCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative umbrella (excess liability) premium estimate based on the generic factors shown below — not a quote from any insurer." />
        </div>

        <div className="mt-16 max-w-3xl">
          <HowToSteps
            name="How to use the Umbrella Insurance Calculator"
            description="Estimate the cost of an umbrella liability policy."
            steps={[
              { name: "Pick a coverage limit", text: "How much extra liability protection you want above your auto and home policy limits." },
              { name: "Count your underlying policies", text: "How many auto and home/property policies the umbrella would sit on top of." },
              { name: "Add prior claims", text: "Liability claims in the past few years raise the estimate." },
              { name: "Read the estimate", text: "See the illustrative annual and monthly cost for that coverage limit." },
            ]}
          />
        </div>

        <div className="mt-10 max-w-3xl">
          <MethodologyPanel
            inputs={["Umbrella coverage limit", "Number of underlying auto policies", "Number of underlying home/property policies", "Prior liability claims"]}
            formulas={[
              "Base = coverage limit in millions × ≈$175 per $1M of coverage per year",
              "Annual premium = (base + surcharge for additional underlying policies) × prior-claims multiplier",
            ]}
            assumptions={[
              "Generic, publicly-representative rate assumptions — not a filed rate table from any specific insurer",
              "Assumes underlying auto/home liability limits already meet the minimums insurers typically require before writing an umbrella policy",
              "Does not model excluded risks (e.g. business liability, intentional acts) that a personal umbrella policy typically does not cover",
            ]}
            sources={[
              { label: "Insurance Information Institute — What is an umbrella liability policy?", url: "https://www.iii.org/article/what-umbrella-liability" },
              { label: "Insurance Information Institute — Should I purchase an umbrella liability policy?", url: "https://www.iii.org/article/should-i-purchase-umbrella-liability-policy-0" },
            ]}
          />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/calculators/umbrella-insurance" />
      </div>
    </main>
  );
}
