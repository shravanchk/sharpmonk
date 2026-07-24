import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleToc from "@/components/ArticleToc";
import ArticleSchema from "@/components/ArticleSchema";
import GuideCTA from "@/components/GuideCTA";
import FAQAccordion from "@/components/FAQAccordion";

const PATH = "/guides/term-insurance-india-guide";
const PUBLISHED = "2026-07-24";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "Term Insurance in India: A Complete Guide (2026)",
  description:
    "A plain-English guide to term insurance in India — how much cover you need, what drives the premium, tax benefits under 80C and 10(10D), riders, and mistakes to avoid. With a free ₹ calculator.",
};

const FAQS = [
  {
    q: "Is term insurance worth it if I get nothing back?",
    a: "Yes, for pure protection. You're paying only for the cover, which is exactly why term is so cheap — a ₹1 crore cover can cost a young non-smoker a few hundred rupees a month. Plans that 'give money back' (endowment, money-back, ULIP) fold in an investment and cost many times more for the same protection.",
  },
  {
    q: "What is claim settlement ratio and why does it matter?",
    a: "It's the share of death claims an insurer paid out in a year. A consistently high ratio (98%+) suggests claims are honoured reliably. It's one signal among several — also look at how long the insurer takes to settle and its solvency — but it's worth checking before you buy.",
  },
  {
    q: "Do I have to disclose smoking and medical history?",
    a: "Yes, always. Non-disclosure of tobacco use, health conditions, or income is the most common reason genuine claims get rejected. Declaring them raises the premium a little; hiding them can cost your family the entire payout.",
  },
  {
    q: "Until what age should my term run?",
    a: "Generally until you expect to be financially free — the mortgage cleared and children independent, often around age 60. Covering to very old ages adds cost for years when few people still have dependents relying on their income.",
  },
];

export default function Page() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <ArticleSchema
        headline="Term Insurance in India: A Complete Guide"
        description="How much term cover you need in India, what drives the premium, tax benefits, riders, and mistakes to avoid."
        path={PATH}
        datePublished={PUBLISHED}
      />
      <div id="article" className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Term insurance in India", href: PATH },
          ]}
        />
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Guide · India</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Term insurance in India: a complete guide
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Term insurance is the cheapest, simplest way to protect your family’s
          finances in India — pure cover, no maturity payout. Here’s how much to
          buy, what moves the premium, and how the tax and riders work.
        </p>

        <ArticleToc />

        <div className="prose-legal mt-10">
          <h2>What term insurance is (and isn’t)</h2>
          <p>
            A term plan pays a fixed <strong>sum assured</strong> to your
            nominee if you die during the policy term. If you survive the term,
            nothing is paid back — and that’s exactly why it’s so cheap. Don’t
            confuse it with <strong>endowment, money-back, or ULIP</strong>
            plans, which bundle an investment into the policy. For pure
            protection those are poor value; a term plan buys far more cover per
            rupee.
          </p>

          <h2>How much cover do you need?</h2>
          <p>
            A common approach: take <strong>10–15× your annual income</strong>,
            add outstanding loans (home, car, personal), add future goals like
            children’s education and marriage, then subtract any existing cover
            and savings. Someone earning ₹15 lakh a year with a home loan often
            lands around ₹1.5–2 crore of cover.
          </p>

          <h2>What drives the premium</h2>
          <table>
            <thead>
              <tr><th>Factor</th><th>Effect on premium</th></tr>
            </thead>
            <tbody>
              <tr><td>Age</td><td>The single biggest lever — buy young to lock a low rate for the whole term.</td></tr>
              <tr><td>Sum assured</td><td>Higher cover, higher premium, but rate per ₹1 lakh falls at larger covers.</td></tr>
              <tr><td>Policy term</td><td>Longer terms cost more per year.</td></tr>
              <tr><td>Tobacco use</td><td>Smokers typically pay ~50% more.</td></tr>
              <tr><td>Health &amp; lifestyle</td><td>Medical history and hazardous occupations raise the rate.</td></tr>
            </tbody>
          </table>
        </div>

        <GuideCTA
          href="/in/term-life"
          icon="shield"
          title="Estimate your term premium in ₹"
          body="Set your age, sum assured, and term to see an indicative yearly and monthly premium, with the factor breakdown."
          cta="India term life calculator"
        />

        <div className="prose-legal mt-2">
          <h2>Tax benefits</h2>
          <p>
            Under current rules, term insurance premiums qualify for a deduction
            under <strong>Section 80C</strong> (up to ₹1.5 lakh a year, available
            under the old tax regime), and the death benefit paid to your
            nominee is generally exempt under <strong>Section 10(10D)</strong>,
            subject to conditions. Tax rules change and depend on your regime and
            circumstances, so treat this as general information and confirm the
            current position for your situation.
          </p>

          <h2>Riders worth considering</h2>
          <ul>
            <li><strong>Critical illness</strong> — a lump sum on diagnosis of listed illnesses.</li>
            <li><strong>Accidental death benefit</strong> — extra cover if death is due to an accident.</li>
            <li><strong>Waiver of premium</strong> — future premiums are waived if you’re disabled or critically ill.</li>
            <li><strong>Terminal illness</strong> — pays the sum assured early on a terminal diagnosis.</li>
          </ul>

          <h2>Common mistakes to avoid</h2>
          <ul>
            <li>Under-insuring — a ₹25–50 lakh cover rarely replaces a real income for long.</li>
            <li>Buying ULIP or endowment thinking it’s protection.</li>
            <li>Not disclosing tobacco use or medical history — the top cause of claim rejection.</li>
            <li>Delaying — every year you wait, the premium locks in higher.</li>
          </ul>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-6">
            <FAQAccordion items={FAQS} />
          </div>
        </section>

        <section className="mt-16 border-t border-[var(--line)] pt-10">
          <h2 className="text-lg font-semibold tracking-tight">Keep going</h2>
          <ul className="text-muted mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/in/term-life" className="text-[var(--accent)] underline underline-offset-2">India term life calculator →</Link></li>
            <li><Link href="/guides/car-insurance-india-explained" className="text-[var(--accent)] underline underline-offset-2">Car insurance in India explained →</Link></li>
            <li><Link href="/in" className="text-[var(--accent)] underline underline-offset-2">All India calculators →</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
