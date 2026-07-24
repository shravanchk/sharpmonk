import Link from "next/link";

type Props = {
  reviewedOn?: string;
  scope?: string;
};

const DEFAULT_REVIEWED_ON = "July 23, 2026";
const DEFAULT_SCOPE =
  "This tool provides planning estimates based on the generic assumptions shown above — not a quote from any insurer.";

const LINKS = [
  { href: "/methodology", label: "Methodology" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/about", label: "About Sharpmonk" },
  { href: "/contact", label: "Contact" },
];

/** Compact E-E-A-T signal block: last-reviewed date, scope statement, and
 *  links to the pages Google/AdSense reviewers look for on YMYL content. */
export default function TrustPanel({
  reviewedOn = DEFAULT_REVIEWED_ON,
  scope = DEFAULT_SCOPE,
}: Props) {
  return (
    <section aria-label="Trust and methodology details" className="glass-card rounded-xl p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)]/95">Trust &amp; methodology</h3>
      <p className="text-muted mt-2 text-xs leading-relaxed">
        <strong className="text-[var(--foreground)]/85">Last reviewed:</strong> {reviewedOn}
      </p>
      <p className="text-muted mt-1.5 text-xs leading-relaxed">{scope}</p>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
