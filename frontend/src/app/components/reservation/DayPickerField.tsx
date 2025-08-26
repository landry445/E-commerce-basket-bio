"use client";

import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Props = {
  value: string; // "YYYY-MM-DD" ou ""
  onChange: (v: string) => void;
  minDate: string; // "YYYY-MM-DD"
  maxDate: string; // "YYYY-MM-DD"
  disabled?: boolean;
};

function strToDate(s: string | null): Date | undefined {
  if (!s) return undefined;
  return new Date(`${s}T00:00:00`);
}
function dateToStr(d?: Date): string {
  if (!d) return "";
  const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
    .toISOString()
    .slice(0, 10);
  return iso;
}

export default function DayPickerField({
  value,
  onChange,
  minDate,
  maxDate,
  disabled,
}: Props) {
  const selected = strToDate(value);
  const from = strToDate(minDate)!;
  const to = strToDate(maxDate)!;

  const disabledDays = [
    { before: from, after: to },
    (date: Date) => {
      const day = date.getDay(); // 0..6
      return !(day === 2 || day === 5); // mardi (2) et vendredi (5)
    },
  ];

  const classNames = {
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

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-2 ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <DayPicker
        mode="single"
        required
        selected={selected}
        onSelect={(d) => onChange(dateToStr(d))}
        fromDate={from}
        toDate={to}
        disabled={disabledDays}
        locale={fr}
        classNames={classNames}
        showOutsideDays
      />
    </div>
  );
}
