"use client";
import Link from "next/link";
import { useCart } from "@/app/providers/cart-provider";
import { formatRupiah } from "@/lib/format";

export function CartSummary() {
  const { itemCount, totalPrice } = useCart();
  return (
    <Link
      href="/cart"
      aria-label={`Keranjang: ${itemCount} item, total ${formatRupiah(totalPrice)}`}
      className="flex items-center gap-2 rounded border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
        {itemCount}
      </span>
      <span className="font-medium">{formatRupiah(totalPrice)}</span>
    </Link>
  );
}
