import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/roles.decorator';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  async findAllUsers(): Promise<AdminUserResponseDto[]> {
    return this.usersService.findAllAdmin();
  }
}
