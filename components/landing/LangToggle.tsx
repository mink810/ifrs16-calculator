"use client";

import { useEffect, useState } from "react";

type Lang = "en" | "ko";

export function LangToggle() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={`lang-btn${lang === "en" ? " active" : ""}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`lang-btn${lang === "ko" ? " active" : ""}`}
        onClick={() => setLang("ko")}
      >
        한국어
      </button>
    </div>
  );
}
