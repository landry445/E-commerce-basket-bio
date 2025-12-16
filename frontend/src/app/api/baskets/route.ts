import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

function apiUrl(path: string): string {
  if (!API_BASE) throw new Error("NEXT_PUBLIC_API_BASE_URL manquant");
  return `${API_BASE}${path}`;
}

async function proxy(
  req: NextRequest,
  method: "GET" | "POST"
): Promise<Response> {
  const headers: Record<string, string> = {
    cookie: req.headers.get("cookie") ?? "",
  };

  let body: BodyInit | undefined;

  if (method === "POST") {
    const ct = req.headers.get("content-type") ?? "";
    if (ct.includes("multipart/form-data")) {
      const form = await req.formData();
      body = form;
      // content-type auto géré par fetch quand body = FormData
    } else {
      headers["content-type"] = ct || "application/json";
      body = await req.text();
    }
  }

  const upstream = await fetch(apiUrl("/baskets"), {
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

export async function GET(req: NextRequest): Promise<Response> {
  return proxy(req, "GET");
}

export async function POST(req: NextRequest): Promise<Response> {
  return proxy(req, "POST");
}
