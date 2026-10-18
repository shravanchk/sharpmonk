import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/disclaimer" },
  title: "Disclaimer",
  description: "What Sharpmonk's exam specifications and resized files can and can't promise, and why the official notification always comes first.",
};

export default function DisclaimerPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">Legal</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Disclaimer</h1>

        <div className="prose-legal mt-10">
          <h2>The official notification comes first</h2>
          <p>
            Each exam page summarises the upload specifications in that
            exam&apos;s official notification or information bulletin, and
            links the document, the pages, and the date we read it. Exam
            bodies revise these between cycles and sometimes mid-cycle. If
            the notification for your exam says something different from
            this Site, follow the notification.
          </p>

          <h2>Not affiliated with any exam body</h2>
          <p>
            Sharpmonk is independent. It is not affiliated with, endorsed
            by, or acting on behalf of IBPS, the National Testing Agency, or
            any other examining, recruiting or government body. Exam names
            are used only to say which specification a page describes.
          </p>

          <h2>Check your files before you submit</h2>
          <p>
            The tools measure every file they produce — its pixel
            dimensions, size in bytes, format and DPI — and show the result
            before you download it. Even so, a portal may apply checks a
            notification doesn&apos;t mention, or judge a photo&apos;s content
            (face size, background, lighting) differently. It remains your
            responsibility to confirm that each upload is accepted and is a
            true image of you, your signature and your impressions.
          </p>

          <h2>Padded files</h2>
          <p>
            To meet a minimum file size, a file may contain a standard JPEG
            comment block that does not change the image. This is explained
            in full on <Link href="/how-it-works#padding">How it works</Link>.
          </p>

          <h2>Use at your own discretion</h2>
          <p>
            See the <Link href="/terms">Terms of Service</Link> for the full
            limitation of liability, and the{" "}
            <Link href="/privacy">Privacy Policy</Link> for how this Site
            handles information — in short, your images never leave your
            device.
          </p>
        </div>
      </div>
    </main>
  );
}
