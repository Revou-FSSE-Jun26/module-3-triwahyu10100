import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-cookies";

export async function POST() {
  // Flask JWT di sini bersifat stateless, tidak ada daftar token yang
  // dicabut (revocation list) di backend — "logout" sepenuhnya berarti
  // menghapus cookie sesi di sisi Next.js. Tidak ada panggilan ke Flask.
  const response = NextResponse.json({ message: "Berhasil keluar." });
  clearAuthCookies(response);
  return response;
}
