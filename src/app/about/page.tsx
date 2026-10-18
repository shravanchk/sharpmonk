import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About Sharpmonk",
  description:
    "Sharpmonk sizes exam photos and signatures to the official specification, in your browser, with every figure traced to its notification.",
};

export default function AboutPage() {
  return (
    <main className="relative flex-1 px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-[var(--accent)] font-mono text-xs tracking-[0.18em] uppercase">About</span>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Why Sharpmonk exists</h1>

        <div className="prose-legal mt-10">
          <p>
            Every year, millions of people applying for bank, medical, engineering and government exams hit the same wall:
            the form won&apos;t accept their photo. It&apos;s 3 MB and the limit is 50 KB, or the signature is 6 KB and the
            minimum is 10, or it&apos;s a PNG with a .jpg name. The usual fix is a resizer site that uploads your face and
            signature to its server, wraps the result in ads, and quotes numbers copied from another resizer site.
          </p>
          <p>Sharpmonk does the job differently:</p>
          <ul>
            <li>
              <strong>Exact.</strong> Files are built to the pixels, KB window and DPI the form asks for, and measured before
              you download them — not estimated.
            </li>
            <li>
              <strong>Sourced.</strong> Every exam page is built from the official notification, linked, with the page number and
              the date it was checked.
            </li>
            <li>
              <strong>Private.</strong> Resizing happens in your browser. There is no server for your images to go to.
            </li>
          </ul>
          <p>
            <Link href="/how-it-works">How it works</Link> explains each step, including the one that surprises people: how a file
            too small for a portal&apos;s minimum is brought up to it.
          </p>

          <h2>Who&apos;s behind it</h2>
          <p>
            Sharpmonk is built and maintained by{" "}
            <a href="https://www.linkedin.com/in/ch-shravan-kumar-b6a89974/" target="_blank" rel="noopener noreferrer">
              Shravan Cherukuri
            </a>
            , a software engineer, as an independent, self-funded project. The same maker runs two sister sites with the same
            approach — work from the official rules, and show the working:
          </p>
          <ul>
            <li>
              <a href="https://upaman.com">Upaman</a> — financial calculators for loans, tax, savings and investing.
            </li>
            <li>
              <a href="https://railmonk.com">Railmonk</a> — IRCTC cancellation refunds, Tatkal timings and waitlist tools, built
              on the published railway rules.
            </li>
          </ul>

          <h2>Which exams are next</h2>
          <p>
            Exams are added one at a time, only after reading the official notification. If yours isn&apos;t listed yet, the{" "}
            <Link href="/resize-image-to-kb">resize-to-KB tool</Link> takes any numbers in the meantime — and{" "}
            <Link href="/contact">tell us</Link> which exam to add.
          </p>
        </div>
      </div>
    </main>
  );
}
