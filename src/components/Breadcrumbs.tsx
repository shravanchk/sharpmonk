import Link from "next/link";

/**
 * Visible breadcrumb trail + matching BreadcrumbList JSON-LD. Breadcrumbs
 * help search engines understand site structure and can surface as
 * breadcrumb rich results / sitelinks. The last item is the current page
 * and is rendered as plain text (not a link).
 */

const SITE_URL = "https://sharpmonk.com";

export type Crumb = { label: string; href: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE_URL}${c.href === "/" ? "" : c.href}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="text-muted flex flex-wrap items-center gap-1.5 font-mono text-xs">
          {items.map((c, i) => {
            const last = i === items.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden className="opacity-50">/</span>}
                {last ? (
                  <span aria-current="page" className="text-[var(--foreground)]/80">{c.label}</span>
                ) : (
                  <Link href={c.href} className="transition-colors hover:text-[var(--accent)]">
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
