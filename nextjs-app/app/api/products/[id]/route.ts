import { NextResponse } from "next/server";
import { fetchFromApi, apiErrorToResponse } from "@/lib/api";
import { requireAdmin } from "@/lib/require-admin";
import type { Product } from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
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
    const product = await fetchFromApi<Product>(`/products/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(product);
  } catch (err) {
    return apiErrorToResponse(err);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    const result = await fetchFromApi<{ message: string }>(
      `/products/${params.id}`,
      { method: "DELETE" },
    );
    return NextResponse.json(result);
  } catch (err) {
    // Termasuk 409 "Cannot delete product: it is linked to one or more
    // active orders" — diteruskan verbatim lewat apiErrorToResponse,
    // supaya CreateProductForm/EditProductForm bisa menampilkannya ke
    // toast tanpa harus menerka-nerka bentuk pesannya.
    return apiErrorToResponse(err);
  }
}
