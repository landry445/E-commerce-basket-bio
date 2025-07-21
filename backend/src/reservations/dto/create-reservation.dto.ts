// src/reservations/dto/create-reservation.dto.ts
import { IsUUID, IsInt, IsDateString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsUUID() basket_id: string;
  @IsUUID() location_id: string;

  @IsInt() @Min(1) price_reservation: number;
  @IsDateString() pickup_date: string;

  @IsInt() @Min(1) quantity: number;
}
