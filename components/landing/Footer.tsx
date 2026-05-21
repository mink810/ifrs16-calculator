export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#" className="footer-logo">
            Aur<span className="accent">el</span>
          </a>
          <p>
            <span data-en>We validate. You review.</span>
            <span data-ko>검증은 저희가. 확인은 당신이.</span>
          </p>
        </div>
        <div className="footer-col">
          <h4>
            <span data-en>Solutions</span>
            <span data-ko>솔루션</span>
          </h4>
          <ul>
            <li>
              <a href="#">
                <span data-en>Accounting Automation</span>
                <span data-ko>회계 자동화</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-en>Audit Support</span>
                <span data-ko>감사 지원</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-en>Standards Coverage</span>
                <span data-ko>회계기준 범위</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>
            <span data-en>Resources</span>
            <span data-ko>리소스</span>
          </h4>
          <ul>
            <li>
              <a href="#">
                <span data-en>Documentation</span>
                <span data-ko>문서</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-en>Blog</span>
                <span data-ko>블로그</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-en>FAQ</span>
                <span data-ko>FAQ</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>
            <span data-en>Company</span>
            <span data-ko>회사</span>
          </h4>
          <ul>
            <li>
              <a href="#">
                <span data-en>About</span>
                <span data-ko>소개</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-en>Contact</span>
                <span data-ko>문의하기</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>
            <span data-en>Legal</span>
            <span data-ko>법적 고지</span>
          </h4>
          <ul>
            <li>
              <a href="#">
                <span data-en>Privacy Policy</span>
                <span data-ko>개인정보처리방침</span>
              </a>
            </li>
            <li>
              <a href="#">
                <span data-en>Terms of Service</span>
                <span data-ko>이용약관</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Aurel, Inc. All rights reserved.</span>
        <span>
          <span data-en>Privacy · Terms</span>
          <span data-ko>개인정보 · 이용약관</span>
        </span>
      </div>
    </footer>
  );
}
