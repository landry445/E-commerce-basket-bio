import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { createMailjetSmtpTransport } from './mailer.provider';

@Module({
  controllers: [MailerController],
  providers: [{ provide: 'MAIL_TRANSPORT', useFactory: createMailjetSmtpTransport }, MailerService],
  exports: [MailerService],
})
export class MailModule {}
