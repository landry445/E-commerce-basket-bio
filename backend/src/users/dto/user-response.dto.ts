// src/users/dto/user-response.dto.ts
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  is_admin: boolean;

  @Expose()
  date_creation: Date;
}
