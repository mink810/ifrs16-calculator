"use client";

import type { PeriodViewMode } from "@/lib/ifrs16/period-view";

type PeriodViewToggleProps = {
  value: PeriodViewMode;
  monthlyLabel: string;
  dailyLabel: string;
  ariaLabel: string;
  onChange: (mode: PeriodViewMode) => void;
};

export function PeriodViewToggle({
  value,
  monthlyLabel,
  dailyLabel,
  ariaLabel,
  onChange,
}: PeriodViewToggleProps) {
  return (
    <div className="calculator-period-toggle" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className={value === "monthly" ? "is-active" : undefined}
        aria-pressed={value === "monthly"}
        onClick={() => onChange("monthly")}
      >
        {monthlyLabel}
      </button>
      <button
        type="button"
        className={value === "daily" ? "is-active" : undefined}
        aria-pressed={value === "daily"}
        onClick={() => onChange("daily")}
      >
        {dailyLabel}
      </button>
    </div>
  );
}
