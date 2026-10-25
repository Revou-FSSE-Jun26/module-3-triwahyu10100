import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROLE_COOKIE } from "@/lib/auth-cookies";

const ADMIN_PREFIX = "/dashboard";
const LOGIN_REQUIRED_PREFIXES = ["/cart", "/checkout", "/orders"];

function matchesPrefix(pathname: string, prefix: string): boolean {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const isLoggedIn = Boolean(role);

  if (matchesPrefix(pathname, ADMIN_PREFIX)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (
    LOGIN_REQUIRED_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix))
  ) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/cart",
    "/cart/:path*",
    "/checkout",
    "/checkout/:path*",
    "/orders",
    "/orders/:path*",
  ],
};
