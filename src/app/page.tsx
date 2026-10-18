import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Icon, { type IconName } from "@/components/Icon";
import IconBadge from "@/components/IconBadge";
import { TOOLS } from "@/lib/content";
import { EXAMS, kbRange, longDate } from "@/lib/specs";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/** The reasons uploads actually bounce — each one something the tools fix. */
const REJECTIONS: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "ruler",
    title: "Wrong pixel size",
    body: "A phone photo is 3000+ pixels wide; IBPS wants 200 × 230. Sharpmonk renders the exact size, with your crop.",
  },
  {
    icon: "file-text",
    title: "Too big — or too small",
    body: "A 140 × 60 signature is a few KB, under a 10 KB minimum. Sharpmonk lands every file inside the window.",
  },
  {
    icon: "scale",
    title: "1,000 or 1,024 bytes?",
    body: "Portals count KB differently and never say how. Sharpmonk's files pass under either count.",
  },
  {
    icon: "alert",
    title: "A PNG named .jpg",
    body: "Renaming doesn't convert, and portals check the contents. Sharpmonk always writes a real JPEG.",
  },
  {
    icon: "pen",
    title: "Grey, shadowed signatures",
    body: "Phone photos of paper come out grey. The cleanup makes paper white and ink dark, without redrawing a stroke.",
  },
  {
    icon: "fingerprint",
    title: "Missing DPI",
    body: "IBPS asks for 200 DPI on the thumb and declaration. Sharpmonk writes it into the file.",
  },
];

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-3" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--background)_20%,transparent)_0%,transparent_55%,var(--background)_100%)]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="flex flex-col">
          <span className="text-muted inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-1.5 font-mono text-xs tracking-[0.16em] uppercase">
            <Icon name="lock" size={13} />
            Nothing is uploaded
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.4rem] lg:leading-[1.08]">
            Exam photo &amp; signature, <span className="text-[var(--accent)]">sized exactly right</span>
          </h1>

          <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed">
            The pixels, KB and DPI from the official notification — not a resizer site&apos;s guess. Crop it, clean it, and
            download a file that passes the first time. It all happens in your browser.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/exams" className="btn-glow inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold">
              Find your exam
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link href="/resize-image-to-kb" className="btn-ghost rounded-full px-7 py-3 text-center text-sm font-medium">
              Resize to any KB
            </Link>
          </div>
        </div>

        {/* Exam picker — the first thing most visitors need, so it paints flat. */}
        <div className="glass-card rounded-3xl p-5 sm:p-6">
          <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">Pick your exam</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {EXAMS.map((e) => {
              const photo = e.docs.find((d) => d.kind === "photo");
              return (
                <li key={e.slug}>
                  <Link
                    href={`/exams/${e.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] p-3.5 transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <IconBadge name="image" size={20} badgeSize="sm" className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium group-hover:text-[var(--accent)]">{e.short}</span>
                      <span className="text-muted block truncate text-xs">
                        {e.docs.length} uploads
                        {photo ? ` · photo ${photo.statedPx ? `${photo.width}×${photo.height}, ` : ""}${kbRange(photo)}` : ""}
                      </span>
                    </span>
                    <Icon name="chevron-right" size={16} className="text-muted shrink-0" />
                  </Link>
                </li>
              );
            })}
            {TOOLS.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="group flex items-center gap-3 rounded-2xl border border-dashed border-[var(--line-strong)] p-3.5 transition-colors hover:bg-[var(--surface-1)]"
                >
                  <IconBadge name={t.icon} size={20} badgeSize="sm" className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium group-hover:text-[var(--accent)]">{t.title}</span>
                    <span className="text-muted block truncate text-xs">Any exam or form — set the numbers yourself</span>
                  </span>
                  <Icon name="chevron-right" size={16} className="text-muted shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why uploads get rejected */}
      <section className="relative border-y border-[var(--line)] bg-[var(--section-bg)] px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">Precision</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Why uploads get rejected</h2>
            <p className="text-muted mt-3 leading-relaxed">
              The form refuses to move on until every image matches. These are the reasons it refuses — and each one is
              checked on the file you download.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REJECTIONS.map((r, i) => (
              <Reveal key={r.title} delay={0.05 * i} className="glass-card rounded-2xl p-6">
                <IconBadge name={r.icon} size={22} />
                <h3 className="mt-4 font-semibold tracking-tight">{r.title}</h3>
                <p className="text-muted mt-1.5 text-sm leading-relaxed">{r.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sources */}
      <section className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div>
          <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">Sources</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Every number has a page reference</h2>
          <p className="text-muted mt-4 leading-relaxed">
            Most resizer sites copy each other, so a wrong number spreads everywhere at once. Sharpmonk reads the official
            notification for every exam it lists, links it, cites the page, and dates the check. Where a notification is
            silent or contradicts itself, the exam page says so.
          </p>
          <Link href="/how-it-works#sources" className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] hover:underline">
            How exams are added
            <Icon name="arrow-right" size={15} />
          </Link>
        </div>
        <ul className="flex flex-col gap-3">
          {EXAMS.map((e) => (
            <li key={e.slug} className="rounded-2xl border border-[var(--line)] p-4 text-sm">
              <span className="font-medium">{e.short}</span>
              <span className="text-muted block text-xs leading-relaxed">
                {e.source.title} · {e.source.issued} · {e.source.pages} · checked {longDate(e.verifiedOn)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Privacy */}
      <section className="relative px-4 pb-24 sm:px-6">
        <Reveal className="glass-card mx-auto flex max-w-4xl flex-col items-center gap-5 rounded-3xl p-8 text-center sm:p-14">
          <IconBadge name="eye-off" size={24} />
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your face and signature stay with you</h2>
          <p className="text-muted max-w-xl leading-relaxed">
            Exam uploads are identity documents. Sharpmonk has no server to send them to: your browser does the resizing, and
            the file goes straight from this page to your downloads. Try it in airplane mode.
          </p>
          <Link href="/how-it-works#privacy" className="btn-ghost rounded-full px-6 py-2.5 text-sm font-medium">
            How to check for yourself
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
