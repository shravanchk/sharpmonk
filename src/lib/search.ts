import { GUIDES, TERMS, TOOLS, type Tool } from "./content";

/**
 * Static search index, assembled at build time from the same content lists the
 * pages render, plus the handful of standalone pages that have no list to
 * belong to. Nothing ships beyond the strings themselves — no service, no
 * network call, no index format to keep in sync.
 *
 * Scoring is deliberately simple: title matches beat body matches, and a
 * prefix beats a match in the middle of a word. For a few dozen documents that
 * is more than enough, and it keeps the whole thing dependency-free.
 */

export type SearchDoc = {
  href: string;
  title: string;
  body: string;
  section: "Calculator" | "Guide" | "Glossary" | "Page";
  /** Extra terms people search for that don't appear in the title or body. */
  keywords?: string;
};

const PAGES: SearchDoc[] = [
  {
    href: "/calculators/term-life",
    title: "Term life insurance rates by age",
    body: "Estimated monthly cost of a 20-year term policy from $250,000 to $2 million, ages 25 to 60.",
    section: "Page",
    keywords: "cost chart price rate table how much life insurance per month premium by age",
  },
  {
    href: "/embed",
    title: "Embed a calculator",
    body: "Put a Sharpmonk calculator on your own site with one line of HTML.",
    section: "Page",
    keywords: "iframe widget publisher blog embed code snippet",
  },
  {
    href: "/about",
    title: "About Sharpmonk",
    body: "Who builds these calculators and why they are free.",
    section: "Page",
  },
  {
    href: "/methodology",
    title: "Methodology",
    body: "The rating factors and formulas behind every estimate.",
    section: "Page",
    keywords: "how it works formula math assumptions sources",
  },
  {
    href: "/contact",
    title: "Contact",
    body: "Questions, corrections and feedback.",
    section: "Page",
  },
  {
    href: "/glossary",
    title: "Insurance glossary",
    body: "Plain-English definitions of common insurance terms.",
    section: "Page",
  },
  {
    href: "/privacy",
    title: "Privacy Policy",
    body: "What we collect, and what we do not.",
    section: "Page",
    keywords: "cookies data gdpr tracking",
  },
  { href: "/terms", title: "Terms of Service", body: "Terms for using Sharpmonk.", section: "Page" },
  {
    href: "/disclaimer",
    title: "Disclaimer",
    body: "Estimates are illustrative and are not quotes.",
    section: "Page",
  },
];

/**
 * Everyday words for what a tool covers, so "car" finds the motor calculator
 * and "mediclaim" finds India health.
 *
 * Keyed off the tool's own wording rather than its category: the categories
 * are too coarse, and bucketing renters under "autohome" was enough to make
 * it a hit for "car".
 */
function synonymsFor(t: Tool): string {
  const text = `${t.title} ${t.body} ${t.href}`.toLowerCase();
  const add: string[] = [...t.cats];
  if (/\b(car|bike|auto|motor)/.test(text)) add.push("car vehicle motor bike two-wheeler idv ncb");
  if (/\b(home|renters|property|house)/.test(text)) add.push("house property flat apartment tenant");
  if (/\b(life|term)/.test(text)) add.push("death cover sum assured nominee");
  if (/\b(health|medical)/.test(text)) add.push("medical mediclaim hospital sum insured");
  if (/\b(pet|dog|cat)/.test(text)) add.push("animal vet veterinary");
  if (t.cats.includes("india")) add.push("india rupees inr ₹");
  return add.join(" ");
}

export const SEARCH_DOCS: SearchDoc[] = [
  ...TOOLS.map(
    (t): SearchDoc => ({
      href: t.href,
      title: t.title,
      body: t.body,
      section: "Calculator",
      keywords: synonymsFor(t),
    }),
  ),
  ...GUIDES.map(
    (g): SearchDoc => ({ href: g.href, title: g.title, body: g.body, section: "Guide", keywords: g.tag }),
  ),
  ...TERMS.map(
    (t): SearchDoc => ({
      href: `/glossary#${slugifyTerm(t.term)}`,
      title: t.term,
      body: t.def,
      section: "Glossary",
    }),
  ),
  ...PAGES,
];

/** Shared with the glossary page so search results can deep-link to a term. */
export function slugifyTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const normalise = (s: string) => s.toLowerCase().normalize("NFKD");

function scoreDoc(doc: SearchDoc, terms: string[]): number {
  const title = normalise(doc.title);
  const haystack = normalise(`${doc.title} ${doc.body} ${doc.keywords ?? ""}`);
  let score = 0;

  for (const term of terms) {
    const inTitle = title.indexOf(term);
    const inAny = haystack.indexOf(term);
    if (inAny === -1) return 0; // every term must appear somewhere

    if (inTitle === 0) score += 10;
    else if (inTitle > 0) score += title[inTitle - 1] === " " ? 7 : 4;
    else score += 2;
  }

  // Nudge the interactive tools above prose when scores tie — someone typing
  // "renters" almost always wants the calculator.
  if (doc.section === "Calculator") score += 1;
  return score;
}

export function searchSite(query: string, limit = 8): SearchDoc[] {
  const terms = normalise(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  return SEARCH_DOCS.map((doc) => ({ doc, score: scoreDoc(doc, terms) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.doc);
}
