import { Inject, Injectable } from '@nestjs/common';
import type { Transporter } from 'nodemailer';

type MailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type OrderItem = { name: string; quantity: number; unitPriceCents: number };

type OrderTemplateParams = {
  firstname: string;
  pickupDateISO: string; // "2025-10-24"
  pickupName: string;
  items: ReadonlyArray<OrderItem>;
  totalCents: number;
};

function eur(cents: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

@Injectable()
export class MailerService {
  constructor(@Inject('MAIL_TRANSPORT') private readonly transport: Transporter) {}

  async send(input: MailInput): Promise<void> {
    await this.transport.sendMail({
      from: process.env.MAIL_FROM as string,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
  }

  orderConfirmationHTML(p: OrderTemplateParams): string {
    const rows = p.items
      .map(
        (it) =>
          `<tr>
            <td style="padding:6px 8px;border:1px solid #ddd;">${it.name}</td>
            <td style="padding:6px 8px;border:1px solid #ddd;text-align:center;">${it.quantity}</td>
            <td style="padding:6px 8px;border:1px solid #ddd;text-align:right;">${eur(it.unitPriceCents)}</td>
          </tr>`
      )
      .join('');

    return `
  <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.4;">
    <h2 style="margin:0 0 12px 0;">Confirmation de réservation</h2>
    <p>Bonjour ${p.firstname},</p>
    <p>Retrait le <strong>${p.pickupDateISO}</strong> — lieu : <strong>${p.pickupName}</strong>.</p>
    <table style="border-collapse:collapse;width:100%;max-width:520px;">
      <thead>
        <tr>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:left;">Panier</th>
          <th style="padding:6px 8px;border:1px solid #ddd;">Qté</th>
          <th style="padding:6px 8px;border:1px solid #ddd;text-align:right;">Prix</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding:6px 8px;border:1px solid #ddd;text-align:right;"><strong>Total</strong></td>
          <td style="padding:6px 8px;border:1px solid #ddd;text-align:right;"><strong>${eur(p.totalCents)}</strong></td>
        </tr>
      </tfoot>
    </table>
    <p style="margin-top:12px;">Merci pour votre réservation.</p>
  </div>`;
  }
}
