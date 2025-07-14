import { Expose } from 'class-transformer';

export class ReservationResponseDto {
  @Expose() id: string;
  @Expose() user_id: string;
  @Expose() basket_id: string;
  @Expose() location_id: string;
  @Expose() price_reservation: number;
  @Expose() pickup_date: Date;
  @Expose() quantity: number;
  @Expose() statut: string;
  @Expose() date_creation: Date;
}
