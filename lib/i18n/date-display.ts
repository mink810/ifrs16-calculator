import { format, isValid, parse } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { ko } from "date-fns/locale/ko";
import type { Locale } from "@/lib/i18n/types";

const ISO_DATE = "yyyy-MM-dd";

const DISPLAY_FORMAT: Record<Locale, string> = {
  en: "yyyy-MM-dd",
  ko: "yyyy-MM-dd",
};

const DATE_FNS_LOCALE = { en: enUS, ko: ko } as const;

export function parseIsoDate(value: string): Date | undefined {
  if (!value.trim()) return undefined;
  const parsed = parse(value, ISO_DATE, new Date());
  return isValid(parsed) ? parsed : undefined;
}

export function toIsoDate(date: Date): string {
  return format(date, ISO_DATE);
}

export function formatDateForDisplay(value: string, locale: Locale): string {
  const date = parseIsoDate(value);
  if (!date) return "";
  return format(date, DISPLAY_FORMAT[locale], { locale: DATE_FNS_LOCALE[locale] });
}

export function dateFnsLocale(locale: Locale) {
  return DATE_FNS_LOCALE[locale];
}

export function datePlaceholder(locale: Locale): string {
  return locale === "en" ? "YYYY-MM-DD" : "연도-월-일";
}
