import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

function forwardSetCookie(upstream: Response, res: NextResponse) {
  const h = upstream.headers as unknown as { getSetCookie?: () => string[] };
  const cookies = h.getSetCookie?.();
  if (cookies?.length) {
    for (const c of cookies) res.headers.append("set-cookie", c);
    return;
  }
  const single = upstream.headers.get("set-cookie");
  if (single) res.headers.set("set-cookie", single);
}

export async function POST(req: NextRequest) {
  const upstream = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: { cookie: req.headers.get("cookie") ?? "" },
  });

  const text = await upstream.text();
  const res = new NextResponse(text, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });

  forwardSetCookie(upstream, res);
  return res;
}
