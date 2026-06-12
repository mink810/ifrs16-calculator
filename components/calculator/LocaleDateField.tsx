"use client";

import { useEffect, useId, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { useLocale } from "@/components/i18n/LocaleProvider";
import {
  dateFnsLocale,
  datePlaceholder,
  formatDateForDisplay,
  parseIsoDate,
  toIsoDate,
} from "@/lib/i18n/date-display";
import "react-day-picker/style.css";

type LocaleDateFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export function LocaleDateField({ value, onChange }: LocaleDateFieldProps) {
  const { locale } = useLocale();
  const inputId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const selected = parseIsoDate(value);
  const displayValue = formatDateForDisplay(value, locale);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  const toggleOpen = () => setOpen((prev) => !prev);

  return (
    <div className="locale-date-field" ref={rootRef}>
      <input
        id={inputId}
        type="text"
        readOnly
        suppressHydrationWarning
        className="locale-date-field-input"
        value={displayValue}
        placeholder={datePlaceholder(locale)}
        onClick={toggleOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleOpen();
          }
          if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={`${inputId}-popover`}
      />
      {open && (
        <div
          id={`${inputId}-popover`}
          className="locale-date-field-popover"
          role="dialog"
          aria-label={datePlaceholder(locale)}
        >
          <DayPicker
            mode="single"
            locale={dateFnsLocale(locale)}
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => {
              if (!date) return;
              onChange(toIsoDate(date));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
