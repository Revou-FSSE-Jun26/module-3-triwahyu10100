import { formatRupiah } from "@/lib/format";
import type { Order } from "@/lib/types";

export interface OrdersListProps {
  orders: Order[];
}

const STATUS_LABEL: Record<Order["status"], string> = {
  waiting: "Menunggu Pembayaran",
  paid: "Sudah Dibayar",
  shipped: "Dikirim",
  delivered: "Diterima",
  cancelled: "Dibatalkan",
};

export function OrdersList({ orders }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">Belum ada pesanan.</p>
    );
  }
  return (
    <ul className="divide-y divide-gray-200 px-4 py-8">
      {orders.map((order) => (
        <li key={order.id} className="flex items-center justify-between py-4">
          <div>
            <p className="font-medium">Pesanan #{order.id}</p>
            <p className="text-sm text-gray-500">
              {new Date(order.order_date).toLocaleDateString("id-ID")} —{" "}
              {STATUS_LABEL[order.status]}
            </p>
          </div>
          <p className="font-semibold">{formatRupiah(order.total_amount)}</p>
        </li>
      ))}
    </ul>
  );
}
