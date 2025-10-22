"use client";
import React from "react";

export default function VerificationOk(): React.ReactElement {
  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <h1 className="mb-3 text-2xl font-semibold">E-mail vérifié</h1>
      <p className="mb-6">
        Ton adresse e-mail est confirmée. Tu peux te connecter.
      </p>
      <a href="/login" className="inline-block rounded-md border px-4 py-2">
        Aller à la connexion
      </a>
    </main>
  );
}
