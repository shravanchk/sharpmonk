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
  /** The notification's pixel rule in its own terms, when it gives one that
   *  isn't a single width × height (a range, say). Only read when statedPx is null. */
  statedPxText?: string;
  /** What the tool produces. Equals statedPx when there is one. */
  width: number;
  height: number;
  minKB: number;
  maxKB: number;
  dpi?: number;
  /** The notification's own DPI rule, when `dpi` is our choice rather than its figure. */
  dpiStated?: string;
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
  /** A PDF upload the notification sizes, which the PDF compressor can make. */
  pdf?: { label: string; minKB: number; maxKB: number };
  faqs: { q: string; a: string }[];
};

/**
 * IBPS and SBI notifications share one annexure for the four scanned images,
 * figures and all; only the declaration text and the fallback when there is
 * no left thumb differ. The figures below were read from each notification
 * that uses this (see each exam's `source`), and match the IBPS PO entry.
 */
function bankDocs(o: { thumbFallback: string; declaration: string }): DocSpec[] {
  return [
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
        o.thumbFallback,
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
        "Not in capital letters — it is not accepted otherwise.",
        `The text: “${o.declaration}”`,
      ],
      fileName: "declaration",
    },
  ];
}

const IBPS_THUMB_FALLBACK =
  "No left thumb: use the right thumb, then a finger of the left hand starting from the forefinger, and so on — and say which one in the uploaded document.";

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
    pdf: { label: "10th-standard certificate", minKB: 0, maxKB: 500 },
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
    pdf: { label: "Certificates", minKB: 50, maxKB: 300 },
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
    pdf: { label: "Class 10 certificate", minKB: 50, maxKB: 300 },
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
  {
    slug: "upsc-cse",
    name: "Civil Services (Preliminary) Examination, 2026",
    short: "UPSC CSE",
    conductedBy: "Union Public Service Commission (UPSC)",
    source: {
      title: "Instructions for uploading documents, UPSC online application portal",
      url: "https://upsconline.nic.in/candidate/resources/bzh30/login/upsc-candidates-portal/dist/assets/Instructions%20for%20uploading%20documents-new-2-CFBYTKvU.pdf",
      issued: "Undated; PDF created 31 July 2025",
      pages: "PDF pages 1, 2 and 4",
    },
    verifiedOn: "2026-10-18",
    summary:
      "A colour photo and a sheet of three signatures, each in a KB window. The CSE 2026 notification sends you to UPSC's upload instructions for the sizes, which fix no photo pixels and only a 350–500 px range for the signature.",
    docs: [
      {
        kind: "photo",
        label: "Photograph",
        statedPx: null,
        width: 350,
        height: 450,
        minKB: 20,
        maxKB: 200,
        fit: "cover",
        cleanInk: false,
        guide: "face80",
        rules: [
          "Recent colour photograph, JPG, between 20 KB and 200 KB, saved with the file name ‘photo’.",
          "Your face covers at least three-quarters (75%) of the photo, looking straight at the camera, head in the centre and both ears visible.",
          "Plain white background, with no shadows on the face or background.",
          "No coloured or dark glasses, no glare on spectacles, and hair not covering the eyes. A natural expression, eyes open.",
          "Not in uniform, and the photograph must not be signed.",
        ],
        notes: [
          "The instructions set no pixel dimensions. Sharpmonk produces 350 × 450 px, the 3.5 × 4.5 cm passport proportion; crop close so your face fills the guide.",
        ],
        fileName: "photo",
      },
      {
        kind: "signature",
        label: "Signature (three times)",
        statedPx: null,
        statedPxText: "350–500 px",
        width: 400,
        height: 480,
        minKB: 20,
        maxKB: 100,
        fit: "contain",
        cleanInk: true,
        rules: [
          "Sign three times, one below the other, on plain white paper in black ink, and upload the sheet as one image.",
          "Scan it clear, well lit and without shadows.",
          "JPG saved with the file name ‘signature’, between 20 KB and 100 KB, and between 350 and 500 pixels.",
        ],
        notes: [
          "The instructions say “between 350 pixels to 500 pixels” without saying whether that is the width or the height. Sharpmonk makes 400 × 480 px, so both sides are inside 350–500 whichever one the portal checks — and the tall frame fits three signatures stacked.",
          "The three-signature rule is in the CSE 2026 notification itself (PDF pages 17–18); the sizes are in UPSC's upload instructions, which that notification points to.",
        ],
        fileName: "signature",
      },
    ],
    pdf: { label: "Matriculation certificate", minKB: 50, maxKB: 300 },
    alsoRequired: [
      "A live photograph captured while filling the Common Application Form, in addition to the uploaded photo.",
      "Your photo ID (Aadhaar or another) as a JPG of 20–200 KB, and the matriculation certificate as a PDF of 50–300 KB.",
    ],
    faqs: [
      {
        q: "What is the UPSC CSE photo size?",
        a: "A colour JPG between 20 KB and 200 KB, named ‘photo’, on a plain white background, with your face covering at least three-quarters of the image and both ears visible. UPSC doesn't fix pixel dimensions.",
      },
      {
        q: "Why does UPSC want my signature three times?",
        a: "The CSE 2026 notification asks you to sign three times, one below the other, on plain white paper in black ink, and upload that as a single image. Photograph the whole sheet; Sharpmonk fits it into a 400 × 480 px frame.",
      },
      {
        q: "What does “350 to 500 pixels” mean for the signature?",
        a: "UPSC's instructions don't say whether it is the width or the height. A 400 × 480 px image has both sides inside 350–500, so it satisfies either reading, and it is the size Sharpmonk produces.",
      },
      {
        q: "Does the file name matter?",
        a: "Yes. UPSC's instructions say a document won't upload under any other name, format or size. Sharpmonk saves the files as photo.jpg and signature.jpg.",
      },
      {
        q: "Do I still need the live photo?",
        a: "Yes. The notification asks for both: the uploaded photograph and a live photograph captured while you fill in the form.",
      },
    ],
  },
  {
    slug: "sbi-po",
    name: "SBI Probationary Officers (CRPD/PO/2026-27/09)",
    short: "SBI PO",
    conductedBy: "State Bank of India (SBI)",
    source: {
      title: "Detailed Advertisement, CRPD/PO/2026-27/09",
      url: "https://sbi.bank.in/documents/77530/57941/18062026_1_Detailed_Adv.2026.pdf/1f1a9532-8a2f-6e59-08a0-616d62a497b1?t=1781759726353",
      issued: "18 June 2026",
      pages: "PDF page 15 (Annexure II)",
    },
    verifiedOn: "2026-10-18",
    summary:
      "Four images, each with fixed pixels and a KB window — the same figures as IBPS: photo, signature, left-hand thumb impression and a hand-written declaration.",
    docs: bankDocs({
      thumbFallback: "No left thumb: use the right thumb.",
      declaration:
        "I ____ (Name of the candidate), ____ (Date of Birth) hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required. The signature, photograph and left-hand thumb impression is of mine.",
    }),
    alsoRequired: [
      "A live photograph, captured in the form by webcam or by scanning a QR code with your phone. It is in addition to the uploaded photo above.",
    ],
    faqs: [
      {
        q: "What is the SBI PO photo size?",
        a: "200 × 230 pixels (preferred), as a JPG between 20 KB and 50 KB. It should be a recent colour passport-style photo on a light, preferably white, background.",
      },
      {
        q: "What is the SBI PO signature size?",
        a: "140 × 60 pixels (preferred), between 10 KB and 20 KB, signed in black ink on white paper and not in capital letters.",
      },
      {
        q: "Are the SBI PO sizes the same as IBPS PO?",
        a: "The figures are identical for all four images. The declaration text is not: SBI's adds your date of birth and the line “The signature, photograph and left-hand thumb impression is of mine”.",
      },
      {
        q: "Does the 2026 corrigendum change the uploads?",
        a: "No. The corrigendum of 1 July 2026 only removes the CIBIL clause; it says all other terms of the advertisement stay unchanged.",
      },
    ],
  },
  {
    slug: "sbi-clerk",
    name: "SBI Junior Associates (Customer Support & Sales) (CRPD/CR/2026-27/17)",
    short: "SBI Clerk",
    conductedBy: "State Bank of India (SBI)",
    source: {
      title: "Detailed Advertisement, CRPD/CR/2026-27/17",
      url: "https://sbi.bank.in/webfiles/uploads/files_2627/08/JA_2026_Detailed_Advt_Eng.pdf",
      issued: "11 August 2026",
      pages: "PDF page 9 (Annexure II)",
    },
    verifiedOn: "2026-10-18",
    summary:
      "Four images for the Junior Associate (clerk) application, each with fixed pixels and a KB window: photo, signature, left thumb impression and a hand-written declaration.",
    docs: bankDocs({
      thumbFallback: "No left thumb: use the right thumb.",
      declaration:
        "I, ____ (Name of the candidate), Date of Birth ____, hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required. The signature, photograph and left thumb impression is of mine.",
    }),
    alsoRequired: [
      "A live photograph, captured in the form by webcam or by scanning a QR code with your phone. It is in addition to the uploaded photo above.",
    ],
    faqs: [
      {
        q: "What is the SBI Clerk photo size?",
        a: "200 × 230 pixels (preferred), as a JPG between 20 KB and 50 KB — a recent colour passport-style photo on a light, preferably white, background.",
      },
      {
        q: "What is the SBI Clerk signature size?",
        a: "140 × 60 pixels (preferred), between 10 KB and 20 KB, in black ink on white paper. Signatures in capital letters are not accepted.",
      },
      {
        q: "What goes in the SBI Clerk hand-written declaration?",
        a: "The text in the advertisement, in your own handwriting, in English, on white paper in black ink — with your name and date of birth filled in. Upload it at 800 × 400 px, 50–100 KB.",
      },
      {
        q: "Are SBI Clerk and SBI PO uploads the same?",
        a: "Yes, the four images have the same pixels and KB windows. Only the declaration wording differs slightly.",
      },
    ],
  },
  {
    slug: "ibps-clerk",
    name: "IBPS Customer Service Associates (CRP CSA-XVI)",
    short: "IBPS Clerk",
    conductedBy: "Institute of Banking Personnel Selection (IBPS)",
    source: {
      title: "Detailed Notification, CRP CSA-XVI",
      url: "https://www.ibps.in/wp-content/uploads/Notification_CRP_CSA_XVI-Final.pdf",
      issued: "1 August 2026",
      pages: "PDF pages 55–57 (Annexure IV)",
    },
    verifiedOn: "2026-10-18",
    summary:
      "IBPS now calls the clerk post Customer Service Associate. Four images, each with fixed pixels and a KB window: photo, signature, left thumb impression and a hand-written declaration.",
    docs: bankDocs({
      thumbFallback: IBPS_THUMB_FALLBACK,
      declaration:
        "I, ____ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will present the supporting documents as and when required.",
    }),
    pdf: { label: "10th-standard certificate", minKB: 0, maxKB: 500 },
    alsoRequired: [
      "A live photograph, captured in the form by webcam or by scanning a QR code with your phone. It is in addition to the uploaded photo above.",
      "10th-standard (SSC/SSLC) certificate as an A4 PDF of at most 500 KB, and the certificate under Clause K (ix) if it applies to you.",
    ],
    faqs: [
      {
        q: "What is the IBPS Clerk photo size?",
        a: "200 × 230 pixels (preferred), as a JPG between 20 KB and 50 KB. The form won't let you move on until the photo and signature match the specification.",
      },
      {
        q: "What is the IBPS Clerk signature size?",
        a: "140 × 60 pixels (preferred), between 10 KB and 20 KB, signed in black ink on white paper and not in capital letters.",
      },
      {
        q: "Is IBPS Clerk the same as IBPS CSA?",
        a: "Yes. Since CRP CSA-XV the clerical cadre recruitment has been titled Customer Service Associates; it is the exam that used to be called CRP Clerks.",
      },
      {
        q: "Are the uploads the same as IBPS PO?",
        a: "Yes — photo, signature, left thumb impression and declaration have the same pixels and KB windows in the CSA-XVI and PO/MT-XVI notifications.",
      },
    ],
  },
  {
    slug: "ibps-rrb",
    name: "IBPS RRB Officers & Office Assistants (CRP RRBs-XV)",
    short: "IBPS RRB",
    conductedBy: "Institute of Banking Personnel Selection (IBPS)",
    source: {
      title: "Detailed Notification, CRP RRBs-XV",
      url: "https://www.ibps.in/wp-content/uploads/CRP-RRBs-XV-notification_Revised.pdf",
      issued: "1 September 2026",
      pages: "PDF pages 58–60 (Annexure III)",
    },
    verifiedOn: "2026-10-18",
    summary:
      "One set of uploads for Officer Scale I, II, III and Office Assistant (Multipurpose): photo, signature, left thumb impression and a hand-written declaration, each with fixed pixels and a KB window.",
    docs: bankDocs({
      thumbFallback: IBPS_THUMB_FALLBACK,
      declaration:
        "I, ____ (Name of the candidate), hereby declare that all the information submitted by me in the application form is correct, true and valid. I will submit the supporting documents as and when required.",
    }),
    pdf: { label: "10th-standard certificate", minKB: 0, maxKB: 500 },
    alsoRequired: [
      "A live photograph, captured in the form by webcam or by scanning a QR code with your phone. It is in addition to the uploaded photo above.",
      "10th-standard (SSC/SSLC) certificate as an A4 PDF of at most 500 KB, plus the certificate or UDID card under Clause J (ix) and the certificate under Clause J (x) if they apply to you.",
    ],
    faqs: [
      {
        q: "What is the IBPS RRB photo size?",
        a: "200 × 230 pixels (preferred), as a JPG between 20 KB and 50 KB — a recent colour passport-style photo on a light, preferably white, background.",
      },
      {
        q: "What is the IBPS RRB signature size?",
        a: "140 × 60 pixels (preferred), between 10 KB and 20 KB, in black ink on white paper and not in capital letters.",
      },
      {
        q: "Are the sizes different for Office Assistant and Officer posts?",
        a: "No. The CRP RRBs-XV notification gives one set of image specifications for every post it covers.",
      },
      {
        q: "Did the RRB-XV corrigenda change the uploads?",
        a: "No. The corrigenda of 9, 15, 21 and 25 September 2026 update vacancies and extend the registration window; each says all other terms stay unchanged.",
      },
    ],
  },
  {
    slug: "rrb-ntpc",
    name: "RRB NTPC, CEN 06/2026 (Graduate) and CEN 07/2026 (Under Graduate)",
    short: "RRB NTPC",
    conductedBy: "Railway Recruitment Boards (RRBs), Ministry of Railways",
    source: {
      title: "Centralised Employment Notification No. 06/2026, Non-Technical Popular Categories (Graduate)",
      url: "https://www.rrbapply.gov.in/assets/forms/CEN_06_2026_NTPC_G.pdf",
      issued: "Applications opened 8 October 2026",
      pages: "PDF pages 22–24 (para 14.4–14.5); CEN 07/2026 repeats them on pages 23–24",
    },
    verifiedOn: "2026-10-18",
    summary:
      "Only the signature is uploaded: the photo is captured live in the form instead of uploaded. The signature has a minimum pixel size and a narrow 30–49 KB window.",
    docs: [
      {
        kind: "signature",
        label: "Signature",
        statedPx: { width: 140, height: 60, qualifier: "minimum" },
        width: 280,
        height: 160,
        minKB: 30,
        maxKB: 49,
        dpi: 200,
        dpiStated: "min 100 to scan",
        physical: "35 mm × 20 mm box",
        fit: "contain",
        cleanInk: true,
        rules: [
          "Signed by you, in black ink on white paper.",
          "Running handwriting (cursive, joined letters) — not block, capital or disjointed letters.",
          "Scanned at a minimum of 100 DPI; JPG / JPEG between 30 KB and 49 KB, at least 140 pixels wide and 60 pixels high.",
          "It sits centred in a 35 mm × 20 mm box on the form, clear and entirely visible.",
          "It must match the signature you give at the exams, document verification, medical examination and appointment.",
        ],
        notes: [
          "The CEN sets a minimum, not a size. Sharpmonk makes 280 × 160 px at 200 DPI — the 35 × 20 mm box's proportions, twice the minimum width, and 35.6 × 20.3 mm when printed.",
          "A signature that size is well under 30 KB even at top quality, so Sharpmonk pads the file into the 30–49 KB window — see How it works.",
        ],
        fileName: "signature",
      },
    ],
    pdf: { label: "SC/ST certificate", minKB: 0, maxKB: 400 },
    alsoRequired: [
      "No photo upload. A live photograph is captured in the form by webcam or your phone's front camera, against a plain white background in non-white clothes, head filling at least half the frame, with no cap, mask or glasses.",
      "SC/ST candidates who want the free railway travel pass upload their SC/ST certificate as a PDF under 400 KB.",
    ],
    faqs: [
      {
        q: "What is the RRB NTPC 2026 signature size?",
        a: "A JPG between 30 KB and 49 KB, at least 140 × 60 pixels, scanned at 100 DPI or more, in black ink on white paper and in running handwriting — not capitals.",
      },
      {
        q: "Do I upload a photo for RRB NTPC?",
        a: "No. The application captures a live photo through your webcam or phone camera, so there is no photo to upload — and pointing the camera at an existing printed or digital photo gets the application rejected.",
      },
      {
        q: "Are the Graduate and Under Graduate specs the same?",
        a: "Yes. CEN 06/2026 (Graduate) and CEN 07/2026 (Under Graduate) give the same signature specification and the same live-photo rules.",
      },
      {
        q: "Why is my signature file bigger than it needs to be?",
        a: "Because the CEN's minimum is 30 KB, and a clean signature at these dimensions is only a few KB. Sharpmonk adds a padding block that every viewer ignores, rather than blowing up the pixels.",
      },
    ],
  },
  {
    slug: "ssc-cgl",
    name: "Combined Graduate Level Examination, 2026",
    short: "SSC CGL",
    conductedBy: "Staff Selection Commission (SSC)",
    source: {
      title: "Notice, Combined Graduate Level Examination, 2026",
      url: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_adv_cgl_2026.pdf",
      issued: "21 May 2026",
      pages: "PDF pages 18, 52 and 71",
    },
    verifiedOn: "2026-10-18",
    summary:
      "Only the signature is uploaded — SSC captures your photo live in the form. The signature has a 10–20 KB window and an approximate size in centimetres, which the notice gives two different ways.",
    docs: [
      {
        kind: "signature",
        label: "Signature",
        statedPx: null,
        width: 400,
        height: 160,
        minKB: 10,
        maxKB: 20,
        dpi: 200,
        dpiStated: "not stated",
        physical: "about 6.0 cm × 2.0 cm, or 4.0 cm × 2.0 cm (see note)",
        fit: "contain",
        cleanInk: true,
        rules: [
          "Scanned signature, JPEG / JPG, between 10 KB and 20 KB.",
          "Blurred or miniature signatures are rejected.",
          "PwD (VH) candidates may upload a thumb impression instead.",
        ],
        notes: [
          "The notice contradicts itself: paragraph 9.6 and the instructions on page 52 say about 6.0 cm × 2.0 cm, while Annexure IV on page 71 says about 4.0 cm × 2.0 cm. Sharpmonk makes 400 × 160 px at 200 DPI, which is 5.1 × 2.0 cm — between the two, and “about” either.",
          "No pixel size or DPI is given; the 200 DPI is ours, so the file prints at that size.",
        ],
        fileName: "signature",
      },
    ],
    alsoRequired: [
      "No photo upload. The form captures a live photo by webcam, or through the mobile app linked by the QR code on the Upload Documents page: good light, plain background, camera at eye level, face inside the frame, no cap, mask or glasses.",
    ],
    faqs: [
      {
        q: "What is the SSC CGL 2026 signature size?",
        a: "A JPEG between 10 KB and 20 KB. The notice gives the dimensions in centimetres — about 6.0 × 2.0 cm in one place and about 4.0 × 2.0 cm in another — and no pixel size.",
      },
      {
        q: "Is it 6 cm or 4 cm wide?",
        a: "The 2026 notice says both: 6.0 × 2.0 cm in paragraph 9.6 and on page 52, and 4.0 × 2.0 cm in Annexure IV. Both are “about”, so Sharpmonk makes a 5.1 × 2.0 cm image (400 × 160 px at 200 DPI) that sits between them.",
      },
      {
        q: "Why is there no photo resizer for SSC CGL?",
        a: "Because SSC doesn't take an uploaded photo. The form captures your photo live, and the notice warns that capturing a photo of an existing photograph gets the application rejected.",
      },
      {
        q: "What if I applied with Aadhaar authentication?",
        a: "The notice says applications that used Aadhaar-based authentication won't be rejected on the ground that the photo or signature doesn't meet the standards. The signature still has to be uploaded.",
      },
    ],
  },
];

export const examBySlug = (slug: string) => EXAMS.find((e) => e.slug === slug);

/** "photo & signature", or "signature" for exams that capture the photo live. */
export const uploadsLabel = (e: ExamSpec) => (e.docs.some((d) => d.kind === "photo") ? "photo & signature" : "signature");

/** The notification's pixel rule in a few characters, or null when it sets none. */
export function pxLabel(d: DocSpec) {
  if (!d.statedPx) return d.statedPxText ?? null;
  const { width, height, qualifier } = d.statedPx;
  return `${width}×${height}${qualifier === "minimum" ? " min" : ""}`;
}

/** "18 October 2026" — fixed locale so the server and client render alike. */
export function longDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${d} ${months[m - 1]} ${y}`;
}

/** "20–50 KB" */
/** "20–50 KB". A word joiner after the dash and a non-breaking space before
 *  the unit keep the whole range on one line. */
export const kbRange = (d: Pick<DocSpec, "minKB" | "maxKB">) => `${d.minKB}–\u2060${d.maxKB}\u00a0KB`;
