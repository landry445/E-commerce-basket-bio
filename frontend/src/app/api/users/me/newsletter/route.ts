import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export async function PATCH(req: NextRequest) {
  const body = await req.text();

  const upstream = await fetch(`${API_BASE}/users/me/newsletter`, {
    method: "PATCH",
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
