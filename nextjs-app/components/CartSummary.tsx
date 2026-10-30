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
      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-caption transition-colors motion-safe:duration-base hover:bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
        {itemCount}
      </span>
      <span className="font-medium text-foreground">
        {formatRupiah(totalPrice)}
      </span>
    </Link>
  );
}
