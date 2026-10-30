"use client";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { Card } from "./Card";
import { AddToCartButton } from "./AddToCartButton";
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
    <Card className="group flex flex-col gap-3 overflow-hidden p-0 transition-shadow motion-safe:duration-base motion-safe:ease-premium hover:shadow-md">
      {/* Bug ditemukan saat menulis e2e/shopping.spec.ts (FEAT-005): grid
          produk tidak punya satu pun tautan ke halaman detail, jadi
          app/products/[id]/page.tsx tidak pernah bisa dijangkau dari UI.
          Gambar + nama produk dibungkus <Link> ke halaman detail; tombol
          tambah-ke-keranjang tetap di luar <Link> supaya tidak ada
          <button> bersarang di dalam <a>. */}
      <Link
        href={`/products/${product.id}`}
        className="flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
        <div className="overflow-hidden bg-surface">
          {product.images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL eksternal belum dikonfigurasi di next.config.mjs
            <img
              src={product.images[0]}
              alt={product.product_name}
              className="aspect-square h-full w-full object-cover transition-transform motion-safe:duration-slow motion-safe:ease-premium motion-safe:group-hover:scale-105"
            />
          ) : (
            <img
              src="/placeholder-product.svg"
              alt="Gambar produk tidak tersedia"
              className="aspect-square h-full w-full object-cover transition-transform motion-safe:duration-slow motion-safe:ease-premium motion-safe:group-hover:scale-105"
            />
          )}
        </div>
        <h3 className="text-h3 px-4 text-foreground">{product.product_name}</h3>
      </Link>
      <p className="px-4 font-bold text-accent">
        {formatRupiah(product.price)}
      </p>

      <div className="px-4 pb-4">
        <AddToCartButton product={product} initialQuantity={initialQuantity} />
      </div>
    </Card>
  );
}
