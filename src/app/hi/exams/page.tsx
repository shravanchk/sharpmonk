import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import Icon from "@/components/Icon";
import { dateIn } from "@/components/ExamPage";
import { STRINGS, alternates } from "@/lib/i18n";
import { EXAMS, kbRange, pxLabel } from "@/lib/specs";

const TITLE = "परीक्षा फ़ोटो और हस्ताक्षर साइज़ — आधिकारिक अधिसूचनाओं से";
const DESCRIPTION =
  "UPSC, SSC, RRB, IBPS, SBI, NEET और JEE के लिए फ़ोटो, हस्ताक्षर, अँगूठे के निशान और घोषणा का साइज़ — हर एक आधिकारिक अधिसूचना से, तारीख़ के साथ, और हर एक का रीसाइज़र।";
const alt = alternates("/exams", "hi");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alt,
  openGraph: { title: TITLE, description: DESCRIPTION, url: alt.canonical, type: "website", locale: "hi_IN" },
};

export default function Page() {
  const t = STRINGS.hi;
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Breadcrumbs items={[{ label: "होम", href: "/hi" }, { label: "परीक्षाएँ", href: "/hi/exams" }]} />
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">परीक्षा अपलोड साइज़, सीधे स्रोत से</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          हर परीक्षा उसकी आधिकारिक अधिसूचना पढ़कर जोड़ी गई है — किसी दूसरी रीसाइज़र साइट से कॉपी करके नहीं — और हर पेज पर
          दस्तावेज़, पेज नंबर और जाँच की तारीख़ दी गई है।
        </p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {EXAMS.map((e) => (
          <Link
            key={e.slug}
            href={`/hi/exams/${e.slug}`}
            className="glass-card group flex flex-col rounded-2xl p-6 transition-transform hover:-translate-y-0.5"
          >
            <span className="text-muted font-mono text-[11px] tracking-[0.14em] uppercase">{e.conductedBy}</span>
            <h2 className="mt-2 text-lg font-semibold tracking-tight group-hover:text-[var(--accent)]">{e.name}</h2>
            <ul className="mt-4 flex flex-col gap-1.5 text-sm">
              {e.docs.map((d) => (
                <li key={d.kind} className="flex justify-between gap-3">
                  <span className="text-muted">{t.docLabel[d.kind]}</span>
                  <span className="shrink-0 text-right font-medium">
                    {pxLabel(d) ? `${pxLabel(d)} · ` : ""}
                    {kbRange(d)}
                  </span>
                </li>
              ))}
            </ul>
            <span className="text-muted mt-5 text-xs">जाँचा गया {dateIn("hi", e.verifiedOn)}</span>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)]">
              रीसाइज़र खोलें
              <Icon name="arrow-right" size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <section className="mt-14 max-w-3xl rounded-2xl border border-[var(--line)] p-6">
        <h2 className="font-semibold tracking-tight">आपकी परीक्षा सूची में नहीं है?</h2>
        <p className="text-muted mt-2 text-sm leading-relaxed">
          अपनी अधिसूचना के नंबरों के साथ <Link href="/hi/resize-image-to-kb" className="text-[var(--accent)] hover:underline">KB में रीसाइज़</Link> या{" "}
          <Link href="/hi/signature-resize" className="text-[var(--accent)] hover:underline">हस्ताक्षर रीसाइज़र</Link> इस्तेमाल करें —
          दोनों कोई भी पिक्सेल और KB सीमा लेते हैं। और <Link href="/contact" className="text-[var(--accent)] hover:underline">हमें बताएँ</Link>{" "}
          कि अगली कौन-सी परीक्षा जोड़ें; उसकी आधिकारिक अधिसूचना पढ़ने के बाद ही वह जोड़ी जाती है।
        </p>
      </section>
    </main>
  );
}
