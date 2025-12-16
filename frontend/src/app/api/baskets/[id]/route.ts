import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function apiUrl(path: string): string {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL manquant");
  return `${API_BASE}${path}`;
}

async function forward(
  req: NextRequest,
  method: "PUT" | "DELETE" | "PATCH",
  id: string
): Promise<Response> {
  const headers: Record<string, string> = {
    cookie: req.headers.get("cookie") ?? "",
  };

  let body: BodyInit | undefined;

  if (method === "PUT") {
    const form = await req.formData();
    body = form;
  }

  if (method === "PATCH") {
    headers["content-type"] = "application/json";
    body = await req.text();
  }

  const upstream = await fetch(apiUrl(`/baskets/${encodeURIComponent(id)}`), {
    method,
    headers,
    body,
    cache: "no-store",
  });

  const buf = await upstream.arrayBuffer();
  const res = new NextResponse(buf, { status: upstream.status });

  const contentType = upstream.headers.get("content-type");
  if (contentType) res.headers.set("content-type", contentType);

  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) res.headers.set("set-cookie", setCookie);

  return res;
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await ctx.params;
  return forward(req, "PUT", id);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await ctx.params;
  return forward(req, "DELETE", id);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await ctx.params;
  return forward(req, "PATCH", id);
}
