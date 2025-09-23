// src/reservations/dto/admin-reservation-list.dto.ts
import { Expose } from 'class-transformer';

export class AdminReservationListDto {
  @Expose() id!: string;
  @Expose() client_name!: string;
  @Expose() basket_name!: string;
  @Expose() pickup_date!: string; // 'YYYY-MM-DD'
  @Expose() statut!: 'active' | 'archived';
  @Expose() quantity!: number;
}
