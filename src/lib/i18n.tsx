"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { translations, Locale, TranslationKey } from "./translations";

type I18nContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKey;
};

const defaultTranslations = translations.en;

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: defaultTranslations,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("lavidalocale");
      if (saved && (saved === "en" || saved === "es" || saved === "fr")) {
        setLocale(saved as Locale);
      }
    } catch {}
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    try {
      localStorage.setItem("lavidalocale", newLocale);
      document.documentElement.lang = newLocale;
    } catch {}
  };

  const currentTranslations = translations[locale] || translations.en;

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: currentTranslations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  return context;
}
