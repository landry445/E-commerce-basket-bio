import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function backendUrl(path: string): string {
  const base = process.env.APP_BASE_URL;
  if (!base) throw new Error("APP_BASE_URL manquant");
  return `${base}${path}`;
}

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const status = url.searchParams.get("status"); // "active" | "archived" | null

  const target = status
    ? `/reservations/admin-list?status=${encodeURIComponent(status)}`
    : "/reservations/admin-list";

  const res = await fetch(backendUrl(target), {
    method: "GET",
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      Accept: "application/json",
    },
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

export async function DELETE(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "id manquant" }, { status: 400 });
  }

  const res = await fetch(
    backendUrl(`/reservations/${encodeURIComponent(id)}`),
    {
      method: "DELETE",
      headers: {
        cookie: req.headers.get("cookie") ?? "",
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  const text = await res.text();
  return new NextResponse(text || null, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}
