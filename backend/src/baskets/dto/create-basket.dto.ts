import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateBasketDto {
  @IsString()
  name_basket: string;

  @IsInt()
  @Min(0)
  price_basket: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_basket?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
