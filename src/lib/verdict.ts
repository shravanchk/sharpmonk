import type { EncodeResult, FileFacts, Rect } from "./imageEngine";
import type { Strings } from "./i18n";
import { safeWindow } from "./jpeg";
import type { PhotoRules } from "./specs";
import type { ToolConfig } from "./toolConfig";
import { backgroundIn, type PhotoAnalysis } from "./vision";

/** "34.2 KB", "2.41 MB" — decimal units, which is what file managers and
 *  most portals display. */
export function fmtSize(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(2)} MB`;
}

const TYPE_NAME: Record<string, string> = {
  jpeg: "JPEG",
  png: "PNG",
  webp: "WebP",
  gif: "GIF",
  heic: "HEIC",
  pdf: "PDF",
  unknown: "?",
};

export type Check = { ok: boolean; text: string; detail?: string };

/** Why the file someone already has would, or wouldn't, pass. */
export function judgeOriginal(f: FileFacts, cfg: ToolConfig, s: Strings): Check[] {
  const c = s.check;
  const out: Check[] = [];
  const win = safeWindow(cfg.minKB, cfg.maxKB);
  const extJpeg = f.extension === "jpg" || f.extension === "jpeg";

  if (f.type !== "jpeg") {
    out.push(
      extJpeg
        ? { ok: false, text: c.renamed(TYPE_NAME[f.type], f.extension), detail: c.renamedDetail }
        : { ok: false, text: c.wrongType(TYPE_NAME[f.type]) },
    );
  } else {
    out.push({ ok: true, text: c.jpeg });
  }

  if (cfg.sizeMode === "exact") {
    const match = f.width === cfg.width && f.height === cfg.height;
    out.push({ ok: match, text: match ? c.px(f.width, f.height) : c.pxWants(f.width, f.height, cfg.width, cfg.height) });
  }

  const inside = f.bytes >= win.minBytes && f.bytes <= win.maxBytes;
  out.push({
    ok: inside,
    text: inside ? c.inside(fmtSize(f.bytes), cfg.minKB, cfg.maxKB) : c.sizeWants(fmtSize(f.bytes), cfg.minKB, cfg.maxKB),
  });

  if (cfg.dpi) {
    const ok = f.dpi === cfg.dpi;
    out.push({ ok, text: ok ? c.dpi(f.dpi) : c.dpiWants(f.dpi, cfg.dpi) });
  }
  return out;
}

/** The checklist for the file Sharpmonk produced. */
export function judgeResult(r: Extract<EncodeResult, { ok: true }>, cfg: ToolConfig, s: Strings): Check[] {
  const c = s.check;
  const win = safeWindow(cfg.minKB, cfg.maxKB);
  const out: Check[] = [
    { ok: true, text: c.jpegFile },
    {
      ok: cfg.sizeMode === "auto" || (r.width === cfg.width && r.height === cfg.height),
      text: c.px(r.width, r.height),
      detail: cfg.sizeMode === "auto" ? c.ownProps : undefined,
    },
    {
      ok: r.bytes >= win.minBytes && r.bytes <= win.maxBytes,
      text: c.insideDash(fmtSize(r.bytes), cfg.minKB, cfg.maxKB),
      detail: c.bothCounts(c.bytes(r.bytes)),
    },
  ];
  if (cfg.dpi) out.push({ ok: r.dpi === cfg.dpi, text: c.dpi(r.dpi), detail: c.dpiHeader });
  return out;
}

/**
 * What the photo rules say, measured on the crop as framed now (`crop` in
 * fractions of the source). Cheap enough to run on every drag.
 *
 * The thresholds lean lenient: a check that fails a good photo would send
 * people to retake it for nothing, so each one fails only when the photo is
 * clearly off.
 */
export function judgePhoto(a: PhotoAnalysis, crop: Rect, rules: PhotoRules, whitened: boolean, s: Strings): Check[] {
  const p = s.photo;
  if (a.faces === 0 || !a.face) return [{ ok: false, text: p.noFace, detail: p.noFaceDetail }];
  if (a.faces > 1) return [{ ok: false, text: p.manyFaces(a.faces) }];

  const out: Check[] = [];
  const top = (a.headTop - crop.y) / crop.h;
  const bottom = (a.chin - crop.y) / crop.h;
  const cut = top < 0.005 || bottom > 0.995;
  if (cut) out.push({ ok: false, text: p.headCut, detail: p.headCutDetail });

  if (rules.faceShare) {
    const share = (a.chin - a.headTop) / crop.h;
    const pct = Math.round(Math.min(share, 1) * 100);
    const want = Math.round(rules.faceShare * 100);
    // Two points of slack: hair and chin edges are estimates.
    if (share >= rules.faceShare - 0.02) {
      if (!cut) out.push({ ok: true, text: p.faceShare(pct, want) });
    } else {
      out.push({ ok: false, text: p.faceSmall(pct, want), detail: p.faceSmallDetail });
    }
  }

  const dx = (a.face.x + a.face.w / 2 - (crop.x + crop.w / 2)) / crop.w;
  out.push(Math.abs(dx) <= 0.06 ? { ok: true, text: p.centred } : { ok: false, text: p.offCentre, detail: p.offCentreDetail });

  if (whitened) {
    out.push({ ok: true, text: p.bgMade });
  } else {
    const bg = backgroundIn(a, crop);
    if (bg) {
      // Phone photos of a white wall indoors come out a light grey; "light"
      // allows that, "white" asks for something close to paper.
      const ok = rules.background === "white" ? bg.lum >= 200 && bg.chroma <= 28 : bg.lum >= 165 && bg.chroma <= 45;
      out.push(ok ? { ok, text: p.bgOk(rules.background) } : { ok, text: p.bgBad(rules.background), detail: p.bgFix });
    }
  }

  if (a.light) {
    const dark = a.light.mean < 70;
    const uneven = a.light.sides > 1.7;
    out.push(
      dark || uneven
        ? { ok: false, text: dark ? p.dark : p.uneven, detail: p.lightDetail }
        : { ok: true, text: p.light },
    );
  }
  return out;
}
