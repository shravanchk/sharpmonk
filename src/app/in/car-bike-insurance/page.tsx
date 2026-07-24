import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import IconBadge from "@/components/IconBadge";
import IndiaMotorCalculator from "@/components/calculator/IndiaMotorCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/in/car-bike-insurance" },
  title: "Car & Bike Insurance Premium Calculator (India, ₹)",
  description:
    "Free motor insurance premium calculator for India. Estimate car and two-wheeler premiums — own-damage plus statutory third-party and 18% GST — with IDV, vehicle age, and No-Claim Bonus, in rupees.",
};

const FAQS = [
  {
    q: "What is IDV and why does it matter?",
    a: "IDV (Insured Declared Value) is the current market value of your vehicle and the maximum a comprehensive policy pays on total loss or theft. The own-damage premium is calculated as a percentage of IDV, so a higher IDV means a higher premium but a bigger payout.",
  },
  {
    q: "What's the difference between third-party and comprehensive?",
    a: "Third-party cover is legally mandatory and only pays for damage you cause to others. Comprehensive adds own-damage cover for your vehicle (accident, theft, fire) on top of third-party. This tool estimates both, plus 18% GST.",
  },
  {
    q: "How does No-Claim Bonus (NCB) work?",
    a: "NCB is a discount on the own-damage premium for every claim-free year, rising from 20% up to 50%. It applies only to the own-damage part, not to the statutory third-party premium.",
  },
];

export default function IndiaMotorPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "India", href: "/in" }, { label: "Car & bike insurance", href: "/in/car-bike-insurance" }]} />
          <div className="mb-5"><IconBadge name="car" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            India · motor
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Car &amp; bike insurance calculator
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Estimate your motor insurance premium in rupees — own-damage plus
            the statutory third-party cover and 18% GST — and see how IDV,
            vehicle age, and your No-Claim Bonus change the total.
          </p>
        </div>

        <div className="mt-10">
          <IndiaMotorCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative motor premium estimate for India using generic rating factors and representative statutory / GST figures — not a quote or a substitute for a licensed advisor." />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/in/car-bike-insurance" />
      </div>
    </main>
  );
}
