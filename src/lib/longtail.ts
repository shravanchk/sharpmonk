/**
 * The generated ("long-tail") cost pages.
 *
 * The site's hand-written pages compete for head terms — "life insurance
 * calculator" — against publishers with thousands of referring domains. These
 * pages go after the queries those publishers answer badly or not at all:
 * "1 crore term insurance premium for 30 year old", "how much is a $500,000
 * life insurance policy for a 40 year old". Each one leads with the number the
 * query asks for and then shows the surrounding grid, so the page earns its
 * place instead of being a thin permutation of a template.
 *
 * Everything is derived from the same estimators the interactive calculators
 * use, so a page and the tool it links to can never disagree, and the deep
 * links are built from the calculators' own schemas via `encodeAll`.
 *
 * Both families are priced on a fixed baseline — 20-year term, non-smoker,
 * good health — so every table on the page varies exactly one factor at a
 * time. The pages say so; a table whose rows each moved two variables would
 * not be comparable.
 */

import { estimateLife, type LifeInputs, type TermYears } from "./insuranceMath";
import { estimateIndiaTermLife, inrShort, type IndiaTermInputs } from "./insuranceIndia";
import { DEFAULT_LIFE, LIFE_SCHEMA } from "./calculatorInputs";
import { encodeAll, type Schema } from "./shareableUrl";
import { usd } from "./format";

/* ----------------------------------------------------------------------
   Shared shapes
   ---------------------------------------------------------------------- */

/** One row of a comparison table. `href` links to the sibling generated page
 *  when the row corresponds to one, which is what gives the set its internal
 *  link graph — a crawler landing on any page can reach the whole grid. */
export type TableRow = {
  label: string;
  monthly: string;
  annual: string;
  href?: string;
  /** Marks the row describing this page's own headline figure. */
  current?: boolean;
};

export type CostTable = {
  heading: string;
  /** Column header for the first (label) column. */
  rowHeader: string;
  intro: string;
  rows: TableRow[];
};

export type LongtailPage = {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  /** Small label above the H1. */
  eyebrow: string;
  /** The answer, in one sentence, directly under the H1. */
  answer: string;
  monthly: string;
  annual: string;
  /** Baseline assumptions, spelled out under the headline figure. */
  assumptions: string[];
  tables: CostTable[];
  faqs: { q: string; a: string }[];
  /** Deep link into the interactive calculator, pre-filled to match. */
  calculatorHref: string;
  breadcrumb: { label: string; href: string }[];
};

const BASELINE_TERM = 20;

/** `?a=1&b=2` for a calculator's own schema, so a generated link can only
 *  carry values that calculator would accept. */
function deepLink<T extends object>(base: string, inputs: T, defaults: T, schema: Schema<T>): string {
  const qs = encodeAll(inputs, defaults, schema).toString();
  return qs ? `${base}?${qs}` : base;
}

/* ----------------------------------------------------------------------
   1. India — term life cost by sum assured × age
   ---------------------------------------------------------------------- */

export const INDIA_COVERS = [
  { value: 2500000, slug: "25-lakh", label: "₹25 lakh" },
  { value: 5000000, slug: "50-lakh", label: "₹50 lakh" },
  { value: 7500000, slug: "75-lakh", label: "₹75 lakh" },
  { value: 10000000, slug: "1-crore", label: "₹1 crore" },
  { value: 15000000, slug: "1-5-crore", label: "₹1.5 crore" },
  { value: 20000000, slug: "2-crore", label: "₹2 crore" },
] as const;

export const INDIA_AGES = [25, 30, 35, 40, 45, 50] as const;

const INDIA_TERMS: number[] = [10, 15, 20, 30, 40];

const INDIA_DEFAULTS: IndiaTermInputs = { age: 32, smoker: false, sumAssured: 10000000, term: 30 };

const INDIA_SCHEMA: Schema<IndiaTermInputs> = {
  age: { kind: "number", min: 18, max: 65, step: 1 },
  smoker: { kind: "bool" },
  sumAssured: { kind: "number", min: 2500000, max: 50000000, step: 2500000 },
  term: { kind: "numEnum", values: [10, 15, 20, 30, 40] },
};

export const indiaTermSlug = (coverSlug: string, age: number) =>
  `${coverSlug}-term-insurance-for-${age}-year-old`;

/** Every India term-life page, in the order they should be listed. */
export function indiaTermPages(): LongtailPage[] {
  return INDIA_COVERS.flatMap((cover) => INDIA_AGES.map((age) => indiaTermPage(cover.slug, age)!));
}

export function indiaTermPage(coverSlug: string, age: number): LongtailPage | null {
  const cover = INDIA_COVERS.find((c) => c.slug === coverSlug);
  if (!cover || !INDIA_AGES.includes(age as (typeof INDIA_AGES)[number])) return null;

  const inputs: IndiaTermInputs = {
    age,
    smoker: false,
    sumAssured: cover.value,
    term: BASELINE_TERM,
  };
  const result = estimateIndiaTermLife(inputs);
  const smokerResult = estimateIndiaTermLife({ ...inputs, smoker: true });

  const slug = indiaTermSlug(cover.slug, age);
  const path = `/in/term-life/${slug}`;

  const money = (v: number) => `₹${v.toLocaleString("en-IN")}`;

  return {
    slug,
    path,
    title: `${cover.label} Term Insurance Premium for a ${age}-Year-Old (₹/year)`,
    description: `Estimated premium for ${cover.label} term life cover at age ${age} in India: about ${money(result.annualPremium)} a year (${money(result.monthlyPremium)} a month) on a ${BASELINE_TERM}-year non-smoker policy. Compare by age, cover and term.`,
    h1: `${cover.label} term insurance premium for a ${age}-year-old`,
    eyebrow: "India · Term life cost",
    answer: `A ${cover.label} term life policy for a healthy, non-smoking ${age}-year-old works out at roughly ${money(result.annualPremium)} a year — about ${money(result.monthlyPremium)} a month — on a ${BASELINE_TERM}-year term.`,
    monthly: money(result.monthlyPremium),
    annual: money(result.annualPremium),
    assumptions: [
      `${cover.label} sum assured`,
      `${BASELINE_TERM}-year policy term`,
      "Non-smoker, no declared medical conditions",
      "Regular annual premium, no riders",
    ],
    tables: [
      {
        heading: `${cover.label} term insurance premium by age`,
        rowHeader: "Age at purchase",
        intro: `Same ${cover.label} cover and same ${BASELINE_TERM}-year term at each age. Buying earlier locks the rate in for the whole term, which is why the gap compounds.`,
        rows: INDIA_AGES.map((a) => {
          const r = estimateIndiaTermLife({ ...inputs, age: a });
          return {
            label: `${a} years old`,
            monthly: money(r.monthlyPremium),
            annual: money(r.annualPremium),
            href: `/in/term-life/${indiaTermSlug(cover.slug, a)}`,
            current: a === age,
          };
        }),
      },
      {
        heading: `Term insurance premium at age ${age}, by cover`,
        rowHeader: "Sum assured",
        intro: `How the premium scales with the sum assured at age ${age}. Cover is priced close to linearly, so doubling the cover roughly doubles the premium.`,
        rows: INDIA_COVERS.map((c) => {
          const r = estimateIndiaTermLife({ ...inputs, sumAssured: c.value });
          return {
            label: c.label,
            monthly: money(r.monthlyPremium),
            annual: money(r.annualPremium),
            href: `/in/term-life/${indiaTermSlug(c.slug, age)}`,
            current: c.slug === cover.slug,
          };
        }),
      },
      {
        heading: `${cover.label} at age ${age}, by policy term`,
        rowHeader: "Policy term",
        intro:
          "A longer term costs more per year because the insurer is on risk through the years when mortality rises fastest.",
        rows: INDIA_TERMS.map((t) => {
          const r = estimateIndiaTermLife({ ...inputs, term: t });
          return {
            label: `${t} years`,
            monthly: money(r.monthlyPremium),
            annual: money(r.annualPremium),
            current: t === BASELINE_TERM,
          };
        }),
      },
      {
        heading: "Smoker vs non-smoker",
        rowHeader: "Tobacco use",
        intro: `Declared tobacco use is the single largest loading on an Indian term policy. For ${cover.label} at age ${age}:`,
        rows: [
          {
            label: "Non-smoker",
            monthly: money(result.monthlyPremium),
            annual: money(result.annualPremium),
            current: true,
          },
          {
            label: "Smoker",
            monthly: money(smokerResult.monthlyPremium),
            annual: money(smokerResult.annualPremium),
          },
        ],
      },
    ],
    faqs: [
      {
        q: `Is ${cover.label} enough term cover at age ${age}?`,
        a: `The common rule of thumb in India is 10–15× your annual income, plus any outstanding home or vehicle loan and a provision for children's education. ${cover.label} fits someone earning roughly ${inrShort(cover.value / 12)}–${inrShort(cover.value / 10)} a year on that basis. It is a starting point, not advice — your own liabilities and dependants decide the figure.`,
      },
      {
        q: `Will the premium rise as I get older during the policy?`,
        a: "No. On a regular level-term plan the premium is set from your age when the policy starts and stays flat for the whole term. That is why the age-by-age table above matters: the age you buy at is the rate you keep.",
      },
      {
        q: "Why is the premium I am quoted different from this?",
        a: "This is an illustrative estimate built from generic rating factors, not a quote. A real premium depends on the insurer, medical underwriting, your income and occupation, any riders you add, and the insurer's current IRDAI-approved rates. Treat this as a budgeting figure and shop the actual cover with 3–4 insurers.",
      },
      {
        q: "Does the premium include GST?",
        a: "The figures above are the base premium. Term life premiums in India also attract GST at 18% on top, so budget roughly that much again over the annual figure shown.",
      },
    ],
    calculatorHref: deepLink("/in/term-life", inputs, INDIA_DEFAULTS, INDIA_SCHEMA),
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "India", href: "/in" },
      { label: "Term life", href: "/in/term-life" },
      { label: `${cover.label} at ${age}`, href: path },
    ],
  };
}

/* ----------------------------------------------------------------------
   2. US — term life cost by coverage × age
   ---------------------------------------------------------------------- */

export const US_COVERS = [
  { value: 250000, slug: "250k", label: "$250,000" },
  { value: 500000, slug: "500k", label: "$500,000" },
  { value: 1000000, slug: "1-million", label: "$1 million" },
  { value: 2000000, slug: "2-million", label: "$2 million" },
] as const;

export const US_AGES = [25, 30, 35, 40, 45, 50, 55, 60] as const;

const US_TERMS: TermYears[] = [10, 20, 30];

export const usTermSlug = (coverSlug: string, age: number) =>
  `${coverSlug}-life-insurance-for-${age}-year-old`;

export function usTermPages(): LongtailPage[] {
  return US_COVERS.flatMap((cover) => US_AGES.map((age) => usTermPage(cover.slug, age)!));
}

export function usTermPage(coverSlug: string, age: number): LongtailPage | null {
  const cover = US_COVERS.find((c) => c.slug === coverSlug);
  if (!cover || !US_AGES.includes(age as (typeof US_AGES)[number])) return null;

  const inputs: LifeInputs = {
    age,
    smoker: false,
    healthRating: "good",
    coverageAmount: cover.value,
    term: BASELINE_TERM as TermYears,
  };
  const result = estimateLife(inputs);
  const smokerResult = estimateLife({ ...inputs, smoker: true });

  const slug = usTermSlug(cover.slug, age);
  const path = `/calculators/term-life/${slug}`;

  return {
    slug,
    path,
    title: `How Much Is a ${cover.label} Life Insurance Policy at Age ${age}?`,
    description: `A ${cover.label} 20-year term life policy at age ${age} runs about ${usd(result.monthlyPremium)} a month (${usd(result.annualPremium)} a year) for a non-smoker in good health. See the cost by age, coverage amount and term length.`,
    h1: `How much is a ${cover.label} life insurance policy at age ${age}?`,
    eyebrow: "Term life cost",
    answer: `About ${usd(result.monthlyPremium)} a month — roughly ${usd(result.annualPremium)} a year — for a ${cover.label} 20-year level term policy, assuming a non-smoker in good health.`,
    monthly: usd(result.monthlyPremium),
    annual: usd(result.annualPremium),
    assumptions: [
      `${cover.label} death benefit`,
      "20-year level term",
      "Non-smoker, good health rating",
      "Level premium for the full term",
    ],
    tables: [
      {
        heading: `${cover.label} term life cost by age`,
        rowHeader: "Age at purchase",
        intro:
          "Same coverage, same 20-year term, priced at each age. Mortality cost roughly doubles every decade after 40, which is the whole shape of this table.",
        rows: US_AGES.map((a) => {
          const r = estimateLife({ ...inputs, age: a });
          return {
            label: `Age ${a}`,
            monthly: usd(r.monthlyPremium),
            annual: usd(r.annualPremium),
            href: `/calculators/term-life/${usTermSlug(cover.slug, a)}`,
            current: a === age,
          };
        }),
      },
      {
        heading: `Term life cost at age ${age}, by coverage amount`,
        rowHeader: "Death benefit",
        intro: `Term life is priced per $1,000 of coverage, so at age ${age} the premium tracks the death benefit almost exactly in proportion.`,
        rows: US_COVERS.map((c) => {
          const r = estimateLife({ ...inputs, coverageAmount: c.value });
          return {
            label: c.label,
            monthly: usd(r.monthlyPremium),
            annual: usd(r.annualPremium),
            href: `/calculators/term-life/${usTermSlug(c.slug, age)}`,
            current: c.slug === cover.slug,
          };
        }),
      },
      {
        heading: `${cover.label} at age ${age}, by term length`,
        rowHeader: "Term length",
        intro:
          "A 30-year term costs more per year than a 10-year one because the insurer carries the risk further up the mortality curve.",
        rows: US_TERMS.map((t) => {
          const r = estimateLife({ ...inputs, term: t });
          return {
            label: `${t}-year term`,
            monthly: usd(r.monthlyPremium),
            annual: usd(r.annualPremium),
            current: t === BASELINE_TERM,
          };
        }),
      },
      {
        heading: "What tobacco use costs",
        rowHeader: "Tobacco use",
        intro: `Smoker rates are the largest single factor in life insurance pricing. For ${cover.label} at age ${age}:`,
        rows: [
          {
            label: "Non-smoker",
            monthly: usd(result.monthlyPremium),
            annual: usd(result.annualPremium),
            current: true,
          },
          {
            label: "Smoker",
            monthly: usd(smokerResult.monthlyPremium),
            annual: usd(smokerResult.annualPremium),
          },
        ],
      },
    ],
    faqs: [
      {
        q: `Is ${cover.label} enough life insurance at age ${age}?`,
        a: `A common starting point is 10–12× your household income, plus your mortgage balance and an allowance per child for education. ${cover.label} suits a household earning around ${usd(cover.value / 12)}–${usd(cover.value / 10)} with a comparable mortgage. Our DIME calculator sizes it against your actual debts rather than a multiple.`,
      },
      {
        q: "Does the premium change during the term?",
        a: "Not on a level term policy — the premium is locked from the age you buy at and stays flat for the full term. It only resets if you renew at the end of the term, and renewal rates at that point are based on your age then.",
      },
      {
        q: "Why do real quotes come back different?",
        a: "These figures come from generic, publicly-documented rating factors, not any insurer's filed rate table. Real pricing adds full medical underwriting, family history, driving record, state rules, and each insurer's own claims experience. Quotes for the same person routinely differ by 30–50% between carriers, which is why shopping several is worth the time.",
      },
      {
        q: "Term or whole life at this age?",
        a: `For most buyers at ${age}, term covers the years dependants actually rely on the income, at a fraction of the cost — the premium above is for pure death benefit with no cash value. Whole life costs several times as much for the same death benefit and is generally an estate-planning or high-net-worth tool rather than a family income-replacement one.`,
      },
    ],
    calculatorHref: deepLink("/calculator", inputs, DEFAULT_LIFE, LIFE_SCHEMA),
    breadcrumb: [
      { label: "Home", href: "/" },
      { label: "Calculators", href: "/calculators" },
      { label: "Term life cost", href: "/calculators/term-life" },
      { label: `${cover.label} at ${age}`, href: path },
    ],
  };
}

/** Every generated page across both families — used by the sitemap. */
export function allLongtailPaths(): string[] {
  return [...indiaTermPages(), ...usTermPages()].map((p) => p.path);
}
