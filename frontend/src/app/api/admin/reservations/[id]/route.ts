import { NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

function isUuidV4(value: string): boolean {
  const uuidV4 =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4.test(value);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
): Promise<NextResponse> {
  const id = ctx.params.id;

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
    return new NextResponse(null, { status: 204 });
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "content-type": "application/json" },
  });
}
