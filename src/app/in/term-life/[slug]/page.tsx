import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LongtailCostPage from "@/components/LongtailCostPage";
import { INDIA_AGES, INDIA_COVERS, indiaTermPage, indiaTermSlug } from "@/lib/longtail";

/**
 * Generated India term-life cost pages — one per (sum assured × age) pair.
 * See lib/longtail.ts for what each page contains and why the set exists.
 */

export function generateStaticParams() {
  return INDIA_COVERS.flatMap((cover) =>
    INDIA_AGES.map((age) => ({ slug: indiaTermSlug(cover.slug, age) })),
  );
}

/** Splits `1-crore-term-insurance-for-30-year-old` back into its parts. */
function parse(slug: string) {
  const match = /^(.+)-term-insurance-for-(\d+)-year-old$/.exec(slug);
  if (!match) return null;
  return indiaTermPage(match[1], Number(match[2]));
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
    <LongtailCostPage
      page={page}
      relatedTo="/in/term-life"
      calculatorLabel="term life calculator"
    />
  );
}
