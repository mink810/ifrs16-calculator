"use client";

import { useMemo } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  exportSummaryScheduleToXlsx,
  type SummaryScheduleExportRow,
} from "@/lib/ifrs16/export-schedule-xlsx";
import { formatAmount } from "@/lib/ifrs16/format";
import type { LeaseAsset, LeasePeriodRow } from "@/lib/ifrs16/types";

type SummaryPortfolioPanelProps = {
  assets: LeaseAsset[];
};

type SummaryRow = SummaryScheduleExportRow;

function parseStartYearMonth(commencementDate: string): { year: number; month: number } | null {
  const [yearText, monthText] = commencementDate.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }
  return { year, month };
}

function monthToIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

function monthIndexToLabel(index: number): string {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

function toPeriodRows(asset: LeaseAsset): LeasePeriodRow[] {
  return asset.schedule.filter((row): row is LeasePeriodRow => row.kind === "period");
}

export function SummaryPortfolioPanel({ assets }: SummaryPortfolioPanelProps) {
  const { t } = useLocale();
  const c = (key: string) => t(`calculator.${key}`);

  const rows = useMemo<SummaryRow[]>(() => {
    const activeAssets = assets.filter((asset) => parseStartYearMonth(asset.inputs.commencementDate));
    if (activeAssets.length === 0) return [];

    const monthMap = new Map<number, Omit<SummaryRow, "period">>();
    let minMonthIndex = Number.POSITIVE_INFINITY;
    let maxMonthIndex = Number.NEGATIVE_INFINITY;

    for (const asset of activeAssets) {
      const start = parseStartYearMonth(asset.inputs.commencementDate);
      if (!start) continue;

      const startMonthIndex = monthToIndex(start.year, start.month);
      const periodRows = toPeriodRows(asset);

      for (const periodRow of periodRows) {
        const monthIndex = startMonthIndex + (periodRow.seq - 1);
        minMonthIndex = Math.min(minMonthIndex, monthIndex);
        maxMonthIndex = Math.max(maxMonthIndex, monthIndex);

        const current = monthMap.get(monthIndex) ?? {
          rou: 0,
          interest: 0,
          payment: 0,
          deprn: 0,
          currentLiability: 0,
          nonCurrentLiability: 0,
          totalLiability: 0,
        };

        current.rou += periodRow.rou;
        current.interest += periodRow.interest;
        current.payment += periodRow.payment;
        current.deprn += periodRow.deprn;
        current.currentLiability += periodRow.currentLiability;
        current.nonCurrentLiability += periodRow.nonCurrentLiability;
        current.totalLiability += periodRow.totalLiability;

        monthMap.set(monthIndex, current);
      }
    }

    if (!Number.isFinite(minMonthIndex) || !Number.isFinite(maxMonthIndex)) {
      return [];
    }

    const summaryRows: SummaryRow[] = [];
    for (let monthIndex = minMonthIndex; monthIndex <= maxMonthIndex; monthIndex++) {
      const aggregate = monthMap.get(monthIndex) ?? {
        rou: 0,
        interest: 0,
        payment: 0,
        deprn: 0,
        currentLiability: 0,
        nonCurrentLiability: 0,
        totalLiability: 0,
      };

      summaryRows.push({
        period: monthIndexToLabel(monthIndex),
        ...aggregate,
      });
    }

    return summaryRows;
  }, [assets]);

  const handleExportExcel = () => {
    exportSummaryScheduleToXlsx(
      rows,
      {
        colPeriod: c("colPeriod"),
        colRou: c("colRou"),
        colInterest: c("colInterest"),
        colPayment: c("colPayment"),
        colDeprn: c("colDeprn"),
        colCurrentLiab: c("colCurrentLiab"),
        colNonCurrentLiab: c("colNonCurrentLiab"),
        colTotalLiab: c("colTotalLiab"),
      },
      c("tabSummary")
    );
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
                <td colSpan={8} className="muted" style={{ textAlign: "center", padding: "18px 10px" }}>
                  {c("summaryEmpty")}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={`summary-${row.period}`}>
                  <td className="col-period">{row.period}</td>
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
