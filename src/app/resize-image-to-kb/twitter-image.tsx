import { ogCard, cardFor, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — generated once at build time.
export const dynamic = "force-static";

export const alt = "Resize image to KB — Sharpmonk";
export { size, contentType };

export default function Image() {
  return ogCard(cardFor("/resize-image-to-kb"));
}
