import Link from "next/link";
import MonkMark from "./MonkMark";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Calculators",
    links: [
      { href: "/calculators", label: "All calculators" },
      { href: "/calculator", label: "Premium estimator" },
      { href: "/calculators/life-insurance-needs", label: "Life insurance needs" },
      { href: "/in", label: "India calculators" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/guides", label: "Insurance guides" },
      { href: "/glossary", label: "Glossary" },
      { href: "/search", label: "Search the site" },
      { href: "/about", label: "About Sharpmonk" },
      { href: "/methodology", label: "Methodology" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--line)] bg-[var(--panel)]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <span className="flex items-center gap-2.5 font-mono text-lg font-semibold tracking-tight">
              <MonkMark size={26} />
              Sharpmonk
            </span>
            <p className="text-muted mt-3 max-w-xs text-sm leading-relaxed">
              Free, fast estimate tools for insurance shoppers. Educational
              estimates only &mdash; not a quote, application, or offer of
              coverage.
            </p>
            <p className="text-muted mt-3 max-w-xs text-sm leading-relaxed">
              A sister site of{" "}
              <a
                href="https://upaman.com"
                className="text-[var(--accent)] transition-colors hover:underline"
              >
                Upaman
              </a>{" "}
              &mdash; free financial calculators, workflows, and guides.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">
                {col.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--foreground)]/80 transition-colors hover:text-[var(--accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Sharpmonk. All rights reserved.</p>
          <p className="max-w-2xl sm:text-right">
            Sharpmonk is not an insurance company, agent, or broker. Estimates
            are for general informational purposes only and do not
            constitute financial, legal, or insurance advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
