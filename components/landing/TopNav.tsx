import Link from "next/link";
import { LangToggle } from "./LangToggle";

export function TopNav() {
  return (
    <nav className="top-nav">
      <div className="container">
        <a href="#" className="nav-logo">
          Aur<span className="accent">el</span>
        </a>
        <ul className="nav-links">
          <li className="nav-dropdown">
            <a href="#" data-en>
              Standards
            </a>
            <a href="#" data-ko>
              회계기준
            </a>
            <div className="nav-dropdown-menu">
              <Link href="/ifrs16">
                <span className="nav-dropdown-badge">16</span>
                <span data-en>IFRS 16</span>
                <span data-ko>IFRS 16</span>
              </Link>
            </div>
          </li>
          <li>
            <a href="#" className="nav-advisor" data-en>
              Find an Advisor
            </a>
            <a href="#" className="nav-advisor" data-ko>
              전문가 찾기
            </a>
          </li>
          <li>
            <a href="#" data-en>
              Blog
            </a>
            <a href="#" data-ko>
              블로그
            </a>
          </li>
          <li>
            <a href="#" data-en>
              About
            </a>
            <a href="#" data-ko>
              소개
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          <LangToggle />
          <a href="#" className="btn btn-secondary">
            <span data-en>Contact us</span>
            <span data-ko>문의하기</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
