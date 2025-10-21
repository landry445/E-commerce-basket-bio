import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mail/mailer.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

type AuthUser = {
  id: string;
  email: string;
  password_hash: string;
  is_admin: boolean;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<AuthUser | null> {
    const user = (await this.usersService.findByEmail(email)) as AuthUser | null;
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) return null;
    return user;
  }

  async login(user: Pick<AuthUser, 'id' | 'is_admin'>): Promise<string> {
    const payload = { sub: user.id, is_admin: user.is_admin };
    return this.jwtService.sign(payload);
  }

  async register(dto: CreateUserDto): Promise<UserResponseDto> {
    // 1) création de l'utilisateur
    const created = await this.usersService.create(dto);

    // 2) e-mail de bienvenue (non bloquant pour l'inscription)
    //    - personnalisation avec le prénom saisi, sinon fallback sur la partie locale de l'e-mail
    const firstname =
      (dto as unknown as { firstname?: string }).firstname ?? dto.email.split('@')[0];

    try {
      const sendFn = (this.mailService as any).sendWelcomeEmail;
      if (typeof sendFn === 'function') {
        await sendFn.call(this.mailService, {
          to: dto.email,
          firstname,
        });
      } else {
        this.logger.debug('MailerService.sendWelcomeEmail not available, skipping welcome email.');
      }
    } catch (e) {
      this.logger.warn(`Envoi e-mail de bienvenue en échec: ${String(e)}`);
    }

    // 3) retour DTO pour le front
    return created;
  }
}
