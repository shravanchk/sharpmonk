import type { Preset } from "@/components/tool/PrecisionTool";
import { examBySlug } from "./specs";
import type { ToolConfig } from "./toolConfig";
import { STRINGS, type Lang } from "./i18n";

/** Starting points for the generic tools, shared by the English and Hindi pages. */

export const RESIZE_INITIAL: ToolConfig = {
  label: "Image",
  sizeMode: "auto",
  width: 600,
  height: 800,
  maxLongSide: 1600,
  minKB: 0,
  maxKB: 50,
  fit: "cover",
  cleanInk: false,
  fileName: "resized",
};

/** "Under N KB" chips, worded in the page's language. */
export function resizePresets(lang: Lang): Preset[] {
  const under = STRINGS[lang].tool.under;
  return [
    ...[20, 50, 100, 200, 500].map((max) => ({ label: under(max), config: { minKB: 0, maxKB: max } })),
    { label: "10–20 KB", config: { minKB: 10, maxKB: 20 } },
    { label: "20–50 KB", config: { minKB: 20, maxKB: 50 } },
  ];
}

// Presets come straight from the verified exam specs, so this page can never
// drift from the exam pages.
const ibps = examBySlug("ibps-po")!.docs.find((d) => d.kind === "signature")!;
const nta = examBySlug("neet-ug")!.docs.find((d) => d.kind === "signature")!;

export const SIGNATURE_INITIAL: ToolConfig = {
  label: "Signature",
  sizeMode: "exact",
  width: ibps.width,
  height: ibps.height,
  maxLongSide: 600,
  minKB: ibps.minKB,
  maxKB: ibps.maxKB,
  fit: "contain",
  cleanInk: true,
  fileName: "signature",
};

export const SIGNATURE_PRESETS: Preset[] = [
  { label: `IBPS PO · ${ibps.width}×${ibps.height} · ${ibps.minKB}–${ibps.maxKB} KB`, config: { width: ibps.width, height: ibps.height, minKB: ibps.minKB, maxKB: ibps.maxKB, dpi: undefined } },
  { label: `NEET UG / JEE Main · ${nta.minKB}–${nta.maxKB} KB`, config: { width: nta.width, height: nta.height, minKB: nta.minKB, maxKB: nta.maxKB, dpi: undefined } },
];
