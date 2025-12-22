import { Inject, Injectable } from '@nestjs/common';
import type { Transporter } from 'nodemailer';
import { DataSource } from 'typeorm';
import { join } from 'path';

type AdminContactInput = {
  subject: string;
  message: string;
  userId: string;
};

type SignupTemplateParams = {
  firstname: string;
  verifyUrl: string;
  expiresHours: number;
};

type OrderEmailItem = { name: string; quantity: number; unitPriceCents: number };

type OrderEmailPayload = {
  firstname: string;
  pickupDateISO: string; // 'YYYY-MM-DD'
  pickupName: string;
  items: OrderEmailItem[];
  totalCents: number;
  customerNote?: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface NewsletterContent {
  subject: string;
  html: string;
}

@Injectable()
export class MailerService {
  constructor(
    @Inject('MAIL_TRANSPORT') private readonly transporter: Transporter,
    private readonly dataSource: DataSource
  ) {}

  private mailFrom(): string {
    return process.env.MAIL_FROM ?? 'Paniers Bio <gaecdesrainettes@lejardindesrainettes.fr>';
  }

  private mailReplyTo(): string {
    return process.env.MAIL_REPLY_TO ?? 'gaecdesrainettes@lejardindesrainettes.fr';
  }

  public orderConfirmationHTML(p: OrderEmailPayload): string {
    const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
    const note = (p.customerNote ?? '').trim();
    const noteBlock = note
      ? `<div style="margin-top:14px;padding:10px;background:#f8faf7;border:1px solid #eee;border-radius:8px">
       <div style="font-weight:600;margin-bottom:6px">Votre message</div>
       <div style="white-space:pre-wrap">${escapeHtml(note)}</div>
     </div>`
      : '';

    const rows = p.items
      .map((it) => {
        const line = it.unitPriceCents * it.quantity;
        return `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${it.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${eur.format(it.unitPriceCents / 100)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${it.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${eur.format(line / 100)}</td>
      </tr>`;
      })
      .join('');

    return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
    <h2 style="margin:0 0 6px 0">Confirmation de réservation</h2>
    <p style="margin:0 0 16px 0">Bonjour ${p.firstname || ''}, ta réservation est enregistrée.</p>
    <p style="margin:0 0 8px 0"><strong>Date de retrait :</strong> ${p.pickupDateISO}</p>
    <p style="margin:0 0 16px 0"><strong>Lieu de retrait :</strong> ${p.pickupName}</p>
    <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee">
      <thead>
        <tr style="background:#f8faf7">
          <th style="text-align:left;padding:8px;border-bottom:1px solid #eee">Panier</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #eee">Prix</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #eee">Qté</th>
          <th style="text-align:right;padding:8px;border-bottom:1px solid #eee">Total</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:10px;text-align:right"><strong>Total à régler sur place</strong></td>
          <td style="padding:10px;text-align:right"><strong>${eur.format(p.totalCents / 100)}</strong></td>
        </tr>
      </tfoot>
    </table>
     ${noteBlock}
    <p style="font-size:13px;color:#555;margin-top:16px">
      Paiement sur place. En cas d’empêchement, merci de nous informer par email ou par téléphone.
    </p>
  </div>`;
  }

  public async send(opts: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<void> {
    const from = process.env.MAIL_FROM ?? 'Paniers Bio <gaecdesrainettes@lejardindesrainettes.fr>';

    const replyTo = process.env.MAIL_REPLY_TO ?? 'gaecdesrainettes@lejardindesrainettes.fr';

    try {
      await this.transporter.sendMail({
        from,
        replyTo,
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        text: opts.text ?? '',
      });

      console.log(`[mail] sent to=${opts.to} subject="${opts.subject}"`);
    } catch (e) {
      console.error(`[mail] send failed to=${opts.to} subject="${opts.subject}"`, e);
      throw e;
    }
  }

  async sendHtml(to: string, subject: string, html: string): Promise<void> {
    await this.send({ to, subject, html });
  }

  signupConfirmationHTML(p: SignupTemplateParams): string {
    return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4;">
    <h2 style="margin:0 0 12px 0;">Validation de ton e-mail</h2>
    <p>Bonjour ${p.firstname || 'client'},</p>
    <p>Ton compte a été créé. Pour l’activer, ouvre le lien ci-dessous&nbsp;:</p>
    <p><a href="${p.verifyUrl}">${p.verifyUrl}</a></p>
    <p>Ce lien reste valide ${p.expiresHours} heures.</p>
    <p style="margin-top:12px;">À très vite.</p>
  </div>`;
  }

  public async sendAdminContact(input: AdminContactInput): Promise<void> {
    const to = process.env.ADMIN_EMAIL!;
    const safe = (s?: string) => (s ?? '').toString().trim();

    const row = await this.dataSource.query(
      `SELECT email, firstname, lastname
         FROM users
        WHERE id = $1
        LIMIT 1`,
      [input.userId]
    );

    const email: string | undefined = row?.[0]?.email ?? undefined;
    const firstname: string | undefined = row?.[0]?.firstname ?? undefined;
    const lastname: string | undefined = row?.[0]?.lastname ?? undefined;
    const fullName = [firstname, lastname].filter(Boolean).join(' ').trim() || undefined;

    const subject =
      safe(input.subject) || `Message client — ${fullName ?? email ?? 'compte connecté'}`;

    const header =
      `<p style="margin:0 0 8px 0">` +
      `<strong>De&nbsp;:</strong> ${fullName ? fullName : 'Client'}` +
      `${email ? ` &lt;${email}&gt;` : ''}` +
      `</p>`;

    const html =
      `<div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">` +
      `<h3 style="margin:0 0 10px 0">Message client</h3>` +
      header +
      `<div style="white-space:pre-wrap">${safe(input.message)}</div>` +
      `</div>`;

    const textLines = [
      `De: ${fullName ?? 'Client'}${email ? ` <${email}>` : ''}`,
      '',
      safe(input.message),
    ];

    await this.send({
      to,
      subject,
      html,
      text: textLines.join('\n'),
    });
  }

  private newsletterAttachments(): { filename: string; path: string; cid: string }[] {
    const baseDir = join(process.cwd(), 'assets', 'newsletter');

    return [
      {
        filename: 'logo-jardins-des-rainettes.jpeg',
        path: join(baseDir, 'logo-jardins-des-rainettes.jpeg'),
        cid: 'logo-jardins-des-rainettes',
      },
      {
        filename: 'logo-ab-eurofeuille.webp',
        path: join(baseDir, 'logo-ab-eurofeuille.webp'),
        cid: 'logo-ab-europ-fr',
      },
    ];
  }

  async sendNewsletterToMany(recipients: string[], content: NewsletterContent): Promise<void> {
    if (recipients.length === 0) return;

    const attachments = this.newsletterAttachments();

    const unsubscribeEmail = process.env.NEWSLETTER_UNSUBSCRIBE_EMAIL ?? this.mailReplyTo();

    const headers = {
      'List-Unsubscribe': `<mailto:${unsubscribeEmail}>`,
    };

    for (const email of recipients) {
      await this.transporter.sendMail({
        from: this.mailFrom(),
        replyTo: this.mailReplyTo(),
        to: email,
        subject: content.subject,
        html: content.html,
        text: content.html
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
        attachments,
        headers,
      });
    }
  }
}
