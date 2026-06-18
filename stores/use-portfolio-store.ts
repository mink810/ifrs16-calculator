import { create } from "zustand";
import { calculateRouAsset } from "@/lib/ifrs16/calculate-rou-asset";
import { calculateSchedule } from "@/lib/ifrs16/calculate-schedule";
import type { PeriodViewMode } from "@/lib/ifrs16/period-view";
import type { LeaseAsset, LeaseInputs, PortfolioTabId } from "@/lib/ifrs16/types";

export const emptyLeaseInputs: LeaseInputs = {
  assetName: "",
  commencementDate: "",
  leaseTerm: 0,
  monthlyPayment: 0,
  initialCost: 0,
  annualRate: 0,
};

function buildSchedule(inputs: LeaseInputs, prorationMode: PeriodViewMode) {
  return calculateSchedule(inputs, prorationMode);
}

function createAsset(inputs: LeaseInputs, prorationMode: PeriodViewMode): LeaseAsset {
  return {
    id: crypto.randomUUID(),
    inputs,
    schedule: buildSchedule(inputs, prorationMode),
  };
}

const initialAssets: LeaseAsset[] = [createAsset({ ...emptyLeaseInputs }, "monthly")];

type PortfolioState = {
  assets: LeaseAsset[];
  activeTabId: PortfolioTabId;
  periodView: PeriodViewMode;
  addAsset: () => void;
  removeAsset: (assetId: string) => void;
  setActiveTab: (tabId: PortfolioTabId) => void;
  setPeriodView: (mode: PeriodViewMode) => void;
  setInput: <K extends keyof LeaseInputs>(
    assetId: string,
    key: K,
    value: LeaseInputs[K]
  ) => void;
  calculateAsset: (assetId: string) => void;
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  assets: initialAssets,
  activeTabId: initialAssets[0]?.id ?? "summary",
  periodView: "monthly",
  addAsset: () =>
    set((state) => {
      const asset = createAsset({ ...emptyLeaseInputs }, state.periodView);
      return { assets: [...state.assets, asset], activeTabId: asset.id };
    }),
  removeAsset: (assetId) =>
    set((state) => {
      const index = state.assets.findIndex((asset) => asset.id === assetId);
      if (index === -1) return state;

      const assets = state.assets.filter((asset) => asset.id !== assetId);
      let activeTabId = state.activeTabId;

      if (state.activeTabId === assetId) {
        activeTabId =
          assets.length === 0
            ? "summary"
            : (assets[Math.min(index, assets.length - 1)]?.id ?? "summary");
      }

      return { assets, activeTabId };
    }),
  setActiveTab: (tabId) => set({ activeTabId: tabId }),
  setPeriodView: (mode) =>
    set((state) => ({
      periodView: mode,
      assets: state.assets.map((asset) => {
        const initialCost =
          asset.inputs.initialCost > 0
            ? calculateRouAsset(
                asset.inputs.monthlyPayment,
                asset.inputs.leaseTerm,
                asset.inputs.annualRate,
                asset.inputs.commencementDate,
                mode
              )
            : asset.inputs.initialCost;
        const inputs = { ...asset.inputs, initialCost };
        return {
          ...asset,
          inputs,
          schedule: buildSchedule(inputs, mode),
        };
      }),
    })),
  setInput: (assetId, key, value) =>
    set((state) => ({
      assets: state.assets.map((asset) => {
        if (asset.id !== assetId || key === "initialCost") return asset;
        return { ...asset, inputs: { ...asset.inputs, [key]: value } };
      }),
    })),
  calculateAsset: (assetId) =>
    set((state) => ({
      assets: state.assets.map((asset) => {
        if (asset.id !== assetId) return asset;
        const initialCost = calculateRouAsset(
          asset.inputs.monthlyPayment,
          asset.inputs.leaseTerm,
          asset.inputs.annualRate,
          asset.inputs.commencementDate,
          state.periodView
        );
        const inputs = { ...asset.inputs, initialCost };
        return {
          ...asset,
          inputs,
          schedule: buildSchedule(inputs, state.periodView),
        };
      }),
    })),
}));
