"use client";

import { useCallback, useState } from "react";
import Icon, { type IconName } from "@/components/Icon";
import PrecisionTool from "./PrecisionTool";
import { configFromDoc } from "@/lib/toolConfig";
import { useStrings } from "@/components/LangProvider";
import { STRINGS } from "@/lib/i18n";
import { kbRange, type DocKind, type DocSpec } from "@/lib/specs";

const ICON: Record<DocKind, IconName> = {
  photo: "image",
  signature: "pen",
  thumb: "fingerprint",
  impressions: "fingerprint",
  declaration: "file-text",
};

/**
 * Every upload an exam asks for, one tab each. Tabs stay mounted while hidden
 * so switching to the signature doesn't throw away a finished photo.
 */
export default function ExamWorkbench({ docs, examSlug }: { docs: DocSpec[]; examSlug: string }) {
  const s = useStrings();
  const [active, setActive] = useState(0);
  const [files, setFiles] = useState<Record<string, { name: string; blob: Blob }>>({});
  const ready = docs.filter((d) => files[d.kind]);

  // English shows the notification's own wording ("Passport-size photograph");
  // other languages use the translated name for the kind of upload.
  const label = (d: DocSpec) => (s === STRINGS.en ? d.label : s.docLabel[d.kind]);

  const fileFor = useCallback(
    (kind: string) => (f: { name: string; blob: Blob } | null) =>
      setFiles((all) => {
        const next = { ...all };
        if (f) next[kind] = f;
        else delete next[kind];
        return next;
      }),
    [],
  );

  // JPEGs don't compress further, so the ZIP just stores them (level 0).
  const downloadZip = async () => {
    const { zipSync } = await import("fflate");
    const entries: Record<string, [Uint8Array, { level: 0 }]> = {};
    for (const d of ready) {
      const f = files[d.kind];
      entries[f.name] = [new Uint8Array(await f.blob.arrayBuffer()), { level: 0 }];
    }
    const url = URL.createObjectURL(new Blob([zipSync(entries) as BlobPart], { type: "application/zip" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${examSlug}-uploads.zip`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  };

  return (
    <div>
      <div role="tablist" aria-label={s.bench.uploads} className="flex gap-2 overflow-x-auto pb-1">
        {docs.map((d, i) => (
          <button
            key={d.kind}
            id={`tab-${d.kind}`}
            role="tab"
            type="button"
            aria-selected={active === i}
            aria-controls={`panel-${d.kind}`}
            onClick={() => setActive(i)}
            className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-4 py-2.5 text-left text-sm transition-colors ${
              active === i
                ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                : "border-[var(--line-strong)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)]"
            }`}
          >
            <Icon name={ICON[d.kind]} size={18} className={active === i ? "text-[var(--accent)]" : "text-muted"} />
            <span>
              <span className="block font-medium leading-tight">{label(d)}</span>
              <span className="text-muted block text-xs leading-tight">
                {d.statedPx ? `${d.width} × ${d.height} px · ` : ""}
                {kbRange(d)}
              </span>
            </span>
          </button>
        ))}
      </div>

      {docs.map((d, i) => (
        <div
          key={d.kind}
          id={`panel-${d.kind}`}
          role="tabpanel"
          aria-labelledby={`tab-${d.kind}`}
          hidden={active !== i}
          className="mt-6"
        >
          <PrecisionTool
            initial={configFromDoc(d)}
            what={d.kind}
            onFile={fileFor(d.kind)}
            tip={s.tip[d.kind] ? <p className="text-muted text-xs leading-relaxed">{s.tip[d.kind]}</p> : undefined}
          />
        </div>
      ))}

      {docs.length > 1 && (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-1)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm">
            <span className="font-medium">{s.bench.ready(ready.length, docs.length)}</span>
            <span className="text-muted block text-xs">
              {ready.length < docs.length
                ? s.bench.todo(docs.filter((d) => !files[d.kind]).map((d) => label(d).toLowerCase()).join(", "))
                : s.bench.allSet}
            </span>
          </p>
          <button
            type="button"
            disabled={ready.length < 2}
            onClick={downloadZip}
            className="btn-ghost inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="download" size={16} />
            {s.bench.zip(ready.length)}
          </button>
        </div>
      )}
    </div>
  );
}
