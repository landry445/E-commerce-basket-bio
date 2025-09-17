import {
  IsArray,
  ArrayMaxSize,
  ArrayUnique,
  IsBoolean,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePickupDto {
  @IsString()
  name_pickup!: string;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsBoolean()
  actif?: boolean;

  // Tableau de jours (0..6) — nullable si vide ou non fourni
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @ArrayUnique()
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  day_of_week?: number[] | null;
}
