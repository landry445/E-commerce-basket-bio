import { DateTime } from "luxon";

type PickupKind = "tuesday" | "friday";

export function isBookingOpenClient(
  kind: PickupKind,
  pickupDateISO: string
): boolean {
  const zone = "Europe/Paris";
  const now = DateTime.now().setZone(zone);
  const pickup = DateTime.fromISO(pickupDateISO, { zone }).startOf("day");

  if (kind === "tuesday" && pickup.weekday !== 2) return false;
  if (kind === "friday" && pickup.weekday !== 5) return false;

  let start;
  let end;

  if (kind === "tuesday") {
    start = pickup.minus({ days: 4 }).set({ hour: 18, minute: 0 }); // ven 18:00
    end = pickup.set({ hour: 8, minute: 0 }); // mar 08:00
  } else {
    start = pickup.minus({ days: 3 }).set({ hour: 18, minute: 0 }); // mar 18:00
    end = pickup.set({ hour: 8, minute: 0 }); // jeu 08:00
  }

  return now >= start && now < end;
}
