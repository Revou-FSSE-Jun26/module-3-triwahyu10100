"use client";
import { useState } from "react";
import { useCart } from "@/app/providers/cart-provider";
import type { Product } from "@/lib/types";

export interface AddToCartButtonProps {
  product: Product;
  initialQuantity?: number;
}

export function AddToCartButton({
  product,
  initialQuantity = 1,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { addToCart, getRemainingStock } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const outOfStock = product.stock_quantity <= 0;
  const remaining = getRemainingStock(product);
  const maxedOutInCart = !outOfStock && remaining <= 0;

  function handleAdd() {
    addToCart(product, quantity);
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <>
      {!outOfStock && !maxedOutInCart && (
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Jumlah produk">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
            disabled={quantity <= 1}
            aria-label="Kurangi jumlah"
            className="h-8 w-8 rounded-full border disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500">
            −
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(q + 1, remaining))}
            disabled={quantity >= remaining}
            aria-label="Tambah jumlah"
            className="h-8 w-8 rounded-full border disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500">
            +
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={handleAdd}
        disabled={outOfStock || maxedOutInCart}
        className={
          outOfStock || maxedOutInCart
            ? "rounded bg-gray-200 px-3 py-2 text-gray-500 cursor-not-allowed"
            : justAdded
              ? "rounded bg-green-600 px-3 py-2 text-white"
              : "rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        }>
        {outOfStock
          ? "Stok Habis"
          : maxedOutInCart
            ? "Stok di keranjang sudah maksimum"
            : justAdded
              ? "Ditambahkan!"
              : "Tambah ke Keranjang"}
      </button>
    </>
  );
}
