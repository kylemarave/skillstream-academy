import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession, roleHomePath, SESSION_COOKIE } from "@/lib/session";
import type { UserRole } from "@/lib/types";

const PUBLIC_PATHS = ["/", "/login"];

function routeRequiresRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/instructor")) return "instructor";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const requiredRole = routeRequiresRole(pathname);
  if (!requiredRole) {
    return NextResponse.next();
  }

  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  const session = raw ? decodeSession(raw) : null;

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session.role !== requiredRole) {
    return NextResponse.redirect(new URL(roleHomePath(session.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
