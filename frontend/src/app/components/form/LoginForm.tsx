"use client";

type Props = {
  onSubmit: (values: { email: string; password: string }) => void;
  error?: string;
};

import { useState } from "react";

export default function LoginForm({ onSubmit, error }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ email, password });
  }

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-xs mx-auto"
      onSubmit={handleSubmit}
    >
      <input
        className="rounded border px-4 py-2 bg-white"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="rounded border px-4 py-2 bg-white"
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <span className="text-red-600 text-sm">{error}</span>}
      <button
        type="submit"
        className="self-end px-4 py-2 cursor-pointer rounded bg-primary text-white hover:brightness-90"
      >
        Connexion
      </button>
    </form>
  );
}
