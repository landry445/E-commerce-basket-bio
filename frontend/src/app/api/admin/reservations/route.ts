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
    // un timeout côté fetch peut s’ajouter via AbortController si besoin
  });

  return new NextResponse(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
