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
    <Card className="flex flex-col gap-2 p-4 transition hover:-translate-y-1 hover:shadow-md">
      {/* Bug ditemukan saat menulis e2e/shopping.spec.ts (FEAT-005): grid
          produk tidak punya satu pun tautan ke halaman detail, jadi
          app/products/[id]/page.tsx tidak pernah bisa dijangkau dari UI.
          Gambar + nama produk dibungkus <Link> ke halaman detail; tombol
          tambah-ke-keranjang tetap di luar <Link> supaya tidak ada
          <button> bersarang di dalam <a>. */}
      <Link href={`/products/${product.id}`} className="flex flex-col gap-2">
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
      </Link>
      <p className="font-bold text-blue-600">{formatRupiah(product.price)}</p>

      <AddToCartButton product={product} initialQuantity={initialQuantity} />
    </Card>
  );
}
