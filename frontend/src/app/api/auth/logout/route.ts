import { NextRequest, NextResponse } from "next/server";

type HeadersWithSetCookie = Headers & { getSetCookie?: () => string[] };

function readSetCookies(headers: Headers): string[] {
  const h = headers as HeadersWithSetCookie;
  const list = h.getSetCookie?.();
  if (Array.isArray(list) && list.length > 0) return list;

  const single = headers.get("set-cookie");
  if (!single) return [];
  return [single];
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_API_BASE_URL manquante" },
      { status: 500 }
    );
  }

  const cookieHeader = req.headers.get("cookie") ?? "";

  const upstream = await fetch(`${apiBase}/auth/logout`, {
    method: "POST",
    headers: { cookie: cookieHeader, accept: "application/json" },
    cache: "no-store",
  });

  const payloadText = await upstream.text();
  const res = new NextResponse(payloadText, { status: upstream.status });

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";
  res.headers.set("content-type", contentType);

  const setCookies = readSetCookies(upstream.headers);
  for (const c of setCookies) res.headers.append("set-cookie", c);

  return res;
}
