"use client";

import { useEffect } from "react";
import DayPickerField from "./DayPickerField";

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week?: number[] | null; // ← tableau
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
  required?: boolean; // pour le select éventuel
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
  // Filtre strict : “Gare” active uniquement
  const gareList = locations
    .filter((l) => l.actif)
    .filter((l) => l.name_pickup.trim().toLowerCase() === "gare");

  // Auto-sélection si une seule gare
  useEffect(() => {
    if (gareList.length === 1 && locationId !== gareList[0].id) {
      onLocation(gareList[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gareList.length]);

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <h3 className="text-lg font-semibold">Sélection du retrait *</h3>

      {/* Point de retrait */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Point de retrait
        </label>

        {gareList.length === 1 ? (
          <input
            className="w-full rounded border px-3 py-2 bg-gray-50"
            value={gareList[0].name_pickup}
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
            {gareList.map((l) => (
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
          <ul className="list-disc pl-5">
            <li>Pour mardi : du samedi 00:00 au lundi 18:00.</li>
            <li>Pour vendredi : du mercredi 00:00 au jeudi 18:00.</li>
          </ul>
        </div>
      </div>

      {/* Date de retrait */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Date de retrait
        </label>

        <DayPickerField
          value={pickupDate}
          onChange={(iso) => {
            // ne conserve que la date autorisée par la fenêtre
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
