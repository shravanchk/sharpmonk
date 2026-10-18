import type { Metadata } from "next";
import { alternates } from "@/lib/i18n";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import PrecisionTool from "@/components/tool/PrecisionTool";
import { EXAM_ENTRIES } from "@/lib/content";
import { RESIZE_INITIAL, resizePresets } from "@/lib/toolPresets";

const PATH = "/resize-image-to-kb";
const TITLE = "Resize Image to KB — Exact Size, Any Window";
const DESCRIPTION =
  "Resize a photo to under 20 KB, 50 KB, 100 KB or any range like 20–50 KB, at exact pixels or its own proportions. Runs in your browser; nothing is uploaded.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alternates(PATH, "en"),
  openGraph: { title: TITLE, description: DESCRIPTION, url: PATH, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};



const FAQS = [
  {
    q: "How do I reduce a photo to under 50 KB without it looking bad?",
    a: "Pick “Under 50 KB” and leave the pixel size on “Keep proportions”. Sharpmonk first lowers JPEG quality — which costs little visible detail until roughly 60% — and only then reduces the pixel dimensions, stopping as soon as the file fits. That keeps as much detail as the limit allows.",
  },
  {
    q: "My form says 20–50 KB and my photo is only 12 KB. What do I do?",
    a: "Set the minimum to 20 KB. If the image is too simple or too small to reach 20 KB on its own, Sharpmonk adds a padding block inside the JPEG — a standard comment segment that viewers ignore — so the file lands inside the window without being upscaled or blurred.",
  },
  {
    q: "Is 50 KB 50,000 bytes or 51,200 bytes?",
    a: "It depends on the website, and they rarely say. Sharpmonk aims for a file that passes either way: at least the minimum × 1,024 bytes and at most the maximum × 1,000 bytes.",
  },
  {
    q: "Can I set exact pixel dimensions too?",
    a: "Yes — switch to “Exact pixels” and enter the width and height. Drag the image to choose the crop, or use “Fit whole image” to keep all of it and fill the rest with white.",
  },
  {
    q: "Does this upload my photo anywhere?",
    a: "No. The whole process runs in your browser with the HTML canvas. There is no server that receives images — you can load this page, switch on airplane mode, and it still works.",
  },
];

export default function ResizeToKbPage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="Resize image to KB" path={PATH} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resize image to KB", href: PATH }]} />

      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">Precision tool</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Resize an image to an exact KB size</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          Set the window the form asks for — under 50 KB, 20–50 KB, anything — and get a JPG that lands inside it,
          measured on the real file. Your image never leaves this device.
        </p>
      </header>

      <section aria-label="Resizer" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <PrecisionTool initial={RESIZE_INITIAL} editable allowAuto presets={resizePresets("en")} what="image" />
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">How it lands inside the window</h2>
          <ol className="mt-5 flex flex-col gap-4 text-sm leading-relaxed">
            <li>
              <strong className="font-semibold">Exact pixels first.</strong> The image is drawn at the size you set (or at its own
              proportions, up to the longest side you allow), stepping down by halves so a large phone photo shrinks cleanly.
            </li>
            <li>
              <strong className="font-semibold">Then quality, measured.</strong> Sharpmonk encodes the JPEG, measures the bytes, and
              bisects the quality setting to find the highest one that fits under your maximum. Every number you see is the size
              of the file you&apos;ll download, not a guess.
            </li>
            <li>
              <strong className="font-semibold">Then the minimum.</strong> If even top quality is under your minimum — common for small
              signatures — the file is padded up to it. <Link href="/how-it-works#padding" className="text-[var(--accent)] hover:underline">How padding works</Link>.
            </li>
          </ol>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight">Questions</h2>
          <div className="mt-4">
            <FAQAccordion items={FAQS} />
          </div>
        </article>

        <aside className="rounded-2xl border border-[var(--line)] p-5 lg:self-start">
          <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">Sizing for an exam?</h2>
          <p className="text-muted mt-3 text-sm leading-relaxed">
            These pages are pre-set to the official notification, with the source linked:
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {EXAM_ENTRIES.map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="text-[var(--accent)] hover:underline">{e.title}</Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
