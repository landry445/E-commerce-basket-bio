"use client";

import { useEffect, useState } from "react";

export type PublicUser = {
  id: string;
  firstname: string;
  is_admin: boolean;
};

export function useAuth() {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
          cache: "no-store",
        });
        if (!cancelled && res.ok) {
          const data = (await res.json()) as Partial<PublicUser>;
          if (data?.id) {
            setUser({
              id: data.id,
              firstname: data.firstname ?? "",
              is_admin: Boolean(data.is_admin),
            });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, isAuthenticated: Boolean(user), loading };
}
