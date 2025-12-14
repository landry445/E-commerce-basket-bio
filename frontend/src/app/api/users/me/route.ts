import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function proxy(req: NextRequest, method: "GET" | "PUT" | "PATCH") {
  const body = method === "GET" ? undefined : await req.text();

  const upstream = await fetch(`${API_BASE}/users/me`, {
    method,
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      ...(method === "GET" ? {} : { "Content-Type": "application/json" }),
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

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}

export async function PUT(req: NextRequest) {
  return proxy(req, "PUT");
}

export async function PATCH(req: NextRequest) {
  return proxy(req, "PATCH");
}
