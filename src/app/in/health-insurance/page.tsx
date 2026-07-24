import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import RelatedCalculators from "@/components/RelatedCalculators";
import IconBadge from "@/components/IconBadge";
import IndiaHealthCalculator from "@/components/calculator/IndiaHealthCalculator";
import FAQAccordion from "@/components/FAQAccordion";
import TrustPanel from "@/components/calculator/TrustPanel";

export const metadata: Metadata = {
  alternates: { canonical: "/in/health-insurance" },
  title: "Health Insurance (Mediclaim) Premium Calculator (India, ₹)",
  description:
    "Free health insurance premium calculator for India. Estimate mediclaim premiums for individual or family-floater cover by sum insured, age, city tier, and pre-existing conditions — in rupees.",
};

const FAQS = [
  {
    q: "What drives a health insurance premium in India?",
    a: "The eldest member's age and the sum insured are the biggest levers, followed by whether it's an individual, couple, or family-floater plan, your city tier, tobacco use, and any pre-existing conditions. Premiums rise sharply after age 45.",
  },
  {
    q: "Individual or family floater?",
    a: "A family floater shares one sum insured across members and is usually cheaper than separate individual policies for a young family — but the shared limit can be a drawback if the eldest member is much older. This tool estimates both.",
  },
  {
    q: "Does it include GST?",
    a: "Health premiums attract GST in India; the illustrative base rate here is representative of the all-in cost. It is not a quote — actual premiums depend on the insurer, room-rent limits, co-pay, and underwriting.",
  },
];

export default function IndiaHealthPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "India", href: "/in" }, { label: "Health insurance", href: "/in/health-insurance" }]} />
          <div className="mb-5"><IconBadge name="heart-pulse" size={24} /></div>
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            India · health
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Health insurance (mediclaim) calculator
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Estimate the annual premium for individual or family-floater health
            cover in rupees, and see how sum insured, age, city tier, and
            pre-existing conditions move the number.
          </p>
        </div>

        <div className="mt-10">
          <IndiaHealthCalculator />
        </div>

        <div className="mt-10 max-w-3xl">
          <TrustPanel scope="This tool provides an illustrative health / mediclaim premium estimate for India using generic rating factors — not a quote or a substitute for an IRDAI-registered advisor." />
        </div>

        <section className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <RelatedCalculators current="/in/health-insurance" />
      </div>
    </main>
  );
}
