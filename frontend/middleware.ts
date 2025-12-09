import { NextResponse, NextRequest } from "next/server";

const CLIENT_PROTECTED = ["/reserver", "/mes-reservations", "/mon-compte"];
const AUTH_PAGES = ["/login", "/register"];

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

async function fetchUser(req: NextRequest) {
  try {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as {
      id: string;
      email: string;
      is_admin: boolean;
    };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const jwt = req.cookies.get("jwt")?.value;

  // 1) Routes client protégées
  if (CLIENT_PROTECTED.some((p) => pathname.startsWith(p))) {
    if (!jwt) {
      const nextUrl = new URL(
        `/login?next=${encodeURIComponent(pathname + search)}`,
        req.url
      );
      return NextResponse.redirect(nextUrl);
    }
    return NextResponse.next();
  }

  // 2) Pages d’auth quand déjà connecté
  if (AUTH_PAGES.includes(pathname) && jwt) {
    const me = await fetchUser(req);
    const dest = me?.is_admin ? "/admin/paniers" : "/reserver";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // 3) Espace admin
  if (pathname.startsWith("/admin")) {
    if (!jwt)
      return NextResponse.redirect(
        new URL("/login?next=/admin/paniers", req.url)
      );
    const me = await fetchUser(req);
    if (!me?.is_admin) return NextResponse.redirect(new URL("/", req.url));
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
