import { create } from "zustand";
import { calculateSchedule } from "@/lib/ifrs16/calculate-schedule";
import type { LeaseInputs, LeaseScheduleRow } from "@/lib/ifrs16/types";

export const defaultLeaseInputs: LeaseInputs = {
  assetName: "",
  commencementDate: "2024-01-01",
  postingDate: "2024-01-01",
  leaseTerm: 60,
  depreciationPeriod: 60,
  monthlyPayment: 800_000,
  initialCost: 42_000_000,
  annualRate: 5,
};

type LeaseState = {
  inputs: LeaseInputs;
  schedule: LeaseScheduleRow[];
  setInput: <K extends keyof LeaseInputs>(key: K, value: LeaseInputs[K]) => void;
};

export const useLeaseStore = create<LeaseState>((set) => ({
  inputs: defaultLeaseInputs,
  schedule: calculateSchedule(defaultLeaseInputs),
  setInput: (key, value) =>
    set((state) => {
      const inputs = { ...state.inputs, [key]: value };
      return { inputs, schedule: calculateSchedule(inputs) };
    }),
}));
