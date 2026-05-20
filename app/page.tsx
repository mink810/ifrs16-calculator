// src/app/page.tsx
"use client";

import { useState } from "react";

export default function Home() {
  // 나중에 수식과 연결할 가짜 데이터 상태 (우선 UI 확인용)
  const [assetName, setAssetName] = useState("제네시스 G80 리스");
  const [period, setPeriod] = useState(60);
  const [monthlyPayment, setMonthlyPayment] = useState(800000);
  const [interestRate, setInterestRate] = useState(5.0);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      {/* 상단 헤더 */}
      <header className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">📊 IFRS16 리스회계 자산 관리 시스템</h1>
        <p className="text-sm text-slate-500 mt-1">월별 리스 상각 스케줄러 및 전표 자동 생성 내부 툴</p>
      </header>

      {/* 메인 콘텐츠 영역 (2분할 레이아웃) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 왼쪽: 계약 조건 입력창 (1칸 차지) */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 flex flex-col gap-5 h-fit">
          <h2 className="text-lg font-semibold border-b pb-2 text-slate-800">📋 리스 계약 정보 입력</h2>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">리스 자산명</label>
            <input 
              type="text" 
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">리스 기간 (개월)</label>
            <input 
              type="number" 
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">약정 월 리스료 (원)</label>
            <input 
              type="number" 
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">연 내재이자율 (%)</label>
            <input 
              type="number" 
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          <button className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
            리스 스케줄 계산하기
          </button>
        </section>

        {/* 오른쪽: 결과 테이블 및 전표 추출 (2칸 차지) */}
        <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200/80 flex flex-col gap-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-lg font-semibold text-slate-800">📅 리스 상각 스케줄표</h2>
            <button className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-3 py-1.5 rounded-lg transition-colors">
              🟢 Excel 다운로드 (.xlsx)
            </button>
          </div>

          {/* 스케줄 테이블 */}
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase border-b font-medium">
                <tr>
                  <th className="p-3 text-center">회차</th>
                  <th className="p-3 text-right">기초 리스부채</th>
                  <th className="p-3 text-right">이자비용</th>
                  <th className="p-3 text-right">리스료 지급</th>
                  <th className="p-3 text-right">기말 리스부채</th>
                  <th className="p-3 text-right">감가상각비</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-700">
                {/* 일단 화면 확인용 가짜 행 1개 */}
                <tr className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 text-center font-medium text-slate-500">1회차</td>
                  <td className="p-3 text-right">42,000,000원</td>
                  <td className="p-3 text-right">175,000원</td>
                  <td className="p-3 text-right">800,000원</td>
                  <td className="p-3 text-right">41,375,000원</td>
                  <td className="p-3 text-right">700,000원</td>
                </tr>
                {/* 추가 회차들이 이곳에 반복문으로 꽂힐 예정입니다 */}
              </tbody>
            </table>
          </div>
          
          <div className="text-xs text-slate-400 bg-slate-50 p-3 rounded-lg border border-dashed">
            💡 <strong>특수 상황 처리:</strong> 중간 매각, 조기 해지, 리스료 조건 변경이 발생한 경우 상단 탭이나 이력 관리 메뉴를 통해 변경 회계를 반영하고 감사 증적 이메일을 백업할 수 있습니다.
          </div>
        </section>

      </div>
    </main>
  );
}