import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('send')
  async send(@Body('to') to: string, @Body('subject') subject: string, @Body('html') html: string) {
    return this.mailService.sendMail(to, subject, html);
  }
}
