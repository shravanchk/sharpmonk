import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InsuranceCalculator from "@/components/calculator/InsuranceCalculator";
import LifeNeedsCalculator from "@/components/calculator/LifeNeedsCalculator";
import IndiaTermCalculator from "@/components/calculator/IndiaTermCalculator";
import IndiaHealthCalculator from "@/components/calculator/IndiaHealthCalculator";
import { EMBEDDABLE } from "@/lib/embeds";

/**
 * A single calculator, with no site chrome, for framing on another site.
 * The attribution link at the foot is the point of the whole feature — it is
 * what turns an embed into a referring domain.
 */

export function generateStaticParams() {
  return EMBEDDABLE.map((e) => ({ slug: e.slug }));
}

const TOOLS: Record<string, () => React.ReactElement> = {
  "premium-estimator": () => <InsuranceCalculator />,
  "life-insurance-needs": () => <LifeNeedsCalculator />,
  "term-life-india": () => <IndiaTermCalculator />,
  "health-insurance-india": () => <IndiaHealthCalculator />,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const embed = EMBEDDABLE.find((e) => e.slug === slug);
  if (!embed) return {};

  return {
    title: embed.title,
    description: embed.blurb,
    // The canonical page carries the same tool wrapped in real content. These
    // exist to be framed, not ranked, so keep them out of the index entirely.
    robots: { index: false, follow: true },
    alternates: { canonical: embed.canonical },
  };
}

export default async function EmbedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const embed = EMBEDDABLE.find((e) => e.slug === slug);
  const Tool = TOOLS[slug];
  if (!embed || !Tool) notFound();

  return (
    <main className="px-4 py-5">
      <Tool />

      <p className="text-muted mt-5 text-center text-xs">
        <Link
          href={embed.canonical}
          target="_blank"
          className="text-[var(--accent)] underline-offset-2 hover:underline"
        >
          {embed.title}
        </Link>{" "}
        by Sharpmonk — illustrative estimate, not a quote.{" "}
        <Link href="/disclaimer" target="_blank" className="underline-offset-2 hover:underline">
          Disclaimer
        </Link>
      </p>
    </main>
  );
}
