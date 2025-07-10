import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreatePickupDto {
  @IsString()
  name_pickup: string;

  @IsOptional()
  @IsString()
  adress?: string;

  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week: number;
}
