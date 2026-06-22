import * as XLSX from "xlsx-js-style";
import { expandAssetScheduleToDisplayRows, type SummaryDisplayRow } from "./period-view";
import type { LeaseAsset, LeaseScheduleRow } from "./types";

export type ScheduleExportLabels = {
  colPeriod: string;
  colAsset?: string;
  colRou: string;
  colAccumulatedDepreciation: string;
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
const EXCEL_SHEET_NAME_MAX = 31;

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

function buildHeaderRow(labels: ScheduleExportLabels): string[] {
  return [
    labels.colPeriod,
    labels.colRou,
    labels.colAccumulatedDepreciation,
    labels.colInterest,
    labels.colPayment,
    labels.colDeprn,
    labels.colCurrentLiab,
    labels.colNonCurrentLiab,
    labels.colTotalLiab,
  ];
}

function displayRowToCells(row: SummaryDisplayRow): (string | number)[] {
  return [
    row.period,
    row.rou,
    row.accumulatedDepreciation,
    row.interest,
    row.payment,
    row.deprn,
    row.currentLiability,
    row.nonCurrentLiability,
    row.totalLiability,
  ];
}

function createScheduleWorksheet(
  rows: SummaryDisplayRow[],
  labels: ScheduleExportLabels
): XLSX.WorkSheet {
  const bodyRows = rows.map(displayRowToCells);
  return createStyledWorksheet([buildHeaderRow(labels), ...bodyRows], 1, 8);
}

function sanitizeSheetName(raw: string): string {
  const cleaned = raw.replace(/[\\/?*[\]]/g, "").trim();
  return (cleaned || "Sheet").slice(0, EXCEL_SHEET_NAME_MAX);
}

function uniqueSheetNames(names: string[]): string[] {
  const used = new Map<string, number>();

  return names.map((name) => {
    const base = sanitizeSheetName(name);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);
    if (count === 0) return base;

    const suffix = ` (${count + 1})`;
    return `${base.slice(0, EXCEL_SHEET_NAME_MAX - suffix.length)}${suffix}`;
  });
}

function downloadWorkbook(sheets: { name: string; worksheet: XLSX.WorkSheet }[]) {
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    XLSX.utils.book_append_sheet(workbook, sheet.worksheet, sheet.name);
  }
  XLSX.writeFile(workbook, buildExportFilename());
}

export function exportScheduleToXlsx(
  schedule: LeaseScheduleRow[],
  labels: ScheduleExportLabels,
  commencementDate: string
): void {
  const rows = expandAssetScheduleToDisplayRows(schedule, commencementDate);
  downloadWorkbook([{ name: "Schedule", worksheet: createScheduleWorksheet(rows, labels) }]);
}

export function exportSummaryScheduleToXlsx(
  rows: SummaryScheduleExportRow[],
  labels: ScheduleExportLabels
): void {
  downloadWorkbook([{ name: "Summary", worksheet: createScheduleWorksheet(rows, labels) }]);
}

export function exportPortfolioScheduleToXlsx(
  summaryRows: SummaryScheduleExportRow[],
  assets: LeaseAsset[],
  labels: ScheduleExportLabels,
  options: {
    summarySheetName: string;
    assetSheetName: (asset: LeaseAsset, index: number) => string;
  }
): void {
  const sheets: { name: string; worksheet: XLSX.WorkSheet }[] = [];

  if (summaryRows.length > 0) {
    sheets.push({
      name: sanitizeSheetName(options.summarySheetName),
      worksheet: createScheduleWorksheet(summaryRows, labels),
    });
  }

  const assetSheets = assets
    .map((asset, index) => {
      const rows = expandAssetScheduleToDisplayRows(
        asset.schedule,
        asset.inputs.commencementDate
      );
      if (rows.length === 0) return null;
      return {
        name: options.assetSheetName(asset, index),
        worksheet: createScheduleWorksheet(rows, labels),
      };
    })
    .filter((sheet): sheet is { name: string; worksheet: XLSX.WorkSheet } => sheet !== null);

  const uniqueNames = uniqueSheetNames([
    ...sheets.map((sheet) => sheet.name),
    ...assetSheets.map((sheet) => sheet.name),
  ]);

  const allSheets = [...sheets, ...assetSheets].map((sheet, index) => ({
    ...sheet,
    name: uniqueNames[index] ?? sanitizeSheetName(sheet.name),
  }));

  if (allSheets.length === 0) return;

  downloadWorkbook(allSheets);
}
