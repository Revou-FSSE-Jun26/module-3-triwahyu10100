import { NextResponse } from "next/server";
import { fetchFromApi, apiErrorToResponse } from "@/lib/api";
import { requireAdmin } from "@/lib/require-admin";
import type { Product } from "@/lib/types";

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json(
      { error: "Body permintaan harus berupa JSON." },
      { status: 400 },
    );
  }
  try {
    const product = await fetchFromApi<Product>("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    return apiErrorToResponse(err);
  }
}
