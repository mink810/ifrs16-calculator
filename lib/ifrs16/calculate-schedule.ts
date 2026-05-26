import type { LeaseInputs, LeasePeriodRow, LeaseScheduleRow } from "./types";

type PeriodCalc = LeasePeriodRow & { principal: number };

function buildPeriods(inputs: LeaseInputs): PeriodCalc[] {
  const leaseTerm = Math.max(0, Math.floor(inputs.leaseTerm));
  const depreciationPeriod = Math.max(1, Math.floor(inputs.depreciationPeriod));
  const monthlyPayment = Math.max(0, inputs.monthlyPayment);
  const initialCost = Math.max(0, inputs.initialCost);
  const monthlyRate = Math.max(0, inputs.annualRate) / 100 / 12;
  const monthlyDeprn = initialCost / depreciationPeriod;

  const periods: PeriodCalc[] = [];
  let liability = initialCost;
  let rou = initialCost;

  for (let seq = 1; seq <= leaseTerm; seq++) {
    const openingRou = rou;
    const interest = liability * monthlyRate;
    const principal = monthlyPayment - interest;
    const payment = monthlyPayment;

    liability = Math.max(0, liability - principal);
    rou = Math.max(0, rou - monthlyDeprn);

    periods.push({
      kind: "period",
      seq,
      rou: openingRou,
      interest,
      payment,
      deprn: monthlyDeprn,
      principal,
      totalLiability: liability,
      currentLiability: 0,
      nonCurrentLiability: 0,
    });
  }

  for (let i = 0; i < periods.length; i++) {
    let currentLiability = 0;
    const end = Math.min(i + 12, periods.length - 1);
    for (let j = i + 1; j <= end; j++) {
      currentLiability += periods[j].principal;
    }
    periods[i].currentLiability = currentLiability;
    periods[i].nonCurrentLiability = Math.max(
      0,
      periods[i].totalLiability - currentLiability
    );
  }

  return periods;
}

export function calculateSchedule(inputs: LeaseInputs): LeaseScheduleRow[] {
  const periods = buildPeriods(inputs);
  const rows: LeaseScheduleRow[] = [];

  let quarterInterest = 0;
  let quarterPayment = 0;
  let quarterDeprn = 0;

  for (const period of periods) {
    rows.push({
      kind: "period",
      seq: period.seq,
      rou: period.rou,
      interest: period.interest,
      payment: period.payment,
      deprn: period.deprn,
      currentLiability: period.currentLiability,
      nonCurrentLiability: period.nonCurrentLiability,
      totalLiability: period.totalLiability,
    });

    quarterInterest += period.interest;
    quarterPayment += period.payment;
    quarterDeprn += period.deprn;

    if (period.seq % 3 === 0) {
      rows.push({
        kind: "subtotal",
        quarter: period.seq / 3,
        interest: quarterInterest,
        payment: quarterPayment,
        deprn: quarterDeprn,
      });
      quarterInterest = 0;
      quarterPayment = 0;
      quarterDeprn = 0;
    }
  }

  return rows;
}
