import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import Footer from "../components/footer";
import ReservationForm from "../components/reservation/ReservationForm";
import Navbar from "../components/navbar/Navbar";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Réserver un panier bio à Savenay | Retrait Gare de Savenay",
  description:
    "Réservation en ligne de paniers de légumes bio. Retrait à la Gare de Savenay. Assistance : 07 88 27 94 07.",
  alternates: { canonical: "/reserver" },
};


async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

type MePayload = { id: string; is_admin?: boolean };

export default async function ReservationPage() {
  const jwt = (await cookies()).get("jwt")?.value;
  if (!jwt) redirect("/login");

  const res = await fetch(`${await baseUrl()}/api/auth/me`, {
    headers: { cookie: `jwt=${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) redirect("/login");

  const me = (await res.json()) as MePayload | null;
  if (!me?.id) redirect("/login");
  return (
    <>
      <Navbar />
      <ReservationForm />
      <Footer />
    </>
  );
}
