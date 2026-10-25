import type { Metadata } from "next";
import { cookies } from "next/headers";
import { fetchFromApi, ApiError } from "@/lib/api";
import { TOKEN_COOKIE } from "@/lib/auth-cookies";
import { OrdersList } from "@/app/orders/orders-list";
import type { Order, PaginatedResponse } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard Pesanan — RevoShop" };

export default async function DashboardOrdersPage() {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token)
    throw new Error("Sesi login tidak ditemukan, silakan masuk kembali.");

  let orders: Order[];
  try {
    const { items } = await fetchFromApi<PaginatedResponse<Order>>(
      "/orders?per_page=100",
      { headers: { Authorization: `Bearer ${token}` } },
    );
    orders = items;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      throw new Error("Sesi login sudah berakhir, silakan masuk kembali.");
    }
    throw err;
  }

  return (
    <div>
      {/*
        Catatan keterbatasan backend: GET /orders selalu di-scope ke
        identitas JWT pemanggil (lihat list_orders() di
        backend/app/routes/order_routes.py, filter_by(user_id=...) tanpa
        parameter/jalur admin apa pun). Tabel di bawah ini HANYA
        menunjukkan order milik akun admin yang sedang login, BUKAN
        seluruh order semua pelanggan — backend memang tidak punya
        endpoint untuk itu, dan ini bukan bug di frontend.
      */}
      <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Catatan: tabel ini hanya menampilkan pesanan milik akun admin yang
        sedang login, bukan seluruh pesanan semua pelanggan — API backend (
        <code>GET /orders</code>) selalu dibatasi ke pemilik token JWT yang
        memanggilnya, tanpa jalur khusus admin untuk melihat pesanan pelanggan
        lain.
      </p>
      <OrdersList orders={orders} />
    </div>
  );
}
