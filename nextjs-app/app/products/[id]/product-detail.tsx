import { AddToCartButton } from "@/components/AddToCartButton";
import { Container } from "@/components/layout/Container";
import { VariantPicker } from "@/components/products/VariantPicker";
import { formatRupiah } from "@/lib/format";
import type { Product } from "@/lib/types";

export interface ProductDetailProps {
  product: Product;
  isApparel: boolean;
}

export function ProductDetail({ product, isApparel }: ProductDetailProps) {
  const outOfStock = product.stock_quantity <= 0;
  return (
    <Container>
      <article className="grid gap-8 py-10 sm:grid-cols-2">
        {product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL eksternal belum dikonfigurasi di next.config.mjs
          <img
            src={product.images[0]}
            alt={product.product_name}
            className="h-80 w-full rounded-lg border border-border object-cover shadow-sm"
          />
        ) : (
          <img
            src="/placeholder-product.svg"
            alt="Gambar produk tidak tersedia"
            className="h-80 w-full rounded-lg border border-border object-cover shadow-sm"
          />
        )}
        <div className="space-y-4">
          <h1 className="text-h1">{product.product_name}</h1>
          <p className="text-h2 text-accent">{formatRupiah(product.price)}</p>
          <p className="text-body text-muted">{product.description}</p>
          <p className="text-caption text-muted">SKU: {product.sku}</p>
          <p
            className={
              outOfStock
                ? "text-caption text-red-600"
                : "text-caption text-green-700"
            }>
            {outOfStock
              ? "Stok habis"
              : `Stok tersedia: ${product.stock_quantity}`}
          </p>

          {/* Placeholder dekoratif — lihat komentar di VariantPicker.tsx.
              Tidak memengaruhi harga/stok/AddToCartButton di bawah.
              Hanya ditampilkan untuk produk kategori Apparel. */}
          {isApparel && <VariantPicker />}

          <AddToCartButton product={product} />
        </div>
      </article>
    </Container>
  );
}
