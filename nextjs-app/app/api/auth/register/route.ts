import { NextResponse } from "next/server";
import { fetchFromApi, apiErrorToResponse } from "@/lib/api";
import { setAuthCookies } from "@/lib/auth-cookies";
import type { User } from "@/lib/types";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (
    !body?.first_name ||
    !body?.last_name ||
    !body?.email ||
    !body?.password
  ) {
    return NextResponse.json(
      { error: "Nama depan, nama belakang, email, dan password wajib diisi." },
      { status: 400 },
    );
  }

  let createdUser: User;
  try {
    createdUser = await fetchFromApi<User>("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    // 409 email/username sudah dipakai, 400 validasi Marshmallow — diteruskan apa adanya.
    return apiErrorToResponse(err);
  }

  // Login otomatis dengan kredensial yang sama persis, supaya "registrasi
  // berhasil" langsung berarti "sudah login" tanpa round-trip tambahan
  // dari sisi client.
  try {
    const { access_token, user } = await fetchFromApi<{
      access_token: string;
      user: User;
    }>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
    const response = NextResponse.json(
      { user, autoLoginFailed: false },
      { status: 201 },
    );
    setAuthCookies(response, access_token, user.role);
    return response;
  } catch (err) {
    // Kasus langka: akun SUDAH tersimpan di database (POST /users di atas
    // sukses), tapi login otomatis gagal (misalnya Flask sempat down di
    // antara dua panggilan). Akun tidak boleh "hilang" dari sudut pandang
    // user — tetap balas 201 dengan data user yang berhasil dibuat, hanya
    // tandai autoLoginFailed=true supaya RegisterForm mengarahkan ke
    // /login (bukan mengklaim sesi aktif yang sebenarnya tidak ada
    // cookie-nya). Dicatat sebagai error server karena ini sinyal bahwa
    // sesuatu yang tidak normal terjadi di antara dua panggilan yang
    // seharusnya selalu berhasil berurutan.
    console.error(
      "[POST /api/auth/register] akun dibuat tapi auto-login gagal:",
      err,
    );
    return NextResponse.json(
      { user: createdUser, autoLoginFailed: true },
      { status: 201 },
    );
  }
}
