import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_BASE_URL manquante" },
      { status: 500 }
    );
  }

  const cookieHeader = req.headers.get("cookie") ?? "";

  const upstream = await fetch(`${apiBase}/auth/me`, {
    method: "GET",
    headers: { cookie: cookieHeader, accept: "application/json" },
    cache: "no-store",
  });

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";
  const payloadText = await upstream.text();

  const res = new NextResponse(payloadText, { status: upstream.status });
  res.headers.set("content-type", contentType);
  return res;
}
