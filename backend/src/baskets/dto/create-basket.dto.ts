import { IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateBasketDto {
  @IsString()
  nom: string;

  @IsInt()
  @Min(0)
  prix_centimes: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;
}
