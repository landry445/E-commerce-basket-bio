import { NextRequest, NextResponse } from "next/server";

type AuthDecision = {
  allowed: boolean;
  redirectTo: string | null;
};

function buildLoginRedirect(req: NextRequest): NextResponse {
  const nextPath = req.nextUrl.pathname + req.nextUrl.search;
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", nextPath);
  return NextResponse.redirect(url);
}

function readAuthToken(req: NextRequest): string | null {
  const cookieName = process.env.COOKIE_NAME ?? "auth_token";
  const cookie = req.cookies.get(cookieName);
  return cookie?.value ?? null;
}

function decide(req: NextRequest, token: string | null): AuthDecision {
  const path = req.nextUrl.pathname;

  const isAdmin = path.startsWith("/admin");
  const isClientArea = path.startsWith("/espace-client");
  const isReserve = path.startsWith("/reserver");
  const isAuthPage = path === "/login" || path === "/register";

  const isPublic =
    path.startsWith("/verification-ok") ||
    path.startsWith("/verification-erreur") ||
    path.startsWith("/auth/verify-email");

  if (isPublic) return { allowed: true, redirectTo: null };

  if (isAuthPage) {
    if (token) return { allowed: false, redirectTo: "/espace-client" };
    return { allowed: true, redirectTo: null };
  }

  if (isAdmin || isClientArea || isReserve) {
    if (!token) return { allowed: false, redirectTo: "/login" };
    return { allowed: true, redirectTo: null };
  }

  return { allowed: true, redirectTo: null };
}

export function middleware(req: NextRequest): NextResponse {
  const token = readAuthToken(req);
  const decision = decide(req, token);

  if (decision.allowed) return NextResponse.next();

  if (decision.redirectTo === "/login") return buildLoginRedirect(req);

  const url = req.nextUrl.clone();
  url.pathname = decision.redirectTo ?? "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/espace-client/:path*",
    "/reserver/:path*",
    "/login",
    "/register",
  ],
};
