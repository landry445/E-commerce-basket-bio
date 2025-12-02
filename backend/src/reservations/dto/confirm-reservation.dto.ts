export type ConfirmReservationDto = {
  groupId: string;
  pickupDateISO: string; // ex: "2025-11-07T00:00:00.000+01:00"
  pickupLocationName: string; // ex: "Gare"
  totalCents: number;
  items: {
    basketId: string;
    basketName: string;
    unitPriceCents: number;
    quantity: number;
    subtotalCents: number;
  }[];
};
