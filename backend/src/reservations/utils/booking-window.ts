import { DateTime } from 'luxon';

export type PickupKind = 'tuesday' | 'friday';

export interface BookingWindowCheckInput {
  // date de retrait visée (mardi ou vendredi) en fuseau Europe/Paris
  pickupDateISO: string; // ISO string (ex: "2025-03-18T00:00:00.000+01:00")
  nowISO?: string; // optionnel pour tests
}

export function isBookingWindowOpen(kind: PickupKind, input: BookingWindowCheckInput): boolean {
  const zone = 'Europe/Paris';
  const now = input.nowISO
    ? DateTime.fromISO(input.nowISO, { zone })
    : DateTime.now().setZone(zone);

  const pickup = DateTime.fromISO(input.pickupDateISO, { zone }).startOf('day');
  // Sécurité : mardi = 2, vendredi = 5 (ISO)
  const weekday = pickup.weekday; // 1=lundi ... 7=dimanche

  if (kind === 'tuesday' && weekday !== 2) return false;
  if (kind === 'friday' && weekday !== 5) return false;

  let start: DateTime;
  let end: DateTime;

  if (kind === 'tuesday') {
    // fenêtre : vendredi 18:00 -> mardi 08:00
    start = pickup.minus({ days: 4 }).set({ hour: 18, minute: 0 }); // vendredi 18:00
    end = pickup.set({ hour: 8, minute: 0 }); // mardi 08:00
  } else {
    // kind === 'friday'
    // fenêtre : mardi 18:00 -> jeudi 08:00
    start = pickup.minus({ days: 3 }).set({ hour: 18, minute: 0 }); // mardi 18:00
    end = pickup.minus({ days: 1 }).set({ hour: 8, minute: 0 }); // jeudi 08:00
  }

  // Inclusif au début, exclusif à la fin
  return now >= start && now < end;
}
