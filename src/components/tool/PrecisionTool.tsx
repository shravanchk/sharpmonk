"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/Icon";
import CropFrame from "./CropFrame";
import DropZone from "./DropZone";
import { RangeField, ToggleField } from "./Fields";
import {
  CENTRED,
  DecodeError,
  cropRect,
  decodeFile,
  inspect,
  produce,
  rotate,
  type EncodeResult,
  type FileFacts,
  type Framing,
  type Source,
} from "@/lib/imageEngine";
import { LIMITS, type ToolConfig } from "@/lib/toolConfig";
import { fmtSize, judgeOriginal, judgePhoto, judgeResult, type Check } from "@/lib/verdict";
import { analysePhoto, frameFace, whiten, type PhotoAnalysis } from "@/lib/vision";
import type { Strings } from "@/lib/i18n";
import { useStrings } from "@/components/LangProvider";

export type Preset = { label: string; config: Partial<ToolConfig> };

type Props = {
  initial: ToolConfig;
  /** Lets the reader change the target. Exam presets are locked. */
  editable?: boolean;
  /** Offer the "keep proportions" mode alongside exact pixels. */
  allowAuto?: boolean;
  presets?: Preset[];
  /** What the drop zone asks for — a key into the strings, e.g. "photo". */
  what?: keyof Strings["what"];
  /** Extra guidance shown under the crop, e.g. how to photograph a signature. */
  tip?: ReactNode;
  /** Told about each finished file (and null when the image is cleared), so
   *  an exam page can bundle every upload into one ZIP. */
  onFile?: (file: { name: string; blob: Blob } | null) => void;
};

type Loaded = { file: File; source: Source; facts: FileFacts; id: number };

let nextId = 1;

/**
 * One precision job: take an image, frame it, and produce a JPEG that meets a
 * target exactly. The file is rebuilt shortly after every change, and what is
 * shown on the right is that file — its real bytes, pixels and DPI — not an
 * estimate.
 */
export default function PrecisionTool({ initial, editable = false, allowAuto = false, presets, what = "image", tip, onFile }: Props) {
  const s = useStrings();
  const [cfg, setCfg] = useState<ToolConfig>(initial);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState(0);
  const [framing, setFraming] = useState<Framing>(CENTRED);
  const [result, setResult] = useState<{ key: string; res: EncodeResult; url: string | null } | null>(null);
  const urlRef = useRef<string | null>(null);
  // Read through a ref so a parent re-rendering with a new callback doesn't
  // restart the encode.
  const onFileRef = useRef(onFile);
  useEffect(() => {
    onFileRef.current = onFile;
  }, [onFile]);

  const working = useMemo(() => (loaded ? rotate(loaded.source, turns) : null), [loaded, turns]);

  // Photo of the candidate: find the face and the background once per image
  // and rotation. Read cfg through a ref so toggling the background doesn't
  // analyse again.
  const cfgRef = useRef(cfg);
  useEffect(() => {
    cfgRef.current = cfg;
  }, [cfg]);
  const visionKey = loaded && cfg.photo ? `${loaded.id}:${turns}` : "";
  const [vision, setVision] = useState<{ key: string; a: PhotoAnalysis | null } | null>(null);
  useEffect(() => {
    if (!working || !visionKey) return;
    let cancelled = false;
    analysePhoto(working).then(
      (a) => {
        if (cancelled) return;
        setVision({ key: visionKey, a });
        // Frame the face straight away, unless the reader already has.
        const c = cfgRef.current;
        setFraming((f) =>
          f === CENTRED && c.guide ? frameFace(a, working.width, working.height, c.width / c.height, c.fit, c.guide) : f,
        );
      },
      () => !cancelled && setVision({ key: visionKey, a: null }),
    );
    return () => {
      cancelled = true;
    };
  }, [working, visionKey]);
  const analysed = vision && vision.key === visionKey ? vision : null;
  const analysis = analysed?.a ?? null;

  const whitened = useMemo(
    () => (working && analysis && cfg.whiteBg ? whiten(working, analysis) : null),
    [working, analysis, cfg.whiteBg],
  );
  // What gets framed and encoded. Framing is in fractions of the image, so it
  // carries over between the photo and its whitened copy.
  const shown = whitened ?? working;

  const problem = validate(cfg, s);
  const key = loaded && !problem ? JSON.stringify([loaded.id, turns, framing, cfg, !!whitened]) : "";
  const busy = !!key && result?.key !== key;
  const current = result && result.key === key ? result : null;

  useEffect(() => {
    if (!shown || !key) return;
    let cancelled = false;
    const t = setTimeout(
      async () => {
        let res: EncodeResult;
        try {
          res = await produce(shown, cfg, framing);
        } catch (e) {
          res = { ok: false, reason: e instanceof Error ? e.message : String(e), smallestBytes: 0 };
        }
        if (cancelled) return;
        const url = res.ok ? URL.createObjectURL(res.blob) : null;
        if (urlRef.current) URL.revokeObjectURL(urlRef.current);
        urlRef.current = url;
        setResult({ key, res, url });
        onFileRef.current?.(res.ok ? { name: `${cfg.fileName}.jpg`, blob: res.blob } : null);
      },
      cfg.sizeMode === "auto" ? 320 : 160,
    );
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [shown, key, cfg, framing]);

  // Release the decoded image and the last object URL when we're done.
  useEffect(() => () => loaded?.source.release(), [loaded]);
  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  const take = async (file: File) => {
    setError(null);
    try {
      const source = await decodeFile(file);
      const facts = await inspect(file, source);
      setTurns(0);
      setFraming(CENTRED);
      setLoaded({ file, source, facts, id: nextId++ });
    } catch (e) {
      setError(e instanceof DecodeError ? e.message : s.tool.readError);
    }
  };

  const update = (patch: Partial<ToolConfig>) => {
    setCfg((c) => ({ ...c, ...patch }));
    if ("width" in patch || "height" in patch || "fit" in patch || "sizeMode" in patch) setFraming(CENTRED);
  };

  // Mirrors produce(): an untouched frame plus cleanup means "find the ink".
  const autoTrim = cfg.sizeMode === "exact" && cfg.cleanInk && framing.zoom === 1 && framing.cx === 0.5 && framing.cy === 0.5;
  const aspect = cfg.sizeMode === "exact" ? cfg.width / cfg.height : working ? working.width / working.height : 1;
  const ok = current?.res.ok ? current.res : null;

  const frameMyFace = () => {
    if (working && analysis && cfg.guide) setFraming(frameFace(analysis, working.width, working.height, aspect, cfg.fit, cfg.guide));
  };
  const photoChecks = (() => {
    if (!working || !analysis || !cfg.photo || problem) return null;
    const r = cropRect(working.width, working.height, aspect, cfg.fit, framing);
    const crop = { x: r.x / working.width, y: r.y / working.height, w: r.w / working.width, h: r.h / working.height };
    return judgePhoto(analysis, crop, cfg.photo, !!whitened, s);
  })();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Left: the image and its framing */}
      <div className="flex min-w-0 flex-col gap-4">
        {!working ? (
          <DropZone onFile={take} what={s.what[what]} />
        ) : (
          <>
            {problem ? (
              <div className="flex min-h-48 items-center justify-center rounded-xl border border-[var(--line-strong)] p-6 text-center text-sm">
                {problem}
              </div>
            ) : (
              <CropFrame
                source={shown ?? working}
                aspect={aspect}
                fit={cfg.sizeMode === "exact" ? cfg.fit : "cover"}
                framing={framing}
                onFraming={setFraming}
                guide={cfg.guide}
              />
            )}
            <p className="text-muted text-center text-xs">
              {autoTrim ? s.tool.autoTrim : cfg.guide ? s.tool.dragFace : s.tool.drag}
            </p>

            <RangeField
              label={s.tool.zoom}
              value={framing.zoom}
              min={1}
              max={4}
              step={0.01}
              format={(v) => `${v.toFixed(2)}×`}
              onChange={(zoom) => setFraming((f) => ({ ...f, zoom }))}
            />

            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" onClick={() => { setTurns((t) => t + 1); setFraming(CENTRED); }}>
                <Icon name="rotate" size={16} /> {s.tool.rotate}
              </button>
              {cfg.sizeMode === "exact" && (
                <button
                  type="button"
                  className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  onClick={() => update({ fit: cfg.fit === "cover" ? "contain" : "cover" })}
                  aria-pressed={cfg.fit === "contain"}
                >
                  <Icon name="crop" size={16} />
                  {cfg.fit === "cover" ? s.tool.fitWhole : s.tool.fillFrame}
                </button>
              )}
              <button type="button" className="btn-ghost inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm" onClick={() => { setLoaded(null); setResult(null); onFile?.(null); }}>
                <Icon name="image" size={16} /> {s.tool.another}
              </button>
            </div>

            {cfg.photo ? (
              <ToggleField
                label={s.photo.white}
                description={cfg.whiteBg && !analysed ? s.photo.whiteWait : s.photo.whiteDesc}
                checked={!!cfg.whiteBg}
                onChange={(whiteBg) => update({ whiteBg })}
              />
            ) : (
              <ToggleField
                label={s.tool.clean}
                description={s.tool.cleanDesc}
                checked={cfg.cleanInk}
                onChange={(cleanInk) => update({ cleanInk })}
              />
            )}
            {tip}
          </>
        )}
        {error && (
          <p role="alert" className="flex gap-2 rounded-xl border border-[var(--line-strong)] bg-[var(--surface-1)] p-3 text-sm">
            <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-[#fb7185]" />
            {error}
          </p>
        )}
      </div>

      {/* Right: target, then the file */}
      <div className="flex min-w-0 flex-col gap-4">
        {editable && <TargetEditor cfg={cfg} update={update} allowAuto={allowAuto} presets={presets} s={s} />}

        <section aria-live="polite" className="glass-card rounded-2xl p-5">
          <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.tool.yourFile}</h3>

          {!loaded && <TargetSummary cfg={cfg} s={s} />}

          {loaded && busy && !current && <p className="text-muted mt-4 text-sm">{s.tool.building}</p>}

          {loaded && current && !current.res.ok && (
            <p className="mt-4 flex gap-2 text-sm">
              <Icon name="alert" size={18} className="mt-0.5 shrink-0 text-[#fb7185]" />
              {current.res.reason}
            </p>
          )}

          {ok && current?.url && (
            <div className={`mt-4 flex flex-col gap-4 transition-opacity ${busy ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-4">
                <OutputPreview url={current.url} width={ok.width} height={ok.height} alt={s.tool.outputAlt} />
                <div className="min-w-0">
                  <div className="text-3xl font-semibold tracking-tight text-[var(--accent)]">{fmtSize(ok.bytes)}</div>
                  <div className="text-muted mt-0.5 text-sm">
                    {ok.width} × {ok.height} px · JPG{ok.dpi ? ` · ${ok.dpi} DPI` : ""}
                  </div>
                  <div className="text-muted mt-0.5 text-xs">{s.tool.quality(Math.round(ok.quality * 100))}</div>
                </div>
              </div>

              <CheckList checks={judgeResult(ok, cfg, s)} />

              {ok.padded > 0 && (
                <p className="text-muted rounded-xl bg-[var(--surface-1)] p-3 text-xs leading-relaxed">
                  {s.tool.padded(fmtSize(ok.bytes - ok.padded), cfg.minKB, fmtSize(ok.padded))}{" "}
                  <Link href="/how-it-works#padding" className="text-[var(--accent)] underline-offset-2 hover:underline">{s.tool.whySafe}</Link>
                </p>
              )}
              {ok.quality < 0.5 && (
                <p className="text-muted text-xs">{s.tool.lowQuality}</p>
              )}

              <a
                href={current.url}
                download={`${cfg.fileName}.jpg`}
                className="btn-glow inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold"
              >
                <Icon name="download" size={17} />
                {s.tool.download(`${cfg.fileName}.jpg`)}
              </a>
            </div>
          )}
        </section>

        {loaded && cfg.photo && (
          <section aria-live="polite" className="rounded-2xl border border-[var(--line)] p-5">
            <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.photo.title}</h3>
            {!analysed && <p className="text-muted mt-3 text-sm">{s.photo.checking}</p>}
            {analysed && !analysis && <p className="text-muted mt-3 text-sm">{s.photo.unavailable}</p>}
            {photoChecks && (
              <>
                <div className="mt-3">
                  <CheckList checks={photoChecks} />
                </div>
                {analysis?.faces === 1 && cfg.guide && (
                  <button
                    type="button"
                    onClick={frameMyFace}
                    className="btn-ghost mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                  >
                    <Icon name="crop" size={16} /> {s.photo.frame}
                  </button>
                )}
                <p className="text-muted mt-3 text-xs leading-relaxed">{s.photo.measured}</p>
              </>
            )}
          </section>
        )}

        {loaded && (
          <section className="rounded-2xl border border-[var(--line)] p-5">
            <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.tool.started}</h3>
            <p className="mt-2 truncate text-sm" title={loaded.facts.name}>{loaded.facts.name}</p>
            <div className="mt-3">
              <CheckList checks={judgeOriginal(loaded.facts, cfg, s)} />
            </div>
            {judgeOriginal(loaded.facts, cfg, s).every((c) => c.ok) && (
              <p className="mt-4 rounded-xl border border-[var(--positive)]/40 bg-[var(--positive)]/10 p-3 text-sm">{s.tool.alreadyOk}</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

function validate(c: ToolConfig, s: Strings): string | null {
  const int = (n: number) => Number.isInteger(n) && n >= 1 && n <= LIMITS.px;
  if (c.sizeMode === "exact" && (!int(c.width) || !int(c.height))) return s.tool.badPx(LIMITS.px);
  if (c.sizeMode === "auto" && (!int(c.maxLongSide) || c.maxLongSide < 48)) return s.tool.badLong(LIMITS.px);
  if (!(c.maxKB > 0) || c.maxKB > LIMITS.kb) return s.tool.badMax(LIMITS.kb);
  if (c.minKB < 0 || c.minKB >= c.maxKB) return s.tool.badMin;
  return null;
}

function TargetSummary({ cfg, s }: { cfg: ToolConfig; s: Strings }) {
  return (
    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
      <div>
        <dt className="text-muted text-xs">{s.tool.sumFile}</dt>
        <dd className="font-medium">{cfg.fileName}.jpg</dd>
      </div>
      <div>
        <dt className="text-muted text-xs">{s.tool.sumPixels}</dt>
        <dd className="font-medium">{cfg.sizeMode === "exact" ? `${cfg.width} × ${cfg.height}` : s.tool.ownProportions}</dd>
      </div>
      <div>
        <dt className="text-muted text-xs">{s.tool.sumSize}</dt>
        <dd className="font-medium">{cfg.minKB > 0 ? `${cfg.minKB}–${cfg.maxKB} KB` : s.tool.under(cfg.maxKB)}</dd>
      </div>
      <div>
        <dt className="text-muted text-xs">{s.tool.sumDpi}</dt>
        <dd className="font-medium">{cfg.dpi ?? s.tool.notRequired}</dd>
      </div>
    </dl>
  );
}

function OutputPreview({ url, width, height, alt }: { url: string; width: number; height: number; alt: string }) {
  // Shown at true size, doubled when tiny so a 140 × 60 signature is legible,
  // and capped so a large photo doesn't swamp the panel.
  const scale = Math.min(width < 160 ? 2 : 1, 132 / width, 170 / height);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      width={Math.round(width * scale)}
      height={Math.round(height * scale)}
      className="shrink-0 rounded-md border border-[var(--line-strong)] bg-white"
    />
  );
}

function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className="flex flex-col gap-2 text-sm">
      {checks.map((c) => (
        <li key={c.text} className="flex gap-2">
          <Icon
            name={c.ok ? "check" : "x"}
            size={17}
            strokeWidth={2.2}
            className={`mt-0.5 shrink-0 ${c.ok ? "text-[var(--positive)]" : "text-[#fb7185]"}`}
          />
          <span>
            {c.text}
            {c.detail && <span className="text-muted block text-xs">{c.detail}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function TargetEditor({
  cfg,
  update,
  allowAuto,
  presets,
  s,
}: {
  cfg: ToolConfig;
  update: (p: Partial<ToolConfig>) => void;
  allowAuto: boolean;
  presets?: Preset[];
  s: Strings;
}) {
  const num = (v: string) => (v.trim() === "" ? NaN : Number(v));
  const field = (label: string, value: number, onChange: (n: number) => void, suffix: string) => (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-sm font-medium text-[var(--foreground)]/90">{label}</span>
      <span className="relative">
        <input
          inputMode="decimal"
          className="field-input pr-10"
          value={Number.isNaN(value) ? "" : String(value)}
          onChange={(e) => onChange(num(e.target.value))}
        />
        <span className="text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs">{suffix}</span>
      </span>
    </label>
  );

  return (
    <section className="glass-card rounded-2xl p-5">
      <h3 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">{s.tool.target}</h3>

      {presets && presets.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => update(p.config)}
              className="rounded-full border border-[var(--line-strong)] bg-[var(--surface-1)] px-3 py-1.5 text-xs transition-colors hover:bg-[var(--surface-2)]"
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {allowAuto && (
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full border border-[var(--line-strong)] p-1 text-sm" role="radiogroup" aria-label="Pixel size">
          {(["auto", "exact"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={cfg.sizeMode === m}
              onClick={() => update({ sizeMode: m })}
              className={`rounded-full px-3 py-1.5 transition-colors ${cfg.sizeMode === m ? "bg-[var(--foreground)] text-[var(--background)]" : "text-muted hover:text-[var(--foreground)]"}`}
            >
              {m === "auto" ? s.tool.keepProportions : s.tool.exactPixels}
            </button>
          ))}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {cfg.sizeMode === "exact" ? (
          <>
            {field(s.tool.width, cfg.width, (width) => update({ width }), "px")}
            {field(s.tool.height, cfg.height, (height) => update({ height }), "px")}
          </>
        ) : (
          <div className="col-span-2">{field(s.tool.longest, cfg.maxLongSide, (maxLongSide) => update({ maxLongSide }), "px")}</div>
        )}
        {field(s.tool.minSize, cfg.minKB, (minKB) => update({ minKB: Number.isNaN(minKB) ? 0 : minKB }), "KB")}
        {field(s.tool.maxSize, cfg.maxKB, (maxKB) => update({ maxKB }), "KB")}
        <label className="col-span-2 flex flex-col gap-1.5">
          <span className="text-sm font-medium text-[var(--foreground)]/90">DPI</span>
          <select
            className="field-input"
            value={cfg.dpi ?? ""}
            onChange={(e) => update({ dpi: e.target.value ? Number(e.target.value) : undefined })}
          >
            <option value="">{s.tool.dpiUnset}</option>
            {[72, 96, 150, 200, 300].map((d) => (
              <option key={d} value={d}>{d} DPI</option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
