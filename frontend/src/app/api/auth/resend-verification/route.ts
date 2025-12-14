import { NextRequest, NextResponse } from "next/server";

type Body = { email: string };

function isBody(value: unknown): value is Body {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.email === "string";
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

  const bodyUnknown: unknown = await req.json().catch(() => null);
  if (!isBody(bodyUnknown)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  await fetch(`${apiBase}/auth/resend-verification`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: bodyUnknown.email }),
    cache: "no-store",
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
