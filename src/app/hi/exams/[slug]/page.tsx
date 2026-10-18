import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ExamPage, { describeExam, examTitle } from "@/components/ExamPage";
import { alternates } from "@/lib/i18n";
import { EXAMS, examBySlug } from "@/lib/specs";

export function generateStaticParams() {
  return EXAMS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = examBySlug(slug);
  if (!e) return {};
  const title = examTitle(e, "hi");
  const description = describeExam(e, "hi");
  const alt = alternates(`/exams/${e.slug}`, "hi");
  return {
    title,
    description,
    alternates: alt,
    openGraph: { title, description, url: alt.canonical, type: "website", locale: "hi_IN" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = examBySlug(slug);
  if (!e) notFound();
  return <ExamPage e={e} lang="hi" />;
}
