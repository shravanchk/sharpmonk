/**
 * On-device analysis of a passport-style photo: where the face is, where the
 * person ends and the background begins, and how the light falls on the face.
 * It drives three things — the photo checks, "Frame my face", and the white
 * background — and, like the rest of the engine, never sends the image
 * anywhere.
 *
 * It runs MediaPipe's face detector and selfie segmenter in WebAssembly. The
 * runtime (~3.5 MB compressed) and two small models are served from /vendor
 * (see scripts/copy-vendor.mjs) and load only the first time a photo is
 * opened; the service worker then keeps them for offline use.
 *
 * Positions are fractions (0–1) of the analysed source, so they hold for any
 * resolution of the same image, the whitened copy included.
 */

import type { FaceDetector, ImageSegmenter } from "@mediapipe/tasks-vision";
import { CENTRED, GUIDES, cropRect, settleFraming, type Fit, type Framing, type Guide, type Rect, type Source } from "./imageEngine";

// Must match the installed @mediapipe/tasks-vision; copy-vendor.mjs checks.
const RUNTIME = "/vendor/mediapipe-1.0.1";
const MODELS = "/vendor/models";

/** Analysis resolution, long side. The segmenter sees 256 px and the face
 *  detector 128, so more only costs time; this much leaves the mask
 *  refinement enough detail to follow hair. */
const LONG = 640;

type Models = { face: FaceDetector; seg: ImageSegmenter };
let loading: Promise<Models> | null = null;

function models(): Promise<Models> {
  loading ??= (async () => {
    const { FilesetResolver, FaceDetector, ImageSegmenter } = await import("@mediapipe/tasks-vision");
    const files = await FilesetResolver.forVisionTasks(RUNTIME);
    // The runtime reports routine start-up ("INFO: Created TensorFlow Lite
    // XNNPACK delegate for CPU.") through console.error; keep that out.
    const error = console.error;
    console.error = (...args: unknown[]) => {
      if (!(typeof args[0] === "string" && args[0].startsWith("INFO:"))) error(...args);
    };
    // CPU: one still image needs no GPU, and the CPU path behaves the same on
    // every phone.
    const [face, seg] = await Promise.all([
      FaceDetector.createFromOptions(files, {
        baseOptions: { modelAssetPath: `${MODELS}/blaze_face_short_range.tflite`, delegate: "CPU" },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      }),
      ImageSegmenter.createFromOptions(files, {
        baseOptions: { modelAssetPath: `${MODELS}/selfie_segmenter.tflite`, delegate: "CPU" },
        runningMode: "IMAGE",
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      }),
    ]).finally(() => {
      console.error = error;
    });
    return { face, seg };
  })().catch((e) => {
    loading = null; // let a later photo try again
    throw e;
  });
  return loading;
}

export type PhotoAnalysis = {
  /** Faces found. The checks only mean something with exactly one. */
  faces: number;
  /** The detector's face box. */
  face: Rect | null;
  /** Top of the head, hair included, and the chin: what "face" is measured
   *  as for a share of the photo. */
  headTop: number;
  chin: number;
  /** Mean brightness of the face (0–255), and the brighter half of the face
   *  over the darker one — 1 is even light. */
  light: { mean: number; sides: number } | null;
  /** Refined person mask (1 = person) at the analysis resolution. */
  mask: { width: number; height: number; alpha: Float32Array };
  /** Summed-area tables over background pixels, for any crop in O(1). */
  bg: { width: number; height: number; count: Uint32Array; lum: Float64Array; chroma: Float64Array };
};

/** Finds the face and separates the person from the background. Rejects if
 *  the runtime can't load (an old browser, or offline before first use). */
export async function analysePhoto(src: Source): Promise<PhotoAnalysis> {
  const { face, seg } = await models();

  const k = Math.min(1, LONG / Math.max(src.width, src.height));
  const w = Math.max(1, Math.round(src.width * k));
  const h = Math.max(1, Math.round(src.height * k));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src.image, 0, 0, w, h);
  const px = ctx.getImageData(0, 0, w, h).data;

  const detections = face.detect(c).detections.filter((d) => d.boundingBox);

  const res = seg.segment(c);
  let raw: Float32Array;
  try {
    const masks = res.confidenceMasks ?? [];
    // selfie_segmenter returns one mask, the person; tolerate a
    // background/person pair as well.
    const m = masks[masks.length - 1];
    if (!m || m.width !== w || m.height !== h) throw new Error("Unexpected segmentation mask");
    raw = m.getAsFloat32Array().slice();
  } finally {
    res.close();
  }

  const lum = new Float32Array(w * h);
  const chroma = new Float32Array(w * h);
  for (let p = 0, i = 0; p < lum.length; p++, i += 4) {
    const r = px[i];
    const g = px[i + 1];
    const b = px[i + 2];
    lum[p] = 0.299 * r + 0.587 * g + 0.114 * b;
    chroma[p] = Math.max(r, g, b) - Math.min(r, g, b);
  }

  const alpha = refineMask(lum, raw, w, h);
  const bg = backgroundTables(alpha, lum, chroma, w, h);

  // The largest face is the candidate; a second one counts only if it's a
  // real face of some size, not a face on a T-shirt in the corner.
  const boxes = detections
    .map((d) => d.boundingBox!)
    .sort((a, b) => b.width * b.height - a.width * a.height);
  const main = boxes[0];
  const faces = boxes.filter((b) => main && b.width * b.height >= main.width * main.height * 0.15).length;

  if (!main) {
    return { faces: 0, face: null, headTop: 0, chin: 1, light: null, mask: { width: w, height: h, alpha }, bg };
  }

  const fx = clamp(main.originX, 0, w);
  const fy = clamp(main.originY, 0, h);
  const fw = clamp(main.width, 1, w - fx);
  const fh = clamp(main.height, 1, h - fy);

  return {
    faces,
    face: { x: fx / w, y: fy / h, w: fw / w, h: fh / h },
    headTop: headTop(alpha, w, fx, fy, fw, fh) / h,
    chin: Math.min(h, fy + fh) / h,
    light: faceLight(lum, w, fx, fy, fw, fh),
    mask: { width: w, height: h, alpha },
    bg,
  };
}

/**
 * Where the hair ends above the face: walk up a band through the middle of
 * the face box while the mask still says "person". The detector's box stops
 * at the forehead; portals mean the whole head.
 */
function headTop(alpha: Float32Array, w: number, fx: number, fy: number, fw: number, fh: number) {
  const x0 = Math.round(fx + fw * 0.3);
  const x1 = Math.max(x0 + 1, Math.round(fx + fw * 0.7));
  const rowPerson = (y: number) => {
    let s = 0;
    for (let x = x0; x < x1; x++) s += alpha[y * w + x];
    return s / (x1 - x0) >= 0.5;
  };
  let y = Math.round(fy);
  if (!rowPerson(Math.min(y + Math.round(fh * 0.1), Math.round(fy + fh) - 1))) {
    // No usable mask over the face: fall back on typical proportions.
    return Math.max(0, fy - fh * 0.3);
  }
  while (y > 0 && rowPerson(y - 1)) y--;
  return y;
}

/** Brightness of the face, and how evenly it's lit side to side. Uses the
 *  middle of the box so hair and background don't count. */
function faceLight(lum: Float32Array, w: number, fx: number, fy: number, fw: number, fh: number) {
  const x0 = Math.round(fx + fw * 0.15);
  const x1 = Math.round(fx + fw * 0.85);
  const xm = Math.round((x0 + x1) / 2);
  const y0 = Math.round(fy + fh * 0.2);
  const y1 = Math.round(fy + fh * 0.9);
  let l = 0;
  let r = 0;
  let nl = 0;
  let nr = 0;
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      if (x < xm) {
        l += lum[y * w + x];
        nl++;
      } else {
        r += lum[y * w + x];
        nr++;
      }
    }
  }
  if (!nl || !nr) return null;
  const ml = l / nl;
  const mr = r / nr;
  return { mean: (l + r) / (nl + nr), sides: Math.max(ml, mr) / Math.max(1, Math.min(ml, mr)) };
}

/* ----------------------------------------------------------------------
   Mask refinement
   ---------------------------------------------------------------------- */

/**
 * The segmenter's mask is soft and blocky (it thinks at 256 px). A guided
 * filter snaps it to the edges actually in the photo, then a gentle contrast
 * curve removes the grey halo either side of the outline.
 */
function refineMask(guide: Float32Array, mask: Float32Array, w: number, h: number) {
  const n = w * h;
  const I = new Float32Array(n);
  const Ip = new Float32Array(n);
  const II = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    I[p] = guide[p] / 255;
    Ip[p] = I[p] * mask[p];
    II[p] = I[p] * I[p];
  }
  const r = Math.max(2, Math.round(Math.max(w, h) / 120));
  const eps = 0.004;
  const mI = boxMean(I, w, h, r);
  const mp = boxMean(mask, w, h, r);
  const mIp = boxMean(Ip, w, h, r);
  const mII = boxMean(II, w, h, r);
  const a = new Float32Array(n);
  const b = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const cov = mIp[p] - mI[p] * mp[p];
    const v = mII[p] - mI[p] * mI[p];
    a[p] = cov / (v + eps);
    b[p] = mp[p] - a[p] * mI[p];
  }
  const ma = boxMean(a, w, h, r);
  const mb = boxMean(b, w, h, r);
  const out = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    const t = clamp((ma[p] * I[p] + mb[p] - 0.2) / 0.6, 0, 1);
    out[p] = t * t * (3 - 2 * t);
  }
  return out;
}

/** Mean over a (2r+1)² window, clipped at the edges, via a summed-area table. */
function boxMean(src: Float32Array, w: number, h: number, r: number) {
  const W = w + 1;
  const S = sat(src, w, h);
  const out = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r);
    const y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r);
      const x1 = Math.min(w, x + r + 1);
      out[y * w + x] = (S[y1 * W + x1] - S[y0 * W + x1] - S[y1 * W + x0] + S[y0 * W + x0]) / ((x1 - x0) * (y1 - y0));
    }
  }
  return out;
}

/** Summed-area table, (w+1) × (h+1), zero first row and column. */
function sat(src: ArrayLike<number>, w: number, h: number, into?: Float64Array | Uint32Array) {
  const W = w + 1;
  const S = into ?? new Float64Array(W * (h + 1));
  for (let y = 0; y < h; y++) {
    let row = 0;
    for (let x = 0; x < w; x++) {
      row += src[y * w + x];
      S[(y + 1) * W + x + 1] = S[y * W + x + 1] + row;
    }
  }
  return S;
}

/* ----------------------------------------------------------------------
   Background
   ---------------------------------------------------------------------- */

function backgroundTables(alpha: Float32Array, lum: Float32Array, chroma: Float32Array, w: number, h: number) {
  const n = w * h;
  const isBg = new Uint8Array(n);
  const bl = new Float32Array(n);
  const bc = new Float32Array(n);
  for (let p = 0; p < n; p++) {
    if (alpha[p] < 0.1) {
      isBg[p] = 1;
      bl[p] = lum[p];
      bc[p] = chroma[p];
    }
  }
  return {
    width: w,
    height: h,
    count: sat(isBg, w, h, new Uint32Array((w + 1) * (h + 1))) as Uint32Array,
    lum: sat(bl, w, h) as Float64Array,
    chroma: sat(bc, w, h) as Float64Array,
  };
}

/** Average brightness and colourfulness of the background inside `r` (in
 *  fractions of the source). Null when the person fills the crop. */
export function backgroundIn(a: PhotoAnalysis, r: Rect): { lum: number; chroma: number } | null {
  const { width: w, height: h, count, lum, chroma } = a.bg;
  const W = w + 1;
  const x0 = clamp(Math.round(r.x * w), 0, w);
  const x1 = clamp(Math.round((r.x + r.w) * w), 0, w);
  const y0 = clamp(Math.round(r.y * h), 0, h);
  const y1 = clamp(Math.round((r.y + r.h) * h), 0, h);
  const sum = (S: ArrayLike<number>) => S[y1 * W + x1] - S[y0 * W + x1] - S[y1 * W + x0] + S[y0 * W + x0];
  const n = sum(count);
  // Under 3% of the crop is too little to judge; it's mostly person anyway.
  if (n < Math.max(50, (x1 - x0) * (y1 - y0) * 0.03)) return null;
  return { lum: sum(lum) / n, chroma: sum(chroma) / n };
}

/** A copy of `src` with everything that isn't the person turned white. */
export function whiten(src: Source, a: PhotoAnalysis): Source {
  // Exam photos come out a few hundred pixels tall; 2000 px leaves room to
  // zoom without carrying a 12-megapixel canvas around.
  const k = Math.min(1, 2000 / Math.max(src.width, src.height));
  const W = Math.max(1, Math.round(src.width * k));
  const H = Math.max(1, Math.round(src.height * k));

  const { width: mw, height: mh, alpha } = a.mask;
  const m = document.createElement("canvas");
  m.width = mw;
  m.height = mh;
  const mctx = m.getContext("2d")!;
  const md = mctx.createImageData(mw, mh);
  for (let p = 0; p < alpha.length; p++) md.data[p * 4 + 3] = Math.round(alpha[p] * 255);
  mctx.putImageData(md, 0, 0);

  const person = document.createElement("canvas");
  person.width = W;
  person.height = H;
  const pctx = person.getContext("2d")!;
  pctx.imageSmoothingEnabled = true;
  pctx.imageSmoothingQuality = "high";
  pctx.drawImage(src.image, 0, 0, W, H);
  pctx.globalCompositeOperation = "destination-in";
  pctx.drawImage(m, 0, 0, W, H);

  const out = document.createElement("canvas");
  out.width = W;
  out.height = H;
  const ctx = out.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  ctx.drawImage(person, 0, 0);
  return { image: out, width: W, height: H, release: () => {} };
}

/* ----------------------------------------------------------------------
   Framing
   ---------------------------------------------------------------------- */

/** The framing that puts the head exactly in the guide oval: as tall as the
 *  oval, centred on it. Zoom is held to the slider's 1–4 range, so a photo
 *  taken from too far away may still come out small — the checks say so. */
export function frameFace(a: PhotoAnalysis, srcW: number, srcH: number, aspect: number, fit: Fit, guide: Guide): Framing {
  if (!a.face) return CENTRED;
  const g = GUIDES[guide];
  const base = cropRect(srcW, srcH, aspect, fit, CENTRED);
  const headH = (a.chin - a.headTop) * srcH;
  const zoom = clamp(base.h / (headH / ((2 * g.ry) / 100)), 1, 4);
  const h = base.h / zoom;
  const top = ((a.headTop + a.chin) / 2) * srcH - (g.cy / 100) * h;
  return settleFraming(srcW, srcH, aspect, fit, {
    zoom,
    cx: a.face.x + a.face.w / 2,
    cy: (top + h / 2) / srcH,
  });
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
