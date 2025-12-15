// frontend/middleware.ts
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = process.env.COOKIE_NAME ?? "jwt";

function buildLoginRedirect(req: NextRequest): NextResponse {
  const nextPath = req.nextUrl.pathname + req.nextUrl.search;
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", nextPath);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest): NextResponse {
  const token = req.cookies.get(COOKIE_NAME)?.value ?? null;

  const path = req.nextUrl.pathname;

  const needsAuth =
    path.startsWith("/reserver") ||
    path.startsWith("/mon-compte") ||
    path.startsWith("/mes-reservations") ||
    path.startsWith("/espace-client") ||
    path.startsWith("/admin");

  if (!needsAuth) return NextResponse.next();
  if (!token) return buildLoginRedirect(req);

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/reserver/:path*",
    "/mon-compte/:path*",
    "/mes-reservations/:path*",
    "/espace-client/:path*",
    "/admin/:path*",
  ],
};
