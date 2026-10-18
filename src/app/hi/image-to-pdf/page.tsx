import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import DocumentToolFromQuery from "@/components/tool/DocumentToolFromQuery";
import { alternates } from "@/lib/i18n";
import { pdfPresets } from "@/lib/pdfPresets";

const TITLE = "इमेज से PDF — फ़ोन की फ़ोटो से एक A4 PDF, सीमा के अंदर";
const DESCRIPTION =
  "सर्टिफ़िकेट या दस्तावेज़ की फ़ोन फ़ोटो को साइज़ सीमा के अंदर एक A4 PDF में बदलें, छाया वाले कागज़ को सफ़ेद करके। सब ब्राउज़र में; कुछ भी अपलोड नहीं होता।";
const alt = alternates("/image-to-pdf", "hi");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alt,
  openGraph: { title: TITLE, description: DESCRIPTION, url: alt.canonical, type: "website", locale: "hi_IN" },
};

const FAQS = [
  {
    q: "सर्टिफ़िकेट की फ़ोटो से एक PDF कैसे बनाऊँ?",
    a: "फ़ोटो चुनें (एक साथ कई चुन सकते हैं), तीरों से पेज का क्रम ठीक करें, टेढ़ी फ़ोटो घुमाएँ, साइज़ सीमा चुनें और “PDF बनाएँ” दबाएँ। हर फ़ोटो एक A4 पेज बनती है।",
  },
  {
    q: "फ़ोटो में छाया और धूसर कागज़ है। क्या ठीक हो सकता है?",
    a: "“कागज़ साफ़ करें” चालू करें। यह कागज़ को सफ़ेद और अक्षरों को गहरा करता है, हर हिस्से को उसके आसपास के कागज़ से नापकर — इसलिए पूरे पेज पर पड़ी छाया भी हट जाती है।",
  },
  {
    q: "दस्तावेज़ की फ़ोटो कैसे लूँ?",
    a: "दस्तावेज़ समतल रखें, दिन की रोशनी में, फ़ोन ठीक ऊपर रखें ताकि पेज टेढ़ा न दिखे, और पेज से फ़्रेम भरें। फ़्लैश न लगाएँ — उससे चमकीला धब्बा आता है।",
  },
];

export default function Page() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="इमेज से PDF" path={alt.canonical} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "होम", href: "/hi" }, { label: "इमेज से PDF", href: alt.canonical }]} />
      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">सटीक टूल</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">फ़ोटो से एक A4 PDF, सीमा के अंदर</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          हर पेज की फ़ोन से फ़ोटो लें, क्रम से यहाँ डालें, और फ़ॉर्म की KB सीमा के अंदर एक PDF पाएँ — चाहें तो कागज़ साफ़ करके।
        </p>
      </header>
      <section aria-label="इमेज से PDF" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <DocumentToolFromQuery initial={{ minKB: 0, maxKB: 300 }} presets={pdfPresets("hi")} what="docPhotos" fileName="document" />
      </section>
      <article className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">सवाल-जवाब</h2>
        <div className="mt-4">
          <FAQAccordion items={FAQS} />
        </div>
        <p className="text-muted mt-8 text-sm leading-relaxed">
          पहले से बड़ी PDF है? <Link href="/hi/compress-pdf-to-kb" className="text-[var(--accent)] hover:underline">PDF को KB में छोटा करें</Link> —
          उसमें PDF और फ़ोटो दोनों साथ चलते हैं।
        </p>
      </article>
    </main>
  );
}
