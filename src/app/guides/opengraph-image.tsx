import { ogCard, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — force this metadata route to be
// generated statically at build time (same as sitemap.ts / manifest.ts).
export const dynamic = "force-static";

export const alt = "Insurance guides — Sharpmonk";
export { size, contentType };

export default function Image() {
  return ogCard({
    eyebrow: "Guides",
    title: "Insurance guides",
    subtitle: "Plain-English explainers, each linked to a free calculator.",
  });
}
