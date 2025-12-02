import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { MailerService } from './mailer.service';
import { TestEmailDto } from './dto/test-email.dto';
import { AdminMessageDto } from './dto/admin-message.dto';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';

type RequestWithUser = Request & { user?: { id: string } };

@Controller('mail')
export class MailerController {
  constructor(private readonly mailer: MailerService) {}

  @Post('test')
  async test(@Body() dto: TestEmailDto): Promise<{ ok: true }> {
    await this.mailer.send({
      to: dto.to,
      subject: 'Test Paniers Bio',
      html: '<p>Envoi opérationnel ✅</p>',
      text: 'Envoi opérationnel',
    });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('contact')
  async contact(@Body() dto: AdminMessageDto, @Req() req: RequestWithUser) {
    const userId = req.user?.id!; // présent grâce au guard
    await this.mailer.sendAdminContact({
      subject: dto.subject ?? 'Message client – formulaire',
      message: dto.message,
      userId,
    });
    return { ok: true };
  }
}
