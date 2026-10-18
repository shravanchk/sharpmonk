import type { Metadata } from "next";
import { alternates } from "@/lib/i18n";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import PrecisionTool from "@/components/tool/PrecisionTool";
import { SIGNATURE_INITIAL, SIGNATURE_PRESETS } from "@/lib/toolPresets";

const PATH = "/signature-resize";
const TITLE = "Signature Resize — Clean, Exact Pixels & KB";
const DESCRIPTION =
  "Turn a phone photo of your signature into clean dark ink on white paper, at exact pixels and KB — 140×60 px and 10–20 KB for IBPS, or any size. Nothing is uploaded.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternates(PATH, "en"),
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};


const FAQS = [
  {
    q: "How do I photograph my signature so it comes out clean?",
    a: "Sign on plain white paper with a black pen, put it on a flat surface in daylight, and shoot from straight above without your shadow across it. Crop close in the frame. The “Clean up the paper” step then turns the paper white and the ink dark, even if the photo came out grey.",
  },
  {
    q: "Why is my signature smaller than the 10 KB minimum?",
    a: "A 140 × 60 px image holds very little — a clean signature at that size is usually 3–8 KB even at maximum JPEG quality. Sharpmonk pads the file to the minimum with a standard JPEG comment block, which every viewer and portal decoder skips.",
  },
  {
    q: "Will the cleanup change how my signature looks?",
    a: "It only changes tone: shadows and grey paper become white, ink becomes near-black, and the edges stay smooth. The strokes themselves are untouched, so it still matches the signature you'll sign at the exam. You can switch it off.",
  },
  {
    q: "Should the signature be in capital letters?",
    a: "Not for IBPS: its notification says signatures in capital letters are not accepted. Sign the way you normally do.",
  },
];

export default function SignatureResizePage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="Signature resizer" path={PATH} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Signature resize", href: PATH }]} />

      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">Precision tool</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Signature resize, cleaned up and exact</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Photograph your signature on white paper. Sharpmonk flattens the paper to white, darkens the ink, and fits it to the
          exact pixels and KB the form wants.
        </p>
      </header>

      <section aria-label="Signature resizer" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <PrecisionTool
          initial={SIGNATURE_INITIAL}
          editable
          presets={SIGNATURE_PRESETS}
          what="signature"
          tip={
            <p className="text-muted text-xs leading-relaxed">
              Crop close: zoom in until the signature fills most of the frame, with a little white around it.
            </p>
          }
        />
      </section>

      <article className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">Questions</h2>
        <div className="mt-4">
          <FAQAccordion items={FAQS} />
        </div>
        <p className="text-muted mt-8 text-sm leading-relaxed">
          Doing a full application? The <Link href="/exams" className="text-[var(--accent)] hover:underline">exam pages</Link> —
          IBPS, SBI, UPSC, SSC, RRB NTPC, NEET UG and JEE Main — size every upload at once.
        </p>
      </article>
    </main>
  );
}
