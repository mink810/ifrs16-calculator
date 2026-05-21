"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export function LangToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-btn${locale === "en" ? " active" : ""}`}
        onClick={() => setLocale("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-btn${locale === "ko" ? " active" : ""}`}
        onClick={() => setLocale("ko")}
      >
        한국어
      </button>
    </div>
  );
}
