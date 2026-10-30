import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = "Tidak ada produk yang ditemukan.",
}: ProductGridProps) {
  if (products.length === 0) {
    return <p className="py-12 text-center text-muted">{emptyMessage}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
