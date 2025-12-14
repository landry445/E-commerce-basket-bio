import { NextResponse, NextRequest } from "next/server";

const CLIENT_PROTECTED = ["/reserver", "/mes-reservations", "/mon-compte"];
const AUTH_PAGES = ["/login", "/register"];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
const COOKIE_NAME = process.env.COOKIE_NAME ?? "auth_token";

type Me = { id: string; email: string; is_admin: boolean };

async function fetchMe(req: NextRequest): Promise<Me | null> {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Me;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const hasToken = Boolean(req.cookies.get(COOKIE_NAME)?.value);

  // Pages d'auth
  if (AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    if (!hasToken) return NextResponse.next();

    const me = await fetchMe(req);
    if (!me) return NextResponse.next();

    const target = me.is_admin ? "/admin/reservations" : "/reserver";
    const url = req.nextUrl.clone();
    url.pathname = target;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Admin
  if (pathname.startsWith("/admin")) {
    if (!hasToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    const me = await fetchMe(req);
    if (!me?.is_admin) {
      const url = req.nextUrl.clone();
      url.pathname = "/reserver";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // Client protégé
  if (CLIENT_PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!hasToken) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    const me = await fetchMe(req);
    if (!me) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?next=${encodeURIComponent(pathname + search)}`;
      return NextResponse.redirect(url);
    }

    if (me.is_admin) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/reservations";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/reserver",
    "/mes-reservations",
    "/mon-compte",
    "/admin/:path*",
  ],
};
