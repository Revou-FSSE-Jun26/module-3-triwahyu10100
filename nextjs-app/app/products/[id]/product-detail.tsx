import { AddToCartButton } from "@/components/AddToCartButton";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const outOfStock = product.stock_quantity <= 0;
  return (
    <article className="grid gap-6 px-4 py-8 sm:grid-cols-2">
      {product.images.length > 0 ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL eksternal belum dikonfigurasi di next.config.mjs
        <img
          src={product.images[0]}
          alt={product.product_name}
          className="h-80 w-full rounded-lg object-cover"
        />
      ) : (
        <img
          src="/placeholder-product.svg"
          alt="Gambar produk tidak tersedia"
          className="h-80 w-full rounded-lg object-cover"
        />
      )}
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">{product.product_name}</h1>
        <p className="text-xl font-bold text-blue-600">
          {formatRupiah(product.price)}
        </p>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
        <p className={outOfStock ? "text-red-600" : "text-green-700"}>
          {outOfStock
            ? "Stok habis"
            : `Stok tersedia: ${product.stock_quantity}`}
        </p>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}
