"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export function FeatureGrid() {
  const { t, m } = useLocale();

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">{t("features.eyebrow")}</span>
          <h2>
            {t("features.titleLine1")}
            <br />
            {t("features.titleLine2")}
          </h2>
          <p>{t("features.subtitle")}</p>
        </div>

        <div className="feature-grid">
          {m.features.items.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-card-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
