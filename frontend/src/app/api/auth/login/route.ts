import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function backendUrl(path: string): string {
  const base = process.env.APP_BASE_URL;
  if (!base) throw new Error("APP_BASE_URL manquant");
  return `${base}${path}`;
}

function forwardSetCookie(upstream: Response, res: NextResponse): void {
  const h = upstream.headers as unknown as { getSetCookie?: () => string[] };
  const cookies = h.getSetCookie?.();
  if (cookies?.length) {
    for (const c of cookies) res.headers.append("set-cookie", c);
    return;
  }
  const single = upstream.headers.get("set-cookie");
  if (single) res.headers.set("set-cookie", single);
}

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.text();

  const upstream = await fetch(backendUrl("/auth/login"), {
    method: "POST",
    headers: {
      "content-type": req.headers.get("content-type") ?? "application/json",
    },
    body,
    cache: "no-store",
  });

  const text = await upstream.text();

  const res = new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });

  forwardSetCookie(upstream, res);
  return res;
}
