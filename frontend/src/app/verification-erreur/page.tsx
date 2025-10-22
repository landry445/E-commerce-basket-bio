"use client";

import React, { useState } from "react";

export default function VerificationErreur(): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  async function resend(): Promise<void> {
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }

  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <h1 className="mb-3 text-2xl font-semibold">Lien invalide ou expiré</h1>
      <p className="mb-6">Un nouveau lien peut être envoyé.</p>

      {sent ? (
        <p>
          Si un compte correspond à cet e-mail, un nouveau lien vient d’être
          envoyé.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void resend();
          }}
          className="space-y-3"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ton.email@exemple.com"
            className="w-full rounded-md border px-3 py-2"
          />
          <button type="submit" className="w-full rounded-md border px-4 py-2">
            Recevoir un nouveau lien
          </button>
        </form>
      )}
    </main>
  );
}
