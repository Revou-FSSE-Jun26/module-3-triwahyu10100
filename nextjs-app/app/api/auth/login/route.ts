import { NextResponse } from "next/server";
import { fetchFromApi, apiErrorToResponse } from "@/lib/api";
import { setAuthCookies } from "@/lib/auth-cookies";
import type { User } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Email dan password wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const { access_token, user } = await fetchFromApi<{
      access_token: string;
      user: User;
    }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const response = NextResponse.json({ user });
    setAuthCookies(response, access_token, user.role);
    return response;
  } catch (err) {
    return apiErrorToResponse(err);
  }
}
