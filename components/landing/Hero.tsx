export function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <span className="hero-eyebrow">
          <span data-en>Financial Accounting Automation</span>
          <span data-ko>재무회계 자동화 플랫폼</span>
        </span>
        <h1>
          <span data-en>
            We validate.
            <br />
            You review.
          </span>
          <span data-ko>
            검증은 저희가.
            <br />
            확인은 당신이.
          </span>
        </h1>
        <p className="hero-sub">
          <span data-en>
            Aurel runs the calculations, checks the logic, and flags the
            exceptions — so your team spends time on judgment, not arithmetic.
          </span>
          <span data-ko>
            Aurel이 계산하고, 논리를 점검하고, 예외를 짚어냅니다. 당신의 팀은
            판단에만 집중하세요.
          </span>
        </p>
        <div className="hero-pill-row">
          <a href="#" className="hero-pill">
            <span className="hero-pill-badge">16</span>
            <span data-en>Start with IFRS 16 →</span>
            <span data-ko>IFRS 16부터 시작하기 →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
