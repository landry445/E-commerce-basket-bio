export class ClientOrderCompactDto {
  id!: string; // id de la réservation/commande
  pickupDate!: string; // YYYY-MM-DD
  totalQty!: number; // somme des quantités des items
  items!: string; // ex: "2×Panier S, 1×Panier M"
}
