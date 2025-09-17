import {
  IsArray,
  IsDateString,
  IsOptional,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsUUID()
  basketId!: string;

  @Min(1)
  @Max(5)
  quantity!: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsUUID()
  locationId?: string;

  @IsDateString() // format 'YYYY-MM-DD'
  pickupDate!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
