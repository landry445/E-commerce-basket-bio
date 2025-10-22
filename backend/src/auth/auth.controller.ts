import {
  UnauthorizedException,
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  Get,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieOptions, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { EmailVerificationService } from './email-verification.service';
import { IsEmail, MaxLength } from 'class-validator'; // +++
import { Transform } from 'class-transformer'; // +++

// +++ DTO validé (compatible ValidationPipe en mode whitelist)
class ResendDto {
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  email!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly emailVerify: EmailVerificationService
  ) {}

  private cookieBase(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    return { httpOnly: true, sameSite: isProd ? 'none' : 'lax', secure: isProd, path: '/' };
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const token = await this.authService.login(user);
    res.cookie('jwt', token, { ...this.cookieBase(), maxAge: 7 * 24 * 60 * 60 * 1000 });
    return { message: 'Connexion réussie' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    const base = this.cookieBase();
    res.clearCookie('jwt', base);
    res.cookie('jwt', '', { ...base, maxAge: 0 });
    return { message: 'Déconnexion réussie' };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { id: string; email: string; is_admin: boolean } }) {
    return { id: req.user.id, email: req.user.email, is_admin: !!req.user.is_admin };
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response): Promise<void> {
    const ok = process.env.EMAIL_VERIFY_REDIRECT_OK ?? 'http://localhost:3000/verification-ok';
    const ko = process.env.EMAIL_VERIFY_REDIRECT_KO ?? 'http://localhost:3000/verification-erreur';
    try {
      await this.emailVerify.verifyToken(token);
      res.redirect(302, ok);
    } catch {
      res.redirect(302, ko);
    }
  }

  // +++ Nouveau : renvoi d’un lien de vérification (réponse neutre)
  @Post('resend-verification')
  @HttpCode(200)
  async resend(@Body() dto: ResendDto): Promise<{ ok: true }> {
    const user = await this.authService.findUserByEmailSafe(dto.email);
    if (user && !user.email_verified_at) {
      await this.authService.sendVerificationMail(user.id);
    }
    return { ok: true };
  }
}
