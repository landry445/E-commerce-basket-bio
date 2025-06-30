import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';

export class CreateBasketDto {
  @IsString()
  nom: string;

  @IsInt()
  @Min(1)
  prix_centimes: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  image_url?: string;
}
