export type AdminReservationRow = {
  id: string;
  client_name: string;
  basket_name: string;
  pickup_date: string; // 'YYYY-MM-DD'
  statut: "active" | "archived";
  quantity: number;
  customer_note: string;
};
