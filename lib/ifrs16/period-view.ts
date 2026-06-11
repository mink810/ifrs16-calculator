import type { LeaseAsset, LeasePeriodRow, LeaseScheduleRow } from "./types";

export type PeriodViewMode = "monthly" | "daily";

export type DisplayScheduleRow = {
  period: string;
  rou: number;
  interest: number;
  payment: number;
  deprn: number;
  currentLiability: number;
  nonCurrentLiability: number;
  totalLiability: number;
};

export type SummaryDisplayRow = DisplayScheduleRow & {
  assetId: string;
  assetName: string;
};

export function parseStartYearMonth(
  commencementDate: string
): { year: number; month: number } | null {
  const [yearText, monthText] = commencementDate.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }
  return { year, month };
}

export function monthToIndex(year: number, month: number): number {
  return year * 12 + (month - 1);
}

export function seqToMonthIndex(commencementDate: string, seq: number): number | null {
  const start = parseStartYearMonth(commencementDate);
  if (!start) return null;
  return monthToIndex(start.year, start.month) + (seq - 1);
}

export function monthIndexToLabel(index: number): string {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function monthIndexToYearMonth(index: number): { year: number; month: number } {
  const year = Math.floor(index / 12);
  const month = (index % 12) + 1;
  return { year, month };
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function formatDateLabel(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatMonthlyPeriodLabel(commencementDate: string, seq: number): string {
  const monthIndex = seqToMonthIndex(commencementDate, seq);
  if (monthIndex === null) return String(seq);
  return monthIndexToLabel(monthIndex);
}

export function toPeriodRows(schedule: LeaseScheduleRow[]): LeasePeriodRow[] {
  return schedule.filter((row): row is LeasePeriodRow => row.kind === "period");
}

function periodRowToDisplayRow(
  row: LeasePeriodRow,
  period: string
): DisplayScheduleRow {
  return {
    period,
    rou: row.rou,
    interest: row.interest,
    payment: row.payment,
    deprn: row.deprn,
    currentLiability: row.currentLiability,
    nonCurrentLiability: row.nonCurrentLiability,
    totalLiability: row.totalLiability,
  };
}

function expandPeriodRowToDailyRows(
  row: LeasePeriodRow,
  commencementDate: string
): DisplayScheduleRow[] {
  const monthIndex = seqToMonthIndex(commencementDate, row.seq);
  if (monthIndex === null) {
    return [periodRowToDisplayRow(row, String(row.seq))];
  }

  const { year, month } = monthIndexToYearMonth(monthIndex);
  const days = daysInMonth(year, month);
  const dailyInterest = row.interest / days;
  const dailyPayment = row.payment / days;
  const dailyDeprn = row.deprn / days;

  const rows: DisplayScheduleRow[] = [];
  for (let day = 1; day <= days; day++) {
    rows.push({
      period: formatDateLabel(year, month, day),
      rou: row.rou,
      interest: dailyInterest,
      payment: dailyPayment,
      deprn: dailyDeprn,
      currentLiability: row.currentLiability,
      nonCurrentLiability: row.nonCurrentLiability,
      totalLiability: row.totalLiability,
    });
  }
  return rows;
}

export function expandAssetScheduleToDisplayRows(
  schedule: LeaseScheduleRow[],
  commencementDate: string,
  mode: PeriodViewMode
): DisplayScheduleRow[] {
  const periodRows = toPeriodRows(schedule);

  if (mode === "monthly") {
    return periodRows.map((row) =>
      periodRowToDisplayRow(row, formatMonthlyPeriodLabel(commencementDate, row.seq))
    );
  }

  return periodRows.flatMap((row) => expandPeriodRowToDailyRows(row, commencementDate));
}

export function buildSummaryDisplayRows(
  assets: LeaseAsset[],
  mode: PeriodViewMode,
  assetLabel: (asset: LeaseAsset, index: number) => string
): SummaryDisplayRow[] {
  const rows: SummaryDisplayRow[] = [];

  assets.forEach((asset, index) => {
    if (!parseStartYearMonth(asset.inputs.commencementDate)) return;

    const assetName = assetLabel(asset, index);
    const displayRows = expandAssetScheduleToDisplayRows(
      asset.schedule,
      asset.inputs.commencementDate,
      mode
    );

    for (const row of displayRows) {
      rows.push({
        ...row,
        assetId: asset.id,
        assetName,
      });
    }
  });

  return rows.sort((a, b) => {
    const periodCmp = a.period.localeCompare(b.period);
    if (periodCmp !== 0) return periodCmp;
    return a.assetName.localeCompare(b.assetName);
  });
}
