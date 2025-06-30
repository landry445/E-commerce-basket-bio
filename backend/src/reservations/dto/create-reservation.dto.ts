import { IsUUID, IsInt, IsDateString, Min } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  basket_id: string;

  @IsUUID()
  location_id: string;

  @IsInt()
  @Min(1)
  prix_centimes: number;

  @IsDateString()
  pickup_date: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
