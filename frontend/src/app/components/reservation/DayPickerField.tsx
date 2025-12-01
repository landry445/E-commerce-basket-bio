"use client";

import { DayPicker } from "react-day-picker";
import { fr } from "date-fns/locale";
import "react-day-picker/dist/style.css";

type Props = {
  value: string;
  onChange: (v: string) => void;
  allowedDate: string; // YYYY-MM-DD
  maxDate: string;
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
  disabled,
}: Props) {
  const selected = strToDate(value);
  const only = strToDate(allowedDate)!;

  return (
    <div
      className={[
        "rounded-xl border border-gray-200 bg-white",
        "p-3 max-[600px]:p-2", // padding mobile
        "w-full max-w-full overflow-hidden", // largeur bornée
        "rdp", // scope des variables CSS DayPicker
        "max-[600px]:[--rdp-cell-size:36px] max-[600px]:[--rdp-nav-button-size:36px] max-[600px]:text-[14px]",
        "max-[360px]:[--rdp-cell-size:34px] max-[360px]:[--rdp-nav-button-size:34px] max-[360px]:text-[13px]",
        disabled ? "opacity-60 pointer-events-none" : "",
      ].join(" ")}
    >
      <DayPicker
        mode="single"
        required
        selected={selected ?? only}
        onSelect={(d) => onChange(dateToStr(d || only))}
        fromDate={only}
        toDate={only} // verrouillage sur la date autorisée
        locale={fr}
        showOutsideDays={false}
      />
    </div>
  );
}
