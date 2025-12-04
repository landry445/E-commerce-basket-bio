import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email } = await req.json();
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  // proxy vers le backend sans dévoiler l’existence d’un compte
  await fetch(`${base}/auth/resend-verification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // si cookies auth côté admin sont utiles un jour :
    // credentials: 'include',
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  // réponse neutre côté front
  return NextResponse.json({ ok: true }, { status: 200 });
}
