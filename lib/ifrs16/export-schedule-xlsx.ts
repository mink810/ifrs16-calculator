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
  subtotal: string;
};

function scheduleRowToCells(
  row: LeaseScheduleRow,
  labels: ScheduleExportLabels
): (string | number)[] {
  if (row.kind === "subtotal") {
    return [
      `${row.quarter}Q ${labels.subtotal}`,
      "-",
      row.interest,
      row.payment,
      row.deprn,
      "-",
      "-",
      "-",
    ];
  }

  return [
    row.seq,
    row.rou,
    row.interest,
    row.payment,
    row.deprn,
    row.currentLiability,
    row.nonCurrentLiability,
    row.totalLiability,
  ];
}

function sanitizeFilename(name: string): string {
  return name.replace(/[<>:"/\\|?*\x00-\x1f]/g, "_").trim() || "lease-schedule";
}

export function exportScheduleToXlsx(
  schedule: LeaseScheduleRow[],
  labels: ScheduleExportLabels,
  baseName: string
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

  const rows = schedule.map((row) => scheduleRowToCells(row, labels));
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");

  const filename = `${sanitizeFilename(baseName)}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
