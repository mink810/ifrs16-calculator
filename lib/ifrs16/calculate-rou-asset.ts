import { getProrationFactor } from "./proration";
import type { PeriodViewMode } from "./period-view";

/** ROU Asset (lease liability PV) from monthly payment, term, and annual rate (%). */
export function calculateRouAsset(
  monthlyPayment: number,
  leaseTermMonths: number,
  annualRatePercent: number,
  commencementDate = "",
  prorationMode: PeriodViewMode = "monthly"
): number {
  const pmt = Math.max(0, monthlyPayment);
  const n = Math.max(0, Math.floor(leaseTermMonths));
  if (pmt === 0 || n === 0) return 0;

  const i = annualRatePercent / 100 / 12;

  if (prorationMode === "monthly" || !commencementDate.trim()) {
    if (i === 0) return Math.round(pmt * n);
    const rouAsset = pmt * ((1 - Math.pow(1 + i, -n)) / i);
    return Math.round(rouAsset);
  }

  let pv = 0;
  for (let seq = 1; seq <= n; seq++) {
    const payment = pmt * getProrationFactor(commencementDate, seq, n, prorationMode);
    pv += i === 0 ? payment : payment / Math.pow(1 + i, seq);
  }
  return Math.round(pv);
}
