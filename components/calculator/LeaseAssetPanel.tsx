"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { exportScheduleToXlsx } from "@/lib/ifrs16/export-schedule-xlsx";
import { formatAmount } from "@/lib/ifrs16/format";
import { expandAssetScheduleToDisplayRows, type PeriodViewMode } from "@/lib/ifrs16/period-view";
import type { LeaseInputs, LeaseScheduleRow } from "@/lib/ifrs16/types";

type LeaseAssetPanelProps = {
  tabLabel: string;
  inputs: LeaseInputs;
  schedule: LeaseScheduleRow[];
  periodView: PeriodViewMode;
  onInputChange: <K extends keyof LeaseInputs>(
    key: K,
    value: LeaseInputs[K]
  ) => void;
  onCalculate: () => void;
};

export function LeaseAssetPanel({
  tabLabel,
  inputs,
  schedule,
  periodView,
  onInputChange,
  onCalculate,
}: LeaseAssetPanelProps) {
  const { t } = useLocale();
  const c = (key: string) => t(`calculator.${key}`);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const parseNumber = (value: string) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const numberValue = (n: number) => (n === 0 ? "" : n);

  const displayRows = useMemo(
    () => expandAssetScheduleToDisplayRows(schedule, inputs.commencementDate, periodView),
    [schedule, inputs.commencementDate, periodView]
  );

  const validateBeforeCalculate = (): string | null => {
    if (!inputs.assetName.trim()) return c("validationAssetNameRequired");
    if (!inputs.commencementDate.trim()) return c("validationCommencementDateRequired");
    if (inputs.leaseTerm <= 0) return c("validationLeaseTermRequired");
    if (inputs.monthlyPayment <= 0) return c("validationMonthlyPaymentRequired");
    if (inputs.annualRate < 0) return c("validationAnnualRateInvalid");
    return null;
  };

  const handleCalculate = () => {
    const msg = validateBeforeCalculate();
    if (msg) {
      setErrorMsg(msg);
      return;
    }
    setErrorMsg(null);
    onCalculate();
  };

  const handleExportExcel = () => {
    exportScheduleToXlsx(
      schedule,
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
      inputs.commencementDate,
      periodView
    );
  };

  return (
    <div className="calculator-grid">
      <section className="calculator-panel calculator-panel--input">
        <h2>{c("inputTitle")}</h2>

        { /* input form */}
        {errorMsg && (
          <div style={{ color: "var(--color-orange)", fontSize: 12, marginBottom: 12 }}>
            {errorMsg}
          </div>
        )}
        <div className="calculator-field">
          <label>{c("assetName")}</label>
          <input
            type="text"
            value={inputs.assetName}
            onChange={(e) => onInputChange("assetName", e.target.value)}
          />
        </div>
        <div className="calculator-field">
          <label>{c("commencementDate")}</label>
          <input
            type="date"
            suppressHydrationWarning
            value={inputs.commencementDate}
            onChange={(e) => onInputChange("commencementDate", e.target.value)}
          />
        </div>
        <div className="calculator-field">
          <label>{c("period")}</label>
          <input
            type="number"
            min={1}
            value={numberValue(inputs.leaseTerm)}
            onChange={(e) => onInputChange("leaseTerm", parseNumber(e.target.value))}
          />
        </div>

        <div className="calculator-field">
          <label>{c("payment")}</label>
          <input
            type="number"
            min={0}
            value={numberValue(inputs.monthlyPayment)}
            onChange={(e) => onInputChange("monthlyPayment", parseNumber(e.target.value))}
          />
        </div>

        <div className="calculator-field">
          <label>{c("initialCost")}</label>
          <input
            type="text"
            readOnly
            disabled
            className="calculator-field-input--computed"
            value={inputs.initialCost === 0 ? "" : formatAmount(inputs.initialCost)}
          />
        </div>

        <div className="calculator-field">
          <label>{c("rate")}</label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={numberValue(inputs.annualRate)}
            onChange={(e) => onInputChange("annualRate", parseNumber(e.target.value))}
          />
        </div>

        <button
          type="button"
          className="btn btn-primary calculator-submit"
          onClick={handleCalculate}
        >
          {c("btnCalculate")}
        </button>
      </section>

      <section className="calculator-panel calculator-panel--table">
        <div className="calculator-table-head">
          <h2>
            {c("tableTitle")}{" "}
            <span className="calculator-table-context">({tabLabel})</span>
          </h2>
          <button
            type="button"
            className="btn calculator-excel-btn"
            onClick={handleExportExcel}
          >
            {c("btnExcel")}
          </button>
        </div>

        <div
          className="calculator-table-wrap"
          role="region"
          aria-label={c("tableTitle")}
          tabIndex={0}
        >
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
              {displayRows.map((row) => (
                <tr key={`row-${row.period}`}>
                  <td className="col-period">{row.period}</td>
                  <td>{formatAmount(row.rou)}</td>
                  <td className="accent-interest">{formatAmount(row.interest)}</td>
                  <td>{formatAmount(row.payment)}</td>
                  <td className="accent-deprn">{formatAmount(row.deprn)}</td>
                  <td className="col-current">{formatAmount(row.currentLiability)}</td>
                  <td className="col-noncurrent">{formatAmount(row.nonCurrentLiability)}</td>
                  <td className="col-total">{formatAmount(row.totalLiability)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
