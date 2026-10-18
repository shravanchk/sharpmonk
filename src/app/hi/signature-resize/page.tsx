import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import PrecisionTool from "@/components/tool/PrecisionTool";
import { alternates } from "@/lib/i18n";
import { SIGNATURE_INITIAL, SIGNATURE_PRESETS } from "@/lib/toolPresets";

const TITLE = "हस्ताक्षर रीसाइज़ — साफ़, सटीक पिक्सेल और KB";
const DESCRIPTION =
  "हस्ताक्षर की फ़ोन फ़ोटो को सफ़ेद कागज़ पर गहरी साफ़ स्याही में बदलें — IBPS के लिए 140×60 पिक्सेल और 10–20 KB, या कोई भी साइज़। कुछ भी अपलोड नहीं होता।";
const alt = alternates("/signature-resize", "hi");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alt,
  openGraph: { title: TITLE, description: DESCRIPTION, url: alt.canonical, type: "website", locale: "hi_IN" },
};

const FAQS = [
  {
    q: "हस्ताक्षर की फ़ोटो कैसे लूँ कि साफ़ आए?",
    a: "सादे सफ़ेद कागज़ पर काले पेन से हस्ताक्षर करें, उसे समतल जगह पर दिन की रोशनी में रखें, और ठीक ऊपर से फ़ोटो लें ताकि आपकी परछाईं न पड़े। “कागज़ साफ़ करें” फिर धूसर कागज़ को सफ़ेद और स्याही को गहरा कर देता है।",
  },
  {
    q: "मेरा हस्ताक्षर 10 KB की न्यूनतम सीमा से छोटा क्यों बनता है?",
    a: "140 × 60 पिक्सेल बहुत छोटी इमेज है — साफ़ हस्ताक्षर सबसे ऊँची क्वालिटी पर भी 3–8 KB का बनता है। Sharpmonk एक मानक JPEG टिप्पणी-ब्लॉक जोड़कर फ़ाइल को न्यूनतम तक लाता है; पोर्टल का डिकोडर उसे अनदेखा करता है।",
  },
  {
    q: "क्या सफ़ाई से मेरा हस्ताक्षर बदल जाएगा?",
    a: "नहीं, सिर्फ़ रंगत बदलती है: छाया और धूसर कागज़ सफ़ेद, स्याही लगभग काली। लकीरें वैसी ही रहती हैं, इसलिए यह परीक्षा में किए जाने वाले हस्ताक्षर से मेल खाता है। चाहें तो इसे बंद कर सकते हैं।",
  },
  {
    q: "क्या हस्ताक्षर कैपिटल अक्षरों में हो सकता है?",
    a: "IBPS के लिए नहीं: उसकी अधिसूचना कहती है कि कैपिटल अक्षरों वाले हस्ताक्षर स्वीकार नहीं होंगे। जैसे आप आम तौर पर करते हैं, वैसे ही करें।",
  },
];

export default function Page() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="हस्ताक्षर रीसाइज़र" path={alt.canonical} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "होम", href: "/hi" }, { label: "हस्ताक्षर रीसाइज़", href: alt.canonical }]} />
      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">सटीक टूल</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">हस्ताक्षर — साफ़ और ठीक साइज़ में</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          सफ़ेद कागज़ पर किए हस्ताक्षर की फ़ोटो लें। Sharpmonk कागज़ को सफ़ेद और स्याही को गहरा करता है, और उसे फ़ॉर्म के
          ठीक पिक्सेल और KB में ढालता है।
        </p>
      </header>
      <section aria-label="हस्ताक्षर रीसाइज़र" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <PrecisionTool
          initial={SIGNATURE_INITIAL}
          editable
          presets={SIGNATURE_PRESETS}
          what="signature"
          tip={<p className="text-muted text-xs leading-relaxed">पास तक क्रॉप करें: ज़ूम करें ताकि हस्ताक्षर फ़्रेम का ज़्यादातर हिस्सा भरे, चारों ओर थोड़ी सफ़ेद जगह रहे।</p>}
        />
      </section>
      <article className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">सवाल-जवाब</h2>
        <div className="mt-4">
          <FAQAccordion items={FAQS} />
        </div>
        <p className="text-muted mt-8 text-sm leading-relaxed">
          पूरा आवेदन भर रहे हैं? <Link href="/hi/exams" className="text-[var(--accent)] hover:underline">परीक्षा पेज</Link> पर सारे अपलोड
          एक साथ तैयार होते हैं।
        </p>
      </article>
    </main>
  );
}
