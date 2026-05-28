import { create } from "zustand";
import { calculateRouAsset } from "@/lib/ifrs16/calculate-rou-asset";
import { calculateSchedule } from "@/lib/ifrs16/calculate-schedule";
import type { LeaseAsset, LeaseInputs, PortfolioTabId } from "@/lib/ifrs16/types";

export const emptyLeaseInputs: LeaseInputs = {
  assetName: "",
  commencementDate: "",
  leaseTerm: 0,
  depreciationPeriod: 0,
  monthlyPayment: 0,
  initialCost: 0,
  annualRate: 0,
};

function createAsset(inputs: LeaseInputs): LeaseAsset {
  return {
    id: crypto.randomUUID(),
    inputs,
    schedule: calculateSchedule(inputs),
  };
}

const initialAssets: LeaseAsset[] = [
  createAsset({ ...emptyLeaseInputs }),
];

type PortfolioState = {
  assets: LeaseAsset[];
  activeTabId: PortfolioTabId;
  addAsset: () => void;
  removeAsset: (assetId: string) => void;
  setActiveTab: (tabId: PortfolioTabId) => void;
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
  addAsset: () =>
    set((state) => {
      const asset = createAsset({ ...emptyLeaseInputs });
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
          asset.inputs.annualRate
        );
        const inputs = { ...asset.inputs, initialCost };
        return { ...asset, inputs, schedule: calculateSchedule(inputs) };
      }),
    })),
}));
