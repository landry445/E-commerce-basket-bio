import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

function env(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
}

export function createGmailAppPasswordTransport(): Transporter {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: env('SMTP_USERNAME'),
      pass: env('SMTP_PASSWORD'),
    },
  });
}
