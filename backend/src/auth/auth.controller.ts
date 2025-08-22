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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  // ↓↓↓ nouveau
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: { user: { id: string; email: string; is_admin: boolean } }) {
    return { id: req.user.id, email: req.user.email, is_admin: !!req.user.is_admin };
  }
}
