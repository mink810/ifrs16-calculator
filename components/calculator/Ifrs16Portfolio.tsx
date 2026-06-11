"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LeaseAssetPanel } from "@/components/calculator/LeaseAssetPanel";
import { PeriodViewToggle } from "@/components/calculator/PeriodViewToggle";
import { SummaryPortfolioPanel } from "@/components/calculator/SummaryPortfolioPanel";
import type { PeriodViewMode } from "@/lib/ifrs16/period-view";
import { Footer } from "@/components/landing/Footer";
import { TopNav } from "@/components/landing/TopNav";
import type { LeaseAsset, PortfolioTabId } from "@/lib/ifrs16/types";
import { usePortfolioStore } from "@/stores/use-portfolio-store";

export function Ifrs16Portfolio() {
  const { t } = useLocale();
  const c = (key: string) => t(`calculator.${key}`);
  const { assets, activeTabId, addAsset, removeAsset, setActiveTab, setInput, calculateAsset } =
    usePortfolioStore();
  const [periodView, setPeriodView] = useState<PeriodViewMode>("monthly");

  const activeAsset = assets.find((asset) => asset.id === activeTabId);

  const assetTabLabel = (asset: LeaseAsset, index: number) => {
    const name = asset.inputs.assetName.trim();
    if (name) return name;
    return c("tabUntitled").replace("{n}", String(index + 1));
  };

  const tabItemClass = (tabId: PortfolioTabId, assetIndex?: number) => {
    const base = "calculator-tab-item";
    if (activeTabId !== tabId) return base;
    if (assetIndex === 0) return `${base} calculator-tab-item--active calculator-tab-item--asset1`;
    if (assetIndex === 1) return `${base} calculator-tab-item--active calculator-tab-item--asset2`;
    return `${base} calculator-tab-item--active`;
  };

  return (
    <div className="aurel-page">
      <TopNav />

      <main className="calculator-main">
        <div className="container">
          <header className="calculator-header">
            <h1>{c("title")}</h1>
            <p>{c("subtitle")}</p>
          </header>

          <div className="calculator-workspace-toolbar">
            <PeriodViewToggle
              value={periodView}
              monthlyLabel={c("periodViewMonthly")}
              dailyLabel={c("periodViewDaily")}
              ariaLabel={c("periodViewLabel")}
              onChange={setPeriodView}
            />
          </div>

          <div className="calculator-workspace">
            {/* 탭 목록 */}
            <div className="calculator-tabs" role="tablist" aria-label={c("title")}>   
              <div
                role="tab"
                aria-selected={activeTabId === "summary"}
                className={tabItemClass("summary")}
              >
                <button
                  type="button"
                  className="calculator-tab-label"
                  onClick={() => setActiveTab("summary")}
                >
                  {c("tabSummary")}
                </button>
              </div>
              {assets.map((asset, index) => (
                <div
                  key={asset.id}
                  role="tab"
                  aria-selected={activeTabId === asset.id}
                  className={tabItemClass(asset.id, index % 2)}
                >
                  <button
                    type="button"
                    className="calculator-tab-label"
                    onClick={() => setActiveTab(asset.id)}
                  >
                    {assetTabLabel(asset, index)}
                  </button>
                  <button
                    type="button"
                    className="calculator-tab-close"
                    aria-label={c("tabClose")}
                    onClick={() => removeAsset(asset.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="calculator-tab-add" onClick={addAsset}>
                {c("btnAddAsset")}
              </button>
            </div>

            {activeTabId === "summary" && (
              <SummaryPortfolioPanel
                assets={assets}
                periodView={periodView}
                assetLabel={assetTabLabel}
              />
            )}

            {activeAsset && (
              <LeaseAssetPanel
                tabLabel={assetTabLabel(
                  activeAsset,
                  assets.findIndex((a) => a.id === activeAsset.id)
                )}
                inputs={activeAsset.inputs}
                schedule={activeAsset.schedule}
                periodView={periodView}
                onInputChange={(key, value) => setInput(activeAsset.id, key, value)}
                onCalculate={() => calculateAsset(activeAsset.id)}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
