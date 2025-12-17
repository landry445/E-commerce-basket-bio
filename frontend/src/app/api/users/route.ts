import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function backendUrl(path: string): string {
  const base = process.env.APP_BASE_URL;
  if (!base) throw new Error("APP_BASE_URL manquant");
  return `${base}${path}`;
}

export async function GET(req: NextRequest): Promise<Response> {
  const res = await fetch(backendUrl("/admin/users"), {
    method: "GET",
    headers: { cookie: req.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
