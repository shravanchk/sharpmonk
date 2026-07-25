import { ogCard, cardFor, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — force this metadata route to be
// generated statically at build time (same as sitemap.ts / manifest.ts).
export const dynamic = "force-static";

export const alt = "How much life insurance do you need? — Sharpmonk";
export { size, contentType };

export default function Image() {
  return ogCard(cardFor("/guides/how-much-life-insurance-do-you-need"));
}
