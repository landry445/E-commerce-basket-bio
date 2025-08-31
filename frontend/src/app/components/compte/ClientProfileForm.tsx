"use client";

import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

type ApiMsg = { message?: string };

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function ClientProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // chargement du profil connecté
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`${API}/users/me`, {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
        });
        if (!res.ok) {
          const msg: ApiMsg = await res.json().catch(() => ({}));
          throw new Error(msg.message || `Erreur ${res.status}`);
        }
        const data: UserProfile = await res.json();
        if (mounted) setProfile(data);
      } catch (e) {
        if (mounted) setError((e as Error).message);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // champs contrôlés
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  // sync état initial quand profile arrive
  useEffect(() => {
    if (!profile) return;
    setFirstname(profile.firstname);
    setLastname(profile.lastname);
    setEmail(profile.email);
    setPhone(profile.phone);
  }, [profile]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/users/me`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ firstname, lastname, phone }),
      });
      if (!res.ok) {
        const msg: ApiMsg = await res.json().catch(() => ({}));
        throw new Error(msg.message || `Erreur ${res.status}`);
      }
      const updated: UserProfile = await res.json();
      setProfile(updated);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!profile ? (
        <p className="text-sm opacity-75">Chargement du profil…</p>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">Prénom</span>
              <input
                type="text"
                className="mt-1 w-full rounded-full border px-4 py-2"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                autoComplete="given-name"
              />
            </label>

            <label className="block">
              <span className="text-sm">Nom</span>
              <input
                type="text"
                className="mt-1 w-full rounded-full border px-4 py-2"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                autoComplete="family-name"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-sm">Email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-full border px-4 py-2 bg-gray-50"
              value={email}
              readOnly
              aria-readonly="true"
              autoComplete="email"
              title="Email non modifiable"
            />
          </label>

          <label className="block">
            <span className="text-sm">Téléphone</span>
            <input
              type="tel"
              className="mt-1 w-full rounded-full border px-4 py-2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="06XXXXXXXX"
            />
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[var(--color-green)] text-white text-sm shadow disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Enregistrement…" : "Enregistrer"}
            </button>

            <a href="/compte" className="text-sm underline">
              Retour au compte
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
