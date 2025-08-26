"use client";

import DayPickerField from "./DayPickerField";

type PickupLocation = {
  id: string;
  name_pickup: string;
  day_of_week: number;
  actif: boolean;
};

type Props = {
  locations: PickupLocation[];
  locationId: string;
  onLocation: (id: string) => void;
  pickupDate: string;
  onDate: (d: string) => void;
  minDate: string;
  maxDate: string;
  disabled?: boolean;
  required?: boolean;
};

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
  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold">
        Sélection du retrait (17h à 18h30)&nbsp;*
      </p>
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Point de retrait
          </label>
          <select
            className="w-full rounded border px-3 py-2"
            value={locationId}
            onChange={(e) => onLocation(e.target.value)}
            disabled={disabled}
            required={required}
          >
            <option value="">Sélection</option>
            {locations
              .filter((l) => l.actif)
              .map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name_pickup}
                </option>
              ))}
          </select>
          <p className="text-xs mt-1 text-gray-500">
            Mardis et vendredis uniquement. Les autres jours restent
            indisponibles.
          </p>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Date de retrait
          </label>
          <DayPickerField
            value={pickupDate}
            onChange={onDate}
            minDate={minDate}
            maxDate={maxDate}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
