"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Footer } from "@/components/landing/Footer";
import { TopNav } from "@/components/landing/TopNav";

type TabId = "summary" | "asset1" | "asset2";

const sampleData = [
  { seq: 1, rou: "42,000,000", interest: "175,000", payment: "800,000", deprn: "700,000", curr: "8,900,000", nonCurr: "32,475,000", total: "41,375,000" },
  { seq: 2, rou: "41,300,000", interest: "172,395", payment: "800,000", deprn: "700,000", curr: "8,950,000", nonCurr: "31,797,395", total: "40,747,395" },
  { seq: 3, rou: "40,600,000", interest: "169,780", payment: "800,000", deprn: "700,000", curr: "9,000,000", nonCurr: "31,117,175", total: "40,117,175" },
  { isSubtotal: true, q: 1, interest: "517,175", payment: "2,400,000", deprn: "2,100,000" },
  { seq: 4, rou: "39,900,000", interest: "167,154", payment: "800,000", deprn: "700,000", curr: "9,050,000", nonCurr: "30,434,329", total: "39,484,329" },
];

export function Ifrs16Portfolio() {
  const { t } = useLocale();
  const c = (key: string) => t(`calculator.${key}`);
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  const tabLabel =
    activeTab === "summary" ? c("tabSummary") : activeTab === "asset1" ? c("tabAsset1") : c("tabAsset2");

  const tabClass = (id: TabId) => {
    const base = "calculator-tab";
    if (activeTab !== id) return base;
    if (id === "asset1") return `${base} calculator-tab--active calculator-tab--asset1`;
    if (id === "asset2") return `${base} calculator-tab--active calculator-tab--asset2`;
    return `${base} calculator-tab--active`;
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
                <input type="text" placeholder="e.g. Genesis G80" />
              </div>

              <div className="calculator-field-row">
                <div className="calculator-field">
                  <label>{c("commencementDate")}</label>
                  <input type="date" suppressHydrationWarning />
                </div>
                <div className="calculator-field">
                  <label>{c("postingDate")}</label>
                  <input type="date" suppressHydrationWarning />
                </div>
              </div>

              <div className="calculator-field-row">
                <div className="calculator-field">
                  <label>{c("period")}</label>
                  <input type="number" placeholder="60" />
                </div>
                <div className="calculator-field">
                  <label>{c("depreciationPeriod")}</label>
                  <input type="number" placeholder="60" />
                </div>
              </div>

              <div className="calculator-field">
                <label>{c("payment")}</label>
                <input type="number" placeholder="800,000" />
              </div>

              <div className="calculator-field">
                <label>{c("initialCost")}</label>
                <input type="number" placeholder="42,000,000" />
              </div>

              <div className="calculator-field">
                <label>{c("rate")}</label>
                <input type="number" step="0.01" placeholder="5.0" />
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
                    {sampleData.map((row, idx) => {
                      if ("isSubtotal" in row && row.isSubtotal) {
                        return (
                          <tr key={`sub-${idx}`} className="row-subtotal">
                            <td>
                              {row.q}Q {c("subtotal")}
                            </td>
                            <td className="muted">-</td>
                            <td className="accent-interest">{row.interest}</td>
                            <td>{row.payment}</td>
                            <td className="accent-deprn">{row.deprn}</td>
                            <td className="muted">-</td>
                            <td className="muted">-</td>
                            <td className="muted">-</td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={`row-${idx}`}>
                          <td className="col-period">{row.seq}</td>
                          <td>{row.rou}</td>
                          <td className="accent-interest">{row.interest}</td>
                          <td>{row.payment}</td>
                          <td className="accent-deprn">{row.deprn}</td>
                          <td className="col-current">{row.curr}</td>
                          <td className="col-noncurrent">{row.nonCurr}</td>
                          <td className="col-total">{row.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
