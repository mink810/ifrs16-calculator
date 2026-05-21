"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMessage } from "@/lib/i18n/get-message";
import { messagesByLocale } from "@/lib/i18n/messages";
import type { Locale, Messages } from "@/lib/i18n/types";

export const DEFAULT_LOCALE: Locale = "en";

const STORAGE_KEY = "aurel-locale-v2";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  m: Messages;
  t: (path: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "ko") return "ko";
  if (stored === "en") return "en";
  return DEFAULT_LOCALE;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const m = messagesByLocale[locale];

  const t = useCallback(
    (path: string) => getMessage(m as unknown as Record<string, unknown>, path) ?? path,
    [m]
  );

  const value = useMemo(
    () => ({ locale, setLocale, m, t }),
    [locale, setLocale, m, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
