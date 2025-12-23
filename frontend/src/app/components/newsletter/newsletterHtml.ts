import {
  BasketItemForm,
  NewsletterFormData,
  NewsletterRenderMode,
} from "./newsletterTypes";

const BACKGROUND = "#F8F7F0";
const FOREGROUND = "#171717";

const DEFAULT_FROG_PATH = "/logo-jardins-des-rainettes.jpeg";
const DEFAULT_AB_PATH = "/logo-ab-eurofeuille.webp";

const FROG_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_FROG_URL ?? DEFAULT_FROG_PATH;
const AB_URL = process.env.NEXT_PUBLIC_NEWSLETTER_AB_URL ?? DEFAULT_AB_PATH;

const ACCOUNT_URL = "https://www.lejardindesrainettes.fr/mon-compte";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatDateTitle(pickupDateISO: string): string {
  if (!pickupDateISO) return "";
  const date = new Date(`${pickupDateISO}T00:00:00`);
  const formatted = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return formatted.toUpperCase();
}

function buildBasketTable(priceEuro: string, items: BasketItemForm[]): string {
  const normalizedPrice = priceEuro.toString().trim() || "10";
  const title = `PANIER À ${normalizedPrice} €`;

  const rows = items
    .filter((item) => item.label.trim() && item.price.trim())
    .map(
      (item) =>
        `<tr>
          <td style="padding:2px 4px 2px 0;">- ${escapeHtml(item.label)}</td>
          <td style="padding:2px 0 2px 4px; text-align:right;">${escapeHtml(
            item.price
          )}€</td>
        </tr>`
    )
    .join("");

  if (!rows) return "";

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:12px;">
  <tr>
    <td colspan="2" style="padding:0 0 6px 0; text-align:center; font-weight:600; text-decoration:underline;">
      ${escapeHtml(title)}
    </td>
  </tr>
  ${rows}
</table>`;
}

export function buildNewsletterBody(
  data: Omit<NewsletterFormData, "subject">,
  mode: NewsletterRenderMode
): string {
  const dateTitle = formatDateTitle(data.pickupDateISO);

  const basket10Price =
    (data.basket10PriceEuro ?? "10").toString().trim() || "10";
  const basket15Price =
    (data.basket15PriceEuro ?? "15").toString().trim() || "15";

  const left = buildBasketTable(basket10Price, data.basket10Items);
  const right = buildBasketTable(basket15Price, data.basket15Items);

  const frogSrc =
    mode === "email" ? "cid:logo-jardins-des-rainettes" : FROG_URL;
  const abSrc = mode === "email" ? "cid:logo-ab-europ-fr" : AB_URL;

  const frogImg = `<img src="${frogSrc}" alt="Jardin des Rainettes"
    style="display:block; max-width:140px; height:auto;" />`;
  const abImg = `<img src="${abSrc}" alt="Agriculture biologique"
    style="display:block; max-width:150px; height:auto; margin-left:auto;" />`;

  const rawComplement = (data.complement ?? "").toString().trim();
  const complementBlock = rawComplement
    ? `<div style="margin-top:10px;padding:8px 10px;border-radius:8px;
                   border-left:4px solid #5B8C51;background-color:#f8faf7;
                   font-size:13px;line-height:1.4;">
         <div style="font-weight:600;margin-bottom:4px;">
           Message complémentaire
         </div>
         <div style="white-space:pre-wrap;">
           ${escapeHtml(rawComplement)}
         </div>
       </div>`
    : "";

  const footerUnsubscribe = `
    <div style="margin-top:14px;font-size:12px;line-height:1.4;color:#444;text-align:left;">
      <div style="margin-bottom:6px;">Tu reçois cet email car tu es inscrit à la newsletter.</div>
      <div>
        Gérer l’abonnement : <a href="${ACCOUNT_URL}" style="color:#5B8C51;">Mon compte</a>
      </div>
    </div>
  `;

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="border-collapse:collapse; background-color:${BACKGROUND}; padding:20px 0;">
  <tr>
    <td style="padding:10px 52px 28px 52px;
               font-size:13px; line-height:1.5; text-align:left;">
      <p style="margin:0 0 6px 0;">
        Bonjour,
      </p>
      <p style="margin:0 0 6px 0;">
        Voici la composition des paniers pour le ${
          dateTitle
            ? `<strong>${escapeHtml(dateTitle.toLowerCase())}</strong>`
            : "la prochaine distribution"
        }.
      </p>
      <p style="margin:0 0 6px 0;">
        Retrait dans le hall de la gare de Savenay, de 16h30 à 19h.
      </p>
      <p style="margin:0 0 6px 0;">
        Règlement sur place.
      </p>
      <div style="margin:16px 0 8px 0; text-align:center;">
        <a
          href="https://www.lejardindesrainettes.fr/reserver"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display:inline-block;
            padding:10px 18px;
            background-color:#5B8C51;
            color:#ffffff;
            text-decoration:none;
            font-size:14px;
            font-weight:600;
            border-radius:999px;
          "
        >
          Réservez ici !
        </a>
      </div>
      ${complementBlock}
      ${footerUnsubscribe}
    </td>
  </tr>
  <tr>
    <td align="center">
      <table role="presentation" width="800" cellpadding="0" cellspacing="0"
        style="border-collapse:collapse; background-color:#ffffff;
               padding:40px 40px 36px 40px;
               font-family:Nunito, Arial, Helvetica, sans-serif;
               color:${FOREGROUND};">

        <tr>
          <td style="text-align:center; padding:30px 0 32px 0;
                     font-size:20px; font-weight:700; letter-spacing:1px;">
            ${escapeHtml(dateTitle || "")}
          </td>
        </tr>

        <tr>
          <td style="padding-bottom:48px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="border-collapse:collapse;">
              <tr>
                <td width="50%" valign="top" style="padding-left:30px;padding-right:30px;">
                  ${left}
                </td>
                <td width="50%" valign="top" style="padding-right:30px;padding-left:30px;">
                  ${right}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="border-collapse:collapse;">
              <tr style="height:280px;" valign="bottom">
                <td width="50%" valign="bottom"
                  style="padding:0 24px 12px 56px; text-align:left;">
                  ${frogImg}
                </td>

                <td width="50%" valign="bottom"
                  style="padding:0 56px 12px 24px;
                         text-align:right; font-size:13px; line-height:1.4;">
                  GAEC du Jardin des Rainettes<br/>
                  07 88 27 94 07<br/>
                  Présente dans le hall de la gare de Savenay<br/>
                  De 16h30 à 19h<br/><br/>
                  ${abImg}
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>`;
}

export function buildNewsletterPlainText(data: NewsletterFormData): string {
  const dateTitle = formatDateTitle(data.pickupDateISO);
  const whenLine = dateTitle
    ? `Composition pour le ${dateTitle.toLowerCase()}`
    : "Composition pour la prochaine distribution";

  const basket10Price =
    (data.basket10PriceEuro ?? "10").toString().trim() || "10";
  const basket15Price =
    (data.basket15PriceEuro ?? "15").toString().trim() || "15";

  const lines: string[] = [];
  lines.push("Bonjour,", "");
  lines.push("GAEC du Jardin des Rainettes", whenLine, "");
  lines.push("Retrait dans le hall de la gare de Savenay, de 16h30 à 19h.");
  lines.push("Règlement sur place.", "");

  const pushBasket = (title: string, items: BasketItemForm[]) => {
    const cleaned = items
      .filter((it) => it.label.trim() && it.price.trim())
      .map((it) => `- ${it.label.trim()} (${it.price.trim()}€)`);
    if (cleaned.length === 0) return;
    lines.push(title);
    lines.push(...cleaned);
    lines.push("");
  };

  pushBasket(`PANIER À ${basket10Price} €`, data.basket10Items);
  pushBasket(`PANIER À ${basket15Price} €`, data.basket15Items);

  const complement = (data.complement ?? "").toString().trim();
  if (complement) {
    lines.push("Message complémentaire :", complement, "");
  }

  lines.push("Réserver : https://www.lejardindesrainettes.fr/reserver", "");
  lines.push(`Gérer l’abonnement : ${ACCOUNT_URL}`, "");
  lines.push(
    "GAEC du Jardin des Rainettes",
    "https://www.lejardindesrainettes.fr"
  );

  return lines.join("\n");
}

export function buildNewsletterHtmlDoc(
  data: NewsletterFormData,
  mode: NewsletterRenderMode = "email"
): string {
  const body = buildNewsletterBody(
    {
      pickupDateISO: data.pickupDateISO,
      basket10Items: data.basket10Items,
      basket15Items: data.basket15Items,
      basket10PriceEuro: data.basket10PriceEuro,
      basket15PriceEuro: data.basket15PriceEuro,
      complement: data.complement ?? "",
    },
    mode
  );

  const preheader = (() => {
    const dateTitle = formatDateTitle(data.pickupDateISO);
    const when = dateTitle
      ? `Composition pour le ${dateTitle.toLowerCase()}`
      : "Composition pour la prochaine distribution";
    return `${when} — Retrait gare de Savenay 16h30–19h. Réservation en ligne.`;
  })();

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(data.subject)}</title>
</head>
<body style="margin:0; padding:0; background-color:${BACKGROUND};">
  <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
    ${escapeHtml(preheader)}
  </div>
${body}
</body>
</html>`;
}
