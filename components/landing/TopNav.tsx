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
