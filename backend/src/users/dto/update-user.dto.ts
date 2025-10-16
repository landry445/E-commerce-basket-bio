import { IsOptional, IsString, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  firstname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[\s()+\-.\d]{9,20}$/, { message: 'Numéro invalide' })
  phone?: string;
}
