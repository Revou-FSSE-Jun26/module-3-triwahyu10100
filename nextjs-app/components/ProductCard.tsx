"use client";
import { formatRupiah } from "@/lib/format";
import { Card } from "./Card";
import { AddToCartControls } from "./AddToCartControls";
import type { Product } from "@/lib/types";

export interface ProductCardProps {
  product: Product;
  initialQuantity?: number;
}

export function ProductCard({
  product,
  initialQuantity = 1,
}: ProductCardProps) {
  return (
    <Card className="flex flex-col gap-2 p-4 transition hover:-translate-y-1 hover:shadow-md">
      {product.images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL eksternal belum dikonfigurasi di next.config.mjs
        <img
          src={product.images[0]}
          alt={product.product_name}
          className="h-40 w-full rounded object-cover"
        />
      ) : (
        <img
          src="/placeholder-product.svg"
          alt="Gambar produk tidak tersedia"
          className="h-40 w-full rounded object-cover"
        />
      )}
      <h3 className="font-semibold">{product.product_name}</h3>
      <p className="font-bold text-blue-600">{formatRupiah(product.price)}</p>

      <AddToCartControls product={product} initialQuantity={initialQuantity} />
    </Card>
  );
}
