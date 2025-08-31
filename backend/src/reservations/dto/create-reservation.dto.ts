import { IsUUID, IsInt, IsDateString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsUUID() basket_id: string;
  @IsUUID() location_id: string;

  @IsDateString() pickup_date: string;

  @IsInt() @Min(1) quantity: number;
}
