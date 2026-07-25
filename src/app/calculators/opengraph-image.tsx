import { ogCard, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — force this metadata route to be
// generated statically at build time (same as sitemap.ts / manifest.ts).
export const dynamic = "force-static";

export const alt = "All calculators — Sharpmonk";
export { size, contentType };

export default function Image() {
  return ogCard({
    eyebrow: "Calculators",
    title: "All calculators",
    subtitle: "Seven free US estimators plus three for India — premiums, coverage needs and comparisons.",
  });
}
