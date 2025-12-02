"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuardClient() {
  const router = useRouter();

  async function check() {
    const res = await fetch("/api/auth/me", {
      credentials: "include",
      cache: "no-store",
    });
    if (!res.ok) router.replace("/login");
    else {
      const me: { is_admin?: boolean } = await res.json();
      if (!me.is_admin) router.replace("/login");
    }
  }

  useEffect(() => {
    void check(); // au premier montage
    const onShow = () => {
      void check();
    }; // retour depuis BFCache / tab active
    window.addEventListener("pageshow", onShow);
    document.addEventListener("visibilitychange", onShow);
    return () => {
      window.removeEventListener("pageshow", onShow);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, []);

  return null;
}
