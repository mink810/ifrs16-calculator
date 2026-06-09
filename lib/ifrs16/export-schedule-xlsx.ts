import * as XLSX from "xlsx";
import type { LeaseScheduleRow } from "./types";

export type ScheduleExportLabels = {
  colPeriod: string;
  colRou: string;
  colInterest: string;
  colPayment: string;
  colDeprn: string;
  colCurrentLiab: string;
  colNonCurrentLiab: string;
  colTotalLiab: string;
};

export type SummaryScheduleExportRow = {
  period: string;
  rou: number;
  interest: number;
  payment: number;
  deprn: number;
  currentLiability: number;
  nonCurrentLiability: number;
  totalLiability: number;
};

type LeasePeriodRow = Extract<LeaseScheduleRow, { kind: "period" }>;

function scheduleRowToCells(row: LeasePeriodRow, commencementDate: string): (string | number)[] {
  const formatPeriodLabel = (seq: number) => {
    const [yearText, monthText] = commencementDate.split("-");
    const startYear = Number(yearText);
    const startMonth = Number(monthText);

    if (!Number.isInteger(startYear) || !Number.isInteger(startMonth) || startMonth < 1 || startMonth > 12) {
      return String(seq);
    }

    const monthOffset = seq - 1;
    const totalMonths = startYear * 12 + (startMonth - 1) + monthOffset;
    const year = Math.floor(totalMonths / 12);
    const month = (totalMonths % 12) + 1;
    return `${year}-${String(month).padStart(2, "0")}`;
  };

  return [
    formatPeriodLabel(row.seq),
    row.rou,
    row.interest,
    row.payment,
    row.deprn,
    row.currentLiability,
    row.nonCurrentLiability,
    row.totalLiability,
  ];
}

function buildExportFilename(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `Lease accounting schedule_${y}-${m}-${d}.xlsx`;
}

export function exportScheduleToXlsx(
  schedule: LeaseScheduleRow[],
  labels: ScheduleExportLabels,
  commencementDate: string
): void {
  const headers = [
    labels.colPeriod,
    labels.colRou,
    labels.colInterest,
    labels.colPayment,
    labels.colDeprn,
    labels.colCurrentLiab,
    labels.colNonCurrentLiab,
    labels.colTotalLiab,
  ];

  const rows = schedule
    .filter((row) => row.kind === "period")
    .map((row) => scheduleRowToCells(row, commencementDate));
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

  XLSX.writeFile(workbook, buildExportFilename());
}

export function exportSummaryScheduleToXlsx(
  rows: SummaryScheduleExportRow[],
  labels: ScheduleExportLabels
): void {
  const headers = [
    labels.colPeriod,
    labels.colRou,
    labels.colInterest,
    labels.colPayment,
    labels.colDeprn,
    labels.colCurrentLiab,
    labels.colNonCurrentLiab,
    labels.colTotalLiab,
  ];

  const bodyRows = rows.map((row) => [
    row.period,
    row.rou,
    row.interest,
    row.payment,
    row.deprn,
    row.currentLiability,
    row.nonCurrentLiability,
    row.totalLiability,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...bodyRows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

  XLSX.writeFile(workbook, buildExportFilename());
}
