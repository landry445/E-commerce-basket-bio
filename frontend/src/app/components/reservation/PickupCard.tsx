"use client";

import { useEffect, useMemo } from "react";
import DayPickerField from "./DayPickerField";

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week?: number | null;
  actif: boolean;
};

type Props = {
  locations: PickupLocation[];
  locationId: string;
  onLocation: (id: string) => void;

  pickupDate: string; // YYYY-MM-DD
  onDate: (iso: string) => void;

  // Bornes d’affichage (visuel uniquement)
  minDate: string;
  maxDate: string;

  // Date autorisée par la règle métier (ou null)
  allowedDate: string | null;

  disabled?: boolean;
  required?: boolean;
};

function parseYmdLocal(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}
function formatFrYmd(ymd: string): string {
  const d = parseYmdLocal(ymd);
  return d.toLocaleDateString("fr-FR");
}

export default function PickupCard({
  locations,
  locationId,
  onLocation,
  pickupDate,
  onDate,
  minDate,
  maxDate,
  allowedDate,
  disabled,
  required,
}: Props) {
  // Lieux actifs “Gare”
  const gareList = useMemo(
    () =>
      locations
        .filter((l) => l.actif)
        .filter((l) => l.name_pickup.trim().toLowerCase() === "gare"),
    [locations]
  );

  // Auto-sélection s’il n’y a qu’une gare
  useEffect(() => {
    if (gareList.length === 1 && locationId !== gareList[0].id) {
      onLocation(gareList[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gareList.length]);

  // Synchronisation stricte de la date avec allowedDate
  useEffect(() => {
    if (allowedDate && pickupDate !== allowedDate) onDate(allowedDate);
    if (!allowedDate && pickupDate) onDate("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedDate]);

  const helper =
    "Commandes ouvertes : samedi→lundi 18h pour mardi ; mercredi→jeudi 18h30 pour vendredi.";

  const noSlot = !allowedDate;

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

      {/* Date de retrait — exactement la date autorisée */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Date de retrait
        </label>

        <DayPickerField
          value={pickupDate}
          onChange={(iso: string) => {
            if (allowedDate && iso === allowedDate) onDate(iso);
          }}
          // Affichage borné (un seul jour cliquable côté champ)
          minDate={allowedDate ?? minDate}
          maxDate={allowedDate ?? maxDate}
          // Limite la sélection à la seule date autorisée
          onlyDate={allowedDate ?? undefined}
          disabled={disabled || noSlot}
        />

        {noSlot ? (
          <p className="mt-2 text-xs text-amber-700">
            Aucun créneau ouvert pour le moment.
          </p>
        ) : (
          <p className="mt-2 text-xs text-gray-500">
            Date disponible : {formatFrYmd(allowedDate)}
          </p>
        )}
      </div>
    </section>
  );
}
