import type { Metadata } from "next";
import { alternates } from "@/lib/i18n";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import DocumentToolFromQuery from "@/components/tool/DocumentToolFromQuery";
import { pdfPresets } from "@/lib/pdfPresets";

const PATH = "/image-to-pdf";
const TITLE = "Image to PDF — Phone Photos to One A4 PDF, Under the Limit";
const DESCRIPTION =
  "Turn phone photos of a certificate or document into a single A4 PDF under a size limit, with shadowed paper cleaned to white. Runs in your browser; nothing is uploaded.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternates(PATH, "en"),
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQS = [
  {
    q: "How do I turn photos of my certificate into one PDF?",
    a: "Choose the photos (you can pick several at once), put them in page order with the arrows, rotate any that are sideways, set the size limit, and press Make PDF. Each photo becomes one A4 page.",
  },
  {
    q: "My photos have shadows and grey paper. Can that be fixed?",
    a: "Switch on “Clean up the paper”. It brightens the paper to white and darkens the text, measuring each area against the paper around it, so shadows across the page disappear without losing faint text.",
  },
  {
    q: "How do I photograph a document so it comes out well?",
    a: "Lay it flat in daylight, hold the phone directly above it so the page isn't trapezoid-shaped, and fill the frame with the page. Avoid the flash — it leaves a bright spot.",
  },
  {
    q: "Are my photos uploaded?",
    a: "No. The PDF is assembled by your browser on this device. Nothing is sent anywhere.",
  },
];

export default function ImageToPdfPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="Image to PDF" path={PATH} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Image to PDF", href: PATH }]} />

      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">Precision tool</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Photos to one A4 PDF, under the size limit</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Photograph each page with your phone, add them here in order, and get a single PDF inside the KB window the form
          asks for — with the paper cleaned up if you want.
        </p>
      </header>

      <section aria-label="Image to PDF" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <DocumentToolFromQuery initial={{ minKB: 0, maxKB: 300 }} presets={pdfPresets("en")} what="docPhotos" fileName="document" />
      </section>

      <article className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
        <div className="mt-4">
          <FAQAccordion items={FAQS} />
        </div>
        <p className="text-muted mt-8 text-sm leading-relaxed">
          Already have a PDF that&apos;s too big? Use <Link href="/compress-pdf-to-kb" className="text-[var(--accent)] hover:underline">Compress PDF to KB</Link> —
          it takes PDFs and photos together.
        </p>
      </article>
    </main>
  );
}
