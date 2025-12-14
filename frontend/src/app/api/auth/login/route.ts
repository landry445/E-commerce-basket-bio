import { NextRequest, NextResponse } from "next/server";

type LoginBody = { email: string; password: string };

function isLoginBody(value: unknown): value is LoginBody {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.email === "string" && typeof v.password === "string";
}

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

  const bodyUnknown: unknown = await req.json().catch(() => null);
  if (!isLoginBody(bodyUnknown)) {
    return NextResponse.json({ message: "Payload invalide" }, { status: 400 });
  }

  const upstream = await fetch(`${apiBase}/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(bodyUnknown),
    cache: "no-store",
  });

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";
  const payloadText = await upstream.text();

  const res = new NextResponse(payloadText, { status: upstream.status });
  res.headers.set("content-type", contentType);

  const setCookies = readSetCookies(upstream.headers);
  for (const c of setCookies) res.headers.append("set-cookie", c);

  return res;
}
