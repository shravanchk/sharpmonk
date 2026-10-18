import type { Fit } from "./imageEngine";
import type { DocSpec } from "./specs";

/**
 * What one tool instance is set to produce. Exam pages build this from a
 * DocSpec and lock it; the generic tools start from a preset and let the
 * reader edit it.
 */
export type ToolConfig = {
  label: string;
  /** "exact": output is width × height. "auto": keep the photo's own
   *  proportions and shrink the pixels only as far as the size limit needs. */
  sizeMode: "exact" | "auto";
  width: number;
  height: number;
  /** Longest side in auto mode, before any shrinking. */
  maxLongSide: number;
  minKB: number;
  maxKB: number;
  dpi?: number;
  fit: Fit;
  cleanInk: boolean;
  guide?: "passport" | "face80";
  fileName: string;
};

export function configFromDoc(doc: DocSpec): ToolConfig {
  return {
    label: doc.label,
    sizeMode: "exact",
    width: doc.width,
    height: doc.height,
    maxLongSide: Math.max(doc.width, doc.height),
    minKB: doc.minKB,
    maxKB: doc.maxKB,
    dpi: doc.dpi,
    fit: doc.fit,
    cleanInk: doc.cleanInk,
    guide: doc.guide,
    fileName: doc.fileName,
  };
}

/** Upper bounds for editable fields — beyond these a browser canvas or a
 *  phone's memory becomes the problem, and no exam form asks for more. */
export const LIMITS = { px: 6000, kb: 5000 };
