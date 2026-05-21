const features = [
  {
    icon: "⚡",
    titleEn: "Automated Calculations",
    titleKo: "자동 계산",
    descEn:
      "Complex accounting logic runs automatically. By the time you see the number, it's already been checked.",
    descKo:
      "복잡한 회계 로직이 자동으로 실행됩니다. 숫자를 보는 순간, 이미 검증된 상태입니다.",
  },
  {
    icon: "🔍",
    titleEn: "Exception Flagging",
    titleKo: "예외 항목 자동 감지",
    descEn:
      "Aurel surfaces what needs your attention — and only that. No more hunting through spreadsheets for anomalies.",
    descKo:
      "주의가 필요한 항목만 짚어줍니다. 스프레드시트에서 이상 항목을 찾아 헤매지 않아도 됩니다.",
  },
  {
    icon: "✅",
    titleEn: "Full Audit Trail",
    titleKo: "완전한 감사 추적",
    descEn:
      "Every figure links back to its source. Auditors follow the logic without asking for explanations.",
    descKo:
      "모든 수치는 원천까지 연결됩니다. 감사인은 설명을 요청하지 않아도 논리를 따라갈 수 있습니다.",
  },
  {
    icon: "📁",
    titleEn: "Audit-ready Workpapers",
    titleKo: "감사 조서 자동 생성",
    descEn:
      "Schedules, reconciliations, and disclosures are structured and ready — before the auditor asks.",
    descKo:
      "스케줄, 조정표, 공시자료가 구조화되어 준비됩니다 — 감사인이 요청하기 전에.",
  },
  {
    icon: "📊",
    titleEn: "Journal Entry Output",
    titleKo: "분개 자동 출력",
    descEn:
      "Entries go straight to your ERP in the right format. Month-end close without the manual lift.",
    descKo:
      "올바른 형식으로 ERP에 바로 전달됩니다. 수작업 없는 월말 결산.",
  },
  {
    icon: "🔗",
    titleEn: "Standards Coverage",
    titleKo: "회계기준 대응",
    descEn:
      "Built around accounting standards — starting with IFRS 16, expanding across the full reporting landscape.",
    descKo:
      "IFRS 16을 시작으로, 전체 회계기준 보고 영역으로 확장합니다.",
  },
] as const;

export function FeatureGrid() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">
            <span data-en>How Aurel works</span>
            <span data-ko>Aurel의 방식</span>
          </span>
          <h2>
            <span data-en>
              Less checking.
              <br />
              More confidence.
            </span>
            <span data-ko>
              덜 확인하고.
              <br />
              더 확신하세요.
            </span>
          </h2>
          <p>
            <span data-en>
              The hard part — calculating, reconciling, flagging — is handled.
              You step in where judgment matters.
            </span>
            <span data-ko>
              계산, 조정, 예외 처리 — 어려운 부분은 처리됩니다. 당신은 판단이
              필요한 곳에서만 개입하세요.
            </span>
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature.titleEn} className="feature-card">
              <div className="feature-card-icon">{feature.icon}</div>
              <h3>
                <span data-en>{feature.titleEn}</span>
                <span data-ko>{feature.titleKo}</span>
              </h3>
              <p>
                <span data-en>{feature.descEn}</span>
                <span data-ko>{feature.descKo}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
