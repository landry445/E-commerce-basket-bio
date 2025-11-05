import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class TestEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  to!: string;
}
