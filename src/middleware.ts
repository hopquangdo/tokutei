import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth/constants";
import { decodeSessionPayload } from "@/lib/auth/cookie-payload";
import type { Role } from "@/lib/auth/types";

function requiredRoleForPath(pathname: string): Role | null {
  if (pathname === "/candidate" || pathname.startsWith("/candidate/"))
    return "candidate";
  if (pathname === "/agent" || pathname.startsWith("/agent/")) return "agent";
  return null;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const need = requiredRoleForPath(pathname);
  if (!need) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? decodeSessionPayload(token) : null;

  if (!session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (session.role !== need) {
    const login = new URL("/login", request.url);
    login.searchParams.set("error", "wrong_portal");
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/candidate/:path*", "/agent/:path*"],
};
