"use client";

import { useState } from "react";
import Icon, { type IconName } from "@/components/Icon";
import PrecisionTool from "./PrecisionTool";
import { configFromDoc } from "@/lib/toolConfig";
import { kbRange, type DocKind, type DocSpec } from "@/lib/specs";

const ICON: Record<DocKind, IconName> = {
  photo: "image",
  signature: "pen",
  thumb: "fingerprint",
  impressions: "fingerprint",
  declaration: "file-text",
};

const WHAT: Record<DocKind, string> = {
  photo: "your photo",
  signature: "a photo of your signature",
  thumb: "a photo of your thumb impression",
  impressions: "a photo of your finger and thumb impressions",
  declaration: "a photo of your declaration",
};

const TIP: Record<DocKind, string | null> = {
  photo: null,
  signature: "Sign on plain white paper, photograph it flat in daylight from straight above, and crop close to the signature.",
  thumb: "Press firmly once, without rolling, on white paper. Photograph it straight on so the ridges are sharp.",
  impressions: "Put all fingers and thumbs of both hands on one sheet of white paper, then photograph the whole sheet straight on.",
  declaration: "Write it in running hand, not capitals, on white paper in black ink, then photograph the page flat and straight on.",
};

/**
 * Every upload an exam asks for, one tab each. Tabs stay mounted while hidden
 * so switching to the signature doesn't throw away a finished photo.
 */
export default function ExamWorkbench({ docs }: { docs: DocSpec[] }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist" aria-label="Uploads" className="flex gap-2 overflow-x-auto pb-1">
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
              <span className="block font-medium leading-tight">{d.label}</span>
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
            what={WHAT[d.kind]}
            tip={TIP[d.kind] ? <p className="text-muted text-xs leading-relaxed">{TIP[d.kind]}</p> : undefined}
          />
        </div>
      ))}
    </div>
  );
}
