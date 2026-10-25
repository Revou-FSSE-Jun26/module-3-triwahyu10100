import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchFromApi, apiErrorToResponse } from "@/lib/api";
import { TOKEN_COOKIE } from "@/lib/auth-cookies";
import type { Order } from "@/lib/types";

export async function POST(request: Request) {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json(
      { error: "Sesi login sudah berakhir, silakan masuk kembali." },
      { status: 401 },
    );
  }
  const body = await request.json().catch(() => null);
  if (!body?.shipping_address || !Array.isArray(body?.items)) {
    return NextResponse.json(
      { error: "Alamat pengiriman dan daftar item wajib diisi." },
      { status: 400 },
    );
  }
  try {
    const order = await fetchFromApi<Order>("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    return apiErrorToResponse(err);
  }
}
