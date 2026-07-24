import type { IconName } from "@/components/Icon";

/**
 * The site's content inventory, in one place.
 *
 * These lists drive the tool explorer, the guides hub and the glossary, and
 * they are also what the site search indexes. Keeping a single copy means a
 * new calculator or guide becomes searchable by virtue of being added here,
 * rather than needing a second edit in an index that quietly goes stale.
 */

export type Cat = "life" | "health" | "autohome" | "other" | "india";

export type Tool = {
  href: string;
  icon: IconName;
  title: string;
  body: string;
  cats: Cat[];
};

export type Guide = { href: string; icon: IconName; title: string; body: string; tag: string };

export type Term = { term: string; def: string };

export const TOOLS: Tool[] = [
  { href: "/calculator", icon: "shield", title: "Premium estimator", body: "Life, health, auto & home premiums in one tabbed tool.", cats: ["life", "health", "autohome"] },
  { href: "/calculators/life-insurance-needs", icon: "clipboard", title: "Life insurance needs", body: "How much cover your family needs, via the DIME method.", cats: ["life"] },
  { href: "/calculators/term-vs-whole-life", icon: "scale", title: "Term vs. whole life", body: "Cost and cash-value comparison for the same coverage.", cats: ["life"] },
  { href: "/calculators/disability-insurance", icon: "briefcase", title: "Disability insurance", body: "Find your income-replacement gap and the cost to close it.", cats: ["other"] },
  { href: "/calculators/renters-insurance", icon: "key", title: "Renters insurance", body: "Monthly cost from belongings, liability, and deductible.", cats: ["autohome"] },
  { href: "/calculators/umbrella-insurance", icon: "umbrella", title: "Umbrella insurance", body: "Extra liability cover above your auto and home limits.", cats: ["other"] },
  { href: "/calculators/pet-insurance", icon: "paw", title: "Pet insurance", body: "Premiums for dogs and cats by age, breed, and plan.", cats: ["other"] },
  { href: "/in/term-life", icon: "shield", title: "Term life (India, ₹)", body: "Term cover premium in rupees by sum assured and age.", cats: ["india", "life"] },
  { href: "/in/health-insurance", icon: "heart-pulse", title: "Health / mediclaim (India, ₹)", body: "Individual or family-floater premium by sum insured.", cats: ["india", "health"] },
  { href: "/in/car-bike-insurance", icon: "car", title: "Car & bike (India, ₹)", body: "Own-damage + third-party + GST with No-Claim Bonus.", cats: ["india", "autohome"] },
];

export const GUIDES: Guide[] = [
  {
    href: "/guides/how-much-life-insurance-do-you-need",
    icon: "clipboard",
    title: "How much life insurance do you need?",
    body: "Size your cover with the DIME method — income, debts, mortgage, education — with a worked example.",
    tag: "Life",
  },
  {
    href: "/guides/term-vs-whole-life-insurance",
    icon: "scale",
    title: "Term vs. whole life insurance",
    body: "Cost, cash value, and the ‘buy term, invest the difference’ argument — so you can pick the right one.",
    tag: "Life",
  },
  {
    href: "/guides/term-insurance-india-guide",
    icon: "shield",
    title: "Term insurance in India: a complete guide",
    body: "How much cover to buy, what drives the premium, tax benefits, riders, and mistakes to avoid.",
    tag: "India",
  },
  {
    href: "/guides/car-insurance-india-explained",
    icon: "car",
    title: "Car insurance in India, explained",
    body: "Third-party vs comprehensive, IDV, No-Claim Bonus, and 18% GST — and how to lower your premium.",
    tag: "India",
  },
];

export const TERMS: Term[] = [
  { term: "Beneficiary (nominee)", def: "The person who receives the payout from a life insurance policy when the insured person dies." },
  { term: "Cash value", def: "The savings component of a permanent life policy that grows over time and can be borrowed against or withdrawn." },
  { term: "Claim settlement ratio", def: "The share of claims an insurer paid out in a year. A high, steady ratio suggests claims are honoured reliably." },
  { term: "Co-pay", def: "A share of each claim you agree to pay yourself, common in health insurance. A higher co-pay lowers your premium." },
  { term: "Comprehensive cover", def: "Motor insurance that combines mandatory third-party liability with own-damage cover for your own vehicle." },
  { term: "Deductible", def: "The amount you pay out of pocket on a claim before the insurer pays the rest. A higher deductible lowers your premium." },
  { term: "Family floater", def: "A single health policy that shares one sum insured across all covered family members instead of separate policies." },
  { term: "IDV (Insured Declared Value)", def: "The current market value of a vehicle, and the maximum a comprehensive motor policy pays if it is stolen or written off." },
  { term: "Liability coverage", def: "Cover that pays for injury or damage you cause to other people or their property." },
  { term: "No-Claim Bonus (NCB)", def: "A discount on your motor own-damage premium for each claim-free year, rising from 20% up to 50%." },
  { term: "Permanent insurance", def: "Life insurance that lasts your whole life and builds cash value (for example whole life), unlike temporary term cover." },
  { term: "Pre-existing condition", def: "A health condition you already have when buying cover. It may carry a waiting period or a higher premium." },
  { term: "Premium", def: "The amount you pay — monthly or yearly — to keep an insurance policy active." },
  { term: "Rider", def: "An optional add-on that extends a base policy, such as critical illness, accidental death, or waiver of premium." },
  { term: "Sum assured", def: "The fixed amount a life insurance policy pays out on death — the headline cover amount." },
  { term: "Sum insured", def: "The maximum a health or general insurance policy will pay in a single policy year." },
  { term: "Term insurance", def: "Pure life cover for a fixed number of years with no maturity payout — the cheapest way to buy a large death benefit." },
  { term: "Third-party liability", def: "Legally required motor cover that pays for damage or injury you cause to others, but not to your own vehicle." },
  { term: "Umbrella insurance", def: "Extra liability cover that sits above the limits of your auto and home policies." },
  { term: "Underwriting", def: "The insurer's process of assessing your risk to decide whether to cover you and at what premium." },
  { term: "Waiting period", def: "A set time after buying health cover before certain conditions or treatments become claimable." },
  { term: "Whole life insurance", def: "Permanent life cover for your entire life that also builds cash value, costing far more than term insurance." },
];
