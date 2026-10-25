import type { NextResponse } from "next/server";
import type { UserRole } from "./types";

export const TOKEN_COOKIE = "revoshop_token";
export const ROLE_COOKIE = "revoshop_role";

// Selaras dengan JWT_ACCESS_TOKEN_EXPIRES di backend/config.py (1 jam) —
// cookie tidak perlu hidup lebih lama dari token yang dikandungnya.
export const COOKIE_MAX_AGE_SECONDS = 60 * 60;

function cookieOptions(httpOnly: boolean) {
  return {
    httpOnly,
    sameSite: "lax" as const,
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV === "production",
  };
}

/** Dipanggil setelah login/register sukses di Flask. */
export function setAuthCookies(
  response: NextResponse,
  token: string,
  role: UserRole,
): void {
  response.cookies.set(TOKEN_COOKIE, token, cookieOptions(true));
  response.cookies.set(ROLE_COOKIE, role, cookieOptions(false));
}

/** Dipanggil saat logout. */
export function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(TOKEN_COOKIE);
  response.cookies.delete(ROLE_COOKIE);
}
