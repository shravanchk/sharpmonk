import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  alternates: { canonical: "/glossary" },
  title: "Insurance Glossary — Key Terms Explained Simply",
  description:
    "Plain-English definitions of common insurance terms — premium, deductible, sum assured, IDV, No-Claim Bonus, family floater, rider, and more, for US and India insurance.",
};

const TERMS: { term: string; def: string }[] = [
  { term: "Beneficiary (nominee)", def: "The person who receives the payout from a life insurance policy when the insured person dies." },
  { term: "Cash value", def: "The savings component of a permanent life policy that grows over time and can be borrowed against or withdrawn." },
  { term: "Claim settlement ratio", def: "The share of claims an insurer paid out in a year. A high, steady ratio suggests claims are honoured reliably." },
  { term: "Co-pay", def: "A share of each claim you agree to pay yourself, common in health insurance. A higher co-pay lowers your premium." },
  { term: "Comprehensive cover", def: "Motor insurance that combines mandatory third-party liability with own-damage cover for your own vehicle." },
  { term: "Deductible", def: "The amount you pay out of pocket on a claim before the insurer pays the rest. A higher deductible lowers your premium." },
  { term: "Family floater", def: "A single health policy that shares one sum insured across all covered family members instead of separate policies." },
  { term: "IDV (Insured Declared Value)", def: "The current market value of a vehicle, and the maximum a comprehensive motor policy pays if it is stolen or written off." },
  { term: "Liability coverage", def: "Cover that pays for injury or damage you cause to other people or their property." },
  { term: "No-Claim Bonus (NCB)", def: "A discount on your motor own-damage premium for each claim-free year, rising from 20% up to 50%." },
  { term: "Permanent insurance", def: "Life insurance that lasts your whole life and builds cash value (for example whole life), unlike temporary term cover." },
  { term: "Pre-existing condition", def: "A health condition you already have when buying cover. It may carry a waiting period or a higher premium." },
  { term: "Premium", def: "The amount you pay — monthly or yearly — to keep an insurance policy active." },
  { term: "Rider", def: "An optional add-on that extends a base policy, such as critical illness, accidental death, or waiver of premium." },
  { term: "Sum assured", def: "The fixed amount a life insurance policy pays out on death — the headline cover amount." },
  { term: "Sum insured", def: "The maximum a health or general insurance policy will pay in a single policy year." },
  { term: "Term insurance", def: "Pure life cover for a fixed number of years with no maturity payout — the cheapest way to buy a large death benefit." },
  { term: "Third-party liability", def: "Legally required motor cover that pays for damage or injury you cause to others, but not to your own vehicle." },
  { term: "Umbrella insurance", def: "Extra liability cover that sits above the limits of your auto and home policies." },
  { term: "Underwriting", def: "The insurer's process of assessing your risk to decide whether to cover you and at what premium." },
  { term: "Waiting period", def: "A set time after buying health cover before certain conditions or treatments become claimable." },
  { term: "Whole life insurance", def: "Permanent life cover for your entire life that also builds cash value, costing far more than term insurance." },
];

const slug = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const schema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Sharpmonk Insurance Glossary",
  hasDefinedTerm: TERMS.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.def })),
};

export default function GlossaryPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Glossary", href: "/glossary" }]} />
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Glossary</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Insurance terms, explained simply</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Short, plain-English definitions of the terms you’ll meet across life,
          health, and motor insurance in the US and India.
        </p>

        <dl className="mt-10 divide-y divide-[var(--line)] border-t border-[var(--line)]">
          {TERMS.map((t) => (
            <div key={t.term} id={slug(t.term)} className="scroll-mt-24 py-5">
              <dt className="font-semibold tracking-tight">{t.term}</dt>
              <dd className="text-muted mt-1.5 leading-relaxed">{t.def}</dd>
            </div>
          ))}
        </dl>

        <section className="mt-14 border-t border-[var(--line)] pt-8">
          <p className="text-muted text-sm">
            Put these into practice with the{" "}
            <Link href="/calculators" className="text-[var(--accent)] underline underline-offset-2">free calculators</Link>{" "}
            or read the{" "}
            <Link href="/guides" className="text-[var(--accent)] underline underline-offset-2">insurance guides</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
