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
    setValue(next);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/me/newsletter`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
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
      setValue((prev) => !prev);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="pt-4">
      <h2 className="mb-1 text-base font-semibold text-[var(--color-dark)]">
        Newsletter des paniers
      </h2>

      <p className="text-xs text-gray-600">
        Description précise du panier du mardi et du panier du vendredi.
      </p>
      <p className="mb-3 text-[11px] text-gray-500">
        Deux e-mails par semaine au maximum, aucun autre contenu, aucune
        publicité.
      </p>

      <label className="flex items-start gap-2 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={value}
          disabled={loading}
          onChange={(event) => handleToggle(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 accent-[var(--color-primary)]"
        />
        <span>
          Recevoir par e-mail la composition des paniers du mardi et du
          vendredi.
        </span>
      </label>

      {successMsg && (
        <p className="mt-2 text-xs text-green-700">{successMsg}</p>
      )}
      {errorMsg && <p className="mt-2 text-xs text-red-600">{errorMsg}</p>}
    </section>
  );
}
