// app/api/admin/reservations/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

// liste blanche des statuts autorisés
const ALLOWED_STATUS = new Set(["active", "archived"]);

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") ?? "";
  const safeStatus = ALLOWED_STATUS.has(status) ? status : "";

  const upstreamUrl = `${API_BASE}/reservations/admin-list${
    safeStatus ? `?status=${safeStatus}` : ""
  }`;

  const res = await fetch(upstreamUrl, {
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id manquant" }, { status: 400 });
  }

  // (optionnel) contrôle simple UUID v4
  const uuidV4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidV4.test(id)) {
    return NextResponse.json({ error: "id invalide" }, { status: 400 });
  }

  const upstreamUrl = `${API_BASE}/reservations/${id}`;
  const res = await fetch(upstreamUrl, {
    method: "DELETE",
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
      Accept: "application/json",
    },
    cache: "no-store",
  });

  // Pas de corps en 204
  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  // Propage le corps JSON si présent (404, 401, 403, 500, etc.)
  return new NextResponse(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
