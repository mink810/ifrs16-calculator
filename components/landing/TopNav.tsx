"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LangToggle } from "./LangToggle";

export function TopNav() {
  const { t } = useLocale();

  return (
    <nav className="top-nav">
      <div className="container">
        <Link href="/" className="nav-logo">
          Aur<span className="accent">el</span>
        </Link>
        <ul className="nav-links">
          <li className="nav-dropdown">
            <a href="#">{t("nav.standards")}</a>
            <div className="nav-dropdown-menu">
              <Link href="/ifrs16">
                <span className="nav-dropdown-badge">16</span>
                {t("nav.ifrs16")}
              </Link>
            </div>
          </li>
          <li>
            <a href="#" className="nav-advisor">
              {t("nav.findAdvisor")}
            </a>
          </li>
          <li>
            <a href="#">{t("nav.blog")}</a>
          </li>
          <li>
            <a href="#">{t("nav.about")}</a>
          </li>
        </ul>
        <div className="nav-actions">
          <LangToggle />
          <a href="#" className="btn btn-secondary">
            {t("nav.contact")}
          </a>
        </div>
      </div>
    </nav>
  );
}
