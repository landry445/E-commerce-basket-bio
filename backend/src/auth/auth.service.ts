import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailerService } from '../mail/mailer.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { EmailVerificationService } from './email-verification.service';

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
    private readonly jwtService: JwtService,
    private readonly emailVerify: EmailVerificationService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const ok = await this.usersService.comparePassword(password, user.password_hash);
    if (!ok) return null;

    // Bloc vérification e-mail
    if (!user.email_verified_at) {
      // Renvoi d’un lien frais avant de bloquer
      const firstname = user.firstname ?? user.email.split('@')[0];
      try {
        await this.emailVerify.sendSignupConfirmationMail({
          user: { id: user.id, email: user.email, firstname },
        });
      } catch (e) {
        this.logger.warn(`Renvoi du mail de vérification en échec: ${String(e)}`);
      }
      throw new UnauthorizedException(
        'Adresse e-mail non vérifiée. Un nouveau lien vient d’être envoyé.'
      );
    }

    return user;
  }

  async login(user: Pick<AuthUser, 'id' | 'is_admin'>): Promise<string> {
    const payload = { sub: user.id, is_admin: user.is_admin };
    return this.jwtService.sign(payload);
  }

  async register(dto: CreateUserDto): Promise<UserResponseDto> {
    // création utilisateur
    const created = await this.usersService.create(dto);

    // envoi du mail de vérification (24 h)
    const firstname = created.firstname ?? created.email.split('@')[0];
    try {
      await this.emailVerify.sendSignupConfirmationMail({
        user: { id: created.id, email: created.email, firstname },
      });
    } catch (e) {
      this.logger.warn(`Envoi e-mail de vérification en échec: ${String(e)}`);
    }

    return created;
  }
}
