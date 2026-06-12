import { isValid, parse } from "date-fns";
import {
  daysInMonth,
  monthIndexToYearMonth,
  seqToMonthIndex,
  type PeriodViewMode,
} from "./period-view";

export function parseCommencementDay(commencementDate: string): {
  year: number;
  month: number;
  day: number;
} | null {
  const parsed = parse(commencementDate, "yyyy-MM-dd", new Date());
  if (!isValid(parsed)) return null;
  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
  };
}

/** e.g. start 2024-06-20, term 60 → 2029-05-19 */
export function getLastPeriodEndDay(
  commencementDate: string,
  leaseTerm: number
): { year: number; month: number; day: number } | null {
  const monthIndex = seqToMonthIndex(commencementDate, leaseTerm);
  const start = parseCommencementDay(commencementDate);
  if (monthIndex === null || !start) return null;

  const { year, month } = monthIndexToYearMonth(monthIndex);
  const dim = daysInMonth(year, month);

  if (start.day === 1) {
    return { year, month, day: dim };
  }

  return { year, month, day: Math.min(start.day - 1, dim) };
}

/**
 * Monthly: full calendar-month amounts (factor 1).
 * Daily: prorate by actual days used in the first / last lease month.
 */
export function getProrationFactor(
  commencementDate: string,
  seq: number,
  leaseTerm: number,
  mode: PeriodViewMode
): number {
  if (mode === "monthly") return 1;
  if (!commencementDate.trim() || leaseTerm <= 0) return 1;

  const start = parseCommencementDay(commencementDate);
  const monthIndex = seqToMonthIndex(commencementDate, seq);
  if (!start || monthIndex === null) return 1;

  const { year, month } = monthIndexToYearMonth(monthIndex);
  const dim = daysInMonth(year, month);
  const isFirstMonth = seq === 1 && year === start.year && month === start.month;

  if (isFirstMonth && seq === leaseTerm) {
    return (dim - start.day + 1) / dim;
  }

  if (isFirstMonth) {
    return (dim - start.day + 1) / dim;
  }

  const lastEnd = getLastPeriodEndDay(commencementDate, leaseTerm);
  if (seq === leaseTerm && lastEnd && year === lastEnd.year && month === lastEnd.month) {
    return lastEnd.day / dim;
  }

  return 1;
}
