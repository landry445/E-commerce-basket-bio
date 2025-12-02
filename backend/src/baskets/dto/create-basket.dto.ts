import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsBoolean, Min, IsNumber } from 'class-validator';

function normalizeEuro(input: unknown): number {
  if (typeof input === 'number') return Number.isFinite(input) ? input : NaN;
  if (typeof input !== 'string') return NaN;
  const s = input.trim().replace(/\s/g, '').replace(',', '.');
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN;
}
export class CreateBasketDto {
  @IsString()
  name_basket: string;

  @Transform(({ value }) => normalizeEuro(value))
  @IsNumber()
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
