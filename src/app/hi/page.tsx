import type { Metadata } from "next";
import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import IconBadge from "@/components/IconBadge";
import { STRINGS, alternates } from "@/lib/i18n";
import { EXAMS, kbRange } from "@/lib/specs";

const TITLE = "Sharpmonk — परीक्षा फ़ोटो और हस्ताक्षर रीसाइज़र, ठीक KB में";
const DESCRIPTION =
  "परीक्षा की फ़ोटो, हस्ताक्षर और सर्टिफ़िकेट को आधिकारिक अधिसूचना के ठीक पिक्सेल, KB और DPI में बनाएँ — UPSC, SSC, IBPS, SBI, NEET, JEE। सब ब्राउज़र में; कुछ भी अपलोड नहीं होता।";
const alt = alternates("/", "hi");

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: alt,
  openGraph: { title: TITLE, description: DESCRIPTION, url: alt.canonical, type: "website", locale: "hi_IN" },
};

const REJECTIONS: { icon: IconName; title: string; body: string }[] = [
  { icon: "ruler", title: "ग़लत पिक्सेल साइज़", body: "फ़ोन की फ़ोटो 3000+ पिक्सेल चौड़ी होती है; IBPS को 200 × 230 चाहिए। Sharpmonk आपके क्रॉप के साथ ठीक वही साइज़ बनाता है।" },
  { icon: "file-text", title: "बहुत बड़ी — या बहुत छोटी", body: "140 × 60 का हस्ताक्षर कुछ ही KB का होता है, 10 KB की न्यूनतम सीमा से कम। Sharpmonk हर फ़ाइल को सीमा के अंदर लाता है।" },
  { icon: "scale", title: "1,000 या 1,024 बाइट?", body: "पोर्टल KB अलग-अलग गिनते हैं और बताते नहीं। Sharpmonk की फ़ाइलें दोनों गिनती में पास होती हैं।" },
  { icon: "alert", title: ".jpg नाम वाली PNG", body: "नाम बदलने से फ़ाइल नहीं बदलती, और पोर्टल अंदर की सामग्री जाँचते हैं। Sharpmonk हमेशा असली JPEG बनाता है।" },
  { icon: "pen", title: "धूसर, छाया वाले हस्ताक्षर", body: "कागज़ की फ़ोन फ़ोटो धूसर आती है। सफ़ाई से कागज़ सफ़ेद और स्याही गहरी हो जाती है, बिना कोई लकीर बदले।" },
  { icon: "fingerprint", title: "DPI नहीं लिखा", body: "IBPS अँगूठे के निशान और घोषणा के लिए 200 DPI माँगता है। Sharpmonk इसे फ़ाइल में लिख देता है।" },
];

export default function Page() {
  const t = STRINGS.hi;
  const tools = [
    { href: "/hi/resize-image-to-kb", icon: "ruler" as IconName, ...t.tools.resize },
    { href: "/hi/signature-resize", icon: "pen" as IconName, ...t.tools.signature },
    { href: "/hi/compress-pdf-to-kb", icon: "file-text" as IconName, ...t.tools.pdf },
    { href: "/hi/image-to-pdf", icon: "image" as IconName, ...t.tools.imagePdf },
  ];
  return (
    <main className="relative flex flex-1 flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[680px]">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:py-20">
        <div className="flex flex-col">
          <span className="text-muted inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-1.5 text-xs">
            <Icon name="lock" size={13} />
            कुछ भी अपलोड नहीं होता
          </span>
          <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            परीक्षा फ़ोटो और हस्ताक्षर, <span className="text-[var(--accent)]">ठीक सही साइज़ में</span>
          </h1>
          <p className="text-muted mt-5 max-w-xl text-lg leading-relaxed">
            पिक्सेल, KB और DPI — आधिकारिक अधिसूचना से, किसी रीसाइज़र साइट के अंदाज़े से नहीं। क्रॉप करें, साफ़ करें, और ऐसी फ़ाइल
            डाउनलोड करें जो पहली बार में पास हो। सब कुछ आपके ब्राउज़र में होता है।
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/hi/exams" className="btn-glow inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold">
              {t.nav.cta}
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link href="/hi/resize-image-to-kb" className="btn-ghost rounded-full px-7 py-3 text-center text-sm font-medium">
              किसी भी KB में रीसाइज़
            </Link>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-5 sm:p-6">
          <h2 className="text-muted text-xs tracking-[0.1em] uppercase">अपनी परीक्षा चुनें</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {EXAMS.map((e) => {
              const photo = e.docs.find((d) => d.kind === "photo");
              return (
                <li key={e.slug}>
                  <Link
                    href={`/hi/exams/${e.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] p-3.5 transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <IconBadge name="image" size={20} badgeSize="sm" className="shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium group-hover:text-[var(--accent)]">{e.short}</span>
                      <span className="text-muted block truncate text-xs">
                        {e.docs.length} अपलोड
                        {photo ? ` · फ़ोटो ${photo.statedPx ? `${photo.width}×${photo.height}, ` : ""}${kbRange(photo)}` : ""}
                      </span>
                    </span>
                    <Icon name="chevron-right" size={16} className="text-muted shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="relative border-y border-[var(--line)] bg-[var(--section-bg)] px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold tracking-tight">टूल</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="glass-card group flex gap-4 rounded-2xl p-6">
                <IconBadge name={tool.icon} size={22} className="shrink-0" />
                <span>
                  <span className="block font-semibold tracking-tight group-hover:text-[var(--accent)]">{tool.title}</span>
                  <span className="text-muted mt-1 block text-sm leading-relaxed">{tool.body}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight">अपलोड रिजेक्ट क्यों होते हैं</h2>
        <p className="text-muted mt-3 max-w-2xl leading-relaxed">
          जब तक हर इमेज नियमों पर खरी न हो, फ़ॉर्म आगे नहीं बढ़ता। ये हैं वजहें — और डाउनलोड होने वाली हर फ़ाइल पर इन सबकी जाँच होती है।
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REJECTIONS.map((r) => (
            <div key={r.title} className="glass-card rounded-2xl p-6">
              <IconBadge name={r.icon} size={22} />
              <h3 className="mt-4 font-semibold tracking-tight">{r.title}</h3>
              <p className="text-muted mt-1.5 text-sm leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
