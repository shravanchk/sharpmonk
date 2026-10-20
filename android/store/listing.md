# Play Store listing

Copy these into Play Console → Grow → Store presence → Main store listing.
Limits: title 30 characters, short description 80, full description 4,000.

## English (en-IN, default)

**App name** (29)
Sharpmonk: Exam Photo Resizer

**Short description** (80)
Resize exam photos & signatures to the exact KB and pixels. Nothing is uploaded.

**Full description**

Exam forms reject uploads for being 51 KB instead of 50, 201 × 230 pixels instead of 200 × 230, or a photo on a grey wall. Sharpmonk makes the file the form asks for, the first time.

THE EXACT SPECIFICATION
• Photo, signature, thumb impression and declaration sizes for UPSC CSE, SSC CGL, RRB NTPC, IBPS PO, IBPS Clerk, IBPS RRB, SBI PO, SBI Clerk, NEET UG and JEE Main.
• Every figure is read from the official notification and dated, not copied from other resizer sites.
• Exact pixels, a file size inside the KB window, and the DPI when the form states one.

PHOTO CHECK
• Finds your face and frames it the way the notification asks, for example "80% of the image should be your face".
• Checks the face is centred and evenly lit and the background is white.
• Turns the background white with one tap.

SIGNATURES AND DOCUMENTS
• Turns a phone photo of your signature into dark ink on clean white paper.
• Compresses certificate PDFs into windows like 50–300 KB.
• Turns photos of pages into one A4 PDF under the size limit.

BUILT FOR PHONES
• Take the photo with the camera, with a guide oval on screen.
• Share a photo or PDF from your gallery or WhatsApp straight into Sharpmonk.
• Works offline once opened.
• English and Hindi.

PRIVATE BY DESIGN
Everything happens on your phone. Your photos and documents are never uploaded to any server.

Sharpmonk is not affiliated with UPSC, SSC, IBPS, SBI, NTA, RRB or any exam body. Always check the current notification before you submit.

## Hindi (hi-IN)

**App name** (30)
Sharpmonk: परीक्षा फ़ोटो साइज़

**Short description** (73)
परीक्षा फ़ोटो और हस्ताक्षर ठीक KB और पिक्सेल में। कुछ भी अपलोड नहीं होता।

**Full description**

परीक्षा फ़ॉर्म छोटी-छोटी बातों पर अपलोड लौटा देते हैं: 50 की जगह 51 KB, 200 × 230 की जगह 201 × 230 पिक्सेल, या धूसर दीवार के सामने ली गई फ़ोटो। Sharpmonk पहली बार में वही फ़ाइल बनाता है जो फ़ॉर्म माँगता है।

सटीक नियम
• UPSC CSE, SSC CGL, RRB NTPC, IBPS PO, IBPS Clerk, IBPS RRB, SBI PO, SBI Clerk, NEET UG और JEE Main के फ़ोटो, हस्ताक्षर, अँगूठे के निशान और घोषणा के साइज़।
• हर आँकड़ा आधिकारिक अधिसूचना से लिया गया है और उस पर जाँच की तारीख़ दी गई है।
• सटीक पिक्सेल, KB सीमा के अंदर फ़ाइल, और फ़ॉर्म में DPI लिखा हो तो वह भी।

फ़ोटो जाँच
• आपका चेहरा पहचानकर अधिसूचना के अनुसार फ़्रेम करता है, जैसे “चेहरा फ़ोटो का 80% हो”।
• जाँचता है कि चेहरा बीच में है, उस पर बराबर रोशनी है, और बैकग्राउंड सफ़ेद है।
• एक टैप में बैकग्राउंड सफ़ेद।

हस्ताक्षर और दस्तावेज़
• हस्ताक्षर की फ़ोन फ़ोटो को सफ़ेद कागज़ पर गहरी स्याही में बदलता है।
• सर्टिफ़िकेट की PDF को 50–300 KB जैसी सीमा में छोटा करता है।
• पन्नों की फ़ोटो से A4 की एक PDF, साइज़ सीमा के अंदर।

फ़ोन के लिए बना
• कैमरे से फ़ोटो लें, स्क्रीन पर अंडाकार गाइड के साथ।
• गैलरी या WhatsApp से फ़ोटो या PDF सीधे Sharpmonk में शेयर करें।
• एक बार खोलने के बाद बिना इंटरनेट भी चलता है।
• हिन्दी और अंग्रेज़ी में।

आपकी फ़ाइलें आपके पास
सब कुछ आपके फ़ोन पर होता है। आपकी फ़ोटो और दस्तावेज़ किसी सर्वर पर अपलोड नहीं होते।

Sharpmonk का UPSC, SSC, IBPS, SBI, NTA, RRB या किसी परीक्षा संस्था से कोई संबंध नहीं है। जमा करने से पहले मौजूदा अधिसूचना ज़रूर देखें।

## Graphics (android/store/)

| Asset | File | Play requirement |
|---|---|---|
| App icon | `icon-512.png` | 512 × 512 PNG |
| Feature graphic | `feature-graphic.png` | 1024 × 500 |
| Phone screenshots | `01-home-en.png`, `02-home-hi.png` | 2–8, 9:16, 1080 × 1920 here |

Add two or three more screenshots taken on a phone, showing the photo check
and the signature cleanup. Use your own photo or one you have permission to
use; don't use a stranger's face from the web. `scripts/build-store-assets.mjs`
regenerates the feature graphic from the logo.

## App content answers

- **Category:** Tools. (Education also fits; Tools is where people search for "photo resizer".)
- **Privacy policy:** https://sharpmonk.com/privacy
- **Ads:** No (`ADSENSE_ENABLED` is false in `src/lib/adsense.ts`; change this answer if ads go live).
- **Data safety:** No data collected or shared. Photos and documents are processed on the device and never leave it. If you turn on Cloudflare Web Analytics (`src/lib/analytics.ts`), it counts page views with no cookies or identifiers; Google's definitions still count that as "App interactions" under "Analytics", collected and not shared, so declare it then.
- **Target audience:** 16–17 and 18+ (NEET and JEE candidates can be 17). Don't tick the under-13 groups, which bring in the Families policy.
- **Content rating:** Utility/productivity app; the questionnaire's answers are all "No".
- **Government apps declaration:** Not a government app. The listing and app say so ("not affiliated with … any exam body").
