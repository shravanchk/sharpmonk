import type { Metadata } from "next";
import { alternates } from "@/lib/i18n";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import DocumentToolFromQuery from "@/components/tool/DocumentToolFromQuery";
import { pdfPresets } from "@/lib/pdfPresets";
import { EXAMS } from "@/lib/specs";

const PATH = "/compress-pdf-to-kb";
const TITLE = "Compress PDF to KB — 50–300 KB, Under 500 KB, Any Window";
const DESCRIPTION =
  "Shrink a scanned certificate PDF into the size an exam form asks for — 50–300 KB, under 500 KB or any window — as A4 pages. Runs in your browser; nothing is uploaded.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternates(PATH, "en"),
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "How do I compress a certificate PDF to under 500 KB?",
    a: "Choose the PDF, pick “Under 500 KB”, and press Make PDF. Sharpmonk redraws each page as an A4 image at the highest resolution that fits — 150 DPI where it can — and lowers JPEG quality before it lowers resolution, so text stays sharp.",
  },
  {
    q: "My form says 50–300 KB and my PDF is only 30 KB. What do I do?",
    a: "Set the minimum to 50 KB. If the document is too simple to reach it, Sharpmonk adds a padding block that PDF readers ignore, so the file lands inside the window without changing what's on the page.",
  },
  {
    q: "Will the text in my PDF still be selectable?",
    a: "No — every page becomes an image, which is what makes large reductions possible. For scanned certificates that changes nothing, because a scan is already an image. If you need selectable text, use the original file where the size allows it.",
  },
  {
    q: "Can I combine a PDF with photos of other pages?",
    a: "Yes. Add PDFs and photos in any mix; each PDF page and each photo becomes one A4 page. Reorder, rotate or remove pages before you make the file.",
  },
  {
    q: "Is my document uploaded?",
    a: "No. The PDF is opened and rebuilt by your browser. There is no server that receives files — check the Network tab in your browser's developer tools while it runs.",
  },
];

export default function CompressPdfPage() {
  const examsWithPdf = EXAMS.filter((e) => e.pdf);
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="Compress PDF to KB" path={PATH} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compress PDF to KB", href: PATH }]} />

      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">Precision tool</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Compress a PDF to an exact KB size</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          For the certificates exam forms ask for as PDFs. Set the window, and get an A4 PDF that lands inside it — measured on
          the real file. Your document never leaves this device.
        </p>
      </header>

      <section aria-label="PDF compressor" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <DocumentToolFromQuery initial={{ minKB: 0, maxKB: 500 }} presets={pdfPresets("en")} what="pdf" fileName="certificate" />
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">How it fits the window</h2>
          <ol className="mt-5 flex flex-col gap-4 text-sm leading-relaxed">
            <li>
              <strong className="font-semibold">Every page becomes a clean A4 image.</strong> Each page is drawn at a set resolution,
              starting at 150 DPI, which keeps small print readable.
            </li>
            <li>
              <strong className="font-semibold">Quality first, then resolution.</strong> The JPEG quality of all pages is searched
              together for the highest setting that fits. Only if that would drop below 50% does the resolution step down — 120,
              100, 85, then 72 DPI.
            </li>
            <li>
              <strong className="font-semibold">Then the minimum.</strong> A document that comes out too small is padded up to the
              window. <Link href="/how-it-works#padding" className="text-[var(--accent)] hover:underline">How padding works</Link>.
            </li>
          </ol>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight">Questions</h2>
          <div className="mt-4">
            <FAQAccordion items={FAQS} />
          </div>
        </article>

        <aside className="rounded-2xl border border-[var(--line)] p-5 lg:self-start">
          <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">PDF sizes by exam</h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm">
            {examsWithPdf.map((e) => (
              <li key={e.slug} className="flex justify-between gap-3">
                <Link href={`${PATH}?min=${e.pdf!.minKB}&max=${e.pdf!.maxKB}`} className="text-[var(--accent)] hover:underline">
                  {e.short}
                </Link>
                <span className="text-muted text-right">
                  {e.pdf!.minKB > 0 ? `${e.pdf!.minKB}–${e.pdf!.maxKB} KB` : `≤ ${e.pdf!.maxKB} KB`}
                </span>
              </li>
            ))}
          </ul>
          <p className="text-muted mt-4 text-xs leading-relaxed">From each exam&apos;s official notification — see its page for the source.</p>
        </aside>
      </div>
    </main>
  );
}
