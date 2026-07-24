import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleToc from "@/components/ArticleToc";
import ArticleSchema from "@/components/ArticleSchema";
import GuideCTA from "@/components/GuideCTA";
import FAQAccordion from "@/components/FAQAccordion";

const PATH = "/guides/term-vs-whole-life-insurance";
const PUBLISHED = "2026-07-24";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "Term vs Whole Life Insurance: Which Should You Buy?",
  description:
    "Term vs whole life insurance compared — cost, cash value, and the 'buy term, invest the difference' argument — so you can pick the right one, with a free comparison calculator.",
};

const FAQS = [
  {
    q: "Why is whole life so much more expensive than term?",
    a: "Two reasons: whole life covers you for your entire life (so the insurer will almost certainly pay a claim), and part of every premium funds a cash-value account. Term only pays if you die during a fixed window, so for the same death benefit it can cost roughly a tenth as much.",
  },
  {
    q: "Is whole life insurance a good investment?",
    a: "It's better thought of as forced, low-risk savings than an investment. Cash value grows slowly and predictably, which some people value, but the returns usually trail a simple diversified portfolio over long periods. It makes most sense when you specifically need lifelong cover, not purely as a way to grow money.",
  },
  {
    q: "Can I convert a term policy to permanent later?",
    a: "Often yes. Many term policies include a conversion option that lets you switch to a permanent policy without a new medical exam, up to a certain age. It's a useful safety valve if your needs change.",
  },
  {
    q: "What happens when my term ends?",
    a: "Cover simply stops. If you still need protection you can buy a new policy (at your older age and health), renew annually at a higher rate, or convert if your policy allows. Ideally you set the term long enough that you no longer need cover when it ends.",
  },
];

export default function Page() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <ArticleSchema
        headline="Term vs Whole Life Insurance: Which Should You Buy?"
        description="Term vs whole life insurance compared on cost, cash value, and the buy-term-invest-the-difference argument."
        path={PATH}
        datePublished={PUBLISHED}
      />
      <div id="article" className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Term vs. whole life", href: PATH },
          ]}
        />
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Guide</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Term vs. whole life insurance
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          They look similar but solve different problems. Term is cheap,
          temporary protection; whole life is permanent cover with a savings
          component that costs far more. Here’s how to choose.
        </p>

        <ArticleToc />

        <div className="prose-legal mt-10">
          <h2>What each one actually is</h2>
          <p>
            <strong>Term life</strong> is pure protection for a set number of
            years. It pays out only if you die during the term, has no cash
            value, and is by far the cheapest way to buy a large death benefit.
          </p>
          <p>
            <strong>Whole life</strong> (a type of permanent insurance) covers
            you for your entire life and builds a cash value you can borrow
            against or surrender. Because a payout is near-certain and part of
            each premium funds that cash value, it typically costs eight to
            twelve times more than term for the same death benefit.
          </p>

          <table>
            <thead>
              <tr><th></th><th>Term</th><th>Whole life</th></tr>
            </thead>
            <tbody>
              <tr><td>Coverage length</td><td>Fixed term (e.g. 20 yrs)</td><td>Lifetime</td></tr>
              <tr><td>Cash value</td><td>None</td><td>Yes, grows slowly</td></tr>
              <tr><td>Cost (same cover)</td><td>Low</td><td>≈ 8–12× higher</td></tr>
              <tr><td>Best for</td><td>Income-replacement years</td><td>Lifelong / estate needs</td></tr>
            </tbody>
          </table>

          <h2>The “buy term, invest the difference” argument</h2>
          <p>
            The classic case for term is simple: buy cheap term cover, then
            invest the money you save versus a whole-life premium. Over a long
            term, that invested difference can grow to more than a whole-life
            policy’s cash value — and you keep full access and market upside.
            The trade-off is discipline and risk: it only works if you actually
            invest the difference every month, and your returns aren’t
            guaranteed. Whole life’s cash value is slower but predictable and
            effectively forces the saving for you.
          </p>
        </div>

        <GuideCTA
          href="/calculators/term-vs-whole-life"
          icon="scale"
          title="Compare the two side by side"
          body="See term vs. whole-life premiums for the same cover, plus what investing the difference could grow to over the term."
          cta="Term vs. whole life calculator"
        />

        <div className="prose-legal mt-2">
          <h2>When whole life actually makes sense</h2>
          <ul>
            <li>You have a lifelong dependent (for example, a child with special needs) who will always rely on you.</li>
            <li>You need guaranteed liquidity for estate taxes or to equalise an inheritance.</li>
            <li>You’re a high earner who has already maxed out tax-advantaged accounts and wants another slow, stable bucket.</li>
            <li>You’re using it deliberately inside a business-continuity or estate plan.</li>
          </ul>

          <h2>When term is the right call (most people)</h2>
          <ul>
            <li>Your need is temporary — covering the mortgage and the years your children depend on you.</li>
            <li>You want the most death benefit per dollar of premium.</li>
            <li>You’d rather invest the difference yourself in low-cost funds.</li>
          </ul>
          <p>
            For the large majority of families, a level term policy sized with
            the <Link href="/guides/how-much-life-insurance-do-you-need">DIME
            method</Link> covers the real risk at a fraction of the cost.
          </p>
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
            <li><Link href="/guides/how-much-life-insurance-do-you-need" className="text-[var(--accent)] underline underline-offset-2">How much life insurance do you need? →</Link></li>
            <li><Link href="/calculators/term-vs-whole-life" className="text-[var(--accent)] underline underline-offset-2">Term vs. whole life calculator →</Link></li>
            <li><Link href="/calculator" className="text-[var(--accent)] underline underline-offset-2">Premium estimator →</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
