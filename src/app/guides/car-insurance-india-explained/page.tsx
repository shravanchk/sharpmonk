import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import ArticleToc from "@/components/ArticleToc";
import ArticleSchema from "@/components/ArticleSchema";
import GuideCTA from "@/components/GuideCTA";
import FAQAccordion from "@/components/FAQAccordion";

const PATH = "/guides/car-insurance-india-explained";
const PUBLISHED = "2026-07-24";

export const metadata: Metadata = {
  alternates: { canonical: PATH },
  title: "Car Insurance in India Explained: IDV, NCB & Premium",
  description:
    "Understand how car insurance premiums work in India — third-party vs comprehensive, IDV, No-Claim Bonus, 18% GST, and how to lower your premium legitimately. With a free ₹ calculator.",
};

const FAQS = [
  {
    q: "Is third-party car insurance enough?",
    a: "It's the legal minimum, but it only pays for damage or injury you cause to others — nothing for your own vehicle if it's damaged or stolen. If your car has meaningful value, comprehensive cover (third-party plus own-damage) is usually worth the extra.",
  },
  {
    q: "Should I lower my IDV to reduce the premium?",
    a: "No. IDV is the maximum you'd receive if the car is stolen or written off. Declaring a lower IDV shaves a little off the premium but cuts your payout and can complicate claims. Keep IDV close to the true market value.",
  },
  {
    q: "Does No-Claim Bonus transfer to a new car?",
    a: "Yes. NCB attaches to you, the owner, not the vehicle — so when you sell and buy a new car you can carry the accumulated discount across. It can also transfer between insurers when you switch.",
  },
  {
    q: "What is zero-depreciation cover?",
    a: "A popular add-on that pays the full cost of replaced parts on a claim without deducting for depreciation. It raises the premium but sharply increases what you receive on a claim — most valuable for newer cars.",
  },
];

export default function Page() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <ArticleSchema
        headline="Car Insurance in India Explained: IDV, NCB & Premium"
        description="How car insurance premiums work in India — third-party vs comprehensive, IDV, NCB, GST, and how to lower the premium."
        path={PATH}
        datePublished={PUBLISHED}
      />
      <div id="article" className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Car insurance in India", href: PATH },
          ]}
        />
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Guide · India</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Car insurance in India, explained
        </h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Motor insurance in India has two parts — a legally mandatory
          third-party cover and optional own-damage cover. Once you understand
          IDV, No-Claim Bonus, and GST, your premium stops being a mystery.
        </p>

        <ArticleToc />

        <div className="prose-legal mt-10">
          <h2>The two parts of a motor policy</h2>
          <p>
            <strong>Third-party (TP)</strong> cover is mandatory by law. It pays
            for injury or damage you cause to other people, vehicles, or
            property — but nothing for your own car. Its price is set by the
            regulator based on engine capacity.
          </p>
          <p>
            <strong>Own-damage (OD)</strong> cover is optional and pays for
            damage to your own vehicle from accidents, theft, fire, or natural
            calamities. A <strong>comprehensive</strong> policy is simply TP + OD
            together.
          </p>

          <h2>IDV — the number everything hangs on</h2>
          <p>
            <strong>IDV (Insured Declared Value)</strong> is the current market
            value of your vehicle and the maximum a comprehensive policy pays if
            it’s stolen or written off. Your own-damage premium is calculated as
            a percentage of IDV, so a higher IDV means a higher premium but a
            bigger payout. IDV falls every year as the car depreciates.
          </p>

          <h2>No-Claim Bonus (NCB)</h2>
          <p>
            NCB is a discount on the <em>own-damage</em> part of your premium for
            every claim-free year, rising from 20% after year one up to 50%. It
            applies only to OD, never to the statutory third-party premium. Make
            a claim and it resets — which is why it’s often cheaper to pay for a
            small dent yourself than to claim and lose the bonus. An
            <em> NCB-protect</em> add-on can preserve it through one claim.
          </p>
        </div>

        <GuideCTA
          href="/in/car-bike-insurance"
          icon="car"
          title="Estimate your motor premium in ₹"
          body="Enter your IDV, vehicle age, and NCB to see own-damage, third-party, and 18% GST add up to a total premium."
          cta="India car & bike calculator"
        />

        <div className="prose-legal mt-2">
          <h2>How the premium adds up (with GST)</h2>
          <p>
            The final premium is the own-damage premium (after NCB) plus the
            third-party premium, plus <strong>18% GST</strong> on the total. For
            a ₹6 lakh car, three years old, with a 25% NCB in a metro:
          </p>
          <table>
            <thead>
              <tr><th>Component</th><th>Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Own-damage premium</td><td>₹13,734</td></tr>
              <tr><td>No-Claim Bonus (25%)</td><td>−₹3,433</td></tr>
              <tr><td>Third-party premium</td><td>₹2,094</td></tr>
              <tr><td>GST (18%)</td><td>₹2,231</td></tr>
              <tr><td><strong>Total premium</strong></td><td><strong>≈ ₹14,626</strong></td></tr>
            </tbody>
          </table>

          <h2>How to lower your premium (legitimately)</h2>
          <ul>
            <li>Protect your NCB — don’t claim for small, cheap-to-fix damage.</li>
            <li>Choose a sensible voluntary deductible if you’re a careful driver.</li>
            <li>Keep IDV accurate rather than inflated, but don’t under-declare it.</li>
            <li>Drop add-ons you don’t need, and compare insurers at renewal.</li>
          </ul>

          <h2>Add-ons worth knowing</h2>
          <ul>
            <li><strong>Zero-depreciation</strong> — full part-replacement value on claims.</li>
            <li><strong>Engine protection</strong> — valuable in flood-prone areas.</li>
            <li><strong>Roadside assistance</strong> and <strong>consumables</strong> cover.</li>
            <li><strong>NCB protect</strong> — keeps your bonus through a claim.</li>
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
            <li><Link href="/in/car-bike-insurance" className="text-[var(--accent)] underline underline-offset-2">India car & bike calculator →</Link></li>
            <li><Link href="/guides/term-insurance-india-guide" className="text-[var(--accent)] underline underline-offset-2">Term insurance in India guide →</Link></li>
            <li><Link href="/in" className="text-[var(--accent)] underline underline-offset-2">All India calculators →</Link></li>
          </ul>
        </section>
      </div>
    </main>
  );
}
