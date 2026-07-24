import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import Icon from "@/components/Icon";
import IconBadge from "@/components/IconBadge";
import { GUIDES } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/guides" },
  title: "Insurance Guides — Plain-English Explainers",
  description:
    "Clear, jargon-free guides to insurance decisions: how much life cover you need, term vs whole life, and India-specific guides to term and car insurance — each linked to a free calculator.",
};


export default function GuidesHubPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }]} />
          <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Guides</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Insurance guides, in plain English
          </h1>
          <p className="text-muted mt-4 leading-relaxed">
            Short, jargon-free explainers for the decisions that actually matter
            — each one linked to a free calculator so you can put the numbers to
            your own situation.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {/* First row (2 across at sm+) lands in the first screenful, so it
              skips the scroll observer and paints straight away. */}
          {GUIDES.map((g, i) => (
            <Reveal key={g.href} delay={0.05 * i} immediate={i < 2} className="h-full">
              <Link
                href={g.href}
                className="glass-card group flex h-full flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <IconBadge name={g.icon} size={22} />
                  <span className="text-muted font-mono text-[0.65rem] tracking-[0.14em] uppercase">
                    {g.tag}
                  </span>
                </div>
                <h2 className="mt-4 font-semibold tracking-tight group-hover:text-[var(--accent)]">
                  {g.title}
                </h2>
                <p className="text-muted mt-2 text-sm leading-relaxed">{g.body}</p>
                <span className="text-[var(--accent)] mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Read guide
                  <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
