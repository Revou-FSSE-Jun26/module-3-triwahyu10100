import type { Metadata } from "next";
import { OrdersList } from "./orders-list";
import { fetchOrdersWithDemoAuth } from "@/lib/demo-auth";

export const metadata: Metadata = { title: "Pesanan Saya — RevoShop" };

export default async function OrdersPage() {
  const orders = await fetchOrdersWithDemoAuth();
  return <OrdersList orders={orders} />;
}
