import { ogCard, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — force this metadata route to be
// generated statically at build time (same as sitemap.ts / manifest.ts).
export const dynamic = "force-static";

export const alt = "India calculators — Sharpmonk";
export { size, contentType };

export default function Image() {
  return ogCard({
    eyebrow: "India",
    title: "India calculators",
    subtitle: "Term life, health and motor premiums in rupees — with GST, IDV and No-Claim Bonus.",
  });
}
