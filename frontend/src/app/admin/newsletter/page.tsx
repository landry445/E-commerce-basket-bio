"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar/Navbar";
import Footer from "@/app/components/Footer";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

type Subscriber = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
};

type SendResult = {
  sent: number;
};

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

  const [subject, setSubject] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendOk, setSendOk] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSubs() {
      setLoadingSubs(true);
      try {
        const res = await fetch(`${API_BASE}/admin/newsletter/subscribers`, {
          credentials: "include",
        });
        if (!res.ok) {
          if (!cancelled) setSubscribers([]);
          return;
        }
        const data = (await res.json()) as Subscriber[];
        if (!cancelled) setSubscribers(data);
      } finally {
        if (!cancelled) setLoadingSubs(false);
      }
    }

    void loadSubs();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSend() {
    setSending(true);
    setSendError(null);
    setSendOk(null);

    try {
      const res = await fetch(`${API_BASE}/admin/newsletter/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ subject, html }),
      });

      if (!res.ok) {
        setSendError("Erreur lors de l’envoi.");
        return;
      }

      const data = (await res.json()) as SendResult;
      if (data.sent === 0) {
        setSendError("Aucun abonné ou contenu manquant.");
        return;
      }

      setSendOk(`Newsletter envoyée à ${data.sent} abonné(s).`);
    } catch {
      setSendError("Erreur réseau.");
    } finally {
      setSending(false);
    }
  }

  const total = subscribers.length;

  return (
    <>
      <Navbar />
      <main className="bg-[var(--background)] text-[var(--foreground)] min-h-screen">
        <section className="container mx-auto max-w-5xl px-4 py-8">
          <h1
            className="text-3xl md:text-4xl mb-6 mt-3"
            style={{ fontFamily: "var(--font-pacifico)" }}
          >
            Newsletter
          </h1>

          {/* Carte info abonnés */}
          <div className="mb-6 rounded-2xl bg-white p-5 shadow border border-gray-200">
            <h2
              className="text-xl mb-2"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              Abonnés
            </h2>
            {loadingSubs && (
              <p className="text-sm text-gray-600">Chargement…</p>
            )}
            {!loadingSubs && total === 0 && (
              <p className="text-sm text-gray-600">
                Aucun abonné à la newsletter pour le moment.
              </p>
            )}
            {!loadingSubs && total > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-800">
                  {total} abonné(s) à la newsletter.
                </p>
                <div className="max-h-40 overflow-y-auto rounded border border-gray-100">
                  <ul className="divide-y divide-gray-100 text-sm">
                    {subscribers.map((s) => (
                      <li key={s.id} className="px-3 py-2 flex justify-between">
                        <span>
                          {s.firstname} {s.lastname}
                        </span>
                        <span className="text-gray-600">{s.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Carte rédaction newsletter */}
          <div className="rounded-2xl bg-white p-5 shadow border border-gray-200">
            <h2
              className="text-xl mb-4"
              style={{ fontFamily: "var(--font-pacifico)" }}
            >
              Rédiger une newsletter
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sujet
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder="Exemple : Paniers de la semaine prochaine"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu (HTML simple)
              </label>
              <textarea
                value={html}
                onChange={(e) => setHtml(e.target.value)}
                className="w-full min-h-[180px] rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
                placeholder="<p>Bonjour, voici les paniers disponibles…</p>"
              />
              <p className="mt-1 text-xs text-gray-500">
                HTML simple conseillé&nbsp;: titres, paragraphes, listes.
              </p>
            </div>

            {sendError && (
              <p className="mb-2 text-sm text-red-600">{sendError}</p>
            )}
            {sendOk && <p className="mb-2 text-sm text-green-700">{sendOk}</p>}

            <button
              type="button"
              onClick={handleSend}
              disabled={sending || total === 0}
              className={[
                "mt-2 inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold shadow",
                sending || total === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-[var(--color-primary)] text-white hover:opacity-90",
              ].join(" ")}
            >
              {sending ? "Envoi en cours…" : "Envoyer la newsletter"}
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
