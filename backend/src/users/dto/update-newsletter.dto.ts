import { IsBoolean } from 'class-validator';

export class UpdateNewsletterPreferenceDto {
  @IsBoolean()
  newsletterOptIn!: boolean;
}
