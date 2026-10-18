import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import Icon from "@/components/Icon";
import ToolSchema from "@/components/ToolSchema";
import ExamWorkbench from "@/components/tool/ExamWorkbench";
import { STRINGS, localHref, type Lang } from "@/lib/i18n";
import { EXAMS, kbRange, longDate, pxLabel, type DocSpec, type ExamSpec } from "@/lib/specs";

const HI_MONTHS = ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"];

const HI_QUALIFIERS: Record<string, string> = { preferred: "पसंदीदा", minimum: "न्यूनतम", maximum: "अधिकतम", exact: "सटीक" };

export function dateIn(lang: Lang, iso: string) {
  if (lang === "en") return longDate(iso);
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${HI_MONTHS[m - 1]} ${y}`;
}

export const hasPhoto = (e: ExamSpec) => e.docs.some((d) => d.kind === "photo");

/** One line answering "what size?" for the meta description. */
export function describeExam(e: ExamSpec, lang: Lang) {
  const t = STRINGS[lang];
  const part = (d: DocSpec | undefined) => {
    if (!d) return null;
    const px = pxLabel(d);
    return `${t.docLabel[d.kind].toLowerCase()} ${px ? `${px} px, ` : ""}${kbRange(d)}`;
  };
  const parts = [part(e.docs.find((d) => d.kind === "photo")), part(e.docs.find((d) => d.kind === "signature"))].filter(Boolean).join("; ");
  return lang === "hi"
    ? `${e.short} अपलोड साइज़, आधिकारिक अधिसूचना से: ${parts}। अपनी फ़ाइल ठीक इसी साइज़ में बनाएँ — ब्राउज़र में, कुछ भी अपलोड नहीं होता।`
    : `${e.short} upload sizes from the official notification: ${parts}. Resize yours to fit exactly — in your browser, nothing uploaded.`;
}

export function examTitle(e: ExamSpec, lang: Lang) {
  return lang === "hi"
    ? `${e.short} ${hasPhoto(e) ? "फ़ोटो और हस्ताक्षर" : "हस्ताक्षर"} साइज़ — सटीक रीसाइज़र`
    : `${e.short} ${hasPhoto(e) ? "Photo & Signature" : "Signature"} Size — Exact Resizer`;
}

/**
 * Hindi questions and answers, built from the spec numbers rather than
 * translated prose, so they can't drift from the figures in the table.
 */
function hindiFaqs(e: ExamSpec) {
  const t = STRINGS.hi;
  const faqs = e.docs.map((d) => {
    const px = d.statedPx ? `${d.statedPx.width} × ${d.statedPx.height} पिक्सेल${d.statedPx.qualifier === "preferred" ? " (पसंदीदा)" : ""}, ` : "";
    const dpi = d.dpi ? `, ${d.dpi} DPI` : "";
    const noPx = d.statedPx || d.statedPxText ? "" : " अधिसूचना में पिक्सेल तय नहीं हैं।";
    return {
      q: `${e.short} ${t.docLabel[d.kind]} का साइज़ क्या है?`,
      a: `${px}${d.minKB}–${d.maxKB} KB की JPG / JPEG फ़ाइल${dpi}।${noPx} स्रोत: ${e.source.title} (${e.source.pages})।`,
    };
  });
  faqs.push({
    q: "क्या मेरी फ़ोटो किसी सर्वर पर अपलोड होती है?",
    a: "नहीं। फ़ोटो आपके ब्राउज़र में ही खुलती, क्रॉप होती और नई फ़ाइल बनती है। Sharpmonk के पास फ़ाइलें लेने वाला कोई सर्वर ही नहीं है।",
  });
  if (e.docs.some((d) => d.minKB >= 10 && d.width * d.height <= 240 * 240)) {
    faqs.push({
      q: "मेरा हस्ताक्षर न्यूनतम KB से छोटा क्यों बनता है?",
      a: "छोटे पिक्सेल साइज़ (जैसे 140 × 60) में साफ़ हस्ताक्षर सबसे ऊँची क्वालिटी पर भी कुछ ही KB का बनता है। Sharpmonk फ़ाइल के अंदर एक मानक JPEG टिप्पणी-ब्लॉक जोड़कर उसे न्यूनतम सीमा तक लाता है — इससे इमेज में कुछ नहीं बदलता।",
    });
  }
  return faqs;
}

/** The exam page, in either language. Hindi pages wrap this in LangProvider. */
export default function ExamPage({ e, lang }: { e: ExamSpec; lang: Lang }) {
  const t = STRINGS[lang];
  const x = t.exam;
  const path = localHref(lang, `/exams/${e.slug}`);
  const others = EXAMS.filter((o) => o.slug !== e.slug);
  const uploads = t.uploads(hasPhoto(e));
  const docLabel = (d: DocSpec) => (lang === "en" ? d.label : t.docLabel[d.kind]);
  const qualifier = (q: string) => (lang === "en" ? q : (HI_QUALIFIERS[q] ?? q));
  const summary =
    lang === "en"
      ? e.summary
      : `${e.docs.length} अपलोड: ${e.docs.map((d) => t.docLabel[d.kind]).join(", ")} — हर एक का साइज़ और KB सीमा आधिकारिक अधिसूचना से।`;

  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name={x.resizer(e.short, uploads)} path={path} description={describeExam(e, lang)} />
      <Breadcrumbs
        items={[
          { label: x.home, href: localHref(lang, "/") },
          { label: x.exams, href: localHref(lang, "/exams") },
          { label: e.short, href: path },
        ]}
      />

      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">{e.conductedBy}</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{x.resizer(e.short, uploads)}</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">{summary}</p>
        <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-1.5 text-xs">
          <Icon name="check" size={14} strokeWidth={2.2} className="text-[var(--positive)]" />
          {x.checked(e.source.title, e.source.issued, dateIn(lang, e.verifiedOn))}
        </p>
      </header>

      {/* The numbers, before the tool, as plain crawlable HTML — the answer
          most people came for. */}
      <section aria-labelledby="spec-heading" className="mt-10">
        <h2 id="spec-heading" className="text-xl font-semibold tracking-tight">
          {x.specs(e.short)}
        </h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--line)]">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-[var(--surface-1)] text-xs">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">{x.thUpload}</th>
                <th scope="col" className="px-4 py-3 font-medium">{x.thPixels}</th>
                <th scope="col" className="px-4 py-3 font-medium">{x.thSize}</th>
                <th scope="col" className="px-4 py-3 font-medium">{x.thDpi}</th>
                <th scope="col" className="px-4 py-3 font-medium">{x.thFormat}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {e.docs.map((d) => (
                <tr key={d.kind}>
                  <th scope="row" className="px-4 py-3 font-medium">
                    {docLabel(d)}
                    {d.physical && <span className="text-muted block text-xs font-normal">{d.physical}</span>}
                  </th>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {d.statedPx ? (
                      <>
                        {d.statedPx.width} × {d.statedPx.height}
                        {d.statedPx.qualifier && <span className="text-muted"> ({qualifier(d.statedPx.qualifier)})</span>}
                      </>
                    ) : (
                      (d.statedPxText ?? <span className="text-muted">{x.notSpecified}</span>)
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{kbRange(d)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {d.dpi ?? <span className="text-muted">—</span>}
                    {d.dpiStated && <span className="text-muted"> ({d.dpiStated})</span>}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">JPG / JPEG</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-label={x.resizerAria} className="glass-card mt-10 rounded-3xl p-4 sm:p-7">
        <ExamWorkbench docs={e.docs} examSlug={e.slug} />
      </section>

      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">{x.says}</h2>
          {x.saysNote && <p className="text-muted mt-2 text-sm">{x.saysNote}</p>}
          {/* The notification's own wording, in the language it was read in. */}
          <div lang="en" className="mt-6 flex flex-col gap-8">
            {e.docs.map((d) => (
              <section key={d.kind}>
                <h3 className="font-semibold tracking-tight">{d.label}</h3>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed">
                  {d.rules.map((r) => (
                    <li key={r} className="flex gap-2.5">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      {r}
                    </li>
                  ))}
                </ul>
                {d.notes?.map((n) => (
                  <p key={n} className="text-muted mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-3 text-xs leading-relaxed">
                    <span className="font-medium text-[var(--foreground)]">{STRINGS.en.exam.note}</span>
                    {n}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight">{x.also}</h2>
          <ul lang="en" className="mt-4 flex flex-col gap-2 text-sm leading-relaxed">
            {e.alsoRequired.map((r) => (
              <li key={r} className="flex gap-2.5">
                <Icon name="info" size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                {r}
              </li>
            ))}
          </ul>
          {e.pdf && (
            <Link
              href={localHref(lang, `/compress-pdf-to-kb?min=${e.pdf.minKB}&max=${e.pdf.maxKB}`)}
              className="btn-ghost mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              <Icon name="file-text" size={16} />
              {x.makePdf(e.pdf.label, e.pdf.minKB > 0 ? `${e.pdf.minKB}–${e.pdf.maxKB} KB` : x.under(e.pdf.maxKB))}
            </Link>
          )}

          <h2 className="mt-12 text-2xl font-semibold tracking-tight">{x.questions}</h2>
          <div className="mt-4">
            <FAQAccordion items={lang === "en" ? e.faqs : hindiFaqs(e)} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-2xl border border-[var(--line)] p-5">
            <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{x.source}</h2>
            <p className="mt-3 text-sm leading-relaxed">
              <a href={e.source.url} className="font-medium text-[var(--accent)] hover:underline" rel="noopener">
                {e.source.title}
              </a>
              <span className="text-muted block">
                {e.conductedBy} · {e.source.issued} · {e.source.pages}
              </span>
            </p>
            <p className="text-muted mt-3 text-xs leading-relaxed">
              {x.readOn(dateIn(lang, e.verifiedOn))}{" "}
              <Link href="/contact" className="text-[var(--accent)] hover:underline">{x.tellUs}</Link> {x.soWeUpdate}
            </p>
          </div>

          {others.length > 0 && (
            <div className="rounded-2xl border border-[var(--line)] p-5">
              <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{x.others}</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={localHref(lang, `/exams/${o.slug}`)} className="text-[var(--accent)] hover:underline">
                      {o.short} {t.uploads(hasPhoto(o))}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
