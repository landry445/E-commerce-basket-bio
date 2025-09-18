import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

type AuthUser = { id: string; email: string; is_admin: boolean };

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(pass, user.password_hash);
    if (!ok) return null;
    return { id: user.id, email: user.email, is_admin: user.is_admin };
  }

  async signToken(user: AuthUser): Promise<string> {
    const payload = { sub: user.id, email: user.email, is_admin: user.is_admin };
    return this.jwtService.sign(payload);
  }

  /** Création de compte via DTO, retour typé UserResponseDto */
  async register(dto: CreateUserDto): Promise<UserResponseDto> {
    // Hypothèse: UsersService.create() gère le hash du mot de passe
    const entity = await this.usersService.create(dto);

    // Mapping explicite vers le DTO de réponse (adapter si champ manquant)
    const res: UserResponseDto = {
      id: entity.id,
      firstname: entity.firstname,
      lastname: entity.lastname,
      email: entity.email,
      phone: entity.phone,
      date_creation: entity.date_creation,
    };
    return res;
  }
}