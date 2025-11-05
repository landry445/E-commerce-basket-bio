"use client";

import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  allowedDate: string; // YYYY-MM-DD
  maxDate: string; // non utilisé ici pour le verrou strict, conservé pour compat éventuelle
  disabled?: boolean;
};

function strToDate(s: string | null): Date | undefined {
  if (!s) return undefined;
  return new Date(`${s}T00:00:00`);
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
  allowedDate,
  maxDate, // eslint-disable-line @typescript-eslint/no-unused-vars
  disabled,
}: Props) {
  const selected = strToDate(value);
  const only = strToDate(allowedDate)!;

  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-2 ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <DayPicker
        mode="single"
        required
        selected={selected ?? only}
        onSelect={(d) => onChange(dateToStr(d || only))}
        fromDate={only}
        toDate={only} // bloque toute navigation et tout autre jour
        locale={fr}
        showOutsideDays={false}
      />
    </div>
  );
}
