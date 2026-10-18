import { ogCard, size, contentType } from "@/lib/ogCard";

// Required for `output: "export"` — generated once at build time.
export const dynamic = "force-static";

export const alt = "Sharpmonk — exam photo and signature resizer";
export { size, contentType };

export default function Image() {
  return ogCard({
    eyebrow: "IBPS · NEET · JEE",
    title: "Exam photo & signature, sized exactly",
    subtitle: "The pixels, KB and DPI from the official notification. Runs in your browser.",
  });
}
