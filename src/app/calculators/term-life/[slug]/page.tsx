import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LongtailCostPage from "@/components/LongtailCostPage";
import { US_AGES, US_COVERS, usTermPage, usTermSlug } from "@/lib/longtail";

/**
 * Generated US term-life cost pages — one per (coverage × age) pair.
 * See lib/longtail.ts for what each page contains and why the set exists.
 */

export function generateStaticParams() {
  return US_COVERS.flatMap((cover) => US_AGES.map((age) => ({ slug: usTermSlug(cover.slug, age) })));
}

/** Splits `500k-life-insurance-for-40-year-old` back into its parts. */
function parse(slug: string) {
  const match = /^(.+)-life-insurance-for-(\d+)-year-old$/.exec(slug);
  if (!match) return null;
  return usTermPage(match[1], Number(match[2]));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = parse(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: page.path },
    openGraph: { title: page.title, description: page.description, url: page.path, type: "article" },
    twitter: { card: "summary_large_image", title: page.title, description: page.description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = parse(slug);
  if (!page) notFound();

  return (
    <LongtailCostPage page={page} relatedTo="/calculator" calculatorLabel="premium estimator" />
  );
}
