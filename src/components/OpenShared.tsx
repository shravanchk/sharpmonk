"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon, { type IconName } from "@/components/Icon";
import { useLang, useStrings } from "@/components/LangProvider";
import { LANG_KEY, STRINGS, localHref } from "@/lib/i18n";
import { isPdf, peekShared } from "@/lib/shared";
import { EXAMS, kbRange, type DocSpec } from "@/lib/specs";
import { fmtSize } from "@/lib/verdict";

/**
 * Where a share from another app lands: shows what came through, asks what
 * it's for, and sends it to that tool, which picks the files up itself
 * (src/lib/shared.ts). Also works as a plain tool menu when nothing came.
 */
export default function OpenShared() {
  const s = useStrings();
  const lang = useLang();
  const router = useRouter();
  const [files, setFiles] = useState<File[] | null>(null);
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    // Arriving from a share (always ?shared=1) on the English page, with
    // Hindi last used: continue in Hindi. Only then — choosing English with
    // the language button comes without ?shared and must stay English.
    try {
      const fromShare = new URLSearchParams(window.location.search).has("shared");
      if (lang === "en" && fromShare && localStorage.getItem(LANG_KEY) === "hi") {
        router.replace(`/hi/open${window.location.search}`);
        return;
      }
    } catch {
      // Storage blocked: stay in English.
    }
    let cancelled = false;
    peekShared().then((f) => !cancelled && setFiles(f));
    return () => {
      cancelled = true;
    };
  }, [lang, router]);

  const thumbs = useMemo(() => (files ?? []).map((f) => (isPdf(f) ? null : URL.createObjectURL(f))), [files]);
  useEffect(() => () => thumbs.forEach((u) => u && URL.revokeObjectURL(u)), [thumbs]);

  if (files === null) {
    return <p className="text-muted mt-8 text-sm">{s.open.loading}</p>;
  }

  const has = files.length > 0;
  const images = files.some((f) => !isPdf(f));
  const pdfs = files.some(isPdf);
  const href = (path: string, query: Record<string, string | number> = {}) => {
    const q = new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)]));
    if (has) q.set("shared", "1");
    const qs = q.toString();
    return localHref(lang, qs ? `${path}?${qs}` : path);
  };

  const tools: { path: string; icon: IconName; title: string; body: string; show: boolean }[] = [
    { path: "/resize-image-to-kb", icon: "ruler", ...s.tools.resize, show: !has || images },
    { path: "/signature-resize", icon: "pen", ...s.tools.signature, show: !has || images },
    { path: "/image-to-pdf", icon: "image", ...s.tools.imagePdf, show: !has || images },
    { path: "/compress-pdf-to-kb", icon: "file-text", ...s.tools.pdf, show: !has || pdfs },
  ];
  const exam = EXAMS.find((e) => e.slug === slug);
  const label = (d: DocSpec) => (s === STRINGS.en ? d.label : s.docLabel[d.kind]);

  return (
    <div className="mt-8 flex flex-col gap-8">
      {has ? (
        <section>
          <h2 className="text-lg font-semibold">{s.open.what(files.length)}</h2>
          <ul className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {files.map((f, i) => (
              <li key={i} className="flex w-28 shrink-0 flex-col gap-1.5">
                <span className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl border border-[var(--line-strong)] bg-white">
                  {thumbs[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbs[i]!} alt="" className="size-full object-cover" />
                  ) : (
                    <Icon name="file-text" size={28} className="text-[#64748b]" />
                  )}
                </span>
                <span className="truncate text-xs" title={f.name}>{f.name}</span>
                <span className="text-muted text-xs">{fmtSize(f.size)}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted mt-3 inline-flex items-center gap-1.5 text-xs">
            <Icon name="lock" size={13} />
            {s.open.local}
          </p>
        </section>
      ) : (
        <p className="rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] p-4 text-sm">{s.open.none}</p>
      )}

      {has && (
        <section>
          <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.open.forExam}</h2>
          <p className="mt-3 text-sm font-medium">{s.open.pickExam}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EXAMS.map((e) => (
              <button
                key={e.slug}
                type="button"
                aria-pressed={slug === e.slug}
                onClick={() => setSlug(e.slug === slug ? null : e.slug)}
                className={`rounded-full border px-3.5 py-2 text-sm transition-colors ${
                  slug === e.slug
                    ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                    : "border-[var(--line-strong)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
                }`}
              >
                {e.short}
              </button>
            ))}
          </div>

          {exam && (
            <div className="mt-5">
              <p className="text-sm font-medium">{s.open.pickUpload(exam.short)}</p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {images &&
                  exam.docs.map((d) => (
                    <button
                      key={d.kind}
                      type="button"
                      onClick={() => router.push(href(`/exams/${exam.slug}`, { doc: d.kind }))}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--surface-2)]"
                    >
                      <span>
                        <span className="block font-medium">{label(d)}</span>
                        <span className="text-muted block text-xs">
                          {d.statedPx ? `${d.width} × ${d.height} px · ` : ""}
                          {kbRange(d)}
                        </span>
                      </span>
                      <Icon name="chevron-right" size={16} className="text-muted shrink-0" />
                    </button>
                  ))}
                {pdfs &&
                  (exam.pdf ? (
                    <button
                      type="button"
                      onClick={() => router.push(href("/compress-pdf-to-kb", { min: exam.pdf!.minKB, max: exam.pdf!.maxKB }))}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-1)] px-4 py-3 text-left text-sm transition-colors hover:bg-[var(--surface-2)]"
                    >
                      <span>
                        <span className="block font-medium">{s.open.pdfUpload(exam.pdf.label)}</span>
                        <span className="text-muted block text-xs">
                          {exam.pdf.minKB > 0 ? `${exam.pdf.minKB}–${exam.pdf.maxKB} KB` : s.tool.under(exam.pdf.maxKB)}
                        </span>
                      </span>
                      <Icon name="chevron-right" size={16} className="text-muted shrink-0" />
                    </button>
                  ) : (
                    !images && <p className="text-muted text-sm">{s.open.noExamPdf}</p>
                  ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.open.tools}</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {tools
            .filter((t) => t.show)
            .map((t) => (
              <Link
                key={t.path}
                href={href(t.path)}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line-strong)] bg-[var(--surface-1)] p-4 transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="icon-badge icon-badge-sm icon-badge--blue shrink-0">
                  <Icon name={t.icon} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{t.title}</span>
                  <span className="text-muted block text-xs leading-relaxed">{t.body}</span>
                </span>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
