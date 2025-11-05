import { IsUUID, IsInt, IsDateString, Min, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
export class CreateReservationDto {
  @IsUUID() basket_id: string;
  @IsUUID() location_id: string;

  @IsDateString() pickup_date: string;

  @IsInt() @Min(1) quantity: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  customer_note?: string;
}
