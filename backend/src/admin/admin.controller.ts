import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from '../auth/role.enum';
import { UsersService } from '../users/users.service';
import { Roles } from '../auth/roles.decorator';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { MailerService } from 'src/mail/mailer.service';
import { AdminNewsletterSendDto } from './dto/admin-newsletter-send.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  async findAllUsers(): Promise<AdminUserResponseDto[]> {
    return this.usersService.findAllAdmin();
  }

  @Delete('users/:id')
  async adminDeleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<{ deleted: boolean }> {
    await this.usersService.deleteUserById(id);
    return { deleted: true };
  }
}

@Controller('admin/newsletter')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
export class AdminNewsletterController {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailService: MailerService,
  ) {}

  @Get('subscribers')
  async listSubscribers(): Promise<
    { id: string; email: string; firstname: string; lastname: string }[]
  > {
    const users = await this.usersService.findNewsletterSubscribers();

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      firstname: u.firstname,
      lastname: u.lastname,
    }));
  }

  @Post('send')
  async sendNewsletter(@Body() dto: AdminNewsletterSendDto): Promise<{ sent: number }> {
    const users = await this.usersService.findNewsletterSubscribers();
    const emails = users.map((u) => u.email);

    if (!dto.subject || !dto.html) {
      // tu peux affiner la gestion d’erreur
      return { sent: 0 };
    }

    await this.mailService.sendNewsletterToMany(emails, {
      subject: dto.subject,
      html: dto.html,
      text: dto.text,
    });


    return { sent: emails.length };
  }
}
