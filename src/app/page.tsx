import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "@/components/Icon";
import IconBadge from "@/components/IconBadge";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const TOOLS: { href: string; icon: IconName; title: string; body: string }[] = [
  { href: "/calculator", icon: "shield", title: "Premium estimator", body: "Life, health, auto & home premiums in one tabbed tool." },
  { href: "/calculators/life-insurance-needs", icon: "clipboard", title: "Life insurance needs", body: "How much cover your family needs, via the DIME method." },
  { href: "/calculators/disability-insurance", icon: "briefcase", title: "Disability insurance", body: "Find your income-replacement gap and the cost to close it." },
  { href: "/calculators/renters-insurance", icon: "key", title: "Renters insurance", body: "Monthly cost from belongings, liability, and deductible." },
  { href: "/calculators/umbrella-insurance", icon: "umbrella", title: "Umbrella insurance", body: "Extra liability cover above your auto and home limits." },
  { href: "/calculators/pet-insurance", icon: "paw", title: "Pet insurance", body: "Premiums for dogs and cats by age, breed, and plan." },
  { href: "/calculators/term-vs-whole-life", icon: "scale", title: "Term vs. whole life", body: "Cost and cash-value comparison for the same coverage." },
];

const STEPS = [
  { icon: "sliders" as IconName, title: "Pick a policy type", body: "Life, health, auto, or home — each with the inputs that actually move that premium." },
  { icon: "chart" as IconName, title: "Enter a few basics", body: "Age, coverage amount, vehicle or home value, deductible. Sliders and dropdowns, no essays." },
  { icon: "check" as IconName, title: "Read the breakdown", body: "See the estimated premium plus every factor driving the number, with charts." },
];

const STATS = [
  { value: "10", label: "Free calculators" },
  { value: "US + ₹", label: "Regions covered" },
  { value: "0", label: "Signups required" },
  { value: "100%", label: "Runs in your browser" },
];

const BENEFITS = [
  { icon: "bolt" as IconName, title: "Transparent math", body: "Every estimate shows the factors behind it — no black box." },
  { icon: "lock" as IconName, title: "Private by design", body: "Nothing leaves your browser. No account, no data collection." },
  { icon: "shield" as IconName, title: "No lead-gen", body: "No phone number to unlock a number, no agent will call you." },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      {/* Subtle backdrop glow (hero only) */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px]">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--background)_20%,transparent)_0%,transparent_55%,var(--background)_100%)]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col">
          <span
            className="reveal text-muted inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-1.5 font-mono text-xs tracking-[0.16em] uppercase"
            style={{ "--delay": "0.05s" } as React.CSSProperties}
          >
            <span className="pulse-dot size-1.5 rounded-full bg-[var(--positive)]" />
            Free · No signup
          </span>

          <h1
            className="reveal mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            style={{ "--delay": "0.15s" } as React.CSSProperties}
          >
            Know your <span className="text-[var(--accent)]">insurance cost</span> before an agent does
          </h1>

          <p
            className="reveal text-muted mt-5 max-w-xl text-lg leading-relaxed"
            style={{ "--delay": "0.25s" } as React.CSSProperties}
          >
            Seven free calculators estimate premiums, coverage needs, and cost
            comparisons across life, health, auto, home, renters, umbrella, and
            pet insurance — with a transparent breakdown of every number.
          </p>

          <div
            className="reveal mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ "--delay": "0.35s" } as React.CSSProperties}
          >
            <Link href="/calculators" className="btn-glow inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold">
              Browse all calculators
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link href="/about" className="btn-ghost rounded-full px-7 py-3 text-center text-sm font-medium">
              How it works
            </Link>
          </div>

          <ul
            className="reveal text-muted mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm"
            style={{ "--delay": "0.45s" } as React.CSSProperties}
          >
            {["No account required", "Instant results", "Nothing sent to a server"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Icon name="check" size={16} className="text-[var(--accent)]" />
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* Product preview card — the hero's largest element, so it paints
            flat: no fade, no scroll observer, nothing between it and LCP. */}
        <Reveal immediate className="relative">
          <div className="glass-card rounded-3xl p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-muted font-mono text-xs tracking-[0.14em] uppercase">Life · monthly estimate</span>
              <IconBadge name="shield" size={18} badgeSize="sm" />
            </div>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-5xl font-semibold tracking-tight">$42</span>
              <span className="text-muted mb-1.5 text-sm">/ month</span>
            </div>
            <p className="text-muted mt-1 text-sm">$504 / year · $500k, 20-yr term</p>

            <div className="mt-6 flex flex-col gap-3 border-t border-[var(--line)] pt-5">
              {[
                { label: "Base rate", w: 60 },
                { label: "Age 35", w: 42 },
                { label: "Non-smoker", w: 26 },
                { label: "Good health", w: 34 },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--foreground)]/85">{r.label}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <div className="bar-fill h-full rounded-full bg-[var(--accent)]" style={{ width: `${r.w}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Trust / stats band */}
      <section className="relative border-y border-[var(--line)] bg-[var(--section-bg)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-10 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-semibold tracking-tight text-[var(--accent)] sm:text-4xl">
                {s.value}
              </div>
              <div className="text-muted mt-1 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-2">
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.16em] uppercase">The tools</span>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Seven calculators, one site</h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.href} delay={0.04 * i} className="h-full">
              <Link href={tool.href} className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5">
                <IconBadge name={tool.icon} size={22} />
                <h3 className="mt-4 font-semibold tracking-tight group-hover:text-[var(--accent)]">{tool.title}</h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{tool.body}</p>
                <span className="text-[var(--accent)] mt-4 inline-flex items-center gap-1 text-sm font-medium">
                  Open
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-y border-[var(--line)] bg-[var(--section-bg)] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-xl">
            <span className="text-[var(--accent)] font-mono text-xs tracking-[0.16em] uppercase">How it works</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Three steps. No phone call.</h2>
            <p className="text-muted mt-3 leading-relaxed">
              Everything runs client-side against publicly documented rating
              factors — a starting point for budgeting, not a bound quote.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={0.08 * i} className="glass-card rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <IconBadge name={s.icon} size={22} />
                  <span className="text-muted font-mono text-sm">0{i + 1}</span>
                </div>
                <h3 className="mt-4 font-semibold tracking-tight">{s.title}</h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="relative mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.title} delay={0.06 * i} className="flex gap-4">
              <IconBadge name={b.icon} size={22} className="shrink-0" />
              <div>
                <h3 className="font-semibold tracking-tight">{b.title}</h3>
                <p className="text-muted mt-1 text-sm leading-relaxed">{b.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="relative px-6 pb-24">
        <Reveal className="glass-card mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-3xl p-10 text-center sm:p-14">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">See your estimate in under a minute</h2>
          <p className="text-muted max-w-md leading-relaxed">
            Pick a tool and start entering numbers — the estimate updates as you go.
          </p>
          <Link href="/calculators" className="btn-glow inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold">
            Browse all calculators
            <Icon name="arrow-right" size={16} />
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
