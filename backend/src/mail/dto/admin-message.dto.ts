import { IsOptional, IsString, Length } from 'class-validator';

export class AdminMessageDto {
  @IsString()
  @Length(3, 2000)
  message!: string;

  @IsOptional()
  @IsString()
  @Length(0, 120)
  subject?: string;
}
