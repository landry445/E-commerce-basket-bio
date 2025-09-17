import { IsArray, ValidateNested, IsUUID, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationItemDto {
  @IsUUID()
  basket_id!: string;

  @IsInt()
  @Min(1)
  @Max(5)
  quantity!: number;
}

export class CreateReservationBatchDto {
  @IsString()
  pickup_date!: string; // 'YYYY-MM-DD'

  @IsUUID()
  location_id!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReservationItemDto)
  items!: CreateReservationItemDto[];
}
