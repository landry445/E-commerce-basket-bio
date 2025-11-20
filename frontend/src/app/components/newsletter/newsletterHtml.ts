import {
  BasketItemForm,
  NewsletterFormData,
  NewsletterRenderMode,
} from "./newsletterTypes";

/* Couleurs proches de ton site */
const BACKGROUND = "#F8F7F0"; // fond beige
const FOREGROUND = "#171717"; // texte principal

/* Chemins publics pour la prévisualisation */
const DEFAULT_FROG_PATH = "/logo-jardins-des-rainettes.jpeg";
const DEFAULT_AB_PATH = "/logo-ab-europ-fr.png";

/* Permet une éventuelle surcharge par variables d’environnement */
const FROG_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_FROG_URL ?? DEFAULT_FROG_PATH;
const AB_URL = process.env.NEXT_PUBLIC_NEWSLETTER_AB_URL ?? DEFAULT_AB_PATH;

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

/**
 * Construit le tableau d’un panier pour le mail.
 * `priceEuro` provient du formulaire (10, 15, 12, etc.).
 */
function buildBasketTable(priceEuro: string, items: BasketItemForm[]): string {
  const normalizedPrice = priceEuro.toString().trim() || "10";
  const title = `PANIER À ${normalizedPrice} €`;

  const rows = items
    .filter((item) => item.label.trim() && item.price.trim())
    .map(
      (item) =>
        `<tr>
          <td style="padding:2px 4px 2px 0;">- ${item.label}</td>
          <td style="padding:2px 0 2px 4px; text-align:right;">${item.price}€</td>
        </tr>`
    )
    .join("");

  if (!rows) return "";

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse; margin-bottom:12px;">
  <tr>
    <td colspan="2" style="padding:0 0 6px 0; text-align:center; font-weight:600; text-decoration:underline;">
      ${title}
    </td>
  </tr>
  ${rows}
</table>`;
}

/**
 * Corps de la newsletter.
 * mode = "preview" → images chargées depuis /public
 * mode = "email"   → images référencées par CID
 */
export function buildNewsletterBody(
  data: Omit<NewsletterFormData, "subject">,
  mode: NewsletterRenderMode
): string {
  const dateTitle = formatDateTitle(data.pickupDateISO);

  // Valeurs par défaut si jamais les champs arrivent vides
  const basket10Price =
    (data.basket10PriceEuro ?? "10").toString().trim() || "10";
  const basket15Price =
    (data.basket15PriceEuro ?? "15").toString().trim() || "15";

  const left = buildBasketTable(basket10Price, data.basket10Items);
  const right = buildBasketTable(basket15Price, data.basket15Items);

  const frogSrc =
    mode === "email" ? "cid:logo-jardins-des-rainettes" : FROG_URL;
  const abSrc = mode === "email" ? "cid:logo-ab-europ-fr" : AB_URL;

  // images plus contenues
  const frogImg = `<img src="${frogSrc}" alt="Jardin des Rainettes"
    style="display:block; max-width:140px; height:auto;" />`;
  const abImg = `<img src="${abSrc}" alt="Agriculture biologique"
    style="display:block; max-width:150px; height:auto; margin-left:auto;" />`;

  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"
  style="border-collapse:collapse; background-color:${BACKGROUND}; padding:20px 0;">
   <td style="padding:10px 52px 28px 52px;
                     font-size:13px; line-height:1.5; text-align:left;">
            <p style="margin:0 0 6px 0;">
      Bonjour,
    </p>
    <p style="margin:0 0 6px 0;">
      Voici la composition des paniers pour le ${
        dateTitle
          ? `<strong>${dateTitle.toLowerCase()}</strong>`
          : "la prochaine distribution"
      }.
    </p>
    <p style= "margin:0 0 6px 0;">
      Retrait dans le hall de la gare de Savenay, de 16h30 à 19h.
    </p>
    <p style="margin:0 0 6px 0;">
      Règlement sur place.
    </p>
          </td>
  <tr>
    <td align="center">
      <!-- Carte centrale -->
      <table role="presentation" width="800" cellpadding="0" cellspacing="0"
        style="border-collapse:collapse; background-color:#ffffff;
               padding:40px 40px 36px 40px;
               font-family:Nunito, Arial, Helvetica, sans-serif;
               color:${FOREGROUND};">

        <!-- Titre date -->
        <tr>
          <td style="text-align:center; padding:30px 0 32px 0;
                     font-size:20px; font-weight:700; letter-spacing:1px;">
            ${dateTitle || ""}
          </td>
        </tr>

        <!-- Deux colonnes paniers -->
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

        <!-- Bas de page : grenouille + texte + AB -->
        <tr>
          <td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
              style="border-collapse:collapse;">
              <tr style="height:280px;" valign="bottom">
                <!-- Grenouille, décollée du bord gauche -->
                <td width="50%" valign="bottom"
                  style="padding:0 24px 12px 56px; text-align:left;">
                  ${frogImg}
                </td>

                <!-- Texte + logo AB, décollés du bord droit -->
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
    },
    mode
  );

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${data.subject}</title>
</head>
<body style="margin:0; padding:0; background-color:${BACKGROUND};">
${body}
</body>
</html>`;
}
