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
  const title = examTitle(e, "en");
  const description = describeExam(e, "en");
  const path = `/exams/${e.slug}`;
  return {
    title,
    description,
    alternates: alternates(path, "en"),
    openGraph: { title, description, url: path, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = examBySlug(slug);
  if (!e) notFound();
  return <ExamPage e={e} lang="en" />;
}
