import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "@/components/Icon";
import IconBadge from "@/components/IconBadge";

export const metadata: Metadata = {
  alternates: { canonical: "/in" },
  title: "Insurance Calculators for India — Term, Health & Motor",
  description:
    "Free, no-signup insurance calculators for India: estimate term life, health (mediclaim), and car & bike (motor) premiums in ₹ with a transparent breakdown of every factor.",
};

const TOOLS: { href: string; icon: IconName; title: string; body: string }[] = [
  {
    href: "/in/term-life",
    icon: "shield",
    title: "Term life insurance",
    body: "Estimate the premium for a pure term cover by sum assured, age, and policy term.",
  },
  {
    href: "/in/health-insurance",
    icon: "heart-pulse",
    title: "Health / mediclaim",
    body: "Premium for individual or family-floater health cover by sum insured and city tier.",
  },
  {
    href: "/in/car-bike-insurance",
    icon: "car",
    title: "Car & bike (motor)",
    body: "Own-damage + third-party + GST with No-Claim Bonus, by IDV and vehicle age.",
  },
];

export default function IndiaHubPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "India", href: "/in" }]} />
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">
            India · ₹
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Insurance calculators for India
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Premium estimates in rupees using generic Indian rating factors —
            sum assured, city tier, IDV, No-Claim Bonus, and GST. Everything
            runs in your browser and shows its math, with no signup.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* First row (up to 3 across at lg) lands in the first screenful, so
              it skips the scroll observer and paints straight away. */}
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.href} delay={0.05 * i} immediate={i < 3} className="h-full">
              <Link
                href={tool.href}
                className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
              >
                <IconBadge name={tool.icon} size={22} />
                <h2 className="mt-4 font-semibold tracking-tight group-hover:text-[var(--accent)]">
                  {tool.title}
                </h2>
                <p className="text-muted mt-2 text-sm leading-relaxed">{tool.body}</p>
                <span className="text-[var(--accent)] mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Open calculator
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="text-muted mt-10 max-w-2xl text-xs leading-relaxed">
          Illustrative estimates only, based on generic rating factors and
          representative GST / statutory figures — not a quote from any
          insurer or a substitute for an IRDAI-registered advisor.{" "}
          <Link href="/disclaimer" className="text-[var(--accent)] underline underline-offset-2">
            Read the full disclaimer
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
