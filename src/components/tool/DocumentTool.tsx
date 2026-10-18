"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/Icon";
import { ToggleField } from "./Fields";
import { DecodeError } from "@/lib/imageEngine";
import { buildPdf, filePages, PdfOpenError, thumbnail, type PageOptions, type PageSource, type PdfProgress, type PdfResult } from "@/lib/pdfEngine";
import { safeWindow } from "@/lib/jpeg";
import { fmtSize } from "@/lib/verdict";
import type { Strings } from "@/lib/i18n";
import { useStrings } from "@/components/LangProvider";

export type DocPreset = { label: string; minKB: number; maxKB: number };

type Props = {
  initial: { minKB: number; maxKB: number };
  presets: DocPreset[];
  /** What the picker asks for — a key into the strings. */
  what: keyof Strings["what"];
  fileName: string;
};

type Item = { id: number; page: PageSource; thumb: string | null; from: string };

let nextId = 1;

/**
 * Pages in, one PDF out, inside a KB window. Takes PDFs and photos in any mix:
 * each PDF page and each photo becomes one A4 page, in the order shown.
 */
export default function DocumentTool({ initial, presets, what, fileName }: Props) {
  const s = useStrings();
  const [items, setItems] = useState<Item[]>([]);
  const [minKB, setMinKB] = useState(initial.minKB);
  const [maxKB, setMaxKB] = useState(initial.maxKB);
  const [opts, setOpts] = useState<PageOptions>({ cleanInk: false, grayscale: false });
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<PdfProgress | null>(null);
  const [result, setResult] = useState<{ res: PdfResult; url: string | null; key: string } | null>(null);
  const [originals, setOriginals] = useState<{ name: string; bytes: number }[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const urlRef = useRef<string | null>(null);
  const run = useRef({ cancelled: false });

  const key = JSON.stringify([items.map((i) => [i.id, i.page.turns]), minKB, maxKB, opts]);
  const stale = result !== null && result.key !== key;
  const valid = maxKB > 0 && minKB >= 0 && minKB < maxKB;

  // Thumbnails render after the fact, so adding a 20-page PDF stays snappy.
  useEffect(() => {
    const missing = items.filter((i) => i.thumb === null);
    if (missing.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const it of missing) {
        const thumb = await thumbnail(it.page, { cleanInk: false, grayscale: false }).catch(() => "");
        if (cancelled) return;
        setItems((list) => list.map((x) => (x.id === it.id ? { ...x, thumb } : x)));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items]);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  // When the offline worker is active, fetch the PDF libraries while the page
  // is idle so it caches them — otherwise they'd only be cached after a first
  // online use, and the PDF tools wouldn't work offline.
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.serviceWorker?.controller) return;
    const warm = () => {
      import("pdfjs-dist").catch(() => {});
      import("pdf-lib").catch(() => {});
    };
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(warm, 2000);
    return () => clearTimeout(id);
  }, []);

  const add = async (files: FileList | null) => {
    if (!files?.length) return;
    setError(null);
    const added: Item[] = [];
    for (const f of Array.from(files)) {
      try {
        for (const page of await filePages(f)) added.push({ id: nextId++, page, thumb: null, from: f.name });
        setOriginals((o) => [...o, { name: f.name, bytes: f.size }]);
      } catch (e) {
        setError(e instanceof PdfOpenError || e instanceof DecodeError ? e.message : `“${f.name}” — ${s.tool.readError}`);
      }
    }
    setItems((list) => [...list, ...added]);
  };

  const move = (id: number, by: number) =>
    setItems((list) => {
      const i = list.findIndex((x) => x.id === id);
      const j = i + by;
      if (i < 0 || j < 0 || j >= list.length) return list;
      const next = list.slice();
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const turn = (id: number) =>
    setItems((list) => list.map((x) => (x.id === id ? { ...x, page: { ...x.page, turns: (x.page.turns + 1) % 4 }, thumb: null } : x)));

  const make = async () => {
    run.current.cancelled = true;
    const token = { cancelled: false };
    run.current = token;
    setError(null);
    const res = await buildPdf(items.map((i) => i.page), { minKB, maxKB }, opts, setProgress, token).catch(
      (e): PdfResult => ({ ok: false, reason: e instanceof Error ? e.message : String(e) }),
    );
    if (token.cancelled) return;
    setProgress(null);
    const url = res.ok ? URL.createObjectURL(res.blob) : null;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = url;
    setResult({ res, url, key });
  };

  const win = valid ? safeWindow(minKB, maxKB) : null;
  const ok = result?.res.ok ? result.res : null;
  const totalIn = originals.reduce((n, o) => n + o.bytes, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">
        <input
          ref={input}
          type="file"
          accept="application/pdf,image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />

        {items.length === 0 ? (
          <div
            role="button"
            tabIndex={0}
            onClick={() => input.current?.click()}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), input.current?.click())}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              add(e.dataTransfer.files);
            }}
            className="flex min-h-64 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--line-strong)] bg-[var(--surface-1)] p-6 text-center transition-colors hover:bg-[var(--surface-2)]"
          >
            <span className="icon-badge icon-badge-lg icon-badge--amber">
              <Icon name="file-text" size={22} />
            </span>
            <span className="font-medium">{s.drop.choose(s.what[what])}</span>
            <span className="text-muted max-w-xs text-sm leading-relaxed">{s.doc.help}</span>
            <span className="text-muted inline-flex items-center gap-1.5 text-xs">
              <Icon name="lock" size={13} />
              {s.drop.local}
            </span>
          </div>
        ) : (
          <>
            <ol className="flex flex-col gap-2" aria-label={s.doc.pagesInOrder}>
              {items.map((it, i) => (
                <li key={it.id} className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-1)] p-2">
                  <span className="text-muted w-6 text-center font-mono text-xs">{i + 1}</span>
                  {it.thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={it.thumb} alt="" width={42} height={59} className="h-[59px] w-[42px] shrink-0 rounded border border-[var(--line-strong)] bg-white object-contain" />
                  ) : (
                    <span className="h-[59px] w-[42px] shrink-0 animate-pulse rounded border border-[var(--line-strong)] bg-[var(--surface-2)]" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm" title={it.from}>
                    {it.from}
                    {it.page.kind === "pdf" && <span className="text-muted"> · {s.doc.page(it.page.index + 1)}</span>}
                  </span>
                  <span className="flex shrink-0 gap-1">
                    <IconButton label={s.doc.up} disabled={i === 0} onClick={() => move(it.id, -1)}>↑</IconButton>
                    <IconButton label={s.doc.down} disabled={i === items.length - 1} onClick={() => move(it.id, 1)}>↓</IconButton>
                    <IconButton label={s.doc.rotate} onClick={() => turn(it.id)}><Icon name="rotate" size={15} /></IconButton>
                    <IconButton label={s.doc.remove} onClick={() => setItems((l) => l.filter((x) => x.id !== it.id))}><Icon name="x" size={15} /></IconButton>
                  </span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" onClick={() => input.current?.click()}>
                <Icon name="upload" size={16} /> {s.doc.addPages}
              </button>
              <button type="button" className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" onClick={() => { setItems([]); setOriginals([]); setResult(null); }}>
                <Icon name="x" size={16} /> {s.doc.startOver}
              </button>
            </div>
          </>
        )}

        <ToggleField
          label={s.doc.clean}
          description={s.doc.cleanDesc}
          checked={opts.cleanInk}
          onChange={(cleanInk) => setOpts((o) => ({ ...o, cleanInk }))}
        />
        <ToggleField
          label={s.doc.bw}
          description={s.doc.bwDesc}
          checked={opts.grayscale}
          onChange={(grayscale) => setOpts((o) => ({ ...o, grayscale }))}
        />
        {error && (
          <p role="alert" className="flex gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface-1)] p-3 text-sm">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-[#fb7185]" />
            {error}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <section className="glass-card rounded-2xl p-5">
          <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.tool.target}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setMinKB(p.minKB);
                  setMaxKB(p.maxKB);
                }}
                className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-3 py-1.5 text-xs transition-colors hover:bg-[var(--surface-2)]"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <KbField label={s.tool.minSize} value={minKB} onChange={setMinKB} />
            <KbField label={s.tool.maxSize} value={maxKB} onChange={setMaxKB} />
          </div>
          {!valid && <p className="mt-3 text-sm text-[#fb7185]">{s.doc.badRange}</p>}
          <button
            type="button"
            disabled={!valid || items.length === 0 || progress !== null}
            onClick={make}
            className="btn-glow mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon name="file-text" size={17} />
            {progress ? progressText(progress, s) : s.doc.make(items.length)}
          </button>
        </section>

        {result && (
          <section aria-live="polite" className={`glass-card rounded-2xl p-5 transition-opacity ${stale ? "opacity-60" : ""}`}>
            <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.doc.yourPdf}</h3>
            {stale && <p className="text-muted mt-2 text-xs">{s.doc.stale}</p>}
            {!result.res.ok && (
              <p className="mt-4 flex gap-2 text-sm">
                <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-[#fb7185]" />
                {result.res.reason}
              </p>
            )}
            {ok && result.url && win && (
              <div className="mt-4 flex flex-col gap-4">
                <div>
                  <div className="text-3xl font-semibold tracking-tight text-[var(--accent)]">{fmtSize(ok.bytes)}</div>
                  <div className="text-muted mt-0.5 text-sm">
                    {s.doc.summary(ok.pages, ok.dpi, Math.round(ok.quality * 100))}
                  </div>
                </div>
                <ul className="flex flex-col gap-2 text-sm">
                  <Check ok text={s.doc.pdfA4} />
                  <Check
                    ok={ok.bytes >= win.minBytes && ok.bytes <= win.maxBytes}
                    text={s.check.insideDash(fmtSize(ok.bytes), minKB, maxKB)}
                    detail={s.check.bothCounts(s.check.bytes(ok.bytes))}
                  />
                  {totalIn > 0 && <Check ok text={s.doc.downFrom(fmtSize(totalIn))} />}
                </ul>
                {ok.dpi < 100 && (
                  <p className="text-muted text-xs leading-relaxed">{s.doc.lowDpi(ok.dpi)}</p>
                )}
                {ok.padded && (
                  <p className="text-muted rounded-xl bg-[var(--surface-1)] p-3 text-xs leading-relaxed">
                    {s.doc.padded(minKB)}{" "}
                    <Link href="/how-it-works#padding" className="text-[var(--accent)] hover:underline">{s.doc.howPadding}</Link>
                  </p>
                )}
                <a
                  href={result.url}
                  download={`${fileName}.pdf`}
                  className="btn-glow inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold"
                >
                  <Icon name="download" size={17} />
                  {s.doc.download(`${fileName}.pdf`)}
                </a>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function progressText(p: PdfProgress, s: Strings) {
  if (p.stage === "render") return s.doc.progressRender(p.pages, p.dpi);
  if (p.stage === "fit") return s.doc.progressFit(p.maxKB, p.dpi);
  return s.doc.progressBuild;
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-lg border border-[var(--line)] text-sm transition-colors hover:bg-[var(--surface-2)] disabled:opacity-30"
    >
      {children}
    </button>
  );
}

function KbField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--foreground)]/90">{label}</span>
      <span className="relative">
        <input
          inputMode="decimal"
          className="field-input pr-10"
          value={Number.isNaN(value) ? "" : String(value)}
          onChange={(e) => onChange(e.target.value.trim() === "" ? 0 : Number(e.target.value))}
        />
        <span className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">KB</span>
      </span>
    </label>
  );
}

function Check({ ok, text, detail }: { ok: boolean; text: string; detail?: string }) {
  return (
    <li className="flex gap-2">
      <Icon name={ok ? "check" : "x"} size={17} strokeWidth={2.2} className={`mt-0.5 shrink-0 ${ok ? "text-[var(--positive)]" : "text-[#fb7185]"}`} />
      <span>
        {text}
        {detail && <span className="text-muted block text-xs">{detail}</span>}
      </span>
    </li>
  );
}
