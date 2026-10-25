import type { Metadata } from "next";
import { cookies } from "next/headers";
import { OrdersList } from "./orders-list";
import { fetchFromApi, ApiError } from "@/lib/api";
import { TOKEN_COOKIE } from "@/lib/auth-cookies";
import type { Order, PaginatedResponse } from "@/lib/types";

export const metadata: Metadata = { title: "Pesanan Saya — RevoShop" };

export default async function OrdersPage() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) {
    // middleware.ts semestinya sudah mengarahkan ke /login sebelum
    // halaman ini dirender sama sekali — cabang ini hanya pertahanan
    // berlapis untuk kasus token dihapus tepat di antara middleware
    // dan render (jendela waktu yang sangat kecil).
    throw new Error("Sesi login tidak ditemukan, silakan masuk kembali.");
  }
  try {
    const { items } = await fetchFromApi<PaginatedResponse<Order>>(
      "/orders?per_page=100",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return <OrdersList orders={items} />;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      throw new Error("Sesi login sudah berakhir, silakan masuk kembali.");
    }
    throw err; // ditangkap app/orders/error.tsx yang sudah ada
  }
}
