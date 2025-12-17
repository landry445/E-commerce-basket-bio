import { NextResponse } from "next/server";

type PatchBody = { actif: boolean };

function backendUrl(path: string): string {
  const base = process.env.APP_BASE_URL; // ex: https://www.api.lejardindesrainettes.fr
  if (!base) throw new Error("APP_BASE_URL manquant");
  return `${base}${path}`;
}

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const body = (await req.json()) as PatchBody;

  const res = await fetch(backendUrl(`/baskets/${ctx.params.id}/actif`), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") ?? "",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "text/plain",
    },
  });
}
