import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  readSessionCookie,
  roleHomePath,
  SESSION_COOKIE,
  sessionIsCurrent,
} from "@/lib/session";
import type { UserRole } from "@/lib/types";

const PUBLIC_PATHS = ["/", "/login"];

function routeRequiresRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/student")) return "student";
  if (pathname.startsWith("/instructor")) return "instructor";
  if (pathname.startsWith("/admin")) return "admin";
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname === "/admin/login" ||
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith("/login/") ||
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
  const session = raw ? await readSessionCookie(raw) : null;

  if (!session || !sessionIsCurrent(session)) {
    const loginUrl = new URL(
      requiredRole === "admin" ? "/admin/login" : "/login",
      request.url,
    );
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
