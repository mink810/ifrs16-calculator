"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { formatAmount } from "@/lib/ifrs16/format";
import { Footer } from "@/components/landing/Footer";
import { TopNav } from "@/components/landing/TopNav";
import { useLeaseStore } from "@/stores/use-lease-store";

type TabId = "summary" | "asset1" | "asset2";

export function Ifrs16Portfolio() {
  const { t } = useLocale();
  const c = (key: string) => t(`calculator.${key}`);
  const [activeTab, setActiveTab] = useState<TabId>("summary");
  const { inputs, schedule, setInput } = useLeaseStore();

  const tabLabel =
    activeTab === "summary" ? c("tabSummary") : activeTab === "asset1" ? c("tabAsset1") : c("tabAsset2");

  const tabClass = (id: TabId) => {
    const base = "calculator-tab";
    if (activeTab !== id) return base;
    if (id === "asset1") return `${base} calculator-tab--active calculator-tab--asset1`;
    if (id === "asset2") return `${base} calculator-tab--active calculator-tab--asset2`;
    return `${base} calculator-tab--active`;
  };

  const parseNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  return (
    <div className="aurel-page">
      <TopNav />

      <main className="calculator-main">
        <div className="container">
          <header className="calculator-header">
            <h1>{c("title")}</h1>
            <p>{c("subtitle")}</p>
          </header>

          <div className="calculator-workspace">
            <div className="calculator-tabs" role="tablist" aria-label={c("title")}>
              <button type="button" role="tab" aria-selected={activeTab === "summary"} className={tabClass("summary")} onClick={() => setActiveTab("summary")}>
                {c("tabSummary")}
              </button>
              <button type="button" role="tab" aria-selected={activeTab === "asset1"} className={tabClass("asset1")} onClick={() => setActiveTab("asset1")}>
                {c("tabAsset1")}
              </button>
              <button type="button" role="tab" aria-selected={activeTab === "asset2"} className={tabClass("asset2")} onClick={() => setActiveTab("asset2")}>
                {c("tabAsset2")}
              </button>
              <button type="button" className="calculator-tab-add">
                {c("btnAddAsset")}
              </button>
            </div>

            <div className="calculator-grid">
              <section className="calculator-panel calculator-panel--input">
              <h2>{c("inputTitle")}</h2>

              <div className="calculator-field">
                <label>{c("assetName")}</label>
                <input
                  type="text"
                  placeholder="e.g. Genesis G80"
                  value={inputs.assetName}
                  onChange={(e) => setInput("assetName", e.target.value)}
                />
              </div>

              <div className="calculator-field">
                <label>{c("commencementDate")}</label>
                <input
                  type="date"
                  suppressHydrationWarning
                  value={inputs.commencementDate}
                  onChange={(e) => setInput("commencementDate", e.target.value)}
                />
              </div>
              <div className="calculator-field">
                <label>{c("postingDate")}</label>
                <input
                  type="date"
                  suppressHydrationWarning
                  value={inputs.postingDate}
                  onChange={(e) => setInput("postingDate", e.target.value)}
                />
              </div>

              <div className="calculator-field-row">
                <div className="calculator-field">
                  <label>{c("period")}</label>
                  <input
                    type="number"
                    min={1}
                    value={inputs.leaseTerm}
                    onChange={(e) => setInput("leaseTerm", parseNumber(e.target.value))}
                  />
                </div>
                <div className="calculator-field">
                  <label>{c("depreciationPeriod")}</label>
                  <input
                    type="number"
                    min={1}
                    value={inputs.depreciationPeriod}
                    onChange={(e) => setInput("depreciationPeriod", parseNumber(e.target.value))}
                  />
                </div>
              </div>

              <div className="calculator-field">
                <label>{c("payment")}</label>
                <input
                  type="number"
                  min={0}
                  value={inputs.monthlyPayment}
                  onChange={(e) => setInput("monthlyPayment", parseNumber(e.target.value))}
                />
              </div>

              <div className="calculator-field">
                <label>{c("initialCost")}</label>
                <input
                  type="number"
                  min={0}
                  value={inputs.initialCost}
                  onChange={(e) => setInput("initialCost", parseNumber(e.target.value))}
                />
              </div>

              <div className="calculator-field">
                <label>{c("rate")}</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  value={inputs.annualRate}
                  onChange={(e) => setInput("annualRate", parseNumber(e.target.value))}
                />
              </div>

              <button type="button" className="btn btn-primary calculator-submit">
                {c("btnCalculate")}
              </button>
              </section>

              <section className="calculator-panel calculator-panel--table">
              <div className="calculator-table-head">
                <h2>
                  {c("tableTitle")}{" "}
                  <span className="calculator-table-context">({tabLabel})</span>
                </h2>
                <button type="button" className="btn calculator-excel-btn">
                  {c("btnExcel")}
                </button>
              </div>

              <div className="calculator-table-wrap" role="region" aria-label={c("tableTitle")} tabIndex={0}>
                <table className="calculator-table">
                  <thead>
                    <tr>
                      <th className="col-period">{c("colPeriod")}</th>
                      <th>{c("colRou")}</th>
                      <th>{c("colInterest")}</th>
                      <th>{c("colPayment")}</th>
                      <th>{c("colDeprn")}</th>
                      <th className="col-current">{c("colCurrentLiab")}</th>
                      <th className="col-noncurrent">{c("colNonCurrentLiab")}</th>
                      <th>{c("colTotalLiab")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedule.map((row, idx) => {
                      if (row.kind === "subtotal") {
                        return (
                          <tr key={`sub-${row.quarter}-${idx}`} className="row-subtotal">
                            <td>
                              {row.quarter}Q {c("subtotal")}
                            </td>
                            <td className="muted">-</td>
                            <td className="accent-interest">{formatAmount(row.interest)}</td>
                            <td>{formatAmount(row.payment)}</td>
                            <td className="accent-deprn">{formatAmount(row.deprn)}</td>
                            <td className="muted">-</td>
                            <td className="muted">-</td>
                            <td className="muted">-</td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={`row-${row.seq}`}>
                          <td className="col-period">{row.seq}</td>
                          <td>{formatAmount(row.rou)}</td>
                          <td className="accent-interest">{formatAmount(row.interest)}</td>
                          <td>{formatAmount(row.payment)}</td>
                          <td className="accent-deprn">{formatAmount(row.deprn)}</td>
                          <td className="col-current">{formatAmount(row.currentLiability)}</td>
                          <td className="col-noncurrent">{formatAmount(row.nonCurrentLiability)}</td>
                          <td className="col-total">{formatAmount(row.totalLiability)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
