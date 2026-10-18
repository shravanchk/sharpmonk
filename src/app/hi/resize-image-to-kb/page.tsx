import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import PrecisionTool from "@/components/tool/PrecisionTool";
import { alternates } from "@/lib/i18n";
import { RESIZE_INITIAL, resizePresets } from "@/lib/toolPresets";

const TITLE = "फ़ोटो को KB में रीसाइज़ करें — 20 KB, 50 KB, कोई भी सीमा";
const DESCRIPTION =
  "फ़ोटो को 20 KB से कम, 50 KB से कम या 20–50 KB जैसी किसी भी सीमा में लाएँ — सटीक पिक्सेल में या उसके अपने अनुपात में। सब ब्राउज़र में होता है; कुछ भी अपलोड नहीं होता।";
const alt = alternates("/resize-image-to-kb", "hi");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alt,
  openGraph: { title: TITLE, description: DESCRIPTION, url: alt.canonical, type: "website", locale: "hi_IN" },
};

const FAQS = [
  {
    q: "फ़ोटो को 50 KB से कम कैसे करें, बिना धुंधला किए?",
    a: "“50 KB से कम” चुनें और पिक्सेल को “अनुपात बनाए रखें” पर छोड़ दें। Sharpmonk पहले JPEG क्वालिटी घटाता है — जिसका असर लगभग 60% तक कम ही दिखता है — और ज़रूरत हो तभी पिक्सेल घटाता है। फ़ाइल सीमा में आते ही रुक जाता है।",
  },
  {
    q: "फ़ॉर्म में 20–50 KB लिखा है और मेरी फ़ोटो सिर्फ़ 12 KB की है। क्या करूँ?",
    a: "न्यूनतम साइज़ 20 KB रखें। अगर इमेज अपने-आप उतनी बड़ी न बने, तो Sharpmonk फ़ाइल के अंदर एक मानक JPEG टिप्पणी-ब्लॉक जोड़ देता है, जिसे हर व्यूअर अनदेखा करता है — इमेज वैसी ही रहती है।",
  },
  {
    q: "50 KB का मतलब 50,000 बाइट या 51,200 बाइट?",
    a: "यह पोर्टल पर निर्भर करता है, और अधिसूचनाएँ बताती नहीं। Sharpmonk ऐसी फ़ाइल बनाता है जो दोनों तरह से पास हो: कम से कम न्यूनतम × 1,024 बाइट और ज़्यादा से ज़्यादा अधिकतम × 1,000 बाइट।",
  },
  {
    q: "क्या मेरी फ़ोटो कहीं अपलोड होती है?",
    a: "नहीं। सारा काम आपके ब्राउज़र में होता है। पेज खुलने के बाद इंटरनेट बंद कर दें, तब भी टूल चलता है।",
  },
];

export default function Page() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="फ़ोटो को KB में रीसाइज़ करें" path={alt.canonical} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "होम", href: "/hi" }, { label: "KB में रीसाइज़", href: alt.canonical }]} />
      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">सटीक टूल</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">फ़ोटो को ठीक उतने KB में लाएँ</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          फ़ॉर्म जो सीमा माँगे — 50 KB से कम, 20–50 KB, कुछ भी — वह चुनें और ऐसी JPG पाएँ जो उसी सीमा में हो, असली फ़ाइल पर
          नापकर। आपकी फ़ोटो इसी डिवाइस पर रहती है।
        </p>
      </header>
      <section aria-label="रीसाइज़र" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <PrecisionTool initial={RESIZE_INITIAL} editable allowAuto presets={resizePresets("hi")} what="image" />
      </section>
      <article className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight">सवाल-जवाब</h2>
        <div className="mt-4">
          <FAQAccordion items={FAQS} />
        </div>
        <p className="text-muted mt-8 text-sm leading-relaxed">
          किसी परीक्षा के लिए? <Link href="/hi/exams" className="text-[var(--accent)] hover:underline">परीक्षा पेज</Link> पर हर अपलोड
          आधिकारिक अधिसूचना के साइज़ पर पहले से सेट है।
        </p>
      </article>
    </main>
  );
}
