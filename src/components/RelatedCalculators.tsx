import Link from "next/link";
import IconBadge from "./IconBadge";
import Icon, { type IconName } from "./Icon";

/**
 * "Related calculators" + "Read next" block for the bottom of each tool
 * page. Cross-links sibling calculators and the matching guides, driven by
 * a small per-route map — better internal linking for both users and SEO.
 */

const TOOLINFO: Record<string, { icon: IconName; title: string }> = {
  "/calculator": { icon: "shield", title: "Premium estimator" },
  "/calculators/life-insurance-needs": { icon: "clipboard", title: "Life insurance needs" },
  "/calculators/term-vs-whole-life": { icon: "scale", title: "Term vs. whole life" },
  "/calculators/disability-insurance": { icon: "briefcase", title: "Disability insurance" },
  "/calculators/renters-insurance": { icon: "key", title: "Renters insurance" },
  "/calculators/umbrella-insurance": { icon: "umbrella", title: "Umbrella insurance" },
  "/calculators/pet-insurance": { icon: "paw", title: "Pet insurance" },
  "/in/term-life": { icon: "shield", title: "Term life (India)" },
  "/in/health-insurance": { icon: "heart-pulse", title: "Health / mediclaim (India)" },
  "/in/car-bike-insurance": { icon: "car", title: "Car & bike (India)" },
};

const G = {
  howMuch: { href: "/guides/how-much-life-insurance-do-you-need", label: "How much life insurance do you need?" },
  termWhole: { href: "/guides/term-vs-whole-life-insurance", label: "Term vs. whole life insurance" },
  termIndia: { href: "/guides/term-insurance-india-guide", label: "Term insurance in India: a guide" },
  carIndia: { href: "/guides/car-insurance-india-explained", label: "Car insurance in India, explained" },
};

const REL: Record<string, { tools: string[]; guides?: { href: string; label: string }[] }> = {
  "/calculator": {
    tools: ["/calculators/life-insurance-needs", "/calculators/term-vs-whole-life", "/calculators/disability-insurance"],
    guides: [G.howMuch, G.termWhole],
  },
  "/calculators/life-insurance-needs": {
    tools: ["/calculator", "/calculators/term-vs-whole-life", "/in/term-life"],
    guides: [G.howMuch, G.termWhole],
  },
  "/calculators/term-vs-whole-life": {
    tools: ["/calculators/life-insurance-needs", "/calculator", "/in/term-life"],
    guides: [G.termWhole, G.howMuch],
  },
  "/calculators/disability-insurance": {
    tools: ["/calculator", "/calculators/life-insurance-needs", "/calculators/umbrella-insurance"],
    guides: [G.howMuch],
  },
  "/calculators/renters-insurance": {
    tools: ["/calculators/umbrella-insurance", "/calculator", "/calculators/pet-insurance"],
  },
  "/calculators/umbrella-insurance": {
    tools: ["/calculators/renters-insurance", "/calculator", "/calculators/disability-insurance"],
  },
  "/calculators/pet-insurance": {
    tools: ["/calculators/renters-insurance", "/calculator", "/calculators/umbrella-insurance"],
  },
  "/in/term-life": {
    tools: ["/in/health-insurance", "/in/car-bike-insurance", "/calculator"],
    guides: [G.termIndia, G.howMuch],
  },
  "/in/health-insurance": {
    tools: ["/in/term-life", "/in/car-bike-insurance", "/calculator"],
    guides: [G.termIndia],
  },
  "/in/car-bike-insurance": {
    tools: ["/in/term-life", "/in/health-insurance"],
    guides: [G.carIndia],
  },
};

export default function RelatedCalculators({ current }: { current: string }) {
  const rel = REL[current];
  if (!rel) return null;

  return (
    <section className="mt-16 max-w-3xl border-t border-[var(--line)] pt-10">
      <h2 className="text-lg font-semibold tracking-tight">Related calculators</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {rel.tools.map((href) => {
          const info = TOOLINFO[href];
          if (!info) return null;
          return (
            <Link
              key={href}
              href={href}
              className="glass-card group flex items-center gap-3 rounded-xl p-4 transition-transform hover:-translate-y-0.5"
            >
              <IconBadge name={info.icon} size={18} badgeSize="sm" />
              <span className="text-sm font-medium leading-tight group-hover:text-[var(--accent)]">
                {info.title}
              </span>
            </Link>
          );
        })}
      </div>

      {rel.guides && rel.guides.length > 0 && (
        <div className="mt-7">
          <h3 className="text-muted font-mono text-[0.7rem] tracking-[0.14em] uppercase">Read next</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {rel.guides.map((g) => (
              <li key={g.href}>
                <Link href={g.href} className="text-[var(--accent)] inline-flex items-center gap-1 underline-offset-2 hover:underline">
                  {g.label}
                  <Icon name="arrow-right" size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
