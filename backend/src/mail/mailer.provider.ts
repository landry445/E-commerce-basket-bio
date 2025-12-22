import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

function env(k: string): string {
  const v = process.env[k];
  if (!v) throw new Error(`Missing env: ${k}`);
  return v;
}

function envInt(k: string, fallback: number): number {
  const raw = process.env[k];
  if (!raw) return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) throw new Error(`Invalid number env: ${k}`);
  return n;
}

export function createMailjetSmtpTransport(): Transporter {
  const host = process.env.SMTP_HOST ?? 'in-v3.mailjet.com';
  const port = envInt('SMTP_PORT', 587);

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // STARTTLS sur 587
    auth: {
      user: env('SMTP_USERNAME'), // Mailjet API Key
      pass: env('SMTP_PASSWORD'), // Mailjet Secret Key
    },
  });
}
