import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from '../users/users.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  findAllUsers() {
    // Attention : expose une liste de users sans password_hash
    // Utilise une méthode dédiée si besoin pour un vrai listing (cf. plus bas)
    return this.usersService.findAllSafe();
  }
}
