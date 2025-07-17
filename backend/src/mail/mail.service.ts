import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger('MailService');

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true pour SSL (465), false pour TLS (587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    };
    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email envoyé à ${to} : ${info.messageId}`);
      return info;
    } catch (error) {
      this.logger.error(`Erreur d'envoi mail : ${error.message}`);
      throw error;
    }
  }
}
