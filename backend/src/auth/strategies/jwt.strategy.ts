// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

type JwtPayload = { sub: string; email?: string; is_admin?: boolean; isAdmin?: boolean };

function cookieExtractor(req: Request): string | null {
  const cookieName = process.env.COOKIE_NAME ?? 'auth_token';
  return req.cookies?.[cookieName] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // devient req.user
  validate(payload: JwtPayload) {
    const isAdmin = typeof payload.isAdmin === 'boolean' ? payload.isAdmin : !!payload.is_admin;
    return { id: payload.sub, email: payload.email, isAdmin };
  }
}
