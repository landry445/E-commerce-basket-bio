"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";

type UserMe = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
};

type ClientOrderCompact = {
  id: string;
  pickupDate: string; // YYYY-MM-DD
  totalQty: number;
  items: string; // "2×Panier S, 1×Panier M"
};

type UserUpdateInput = {
  firstname: string;
  lastname: string;
  phone: string;
};

const API_BASE: string =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";


export default function AccountPage() {
  const router = useRouter();

  // --- État principal
  const [me, setMe] = useState<UserMe | null>(null);
  const [form, setForm] = useState<UserUpdateInput>({
    firstname: "",
    lastname: "",
    phone: "",
  });
  const [saving, setSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState<boolean>(false);
  const [orders, setOrders] = useState<ClientOrderCompact[] | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // --- Chargement des données utilisateur et commandes
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [uRes, oRes] = await Promise.all([
          fetch(`${API_BASE}/users/me`, { credentials: "include" }),
          fetch(`${API_BASE}/reservations/me/compact?limit=5`, {
            credentials: "include",
          }),
        ]);

        if (uRes.status === 401) {
          router.replace("/login");
          return;
        }

        const user = uRes.ok ? ((await uRes.json()) as UserMe) : null;
        const rawOrders = oRes.ok
          ? ((await oRes.json()) as {
              id: string;
              pickupDate: string;
              basketName: string;
              totalQty: number;
            }[])
          : [];
        const orders: ClientOrderCompact[] = rawOrders.map((o) => ({
          id: o.id,
          pickupDate: o.pickupDate,
          totalQty: o.totalQty,
          items: o.basketName || "-",
        }));

        if (!cancelled) {
          if (user) {
            setMe(user);
            setForm({
              firstname: user.firstname ?? "",
              lastname: user.lastname ?? "",
              phone: user.phone ?? "",
            });
          }

          orders.sort((a, b) => (a.pickupDate < b.pickupDate ? 1 : -1));
          setOrders(orders);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // --- Validation simple téléphone (ex: 10 chiffres FR, souple)
  const phoneError = useMemo(() => {
    const p = form.phone.trim();
    if (!p) return null;
    const digits = p.replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 15) return "Numéro invalide";
    return null;
  }, [form.phone]);

  // --- Soumission du formulaire (PATCH /users/me)
  async function onSaveProfile() {
    setSaving(true);
    setSaveOk(false);
    setSaveError(null);

    try {
      if (phoneError) {
        setSaveError(phoneError);
        return;
      }

      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
          phone: form.phone.trim(),
        } as UserUpdateInput),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      if (!res.ok) {
        const msg = await safeMessage(res);
        setSaveError(msg ?? "Échec de la mise à jour");
        return;
      }

      const updated = (await res.json()) as UserMe;
      setMe(updated);
      setForm({
        firstname: updated.firstname,
        lastname: updated.lastname,
        phone: updated.phone ?? "",
      });
      setSaveOk(true);
    } catch {
      setSaveError("Erreur inattendue");
    } finally {
      setSaving(false);
      // efface le flag de succès après 2 s
      setTimeout(() => setSaveOk(false), 2000);
    }
  }

  // --- Formatage date
  function fmtDateYMD(ymd: string): string {
    // ymd attendu: "YYYY-MM-DD"
    const d = new Date(`${ymd}T00:00:00Z`);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] font-sans min-h-screen">
        <section className="container mx-auto px-4 py-8 max-w-5xl">
          <h1
            className="text-3xl md:text-4xl mb-6"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Mon compte
          </h1>

          {/* Chargement */}
          {loading && (
            <div className="animate-pulse space-y-4">
              <div className="h-28 bg-white rounded-2xl shadow" />
              <div className="h-52 bg-white rounded-2xl shadow" />
            </div>
          )}

          {/* Bloc profil */}
          {!loading && me && (
            <div className="bg-white rounded-2xl shadow p-5 mb-8">
              <h2
                className="text-xl mb-4"
                style={{ fontFamily: "var(--font-pacifico)" }}
              >
                Mes informations
              </h2>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <Field
                  label="Prénom"
                  value={form.firstname}
                  onChange={(v) => setForm((s) => ({ ...s, firstname: v }))}
                />
                <Field
                  label="Nom"
                  value={form.lastname}
                  onChange={(v) => setForm((s) => ({ ...s, lastname: v }))}
                />
                <Field
                  label="Téléphone"
                  value={form.phone}
                  onChange={(v) => setForm((s) => ({ ...s, phone: v }))}
                  error={phoneError ?? undefined}
                />
                <ReadOnlyField label="Email" value={me.email} />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onSaveProfile}
                  disabled={saving || !!phoneError}
                  className={[
                    "px-4 py-2 rounded-lg border shadow-sm",
                    saving || phoneError
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-black text-white",
                  ].join(" ")}
                >
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </button>

                {saveOk && (
                  <span className="text-green-700 text-sm">
                    Modifications enregistrées
                  </span>
                )}
                {saveError && (
                  <span className="text-red-600 text-sm">{saveError}</span>
                )}
              </div>
            </div>
          )}

          {/* Bloc commandes compactes */}
          {!loading && (
            <div className="bg-white rounded-2xl shadow p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2
                  className="text-xl"
                  style={{ fontFamily: "var(--font-pacifico)" }}
                >
                  Mes commandes
                </h2>
              </div>

              {(!orders || orders.length === 0) && (
                <p className="text-sm text-gray-600">Aucune commande.</p>
              )}

              {orders && orders.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Paniers</th>
                        <th className="py-2 pr-4">Quantité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b last:border-0">
                          <td className="py-3 pr-4">
                            {fmtDateYMD(o.pickupDate)}
                          </td>
                          <td className="py-3 pr-4">{o.items || "-"}</td>
                          <td className="py-3 pr-4">{o.totalQty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 mb-1">{label}</label>
      <input
        className={[
          "rounded-lg border px-3 py-2",
          error ? "border-red-400" : "border-gray-300",
        ].join(" ")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <label className="text-gray-500 mb-1">{label}</label>
      <input
        className="rounded-lg border px-3 py-2 bg-gray-50 text-gray-600 border-gray-200"
        value={value}
        readOnly
      />
    </div>
  );
}

async function safeMessage(res: Response): Promise<string | null> {
  try {
    const ct = res.headers.get("content-type") ?? "";
    if (!ct.includes("application/json")) return null;
    const data = (await res.json()) as unknown;
    if (
      data &&
      typeof data === "object" &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
    return null;
  } catch {
    return null;
  }
}