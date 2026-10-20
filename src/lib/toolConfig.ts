import type { Fit, Guide } from "./imageEngine";
import type { DocSpec, PhotoRules } from "./specs";

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
  guide?: Guide;
  /** Set for a photo of the candidate: turns on the photo checks. */
  photo?: PhotoRules;
  /** Replace the background with white (photos only). */
  whiteBg?: boolean;
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
    photo: doc.photo,
    whiteBg: false,
    fileName: doc.fileName,
  };
}

/** Upper bounds for editable fields — beyond these a browser canvas or a
 *  phone's memory becomes the problem, and no exam form asks for more. */
export const LIMITS = { px: 6000, kb: 5000 };
