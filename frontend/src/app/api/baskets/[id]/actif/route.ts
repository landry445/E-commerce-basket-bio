import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type PatchBody = { actif: boolean };

function backendUrl(path: string): string {
  const base = process.env.APP_BASE_URL;
  if (!base) throw new Error("APP_BASE_URL manquant");
  return `${base}${path}`;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await context.params;
  const body = (await req.json()) as PatchBody;

  const res = await fetch(backendUrl(`/baskets/${id}/actif`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
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
