import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import SidebarAdmin from "@/app/components/adminLayout/SidebarAdmin";
import AdminActionsBar from "@/app/components/adminLayout/AdminActionsBar";
import AuthGuardClient from "./AuthGuardClient";

export const dynamic = "force-dynamic";

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jwt = (await cookies()).get("jwt")?.value;
  if (!jwt) redirect("/login");

  const res = await fetch(`${await baseUrl()}/api/auth/me`, {
    headers: { cookie: `jwt=${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) redirect("/login");

  const me = (await res.json()) as { is_admin?: boolean };
  if (!me.is_admin) redirect("/login");

  return (
    <div className="flex min-h-screen bg-light">
      <SidebarAdmin userName="Adri" />
      <div className="flex-1 flex flex-col">
        <AdminActionsBar />
        <main className="flex-1 px-12 py-8 flex flex-col">
          {" "}
          <AuthGuardClient />
          {children}
        </main>
      </div>
    </div>
  );
}
