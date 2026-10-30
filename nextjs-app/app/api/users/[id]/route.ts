import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchFromApi, apiErrorToResponse } from "@/lib/api";
import { TOKEN_COOKIE } from "@/lib/auth-cookies";
import type { User } from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Sesi login sudah berakhir, silakan masuk kembali." },
      { status: 401 },
    );
  }
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "Request body harus berupa JSON." },
      { status: 400 },
    );
  }
  try {
    // Flask sendiri sudah menolak (403) kalau identitas JWT != params.id
    // (lihat update_user() di backend/app/routes/user_routes.py) — proxy
    // ini hanya meneruskan, tidak perlu mengecek ulang.
    const user = await fetchFromApi<User>(`/users/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return apiErrorToResponse(err);
  }
}
