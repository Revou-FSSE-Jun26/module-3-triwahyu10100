import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { fetchFromApi, ApiError, apiErrorToResponse } from "./api";
import { TOKEN_COOKIE } from "./auth-cookies";
import type { User, UserRole } from "./types";

// HARUS sama persis dengan JWT_SECRET_KEY di backend/.env — kunci ini
// dipakai Flask-JWT-Extended untuk menandatangani token dengan HS256
// (dikonfirmasi dari backend/config.py dan
// flask_jwt_extended/config.py's _secret_key). Server-only: TIDAK
// diberi prefix NEXT_PUBLIC_, tidak pernah dikirim ke browser.
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

interface AuthenticatedUser {
  id: number;
  role: UserRole;
}

/**
 * Memverifikasi signature JWT dari cookie httpOnly `revoshop_token`,
 * lalu menanyakan role SESUNGGUHNYA ke Flask (GET /users/<id>, endpoint
 * publik, tidak butuh token tambahan) — TIDAK PERNAH mempercayai cookie
 * `revoshop_role`, karena cookie itu sengaja non-httpOnly (demi
 * middleware.ts) sehingga bisa ditulis bebas oleh JavaScript browser
 * siapa pun (lihat "lib/auth-cookies.ts" dan "Pertimbangan keamanan").
 * Mengembalikan null kalau token tidak ada/signature tidak valid/token
 * kedaluwarsa/user tidak ditemukan — pemanggil cukup mengecek null,
 * tidak perlu try/catch untuk kasus-kasus itu. Kegagalan infrastruktur
 * (Flask tidak terjangkau) TETAP dilempar sebagai exception, supaya
 * pemanggil bisa membedakannya dari "memang bukan admin" lewat
 * apiErrorToResponse (502, bukan 401/403).
 */
export async function resolveAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return null;
  // Dipisah dari pengecekan `token` di atas (jawaban temuan Round 4 #2):
  // `.env.example` sengaja tidak mengisi nilai JWT_SECRET_KEY, jadi
  // variabel ini kosong/belum diset adalah kesalahan setup lokal yang
  // paling umum terjadi — console.error di sini membuatnya langsung
  // terlihat di log server, berbeda dari "user memang belum login"
  // (yang tidak perlu/tidak boleh berisik di log).
  if (!JWT_SECRET_KEY) {
    console.error("[require-admin] JWT_SECRET_KEY belum diset di .env.local");
    return null;
  }

  let subject: string;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET_KEY),
      { algorithms: ["HS256"] },
    );
    if (typeof payload.sub !== "string") return null;
    subject = payload.sub;
  } catch (err) {
    // Hasil akhirnya selalu "anggap tidak login" (return null) — baik
    // untuk signature tidak valid maupun token kedaluwarsa. TAPI
    // (jawaban temuan iterasi 2 NIT #3) dua kasus itu dibedakan lewat
    // console.warn supaya salah konfigurasi JWT_SECRET_KEY lokal (yang
    // tidak sinkron dengan backend/.env) tidak terlihat identik dengan
    // "memang belum login" saat men-debug setup lokal.
    if (err instanceof Error && err.name === "JWTExpired") {
      console.warn("[require-admin] token JWT sudah kedaluwarsa.");
    } else {
      console.warn(
        "[require-admin] signature JWT tidak valid — periksa apakah " +
          "JWT_SECRET_KEY di nextjs-app/.env.local sama persis dengan " +
          "backend/.env.",
        err,
      );
    }
    return null;
  }

  try {
    const user = await fetchFromApi<User>(`/users/${subject}`);
    return { id: user.id, role: user.role };
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err; // kegagalan infrastruktur — diteruskan ke apiErrorToResponse oleh pemanggil
  }
}

/**
 * Helper siap-pakai untuk Route Handler: mengembalikan NextResponse
 * (401/403/502) kalau pemanggil BUKAN admin sesungguhnya, atau `null`
 * kalau boleh lanjut memproses permintaan.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  let user: AuthenticatedUser | null;
  try {
    user = await resolveAuthenticatedUser();
  } catch (err) {
    return apiErrorToResponse(err);
  }
  if (!user) {
    return NextResponse.json(
      {
        error:
          "Sesi login tidak ditemukan atau sudah berakhir, silakan masuk kembali.",
      },
      { status: 401 },
    );
  }
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Hanya admin yang boleh melakukan aksi ini." },
      { status: 403 },
    );
  }
  return null;
}
