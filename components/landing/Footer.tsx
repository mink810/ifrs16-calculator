"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export function Footer() {
  const { t } = useLocale();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#" className="footer-logo">
            Aur<span className="accent">el</span>
          </a>
          <p>{t("footer.tagline")}</p>
        </div>
        <div className="footer-col">
          <h4>{t("footer.solutions")}</h4>
          <ul>
            <li>
              <a href="#">{t("footer.accountingAutomation")}</a>
            </li>
            <li>
              <a href="#">{t("footer.auditSupport")}</a>
            </li>
            <li>
              <a href="#">{t("footer.standardsCoverage")}</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t("footer.resources")}</h4>
          <ul>
            <li>
              <a href="#">{t("footer.documentation")}</a>
            </li>
            <li>
              <a href="#">{t("footer.blog")}</a>
            </li>
            <li>
              <a href="#">{t("footer.faq")}</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t("footer.company")}</h4>
          <ul>
            <li>
              <a href="#">{t("footer.about")}</a>
            </li>
            <li>
              <a href="#">{t("footer.contact")}</a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>{t("footer.legal")}</h4>
          <ul>
            <li>
              <a href="#">{t("footer.privacyPolicy")}</a>
            </li>
            <li>
              <a href="#">{t("footer.termsOfService")}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>{t("footer.copyright")}</span>
        <span>{t("footer.bottomLinks")}</span>
      </div>
    </footer>
  );
}
