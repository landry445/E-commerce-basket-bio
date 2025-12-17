import { IsBoolean } from 'class-validator';

export class UpdateBasketActifDto {
  @IsBoolean()
  actif!: boolean;
}
