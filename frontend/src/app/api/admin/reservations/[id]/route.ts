import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

function isUuidV4(value: string): boolean {
  const uuidV4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4.test(value);
}

type ParamsPromise = Promise<{ id: string }>;

export async function DELETE(
  req: NextRequest,
  context: { params: ParamsPromise }
): Promise<Response> {
  const { id } = await context.params;

  if (!isUuidV4(id)) {
    return NextResponse.json({ error: "id invalide" }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE}/reservations/${id}`, {
    method: "DELETE",
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (upstream.status === 204) {
    return new Response(null, { status: 204 });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "application/json";
  const bodyText = await upstream.text();

  return new Response(bodyText, {
    status: upstream.status,
    headers: { "content-type": contentType },
  });
}
