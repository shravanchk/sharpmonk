import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";

const TITLE = "How It Works — Privacy, KB Maths, Padding and DPI";
const DESCRIPTION =
  "How Sharpmonk resizes images without uploading them, why it treats a KB as both 1,000 and 1,024 bytes, how it reaches a minimum file size, and where every exam figure comes from.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/how-it-works" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/how-it-works", type: "article" },
};

const SECTIONS = [
  { id: "privacy", title: "Your images never leave your device" },
  { id: "kb", title: "What “50 KB” means" },
  { id: "quality", title: "How the size is hit" },
  { id: "padding", title: "Reaching a minimum size" },
  { id: "dpi", title: "DPI" },
  { id: "cleanup", title: "Cleaning up signatures" },
  { id: "sources", title: "Where the exam figures come from" },
];

export default function HowItWorksPage() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How it works", href: "/how-it-works" }]} />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">How Sharpmonk works</h1>
      <p className="text-muted mt-4 text-lg leading-relaxed">
        Everything a resizer does to your file, stated plainly — including the one trick that makes exact sizes possible.
      </p>

      <nav aria-label="On this page" className="mt-8 rounded-2xl border border-[var(--line)] p-5">
        <ol className="grid gap-1.5 text-sm sm:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-[var(--accent)] hover:underline">
                {i + 1}. {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose-legal mt-10">
        <h2 id="privacy">1. Your images never leave your device</h2>
        <p>
          Sharpmonk is a static website. There is no server that accepts images — no upload endpoint exists. Your photo is
          opened by your browser, drawn onto an HTML canvas, re-encoded as a JPEG by your browser, and handed back to you as a
          download. You can check this yourself: open the page, switch on airplane mode, and resize an image — it still works.
          Or open your browser&apos;s developer tools, watch the Network tab while you resize, and see that nothing is sent.
        </p>
        <p>
          That matters more than usual here. Exam uploads are identity documents: your face, your signature, your fingerprints.
          They shouldn&apos;t pass through a stranger&apos;s server to be resized.
        </p>

        <h2 id="kb">2. What “50 KB” means</h2>
        <p>
          Some websites count a kilobyte as 1,000 bytes, others as 1,024, and exam notifications never say which. A 50,500-byte
          file is 50.5 KB by one count and 49.3 KB by the other — accepted by one portal, rejected by another.
        </p>
        <p>
          So Sharpmonk aims for a file that passes either way: at least the minimum × 1,024 bytes, and at most the maximum ×
          1,000 bytes. For a 20–50 KB window that&apos;s 20,480 to 50,000 bytes. The size shown is always measured on the
          actual file you download.
        </p>

        <h2 id="quality">3. How the size is hit</h2>
        <p>
          First the image is drawn at the exact pixel dimensions, stepping a large photo down by halves so it shrinks without
          jagged edges. Then the JPEG quality setting is searched by bisection: encode, measure, adjust, repeat, until the
          highest quality that fits under the maximum is found. In “Keep proportions” mode, if the quality would have to drop
          below 60% the pixel dimensions are reduced a step instead, because a slightly smaller image looks better than a
          heavily compressed one.
        </p>

        <h2 id="padding">4. Reaching a minimum size</h2>
        <p>
          Small images often can&apos;t reach a portal&apos;s minimum. A signature at 140 × 60 pixels is usually 3–8 KB even at
          maximum JPEG quality, yet IBPS asks for at least 10 KB. Upscaling it or adding noise would make it worse.
        </p>
        <p>
          Instead, Sharpmonk adds a <em>comment segment</em> to the file. The JPEG format has always allowed comment blocks
          (the COM marker, <code>FF FE</code>); every decoder skips them, so the picture is bit-for-bit the same. The comment is
          filled with repeated plain text reading “sharpmonk.com size padding”, and it brings the file just above the minimum.
          When this happens, the tool says so and shows how many bytes were added.
        </p>
        <p>
          This is not hidden data and it carries nothing about you. If a portal ever rejected a padded file, choosing a larger
          pixel size (where the form allows one) gets you to the minimum without padding.
        </p>

        <h2 id="dpi">5. DPI</h2>
        <p>
          DPI (dots per inch) is a number stored in the file&apos;s header saying how large the image should print. It
          doesn&apos;t change a single pixel. Where a notification specifies one — IBPS asks for 200 DPI for the thumb impression
          and the declaration — Sharpmonk writes it into the JPEG&apos;s JFIF header. Elsewhere it&apos;s left as your browser
          wrote it.
        </p>

        <h2 id="cleanup">6. Cleaning up signatures</h2>
        <p>
          A phone photo of a signature has paper that shades from grey to off-white across the frame, so a single brightness
          cut-off either loses faint strokes or leaves grey patches. The cleanup estimates the paper&apos;s brightness locally,
          across a grid, and measures every pixel against the paper around it. Paper becomes white, ink becomes near-black,
          and the edges of strokes stay smooth. It changes tone only — never the shape of what you wrote.
        </p>

        <h2 id="sources">7. Where the exam figures come from</h2>
        <p>
          Every exam page is built from that exam&apos;s official notification or information bulletin, downloaded from the
          conducting body&apos;s website. The page links the document and names the pages the figures are on and the date we
          read it. Where a notification is silent — NTA doesn&apos;t fix pixel sizes for NEET or JEE Main — the page says so
          rather than inventing a requirement, and where it contradicts itself, we say that too.
        </p>
        <p>
          Notifications change from one cycle to the next. If the one in front of you differs from ours, follow yours — and
          please <Link href="/contact">let us know</Link>.
        </p>
      </div>
    </main>
  );
}
