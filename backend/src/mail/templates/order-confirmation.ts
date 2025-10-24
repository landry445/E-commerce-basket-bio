type Line = { name: string; unit: number; qty: number; total: number };
type Payload = {
  firstname: string;
  email: string;
  pickupDate: string; // YYYY-MM-DD
  pickupName: string;
  lines: Line[];
  grandTotal: number;
};

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

export function orderConfirmationHtml(p: Payload): string {
  const rows = p.lines
    .map(
      (l) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee">${l.name}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${eur.format(l.unit)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${l.qty}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${eur.format(l.total)}</td>
      </tr>`
    )
    .join('');

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
    <h2 style="font-family:'Pacifico',cursive;margin:0 0 6px 0">Confirmation de réservation</h2>
    <p style="margin:0 0 16px 0">Bonjour ${p.firstname || ''}, ta réservation est enregistrée.</p>

    <p style="margin:0 0 8px 0"><strong>Date de retrait :</strong> ${p.pickupDate}</p>
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
          <td style="padding:10px;text-align:right"><strong>${eur.format(p.grandTotal)}</strong></td>
        </tr>
      </tfoot>
    </table>

    <p style="font-size:13px;color:#555;margin-top:16px">
      Paiement sur place uniquement. En cas d’empêchement, prévenir par retour d’e-mail.
    </p>
  </div>`;
}
