"use client";

import { useState } from "react";

type NewsletterBoxProps = {
  initialNewsletterOptIn: boolean;
};

type UpdateResponse = {
  newsletterOptIn: boolean;
};

export function NewsletterBox(props: NewsletterBoxProps) {
  const [value, setValue] = useState<boolean>(props.initialNewsletterOptIn);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  async function handleToggle(next: boolean) {
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    // on met à jour l’UI tout de suite
    setValue(next);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/newsletter`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newsletterOptIn: next }),
        }
      );

      if (!response.ok) {
        throw new Error("HTTP error");
      }

      const data: UpdateResponse = await response.json();
      setValue(data.newsletterOptIn);
      setSuccessMsg("Préférence enregistrée.");
    } catch {
      setErrorMsg("Mise à jour impossible pour le moment.");
      // retour à l’ancienne valeur en cas d’erreur
      setValue((prev) => !prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="pt-4">
      <h2 className="mb-2 text-base font-semibold text-[var(--color-dark)]">
        Newsletter
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Informations ponctuelles sur les paniers, les dates de réservation et la
        vie du jardin.
      </p>

      <label className="flex items-center gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={value}
          disabled={loading}
          onChange={(event) => handleToggle(event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-[var(--color-primary)]"
        />
        <span>Recevoir la newsletter par e-mail</span>
      </label>

      {successMsg && (
        <p className="mt-2 text-xs text-green-700">{successMsg}</p>
      )}
      {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
    </section>
  );
}
