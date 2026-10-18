import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FAQAccordion from "@/components/FAQAccordion";
import ToolSchema from "@/components/ToolSchema";
import DocumentToolFromQuery from "@/components/tool/DocumentToolFromQuery";
import { alternates } from "@/lib/i18n";
import { pdfPresets } from "@/lib/pdfPresets";
import { EXAMS } from "@/lib/specs";

const TITLE = "PDF को KB में छोटा करें — 50–300 KB, 500 KB से कम";
const DESCRIPTION =
  "स्कैन किए सर्टिफ़िकेट की PDF को परीक्षा फ़ॉर्म की सीमा में लाएँ — 50–300 KB, 500 KB से कम या कोई भी — A4 पेज के रूप में। सब ब्राउज़र में होता है; कुछ भी अपलोड नहीं होता।";
const alt = alternates("/compress-pdf-to-kb", "hi");

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: alt,
  openGraph: { title: TITLE, description: DESCRIPTION, url: alt.canonical, type: "website", locale: "hi_IN" },
};

const FAQS = [
  {
    q: "सर्टिफ़िकेट की PDF को 500 KB से कम कैसे करें?",
    a: "PDF चुनें, “500 KB से कम” दबाएँ और “PDF बनाएँ” करें। Sharpmonk हर पेज को A4 इमेज के रूप में सबसे ऊँचे संभव रेज़ोल्यूशन (जहाँ हो सके 150 DPI) पर बनाता है, और रेज़ोल्यूशन घटाने से पहले JPEG क्वालिटी घटाता है, ताकि अक्षर साफ़ रहें।",
  },
  {
    q: "फ़ॉर्म में 50–300 KB लिखा है और मेरी PDF सिर्फ़ 30 KB की है।",
    a: "न्यूनतम 50 KB रखें। दस्तावेज़ अपने-आप उतना बड़ा न बने तो एक पैडिंग ब्लॉक जोड़ा जाता है जिसे PDF रीडर अनदेखा करते हैं — पेज पर कुछ नहीं बदलता।",
  },
  {
    q: "क्या PDF का टेक्स्ट सेलेक्ट हो पाएगा?",
    a: "नहीं — हर पेज इमेज बन जाता है, इसी से इतनी कमी संभव है। स्कैन किए सर्टिफ़िकेट पहले से इमेज ही होते हैं, इसलिए उनमें कोई फ़र्क नहीं पड़ता।",
  },
  {
    q: "क्या मेरा दस्तावेज़ अपलोड होता है?",
    a: "नहीं। PDF आपका ब्राउज़र ही खोलता और दोबारा बनाता है। फ़ाइलें लेने वाला कोई सर्वर है ही नहीं।",
  },
];

export default function Page() {
  return (
    <main className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <ToolSchema name="PDF को KB में छोटा करें" path={alt.canonical} description={DESCRIPTION} />
      <Breadcrumbs items={[{ label: "होम", href: "/hi" }, { label: "PDF को KB में", href: alt.canonical }]} />
      <header className="max-w-3xl">
        <span className="font-mono text-xs tracking-[0.16em] text-[var(--accent)] uppercase">सटीक टूल</span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">PDF को ठीक उतने KB में लाएँ</h1>
        <p className="text-muted mt-4 text-lg leading-relaxed">
          उन सर्टिफ़िकेट के लिए जो परीक्षा फ़ॉर्म PDF में माँगते हैं। सीमा चुनें, और ऐसी A4 PDF पाएँ जो उसी में हो — असली फ़ाइल
          पर नापकर। आपका दस्तावेज़ इसी डिवाइस पर रहता है।
        </p>
      </header>
      <section aria-label="PDF कंप्रेसर" className="glass-card mt-8 rounded-3xl p-4 sm:p-7">
        <DocumentToolFromQuery initial={{ minKB: 0, maxKB: 500 }} presets={pdfPresets("hi")} what="pdf" fileName="certificate" />
      </section>
      <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight">सवाल-जवाब</h2>
          <div className="mt-4">
            <FAQAccordion items={FAQS} />
          </div>
        </article>
        <aside className="rounded-2xl border border-[var(--line)] p-5 lg:self-start">
          <h2 className="text-muted font-mono text-xs tracking-[0.14em] uppercase">परीक्षा के हिसाब से PDF साइज़</h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm">
            {EXAMS.filter((e) => e.pdf).map((e) => (
              <li key={e.slug} className="flex justify-between gap-3">
                <Link href={`${alt.canonical}?min=${e.pdf!.minKB}&max=${e.pdf!.maxKB}`} className="text-[var(--accent)] hover:underline">
                  {e.short}
                </Link>
                <span className="text-muted text-right">{e.pdf!.minKB > 0 ? `${e.pdf!.minKB}–${e.pdf!.maxKB} KB` : `≤ ${e.pdf!.maxKB} KB`}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted mt-4 text-xs leading-relaxed">हर परीक्षा की आधिकारिक अधिसूचना से — स्रोत उसके पेज पर।</p>
        </aside>
      </div>
    </main>
  );
}
