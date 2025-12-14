import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

type JwtPayload = { sub: string; email: string; is_admin: boolean };

function cookieExtractor(req: any): string | null {
  if (!req?.cookies) return null;

  const cookieName = process.env.COOKIE_NAME ?? 'auth_token';
  const token = req.cookies[cookieName];

  if (typeof token !== 'string' || token.length === 0) return null;
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email ?? null,
      is_admin: !!payload.is_admin,
    };
  }
}
