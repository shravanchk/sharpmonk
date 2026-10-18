/**
 * Exam upload specifications.
 *
 * Every figure here was read from the conducting body's own notification PDF
 * — not from the resizer sites that copy each other — and each exam records
 * the document, its URL, the page, and the date it was checked. That is the
 * whole value of this file: when a notification changes, update the entry and
 * its `verifiedOn`, and every page and tool picks it up.
 *
 * Adding an exam: download the notification, find the "scanned images" or
 * "upload documents" section, and copy the numbers exactly. Where the
 * notification states no pixel size, say so (`statedPx: null`) and choose a
 * sensible output size instead of inventing a requirement.
 */

import type { Fit } from "./imageEngine";

export type DocKind = "photo" | "signature" | "thumb" | "declaration" | "impressions";

export type DocSpec = {
  kind: DocKind;
  label: string;
  /** Pixel size as the notification states it, or null when it fixes none. */
  statedPx: { width: number; height: number; qualifier?: string } | null;
  /** What the tool produces. Equals statedPx when there is one. */
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  dpi?: number;
  /** Physical size as printed in the notification, when given. */
  physical?: string;
  fit: Fit;
  /** Default for the paper-to-white cleanup (signatures and ink scans). */
  cleanInk: boolean;
  /** Overlay drawn on the crop frame. */
  guide?: "passport" | "face80";
  /** The notification's own rules, in plain words. */
  rules: string[];
  /** Our notes — where the notification is silent or contradicts itself. */
  notes?: string[];
  fileName: string;
};

export type ExamSpec = {
  slug: string;
  /** Full name, as the notification titles the recruitment or exam. */
  name: string;
  short: string;
  conductedBy: string;
  source: {
    title: string;
    url: string;
    /** As printed on, or recorded in, the document. */
    issued: string;
    pages: string;
  };
  /** ISO date the figures were last checked against `source`. */
  verifiedOn: string;
  summary: string;
  docs: DocSpec[];
  /** Uploads the portal also asks for that these tools don't produce. */
  alsoRequired: string[];
  faqs: { q: string; a: string }[];
};

export const EXAMS: ExamSpec[] = [
  {
    slug: "ibps-po",
    name: "IBPS PO / MT (CRP PO/MT-XVI)",
    short: "IBPS PO",
    conductedBy: "Institute of Banking Personnel Selection (IBPS)",
    source: {
      title: "Detailed Notification, CRP PO/MT-XVI",
      url: "https://www.ibps.in/wp-content/uploads/Detailed-Notification_CRP-PO-XVI_Final_V1_30.06.2026.pdf",
      issued: "30 June 2026",
      pages: "PDF pages 39–41",
    },
    verifiedOn: "2026-10-18",
    summary:
      "Four images, each with fixed pixels and a KB window: photo, signature, left thumb impression and a hand-written declaration.",
    docs: [
      {
        kind: "photo",
        label: "Photograph",
        statedPx: { width: 200, height: 230, qualifier: "preferred" },
        width: 200,
        height: 230,
        minKB: 20,
        maxKB: 50,
        physical: "4.5 cm × 3.5 cm",
        fit: "cover",
        cleanInk: false,
        guide: "passport",
        rules: [
          "Recent passport-style colour photograph.",
          "Light-coloured, preferably white, background.",
          "Look straight at the camera with a relaxed face; no harsh shadows or red-eye.",
          "Glasses only if there are no reflections and the eyes are clearly visible.",
          "Caps, hats and dark glasses are not acceptable. Religious headwear is allowed if it does not cover the face.",
        ],
        fileName: "photo",
      },
      {
        kind: "signature",
        label: "Signature",
        statedPx: { width: 140, height: 60, qualifier: "preferred" },
        width: 140,
        height: 60,
        minKB: 10,
        maxKB: 20,
        fit: "contain",
        cleanInk: true,
        rules: [
          "Sign on white paper with a black ink pen.",
          "Not in capital letters.",
          "Must match the signature you put on the call letter and attendance sheet at the exam, or you can be disqualified.",
        ],
        notes: [
          "At 140 × 60 px a signature is only a few KB even at top quality, so it falls short of the 10 KB minimum. Sharpmonk pads the file to reach it — see How it works.",
        ],
        fileName: "signature",
      },
      {
        kind: "thumb",
        label: "Left thumb impression",
        statedPx: { width: 240, height: 240, qualifier: "preferred" },
        width: 240,
        height: 240,
        minKB: 20,
        maxKB: 50,
        dpi: 200,
        physical: "3 cm × 3 cm",
        fit: "contain",
        cleanInk: true,
        rules: [
          "Left thumb impression on white paper, in black or blue ink.",
          "JPG / JPEG, 240 × 240 pixels at 200 DPI.",
          "No left thumb: use the right thumb, then a finger of the left hand starting from the forefinger, and so on — and say which one in the uploaded document.",
        ],
        fileName: "left-thumb",
      },
      {
        kind: "declaration",
        label: "Hand-written declaration",
        statedPx: { width: 800, height: 400, qualifier: "preferred" },
        width: 800,
        height: 400,
        minKB: 50,
        maxKB: 100,
        dpi: 200,
        physical: "10 cm × 5 cm",
        fit: "contain",
        cleanInk: true,
        rules: [
          "Written by you, in English, on white paper with black ink.",
          "Not in capital letters — the application is treated as invalid otherwise.",
          "The text: “I, ____ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.”",
        ],
        fileName: "declaration",
      },
    ],
    alsoRequired: [
      "A live photograph, captured in the form by webcam or by scanning a QR code with your phone. It is in addition to the uploaded photo above.",
      "10th-standard (SSC/SSLC) certificate as an A4 PDF of at most 500 KB.",
    ],
    faqs: [
      {
        q: "What is the IBPS PO photo size?",
        a: "200 × 230 pixels (the notification calls this preferred), as a JPG between 20 KB and 50 KB. It should be a recent colour passport-style photo on a light, preferably white, background.",
      },
      {
        q: "What is the IBPS PO signature size?",
        a: "140 × 60 pixels, between 10 KB and 20 KB, signed in black ink on white paper and not in capital letters.",
      },
      {
        q: "Why does my signature come out under 10 KB?",
        a: "Because 140 × 60 is a very small image — a clean signature at that size is usually 3–8 KB even at maximum JPEG quality. Sharpmonk adds a padding block inside the file (a standard JPEG comment segment that every viewer ignores) to bring it inside the window without blurring or enlarging it.",
      },
      {
        q: "Do I still need the live photo if I upload a photograph?",
        a: "Yes. The notification asks for both: the scanned photograph to these specifications, and a live photograph captured in the form by webcam or phone.",
      },
      {
        q: "What does 200 DPI mean for the thumb and declaration?",
        a: "DPI is a label inside the file saying how large it is meant to print; it doesn't change the pixels. At 200 DPI, 240 × 240 px is 3 × 3 cm and 800 × 400 px is 10 × 5 cm, which is how the notification describes them. Sharpmonk writes 200 DPI into both files.",
      },
    ],
  },
  {
    slug: "neet-ug",
    name: "NEET (UG) 2026",
    short: "NEET UG",
    conductedBy: "National Testing Agency (NTA)",
    source: {
      title: "Information Bulletin, NEET (UG)-2026",
      url: "https://cdnbbsr.s3waas.gov.in/s37bc1ec1d9c3426357e69acd5bf320061/uploads/2026/02/202602231394640855.pdf",
      issued: "February 2026",
      pages: "PDF pages 21–22",
    },
    verifiedOn: "2026-10-18",
    summary:
      "KB windows but no pixel sizes: passport photo, signature, and one image of both hands' finger and thumb impressions.",
    docs: [
      {
        kind: "photo",
        label: "Passport-size photograph",
        statedPx: null,
        width: 350,
        height: 450,
        minKB: 10,
        maxKB: 200,
        fit: "cover",
        cleanInk: false,
        guide: "face80",
        rules: [
          "Recent passport-size photograph, in colour or black & white.",
          "80% of the image should be your face, without a mask, with ears visible.",
          "White background.",
          "JPG / JPEG, between 10 KB and 200 KB.",
        ],
        notes: [
          "The bulletin sets no pixel dimensions. Sharpmonk produces 350 × 450 px — the 3.5 × 4.5 cm passport proportion — which is comfortably sharp and well inside the size window.",
        ],
        fileName: "photo",
      },
      {
        kind: "signature",
        label: "Signature",
        statedPx: null,
        width: 400,
        height: 160,
        minKB: 10,
        maxKB: 100,
        fit: "contain",
        cleanInk: true,
        rules: ["JPG / JPEG, between 10 KB and 100 KB."],
        notes: [
          "The bulletin sets no pixel dimensions for the signature. Sharpmonk uses 400 × 160 px, a 5 : 2 strip that fits a normal signature without clipping.",
        ],
        fileName: "signature",
      },
      {
        kind: "impressions",
        label: "Left & right hand finger and thumb impressions",
        statedPx: null,
        width: 900,
        height: 600,
        minKB: 50,
        maxKB: 200,
        fit: "contain",
        cleanInk: true,
        rules: [
          "Impressions of the fingers and thumbs of both hands, clearly legible.",
          "JPG / JPEG. Unclear impressions are rejected.",
        ],
        notes: [
          "The bulletin contradicts itself here: its upload list says 10–200 KB, and the section on impressions a page later says 50–300 KB. Sharpmonk targets 50–200 KB, which satisfies both.",
          "No pixel size is given; 900 × 600 px keeps all ten prints legible.",
        ],
        fileName: "finger-thumb-impressions",
      },
    ],
    alsoRequired: [
      "A live photograph captured in the form by webcam or a QR code on your phone. It is matched against your Aadhaar photo.",
      "Certificates (Class X, category, address proof and others) as PDFs of 50–300 KB each.",
    ],
    faqs: [
      {
        q: "What is the NEET UG 2026 photo size?",
        a: "The bulletin gives a file size, not pixel dimensions: a JPG between 10 KB and 200 KB, colour or black & white, with your face (no mask, ears visible) filling 80% of the image against a white background.",
      },
      {
        q: "Do I need to upload a postcard-size photo?",
        a: "Not in the 2026 upload list. The images uploaded are the passport-size photograph, signature, and finger and thumb impressions, plus a live photo captured in the form.",
      },
      {
        q: "Is the thumb impression limit 10–200 KB or 50–300 KB?",
        a: "The 2026 bulletin says both, a page apart. A file between 50 KB and 200 KB meets both readings, so that's what Sharpmonk produces.",
      },
      {
        q: "Can I correct the photo after submitting?",
        a: "The bulletin says no: the facility for correcting the photograph, signature and impressions will not be given, so check them before you submit.",
      },
    ],
  },
  {
    slug: "jee-main",
    name: "JEE (Main) 2026",
    short: "JEE Main",
    conductedBy: "National Testing Agency (NTA)",
    source: {
      title: "Information Bulletin, JEE (Main) 2026",
      url: "https://cdnbbsr.s3waas.gov.in/s3f8e59f4b2fe7c5705bf878bbd494ccdf/uploads/2025/11/202511021649722475.pdf",
      issued: "2 November 2025",
      pages: "PDF page 10",
    },
    verifiedOn: "2026-10-18",
    summary: "A colour passport photo and a signature, each in a KB window, with no pixel sizes fixed.",
    docs: [
      {
        kind: "photo",
        label: "Passport-size photograph",
        statedPx: null,
        width: 350,
        height: 450,
        minKB: 10,
        maxKB: 200,
        fit: "cover",
        cleanInk: false,
        guide: "face80",
        rules: [
          "Recent passport-size photograph in colour.",
          "80% of the image should be your face, without a mask, with ears visible.",
          "White background.",
          "JPG / JPEG, between 10 KB and 200 KB.",
        ],
        notes: [
          "Unlike NEET, JEE Main asks for colour — a black & white photo doesn't meet the bulletin.",
          "No pixel dimensions are set; Sharpmonk produces 350 × 450 px, the 3.5 × 4.5 cm passport proportion.",
        ],
        fileName: "photo",
      },
      {
        kind: "signature",
        label: "Signature",
        statedPx: null,
        width: 400,
        height: 160,
        minKB: 10,
        maxKB: 100,
        fit: "contain",
        cleanInk: true,
        rules: ["JPG / JPEG, clearly legible, between 10 KB and 100 KB."],
        notes: ["No pixel dimensions are set; Sharpmonk uses a 400 × 160 px strip."],
        fileName: "signature",
      },
    ],
    alsoRequired: [
      "A live photograph captured in the form by webcam or a QR code on your phone.",
      "Class 10 certificate or marks sheet as a PDF of 50–300 KB.",
    ],
    faqs: [
      {
        q: "What is the JEE Main 2026 photo size?",
        a: "A colour JPG between 10 KB and 200 KB, with your face (no mask, ears visible) covering 80% of the image on a white background. The bulletin doesn't fix pixel dimensions.",
      },
      {
        q: "What is the JEE Main signature size?",
        a: "A clearly legible JPG between 10 KB and 100 KB. No pixel size is given.",
      },
      {
        q: "Is the JEE Main photo rule the same as NEET's?",
        a: "Nearly. Both want 10–200 KB with 80% face and a white background, but JEE Main asks for a colour photo while NEET accepts colour or black & white.",
      },
    ],
  },
];

export const examBySlug = (slug: string) => EXAMS.find((e) => e.slug === slug);

/** "18 October 2026" — fixed locale so the server and client render alike. */
export function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

/** "20–50 KB" */
export const kbRange = (d: Pick<DocSpec, "minKB" | "maxKB">) => `${d.minKB}–${d.maxKB} KB`;
