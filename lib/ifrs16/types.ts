export type LeaseInputs = {
  assetName: string;
  commencementDate: string;
  leaseTerm: number;
  monthlyPayment: number;
  initialCost: number;
  annualRate: number;
};

export type LeasePeriodRow = {
  kind: "period";
  seq: number;
  rou: number;
  interest: number;
  payment: number;
  deprn: number;
  currentLiability: number;
  nonCurrentLiability: number;
  totalLiability: number;
};

export type LeaseSubtotalRow = {
  kind: "subtotal";
  quarter: number;
  interest: number;
  payment: number;
  deprn: number;
};

export type LeaseScheduleRow = LeasePeriodRow | LeaseSubtotalRow;

export type LeaseAsset = {
  id: string;
  inputs: LeaseInputs;
  schedule: LeaseScheduleRow[];
};

export type PortfolioTabId = "summary" | string;
