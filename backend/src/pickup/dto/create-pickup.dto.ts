import { IsArray, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreatePickupDto {
  @IsString()
  name_pickup: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsArray()
  day_of_week?: number[];

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
