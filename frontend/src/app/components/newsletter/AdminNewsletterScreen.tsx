"use client";

import { useEffect, useState } from "react";
import { NewsletterFormData, SendResult, Subscriber } from "./newsletterTypes";
import {
  buildNewsletterHtmlDoc,
  buildNewsletterPlainText,
} from "./newsletterHtml";
import { SubscribersCard } from "./SubscribersCard";
import { NewsletterForm } from "./NewsletterForm";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export function AdminNewsletterScreen() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingSubs, setLoadingSubs] = useState<boolean>(true);

  const [sending, setSending] = useState<boolean>(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const [remoteSuccess, setRemoteSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSubs(): Promise<void> {
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

    loadSubs();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSend(form: NewsletterFormData): Promise<void> {
    setRemoteError(null);
    setRemoteSuccess(null);

    if (subscribers.length === 0) {
      setRemoteError("Aucun abonné pour cette newsletter.");
      return;
    }

    setSending(true);

    try {
      const htmlDoc = buildNewsletterHtmlDoc(form, "email");
      const text = buildNewsletterPlainText(form);

      const res = await fetch(`${API_BASE}/admin/newsletter/send`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          subject: form.subject,
          html: htmlDoc,
          text,
        }),
      });

      if (!res.ok) {
        setRemoteError("Erreur lors de l’envoi.");
        return;
      }

      const result = (await res.json()) as SendResult;
      setRemoteSuccess(`Newsletter envoyée à ${result.sent} abonné(s).`);
    } catch {
      setRemoteError("Erreur réseau.");
    } finally {
      setSending(false);
    }
  }

  const total = subscribers.length;

  return (
    <>
      <SubscribersCard subscribers={subscribers} loading={loadingSubs} />

      <NewsletterForm
        totalSubscribers={total}
        sending={sending}
        remoteError={remoteError}
        remoteSuccess={remoteSuccess}
        onSend={handleSend}
      />
    </>
  );
}
