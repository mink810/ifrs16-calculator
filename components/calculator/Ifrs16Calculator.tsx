"use client";

import Link from "next/link";
import { useState } from "react";

export function Ifrs16Calculator() {
  // 1. 언어 상태 관리 (디폴트: 영어 'en')
  const [lang, setLang] = useState<"en" | "kr">("en");

  // 화면 문구 사전 (토글용 데이터)
  const t = {
    en: {
      title: "📊 IFRS16 Lease Accounting System",
      subtitle: "Monthly Amortization Scheduler & Journal Entry Generator",
      inputTitle: "📋 Lease Contract Input",
      assetName: "Asset Name",
      period: "Lease Period (Months)",
      payment: "Monthly Payment",
      rate: "Annual Implicit Rate (%)",
      btnCalculate: "Calculate Schedule",
      tableTitle: "📅 Lease Amortization Schedule",
      btnExcel: "🟢 Export Excel (.xlsx)",
      colPeriod: "Period",
      colRou: "ROU Asset",
      colInterest: "Interest Expense",
      colPayment: "Lease Payment",
      colDeprn: "Depreciation",
      colCurrentLiab: "Current Liability",
      colNonCurrentLiab: "Non-current Liability",
      colTotalLiab: "Total Liability",
      subtotal: "Q Subtotal",
      tip: "💡 **Initial & Termination J/E:** Initial recognition and modification/termination gain or loss tracking can be managed via the tabs above.",
    },
    kr: {
      title: "📊 IFRS16 리스회계 자산 관리 시스템",
      subtitle: "월별 리스 상각 스케줄러 및 전표 자동 생성 내부 툴",
      inputTitle: "📋 리스 계약 정보 입력",
      assetName: "리스 자산명",
      period: "리스 기간 (개월)",
      payment: "약정 월 리스료",
      rate: "연 내재이자율 (%)",
      btnCalculate: "리스 스케줄 계산",
      tableTitle: "📅 리스 상각 스케줄표",
      btnExcel: "🟢 Excel 다운로드 (.xlsx)",
      colPeriod: "회차",
      colRou: "사용권자산 (ROU)",
      colInterest: "이자비용",
      colPayment: "리스료 지급",
      colDeprn: "감가상각",
      colCurrentLiab: "단기 리스부채",
      colNonCurrentLiab: "장기 리스부채",
      colTotalLiab: "리스부채 잔액",
      subtotal: "분기 소계",
      tip: "💡 **취득 및 매각 시점 전표:** 최초 취득 전표 및 중간 매각에 따른 처분손익 계산은 상단 탭이나 특수 상황 메뉴에서 추적할 수 있습니다.",
    }
  }[lang];

  // UI 확인용 1~4회차 가짜 데이터 (3회차 뒤에 분기 소계가 들어가는 예시)
  const sampleData = [
    { seq: 1, rou: "42,000,000", interest: "175,000", payment: "800,000", deprn: "700,000", curr: "8,900,000", nonCurr: "32,475,000", total: "41,375,000" },
    { seq: 2, rou: "41,300,000", interest: "172,395", payment: "800,000", deprn: "700,000", curr: "8,950,000", nonCurr: "31,797,395", total: "40,747,395" },
    { seq: 3, rou: "40,600,000", interest: "169,780", payment: "800,000", deprn: "700,000", curr: "9,000,000", nonCurr: "31,117,175", total: "40,117,175" },
    { isSubtotal: true, q: 1, interest: "517,175", payment: "2,400,000", deprn: "2,100,000" }, // 1분기 소계행
    { seq: 4, rou: "39,900,000", interest: "167,154", payment: "800,000", deprn: "700,000", curr: "9,050,000", nonCurr: "30,434,329", total: "29,484,329" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      {/* 상단 헤더 및 언어 토글 스위치 */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            href="/"
            className="inline-block text-sm text-slate-500 hover:text-slate-800 mb-3"
          >
            ← Aurel
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">{t.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        {/* 언어 선택 토글 스위치 */}
        <div className="flex bg-slate-200 p-1 rounded-lg self-end md:self-auto">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${lang === "en" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            English (EN)
          </button>
          <button
            type="button"
            onClick={() => setLang("kr")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${lang === "kr" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
          >
            한국어 (KR)
          </button>
        </div>
      </header>

      {/* 메인 2분할 레이아웃 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 왼쪽: 입력창 (4칸 중 1칸 차지) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 flex flex-col gap-5 h-fit lg:col-span-1">
          <h2 className="text-md font-semibold border-b pb-2 text-slate-800">{t.inputTitle}</h2>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.assetName}</label>
            <input type="text" defaultValue="Genesis G80 Lease" className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.period}</label>
            <input type="number" defaultValue={60} className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.payment} ($ / ₩)</label>
            <input type="number" defaultValue={800000} className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400" />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t.rate}</label>
            <input type="number" step="0.1" defaultValue={5.0} className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-400" />
          </div>

          <button
            type="button"
            className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            {t.btnCalculate}
          </button>
        </section>

        {/* 오른쪽: 결과 스케줄표 (4칸 중 3칸 차지) */}
        <section className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-2">
            <h2 className="text-md font-semibold text-slate-800">{t.tableTitle}</h2>
            <button
              type="button"
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              {t.btnExcel}
            </button>
          </div>

          {/* 스케줄 테이블 (친구 요청 컬럼 완벽 반영) */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead className="bg-slate-50 text-slate-500 uppercase border-b font-semibold">
                <tr>
                  <th className="p-2.5 text-center w-16">{t.colPeriod}</th>
                  <th className="p-2.5 text-right">{t.colRou}</th>
                  <th className="p-2.5 text-right">{t.colInterest}</th>
                  <th className="p-2.5 text-right">{t.colPayment}</th>
                  <th className="p-2.5 text-right">{t.colDeprn}</th>
                  <th className="p-2.5 text-right text-indigo-600">{t.colCurrentLiab}</th>
                  <th className="p-2.5 text-right text-emerald-600">{t.colNonCurrentLiab}</th>
                  <th className="p-2.5 text-right font-bold">{t.colTotalLiab}</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {sampleData.map((row, idx) => {
                  // 분기 소계 행일 때의 디자인
                  if (row.isSubtotal) {
                    return (
                      <tr key={`sub-${idx}`} className="bg-slate-100/80 font-bold text-slate-600">
                        <td className="p-2.5 text-center text-[11px] bg-slate-200/50">{row.q}Q {t.subtotal}</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right text-amber-700">{row.interest}</td>
                        <td className="p-2.5 text-right">{row.payment}</td>
                        <td className="p-2.5 text-right text-blue-700">{row.deprn}</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                        <td className="p-2.5 text-right text-slate-400">-</td>
                      </tr>
                    );
                  }

                  // 일반 월별 회차 행 디자인
                  return (
                    <tr key={`row-${idx}`} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-2.5 text-center font-medium text-slate-400">{row.seq}</td>
                      <td className="p-2.5 text-right">{row.rou}</td>
                      <td className="p-2.5 text-right text-amber-600">{row.interest}</td>
                      <td className="p-2.5 text-right">{row.payment}</td>
                      <td className="p-2.5 text-right text-blue-600">{row.deprn}</td>
                      <td className="p-2.5 text-right font-medium text-indigo-600 bg-indigo-50/20">{row.curr}</td>
                      <td className="p-2.5 text-right font-medium text-emerald-600 bg-emerald-50/20">{row.nonCurr}</td>
                      <td className="p-2.5 text-right font-semibold bg-slate-50/30">{row.total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-dashed" dangerouslySetInnerHTML={{ __html: t.tip }} />
        </section>

      </div>
    </main>
  );
}