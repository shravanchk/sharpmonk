import { ogCard, cardFor, size, contentType } from "@/lib/ogCard";
import { EXAMS } from "@/lib/specs";

// Required for `output: "export"` — one card per exam, generated at build time.
export const dynamic = "force-static";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ slug: e.slug }));
}

export const alt = "Exam photo and signature sizes — Sharpmonk";
export { size, contentType };

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogCard(cardFor(`/exams/${slug}`));
}
