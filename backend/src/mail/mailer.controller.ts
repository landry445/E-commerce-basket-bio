import { Body, Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { TestEmailDto } from './dto/test-email.dto';

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
}
