"use client";

import { useEffect, useMemo } from "react";
import DayPickerField from "./DayPickerField";

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week?: number[] | null;
  actif: boolean;
};

type Props = {
  locations: PickupLocation[];
  locationId: string;
  onLocation: (id: string) => void;

  pickupDate: string; // YYYY-MM-DD
  onDate: (iso: string) => void;

  allowedDate: string;
  maxDate: string; // YYYY-MM-DD

  disabled?: boolean;
  required?: boolean;
};

export default function PickupCard({
  locations,
  locationId,
  onLocation,
  pickupDate,
  onDate,
  maxDate,
  allowedDate,
  disabled,
  required,
}: Props) {
  const activeList = useMemo(() => {
    return locations
      .filter((l) => l.actif === true)
      .sort((a, b) => a.name_pickup.localeCompare(b.name_pickup, "fr"));
  }, [locations]);

  useEffect(() => {
    if (activeList.length === 1 && locationId !== activeList[0].id) {
      onLocation(activeList[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeList.length]);

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <h3 className="text-lg font-semibold">Sélection du retrait *</h3>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Point de retrait
        </label>

        {activeList.length === 1 ? (
          <input
            className="w-full rounded border px-3 py-2 bg-gray-50"
            value={activeList[0].name_pickup}
            readOnly
          />
        ) : (
          <select
            className="w-full rounded border px-3 py-2"
            value={locationId}
            onChange={(e) => onLocation(e.target.value)}
            disabled={disabled}
            required={required}
          >
            <option value="">Sélection</option>
            {activeList.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name_pickup}
              </option>
            ))}
          </select>
        )}

        <div
          role="note"
          aria-label="Fenêtres de réservation"
          className="mt-1 text-gray-500 text-sm"
        >
          <ul className="list-disc pl-5 text">
            <li>Pour le mardi : du vendredi 18:00 au mardi 8:00.</li>
            <li>Pour le vendredi : du mardi 18:00 au vendredi 8:00.</li>
            <li>Retrait à la gare de Savenay.</li>
          </ul>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Date de retrait
        </label>

        <DayPickerField
          value={pickupDate}
          onChange={(iso) => {
            if (iso === allowedDate) onDate(iso);
          }}
          allowedDate={allowedDate}
          maxDate={maxDate}
          disabled={disabled}
        />
      </div>
    </section>
  );
}
