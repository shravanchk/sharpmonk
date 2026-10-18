import { Noto_Sans_Devanagari } from "next/font/google";
import LangProvider from "@/components/LangProvider";

// Geist has no Devanagari glyphs. Listing Noto after it keeps Latin text
// (numbers, KB, DPI) in Geist and draws Hindi in Noto.
const deva = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-deva", weight: "variable" });

export default function HindiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${deva.variable} flex flex-1 flex-col`} style={{ fontFamily: "var(--font-geist-sans), var(--font-deva), system-ui, sans-serif" }}>
      <LangProvider lang="hi">{children}</LangProvider>
    </div>
  );
}
