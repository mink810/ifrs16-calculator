/** ROU Asset (lease liability PV) from monthly payment, term, and annual rate (%). */
export function calculateRouAsset(
  monthlyPayment: number,
  leaseTermMonths: number,
  annualRatePercent: number
): number {
  const pmt = Math.max(0, monthlyPayment);
  const n = Math.max(0, Math.floor(leaseTermMonths));
  if (pmt === 0 || n === 0) return 0;

  const i = annualRatePercent / 100 / 12;
  if (i === 0) return Math.round(pmt * n);

  const rouAsset = pmt * ((1 - Math.pow(1 + i, -n)) / i);
  return Math.round(rouAsset);
}
