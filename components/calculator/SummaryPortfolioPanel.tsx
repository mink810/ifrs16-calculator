"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { exportSummaryScheduleToXlsx } from "@/lib/ifrs16/export-schedule-xlsx";
import { formatAmount } from "@/lib/ifrs16/format";
import { buildSummaryDisplayRows, type PeriodViewMode } from "@/lib/ifrs16/period-view";
import type { LeaseAsset } from "@/lib/ifrs16/types";

type SummaryPortfolioPanelProps = {
  assets: LeaseAsset[];
  periodView: PeriodViewMode;
  assetLabel: (asset: LeaseAsset, index: number) => string;
};

export function SummaryPortfolioPanel({
  assets,
  periodView,
  assetLabel,
}: SummaryPortfolioPanelProps) {
  const { t } = useLocale();
  const c = (key: string) => t(`calculator.${key}`);

  const rows = useMemo(
    () => buildSummaryDisplayRows(assets, periodView, assetLabel),
    [assets, periodView, assetLabel]
  );

  const handleExportExcel = () => {
    exportSummaryScheduleToXlsx(rows, {
      colPeriod: c("colPeriod"),
      colAsset: c("colAsset"),
      colRou: c("colRou"),
      colInterest: c("colInterest"),
      colPayment: c("colPayment"),
      colDeprn: c("colDeprn"),
      colCurrentLiab: c("colCurrentLiab"),
      colNonCurrentLiab: c("colNonCurrentLiab"),
      colTotalLiab: c("colTotalLiab"),
    });
  };

  return (
    <section className="calculator-panel calculator-panel--table">
      <div className="calculator-table-head">
        <h2>
          {c("tableTitle")} <span className="calculator-table-context">({c("tabSummary")})</span>
        </h2>
        <button
          type="button"
          className="btn calculator-excel-btn"
          onClick={handleExportExcel}
          disabled={rows.length === 0}
        >
          {c("btnExcel")}
        </button>
      </div>

      <div className="calculator-table-wrap" role="region" aria-label={c("tableTitle")} tabIndex={0}>
        <table className="calculator-table">
          <thead>
            <tr>
              <th className="col-period">{c("colPeriod")}</th>
              <th className="col-asset">{c("colAsset")}</th>
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan={9} className="muted" style={{ textAlign: "center", padding: "18px 10px" }}>
                  {c("summaryEmpty")}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`summary-${row.period}-${row.assetId}`}>
                  <td className="col-period">{row.period}</td>
                  <td className="col-asset">{row.assetName}</td>
                  <td>{formatAmount(row.rou)}</td>
                  <td className="accent-interest">{formatAmount(row.interest)}</td>
                  <td>{formatAmount(row.payment)}</td>
                  <td className="accent-deprn">{formatAmount(row.deprn)}</td>
                  <td className="col-current">{formatAmount(row.currentLiability)}</td>
                  <td className="col-noncurrent">{formatAmount(row.nonCurrentLiability)}</td>
                  <td className="col-total">{formatAmount(row.totalLiability)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
