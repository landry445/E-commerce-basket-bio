import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function apiUrl(path: string): string {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL manquant");
  return `${API_BASE}${path}`;
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await ctx.params;

  const upstream = await fetch(
    apiUrl(`/baskets/${encodeURIComponent(id)}/image`),
    {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    }
  );

  const buf = await upstream.arrayBuffer();
  const res = new NextResponse(buf, { status: upstream.status });

  const ct = upstream.headers.get("content-type");
  if (ct) res.headers.set("content-type", ct);

  return res;
}
