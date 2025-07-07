// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(pass, user.password_hash);
    if (!isMatch) return null;
    return user;
  }

  async login(user: any) {
    const payload = { sub: user.id, is_admin: user.is_admin };
    return this.jwtService.sign(payload);
  }
}
