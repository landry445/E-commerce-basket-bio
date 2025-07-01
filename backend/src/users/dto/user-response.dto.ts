// src/users/dto/user-response.dto.ts
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  prenom: string;

  @Expose()
  nom: string;

  @Expose()
  email: string;

  @Expose()
  telephone: string;

  @Expose()
  is_admin: boolean;

  @Expose()
  date_creation: Date;
}
