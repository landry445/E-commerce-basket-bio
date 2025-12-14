import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.lejardindesrainettes.fr";

const ALLOWED_STATUS = new Set(["active", "archived"]);

export async function GET(req: NextRequest): Promise<NextResponse> {
  const status = req.nextUrl.searchParams.get("status") ?? "";
  const safeStatus = ALLOWED_STATUS.has(status) ? status : "";

  const upstreamUrl = `${API_BASE}/reservations/admin-list${
    safeStatus ? `?status=${safeStatus}` : ""
  }`;

  const upstream = await fetch(upstreamUrl, {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      accept: "application/json",
    },
    cache: "no-store",
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
