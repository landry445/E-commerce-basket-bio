// src/reservations/dto/checkout.dto.ts
import { IsUUID, IsDateString, IsInt, Min, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckoutItemDto {
  @IsUUID() basket_id!: string;
  @IsInt() @Min(1) quantity!: number;
}

export class CheckoutDto {
  @IsUUID() location_id!: string;
  @IsDateString() pickup_date!: string; // YYYY-MM-DD
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  @ArrayMinSize(1)
  items!: CheckoutItemDto[];
}
