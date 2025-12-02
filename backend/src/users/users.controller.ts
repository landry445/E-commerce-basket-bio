import { Controller, Get, Patch, UseGuards, Req, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateNewsletterPreferenceDto } from './dto/update-newsletter.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req): Promise<UserResponseDto> {
    return this.usersService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
    return this.usersService.updatePartial(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/newsletter')
  async updateNewsletter(
    @Req() req,
    @Body() dto: UpdateNewsletterPreferenceDto,
  ): Promise<{ newsletterOptIn: boolean }> {
    const userId = req.user.sub ?? req.user.id;

    const updated = await this.usersService.updateNewsletterPreference(userId, dto.newsletterOptIn);

    return { newsletterOptIn: updated.newsletterOptIn };
  }
}
