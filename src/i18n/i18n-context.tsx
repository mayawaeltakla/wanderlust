"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LOCALES, type Locale, type LocaleMeta } from "@/lib/types";
import { getDict, type Dict } from "@/i18n/dictionaries";

interface I18nContextValue {
  locale: Locale;
  dir: "rtl" | "ltr";
  meta: LocaleMeta;
  setLocale: (l: Locale) => void;
  t: Dict;
  locales: LocaleMeta[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "wanderlust.locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  // Load persisted locale on mount (after hydration to avoid mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved && LOCALES.some((l) => l.code === saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Sync <html lang> and dir, persist preference
  const dir = useMemo<"rtl" | "ltr">(
    () => (locale === "ar" ? "rtl" : "ltr"),
    [locale],
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
  }, [locale, dir]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const meta = useMemo(
    () => LOCALES.find((l) => l.code === locale) ?? LOCALES[0],
    [locale],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      dir,
      meta,
      setLocale,
      t: getDict(locale),
      locales: LOCALES,
    }),
    [locale, dir, meta, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
