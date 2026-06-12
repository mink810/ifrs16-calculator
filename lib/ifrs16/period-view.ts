import type { LeaseAsset, LeasePeriodRow, LeaseScheduleRow } from "./types";

export type PeriodViewMode = "monthly" | "daily";

export type DisplayScheduleRow = {
  period: string;
  rou: number;
  accumulatedDepreciation: number;
  interest: number;
  payment: number;
  deprn: number;
  currentLiability: number;
  nonCurrentLiability: number;
  totalLiability: number;
};

export type SummaryDisplayRow = DisplayScheduleRow;

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
    accumulatedDepreciation: row.accumulatedDepreciation,
    interest: row.interest,
    payment: row.payment,
    deprn: row.deprn,
    currentLiability: row.currentLiability,
    nonCurrentLiability: row.nonCurrentLiability,
    totalLiability: row.totalLiability,
  };
}

export function expandAssetScheduleToDisplayRows(
  schedule: LeaseScheduleRow[],
  commencementDate: string
): DisplayScheduleRow[] {
  return toPeriodRows(schedule).map((row) =>
    periodRowToDisplayRow(row, formatMonthlyPeriodLabel(commencementDate, row.seq))
  );
}

function emptyAggregate(): Omit<DisplayScheduleRow, "period"> {
  return {
    rou: 0,
    accumulatedDepreciation: 0,
    interest: 0,
    payment: 0,
    deprn: 0,
    currentLiability: 0,
    nonCurrentLiability: 0,
    totalLiability: 0,
  };
}

function addToAggregate(
  target: Omit<DisplayScheduleRow, "period">,
  source: Omit<DisplayScheduleRow, "period">
) {
  target.rou += source.rou;
  target.accumulatedDepreciation += source.accumulatedDepreciation;
  target.interest += source.interest;
  target.payment += source.payment;
  target.deprn += source.deprn;
  target.currentLiability += source.currentLiability;
  target.nonCurrentLiability += source.nonCurrentLiability;
  target.totalLiability += source.totalLiability;
}

export function buildSummaryDisplayRows(assets: LeaseAsset[]): SummaryDisplayRow[] {
  const activeAssets = assets.filter((asset) =>
    parseStartYearMonth(asset.inputs.commencementDate)
  );
  if (activeAssets.length === 0) return [];

  const periodMap = new Map<string, Omit<DisplayScheduleRow, "period">>();
  const periodKeys: string[] = [];

  for (const asset of activeAssets) {
    const displayRows = expandAssetScheduleToDisplayRows(
      asset.schedule,
      asset.inputs.commencementDate
    );

    for (const row of displayRows) {
      if (!periodMap.has(row.period)) {
        periodMap.set(row.period, emptyAggregate());
        periodKeys.push(row.period);
      }
      addToAggregate(periodMap.get(row.period)!, row);
    }
  }

  periodKeys.sort();
  return periodKeys.map((period) => ({
    period,
    ...(periodMap.get(period) ?? emptyAggregate()),
  }));
}
