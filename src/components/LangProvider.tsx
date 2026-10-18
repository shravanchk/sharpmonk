"use client";

import { createContext, useContext, useEffect } from "react";
import { STRINGS, type Lang, type Strings } from "@/lib/i18n";

const LangContext = createContext<Lang>("en");

/**
 * Wraps a page's content in its language. Hindi pages render inside
 * <LangProvider lang="hi">; everything else defaults to English.
 *
 * There is one root layout for both languages (two would force a full reload
 * on every language switch), so the page also sets <html lang> itself.
 */
export default function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = lang;
    return () => {
      document.documentElement.lang = "en";
    };
  }, [lang]);
  return (
    <LangContext.Provider value={lang}>
      <div lang={lang} className="flex flex-1 flex-col">
        {children}
      </div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
export const useStrings = (): Strings => STRINGS[useContext(LangContext)];
