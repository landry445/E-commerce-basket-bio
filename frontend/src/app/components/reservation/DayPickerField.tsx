"use client";

import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  minDate: string;
  maxDate: string;
  disabled?: boolean;
  /** Force un unique jour sélectionnable (YYYY-MM-DD). */
  onlyDate?: string | null;
};

function strToDate(s: string | null): Date | undefined {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0); // interprétation locale
}
function dateToStr(d?: Date): string {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function DayPickerField({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
  onlyDate,
}: Props) {
  const selected = strToDate(value);

  // Mode "un seul jour"
  const from = onlyDate ? strToDate(onlyDate)! : strToDate(minDate)!;
  const to = onlyDate ? strToDate(onlyDate)! : strToDate(maxDate)!;

  const disabledDays = onlyDate
    ? [{ before: from, after: to }] // from === to => un seul jour cliquable
    : [
        { before: from, after: to },
        (date: Date) => {
          const day = date.getDay(); // 0..6
          return !(day === 2 || day === 5); // mardi(2) / vendredi(5)
        },
      ];

  const classNames: Record<string, string> = {
    months: "flex flex-col",
    month: "w-full",
    caption: "flex justify-center p-2",
    table: "w-full border-collapse",
    head_row: "grid grid-cols-7 text-xs text-gray-600",
    row: "grid grid-cols-7",
    head_cell: "py-1 text-center",
    cell: "p-1",
    day: "w-9 h-9 rounded-full mx-auto text-sm hover:bg-[var(--color-primary)]/10",
    day_selected:
      "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary)]",
    day_disabled: "text-gray-300 line-through",
    day_outside: "text-gray-300",
    nav: "flex items-center gap-2",
    button: "cursor-pointer",
  };

  const isDisabled = disabled || (!onlyDate && from > to);

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-2 ${
        isDisabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <DayPicker
        mode="single"
        required
        selected={onlyDate ? from : selected}
        onSelect={(d) => {
          if (d) onChange(dateToStr(d));
        }}
        fromDate={from}
        toDate={to}
        disabled={disabledDays}
        month={from}
        locale={fr}
        classNames={classNames}
        showOutsideDays
      />
    </div>
  );
}
