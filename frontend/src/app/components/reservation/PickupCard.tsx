"use client";

import { useEffect } from "react";
import DayPickerField from "./DayPickerField";

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week?: number | null; // optionnel
  actif: boolean;
};

type Props = {
  locations: PickupLocation[];
  locationId: string;
  onLocation: (id: string) => void;

  pickupDate: string; // YYYY-MM-DD
  onDate: (iso: string) => void;

  minDate: string; // YYYY-MM-DD (J+3)
  maxDate: string; // YYYY-MM-DD

  disabled?: boolean;
  required?: boolean; // pour le select éventuel
};

// validation locale mardi/vendredi + >= J+3
function isTueOrFriISO(iso: string): boolean {
  if (!iso) return false;
  const d = new Date(iso + "T00:00:00");
  const g = d.getDay();
  return g === 2 || g === 5;
}

export default function PickupCard({
  locations,
  locationId,
  onLocation,
  pickupDate,
  onDate,
  minDate,
  maxDate,
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

  const helper =
    "Retrait les mardis et vendredis uniquement, réservable jusqu’à J+3.";

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

        <p className="text-xs mt-1 text-gray-500">{helper}</p>
      </div>

      {/* Date de retrait */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Date de retrait
        </label>

        {/* DayPickerField existant : min/max + masque des jours intégrés */}
        <DayPickerField
          value={pickupDate}
          onChange={(iso: string) => {
            const ok = isTueOrFriISO(iso) && iso >= minDate;
            if (ok) onDate(iso);
          }}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
        />
      </div>
    </section>
  );
}
