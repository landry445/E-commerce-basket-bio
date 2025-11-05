import { NextRequest, NextResponse } from "next/server";
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

export async function DELETE(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id");
  const csrfHeader = req.headers.get("x-csrf");
  const csrfCookie = req.cookies.get("csrf")?.value;

  if (!id)
    return NextResponse.json({ message: "id manquant" }, { status: 400 });
  if (!csrfHeader || csrfHeader !== csrfCookie) {
    return NextResponse.json({ message: "csrf invalide" }, { status: 403 });
  }

  const res = await fetch(`${API_BASE}/reservations/${id}`, {
    method: "DELETE",
    headers: { Cookie: req.headers.get("cookie") ?? "" },
    cache: "no-store",
  });

  return NextResponse.json({ ok: res.ok }, { status: res.status });
}
