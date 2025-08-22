// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdmin) return NextResponse.next();

  const jwt = req.cookies.get("jwt")?.value;
  if (!jwt) return NextResponse.redirect(new URL("/login", req.url));

  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const me = await fetch(`${base}/api/auth/me`, {
    headers: { cookie: `jwt=${jwt}` },
  });

  if (!me.ok) return NextResponse.redirect(new URL("/login", req.url));

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

export const config = { matcher: ["/admin/:path*"] };
