import * as XLSX from "xlsx-js-style";
import {
  expandAssetScheduleToDisplayRows,
  type PeriodViewMode,
  type SummaryDisplayRow,
} from "./period-view";
import type { LeaseScheduleRow } from "./types";

export type ScheduleExportLabels = {
  colPeriod: string;
  colAsset?: string;
  colRou: string;
  colInterest: string;
  colPayment: string;
  colDeprn: string;
  colCurrentLiab: string;
  colNonCurrentLiab: string;
  colTotalLiab: string;
};

export type SummaryScheduleExportRow = SummaryDisplayRow;

const ARIAL_FONT = "Arial";
const AMOUNT_NUM_FMT = "#,##0";

function buildExportFilename(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `Lease accounting schedule_${y}-${m}-${d}.xlsx`;
}

function estimateCellWidth(value: string | number): number {
  if (typeof value === "number") {
    return Math.round(value).toLocaleString("en-US").length;
  }
  return String(value).length;
}

function applyColumnWidths(worksheet: XLSX.WorkSheet, rows: (string | number)[][]) {
  if (rows.length === 0) return;

  const colCount = rows[0]?.length ?? 0;
  const widths = Array.from({ length: colCount }, () => 10);

  for (const row of rows) {
    row.forEach((cell, col) => {
      widths[col] = Math.max(widths[col], estimateCellWidth(cell));
    });
  }

  worksheet["!cols"] = widths.map((width) => ({
    wch: Math.min(Math.max(width + 3, 12), 48),
  }));
}

function applyWorksheetStyles(
  worksheet: XLSX.WorkSheet,
  amountColumnStart: number,
  amountColumnEnd: number
) {
  const ref = worksheet["!ref"];
  if (!ref) return;

  const range = XLSX.utils.decode_range(ref);
  for (let row = range.s.r; row <= range.e.r; row++) {
    for (let col = range.s.c; col <= range.e.c; col++) {
      const address = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = worksheet[address];
      if (!cell) continue;

      const isHeader = row === range.s.r;
      const isAmount = col >= amountColumnStart && col <= amountColumnEnd;

      cell.s = {
        font: {
          name: ARIAL_FONT,
          sz: 11,
          bold: isHeader,
        },
        alignment: {
          horizontal: isAmount ? "right" : "left",
          vertical: "center",
        },
        ...(isAmount && !isHeader ? { numFmt: AMOUNT_NUM_FMT } : {}),
      };
    }
  }
}

function createStyledWorksheet(
  rows: (string | number)[][],
  amountColumnStart: number,
  amountColumnEnd: number
): XLSX.WorkSheet {
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  applyColumnWidths(worksheet, rows);
  applyWorksheetStyles(worksheet, amountColumnStart, amountColumnEnd);
  return worksheet;
}

function downloadWorkbook(worksheet: XLSX.WorkSheet, sheetName: string) {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, buildExportFilename());
}

export function exportScheduleToXlsx(
  schedule: LeaseScheduleRow[],
  labels: ScheduleExportLabels,
  commencementDate: string,
  periodView: PeriodViewMode = "monthly"
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

  const bodyRows = expandAssetScheduleToDisplayRows(schedule, commencementDate, periodView).map(
    (row) => [
      row.period,
      row.rou,
      row.interest,
      row.payment,
      row.deprn,
      row.currentLiability,
      row.nonCurrentLiability,
      row.totalLiability,
    ]
  );

  const worksheet = createStyledWorksheet([headers, ...bodyRows], 1, 7);
  downloadWorkbook(worksheet, "Schedule");
}

export function exportSummaryScheduleToXlsx(
  rows: SummaryScheduleExportRow[],
  labels: ScheduleExportLabels
): void {
  const headers = [
    labels.colPeriod,
    labels.colAsset ?? "Asset",
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
    row.assetName,
    row.rou,
    row.interest,
    row.payment,
    row.deprn,
    row.currentLiability,
    row.nonCurrentLiability,
    row.totalLiability,
  ]);

  const worksheet = createStyledWorksheet([headers, ...bodyRows], 2, 8);
  downloadWorkbook(worksheet, "Summary");
}
