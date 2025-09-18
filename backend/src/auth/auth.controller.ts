// src/auth/auth.controller.ts
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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CookieOptions, Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  private cookieBase(): CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      sameSite:
        (process.env.COOKIE_SAMESITE as 'lax' | 'strict' | 'none') ?? (isProd ? 'none' : 'lax'),
      secure: (process.env.COOKIE_SECURE ?? (isProd ? 'true' : 'false')) === 'true',
      domain: process.env.COOKIE_DOMAIN ?? 'localhost',
      path: '/',
    };
  }

  private cookieName(): string {
    return process.env.COOKIE_NAME ?? 'auth_token';
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const token = await this.authService.signToken(user);
    res.cookie(this.cookieName(), token, {
      ...this.cookieBase(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Connexion réussie' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    const base = this.cookieBase();
    const name = this.cookieName();
    res.clearCookie(name, base);
    res.cookie(name, '', { ...base, maxAge: 0 });
    return { message: 'Déconnexion réussie' };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: { user: { id: string; email?: string; isAdmin: boolean } }) {
    // Fournit le firstname attendu par le front
    const u = await this.usersService.findOne(req.user.id);
    return { id: u.id, firstname: u.firstname, is_admin: !!req.user.isAdmin };
  }
}
