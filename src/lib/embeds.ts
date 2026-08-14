/**
 * The embeddable calculators.
 *
 * Content alone does not rank a new domain — referring domains do, and the one
 * asset a calculator site can trade for them is the calculator itself. Each
 * entry here becomes a chrome-less page at `/embed/<slug>` that a blog or forum
 * can drop into an `<iframe>`, carrying a "Powered by Sharpmonk" link back.
 *
 * The embed pages are `noindex`: they render the same tool as the canonical
 * page and exist to be framed, not crawled. The gallery at `/embed` that hands
 * out the snippets is the indexable page.
 */

export type Embeddable = {
  slug: string;
  title: string;
  /** One line describing what a publisher's readers get out of it. */
  blurb: string;
  /** The canonical page this embed mirrors. */
  canonical: string;
  /** iframe height in px — tall enough to avoid an inner scrollbar. */
  height: number;
};

export const EMBEDDABLE: Embeddable[] = [
  {
    slug: "premium-estimator",
    title: "Insurance premium estimator",
    blurb: "Life, health, auto and home premiums in one tabbed tool.",
    canonical: "/calculator",
    height: 780,
  },
  {
    slug: "life-insurance-needs",
    title: "Life insurance needs (DIME)",
    blurb: "How much cover a reader's family needs, from income, debts and education.",
    canonical: "/calculators/life-insurance-needs",
    height: 820,
  },
  {
    slug: "term-life-india",
    title: "Term life premium (India, ₹)",
    blurb: "Term cover premium in rupees by sum assured, age and policy term.",
    canonical: "/in/term-life",
    height: 720,
  },
  {
    slug: "health-insurance-india",
    title: "Health / mediclaim premium (India, ₹)",
    blurb: "Individual or family-floater premium by sum insured and city tier.",
    canonical: "/in/health-insurance",
    height: 800,
  },
];

export const SITE_URL = "https://sharpmonk.com";

/** The snippet a publisher copies. Kept as one line per element so it stays
 *  readable when pasted into a CMS that strips indentation. */
export function embedSnippet(embed: Embeddable): string {
  return [
    `<iframe src="${SITE_URL}/embed/${embed.slug}"`,
    `  width="100%" height="${embed.height}" style="border:0;max-width:100%"`,
    `  loading="lazy" title="${embed.title} — Sharpmonk"></iframe>`,
    `<p><a href="${SITE_URL}${embed.canonical}">${embed.title}</a> by Sharpmonk</p>`,
  ].join("\n");
}
