import { Module } from '@nestjs/common';
// import { DataSource } from 'typeorm';
import { MailerService } from './mailer.service';
import { createMailjetSmtpTransport } from './mailer.provider';

@Module({
  providers: [
    {
      provide: 'MAIL_TRANSPORT',
      useFactory: () => {
        return createMailjetSmtpTransport();
      },
    },
    MailerService,
  ],
  exports: [MailerService],
})
export class MailModule {}
