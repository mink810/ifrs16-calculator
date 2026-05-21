"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="hero">
      <div className="container">
        <span className="hero-eyebrow">{t("hero.eyebrow")}</span>
        <h1>
          {t("hero.titleLine1")}
          <br />
          {t("hero.titleLine2")}
        </h1>
        <p className="hero-sub">{t("hero.subtitle")}</p>
        <div className="hero-pill-row">
          <Link href="/ifrs16" className="hero-pill">
            <span className="hero-pill-badge">16</span>
            {t("hero.pill")}
          </Link>
        </div>
      </div>
    </section>
  );
}
