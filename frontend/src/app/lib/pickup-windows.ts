export type PickupWindow =
  | { kind: "tuesday"; pickupDow: 2 } // mardi = 2 (0=dimanche)
  | { kind: "friday"; pickupDow: 5 }; // vendredi = 5

function toParis(d: Date): Date {
  // Sécurise le calcul en timezone locale (France) sans lib externe.
  return new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  );
}

function nextDow(base: Date, dow: number): Date {
  const d = new Date(base);
  const delta = (dow - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + delta);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isBetween(
  now: Date,
  openDow: number,
  openHour: number,
  closeDow: number,
  closeHour: number
): boolean {
  // Fenêtre pouvant traverser le week-end : on calcule les bornes relatives à la semaine courante.
  const d = toParis(now);
  const open = new Date(d);
  const close = new Date(d);

  // Positionne ouverture
  const diffOpen = (openDow - d.getDay() + 7) % 7;
  open.setDate(d.getDate() + diffOpen);
  open.setHours(openHour, 0, 0, 0);

  // Positionne fermeture
  const diffClose = (closeDow - d.getDay() + 7) % 7;
  close.setDate(d.getDate() + diffClose);
  close.setHours(closeHour, 0, 0, 0);

  // Si la fermeture “repasse” avant l’ouverture, on considère la fermeture sur la semaine suivante
  if (close <= open) {
    close.setDate(close.getDate() + 7);
  }

  return d >= open && d < close;
}

/**
 * Règles métier :
 * - Mardi réservable du vendredi 18:00 au lundi 18:00
 * - Vendredi réservable du lundi 18:00 au vendredi 18:00
 * Retourne la date ISO du prochain retrait autorisé ou null.
 */
export function computeAllowedDate(
  nowInput: Date,
  window: PickupWindow
): string | null {
  const now = toParis(nowInput);

  if (window.kind === "tuesday") {
    const ok = isBetween(now, /*open*/ 5, 18, /*close*/ 1, 18);
    if (!ok) return null;
    const dt = nextDow(now, 2); // prochain mardi
    return dt.toISOString().slice(0, 10);
  }
  // friday
  const ok = isBetween(now, /*open*/ 1, 18, /*close*/ 5, 18);
  if (!ok) return null;
  const dt = nextDow(now, 5); // prochain vendredi
  return dt.toISOString().slice(0, 10);
}
