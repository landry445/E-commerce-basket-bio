import { IsNotEmpty, IsString } from 'class-validator';

export class AdminNewsletterSendDto {
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @IsString()
  @IsNotEmpty()
  html!: string;

  @IsString()
  @IsNotEmpty()
  text?: string;
}
