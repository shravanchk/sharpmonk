import { ogCard, cardFor, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — generated once at build time.
export const dynamic = "force-static";

export const alt = "Signature resizer — Sharpmonk";
export { size, contentType };

export default function Image() {
  return ogCard(cardFor("/signature-resize"));
}
